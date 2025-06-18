const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const fetch = require('node-fetch');
const net = require('net');
const cors = require('cors');
const ping = require('ping');

const app = express();
const PORT = 3000;

const SERVICES_PATH = path.join(__dirname, 'services.json');
const PINGS_PATH = path.join(__dirname, 'pings.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper functions
const readData = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf-8'));
const writeData = async (filePath, data) => fs.writeFile(filePath, JSON.stringify(data, null, 2));

// API to get all services and their pings
app.get('/api/services', async (req, res) => {
    try {
        const services = await readData(SERVICES_PATH);
        const pings = await readData(PINGS_PATH);
        const data = services.map(service => ({
            ...service,
            pings: pings[service.id] || []
        }));
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error reading data files.' });
    }
});

// API to add a service
app.post('/api/services', async (req, res) => {
    try {
        const services = await readData(SERVICES_PATH);
        const newService = { id: crypto.randomUUID(), ...req.body };
        services.push(newService);
        await writeData(SERVICES_PATH, services);
        res.status(201).json(newService);
    } catch (error) {
        res.status(500).json({ message: 'Error adding service.' });
    }
});

// API to update a service
app.put('/api/services/:id', async (req, res) => {
    try {
        const services = await readData(SERVICES_PATH);
        const index = services.findIndex(s => s.id === req.params.id);
        if (index === -1) return res.status(404).json({ message: 'Service not found.' });
        
        services[index] = { ...services[index], ...req.body };
        await writeData(SERVICES_PATH, services);
        res.json(services[index]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating service.' });
    }
});

// API to delete a service
app.delete('/api/services/:id', async (req, res) => {
    try {
        let services = await readData(SERVICES_PATH);
        services = services.filter(s => s.id !== req.params.id);
        await writeData(SERVICES_PATH, services);

        let pings = await readData(PINGS_PATH);
        delete pings[req.params.id];
        await writeData(PINGS_PATH, pings);

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting service.' });
    }
});

// API to ping a service
app.post('/api/ping/:id', async (req, res) => {
    try {
        const services = await readData(SERVICES_PATH);
        const service = services.find(s => s.id === req.params.id);
        if (!service) return res.status(404).json({ message: 'Service not found.' });

        const startTime = Date.now();
        let status = 'down';
        let latency = -1;

        if (service.type === 'url') {
            try {
                const response = await fetch(service.target, { timeout: 500 });
                if (response.ok) {
                    status = 'up';
                    latency = Date.now() - startTime;
                }
            } catch (error) { /* status remains 'down' */ }
        } else if (service.type === 'ip') {
            const target = service.target;
            if (target.includes(':')) {
                const [host, port] = target.split(':');
                await new Promise((resolve) => {
                    const socket = new net.Socket();
                    socket.setTimeout(500);
                    socket.on('connect', () => {
                        status = 'up';
                        latency = Date.now() - startTime;
                        socket.destroy();
                        resolve();
                    });
                    socket.on('timeout', () => { socket.destroy(); resolve(); });
                    socket.on('error', () => { socket.destroy(); resolve(); });
                    socket.connect(port, host);
                });
            } else {
                // ICMP ping for IP only, try 2 times with a 0.5-second total timeout
                const extra = process.platform === 'win32' ? ['-n', '2'] : ['-c', '2'];
                const res = await ping.promise.probe(target, { timeout: 0.5, extra });
                if (res.alive) {
                    status = 'up';
                    latency = Math.round(res.time);
                }
            }
        }

        const pings = await readData(PINGS_PATH);
        if (!pings[service.id]) pings[service.id] = [];
        pings[service.id].unshift({ timestamp: new Date().toISOString(), status, latency });
        pings[service.id] = pings[service.id].slice(0, 3); // Keep last 3 pings
        await writeData(PINGS_PATH, pings);

        res.json(pings[service.id]);
    } catch (error) {
        res.status(500).json({ message: 'Error during ping.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
