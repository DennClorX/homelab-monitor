document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3000/api';
    const serviceContainer = document.getElementById('service-container');
    const modal = document.getElementById('service-modal');
    const modalTitle = document.getElementById('modal-title');
    const serviceForm = document.getElementById('service-form');
    const serviceTypeInput = document.getElementById('service-type');
    const serviceTargetInput = document.getElementById('service-target');
    const closeBtn = document.querySelector('.close-btn');
    const addServiceBtn = document.getElementById('add-service-btn');
    const pingAllBtn = document.getElementById('ping-all-btn');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const autoPingIntervalInput = document.getElementById('auto-ping-interval');
    const gridColumnsSelect = document.getElementById('grid-columns');

    let services = [];
    let autoPingTimer = null;

    // SVG Icons for actions
    const ICONS = {
        github: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>`,
        theme_light: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>`,
        theme_dark: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>`,
        add: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>`,
        ping_all: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0" /></svg>`,
        go: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-4.5 0V6.375c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 10.5z" /></svg>`,
        ping: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" /></svg>`,
        edit: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>`,
        delete: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>`
    };

    const getServices = async () => {
        try {
            const response = await fetch(`${API_URL}/services`);
            services = await response.json();
            renderServices();
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    const renderServices = () => {
        serviceContainer.innerHTML = '';
        services.forEach(service => {
            const card = document.createElement('div');
            card.className = 'service-card';
            card.dataset.id = service.id;

            const lastPing = service.pings[0];
            const statusClass = lastPing ? lastPing.status : '';

            const successfulPings = service.pings.filter(p => p.status === 'up');
            let avgLatencyHtml = 'Avg: N/A';
            if (successfulPings.length > 0) {
                const totalLatency = successfulPings.reduce((sum, p) => sum + p.latency, 0);
                const avg = Math.round(totalLatency / successfulPings.length);
                avgLatencyHtml = `Avg: <strong>${avg}ms</strong>`;
            }

            // Set the main structure of the card, leaving actions empty
            card.innerHTML = `
                <div class="service-header">
                    <div class="service-info">
                        <div class="status-indicator ${statusClass}"></div>
                        <span class="service-name">${service.name}</span>
                    </div>
                    <div class="service-actions">
                        <!-- Action buttons will be added here by JS -->
                    </div>
                </div>
                <div class="service-target">${service.target}</div>
                <div class="ping-history">
                    <span>${avgLatencyHtml}</span>
                    <ul>
                        ${service.pings.map(p => `<li><span class="status-indicator ${p.status}"></span></li>`).join('')}
                    </ul>
                </div>
            `;

            const actionsContainer = card.querySelector('.service-actions');

            // Always create the Go button, but disable it for non-URL types
            const goBtn = document.createElement('button');
            goBtn.className = 'action-btn go-btn';
            goBtn.innerHTML = ICONS.go;
            if (service.type === 'url') {
                goBtn.title = 'Go to site';
            } else {
                goBtn.disabled = true;
                goBtn.style.opacity = '0.2';
                goBtn.style.cursor = 'not-allowed';
                goBtn.title = 'This service is not a website';
            }
            actionsContainer.appendChild(goBtn);

            const pingBtn = document.createElement('button');
            pingBtn.className = 'action-btn ping-btn';
            pingBtn.title = 'Ping';
            pingBtn.innerHTML = ICONS.ping;
            actionsContainer.appendChild(pingBtn);

            const editBtn = document.createElement('button');
            editBtn.className = 'action-btn edit-btn';
            editBtn.title = 'Edit';
            editBtn.innerHTML = ICONS.edit;
            actionsContainer.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'action-btn delete-btn';
            deleteBtn.title = 'Delete';
            deleteBtn.innerHTML = ICONS.delete;
            actionsContainer.appendChild(deleteBtn);

            serviceContainer.appendChild(card);
        });
        if (pingAllBtn.disabled) {
            pingAllBtn.disabled = false;
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const id = document.getElementById('service-id').value;
        const serviceData = {
            name: document.getElementById('service-name').value,
            type: document.getElementById('service-type').value,
            target: document.getElementById('service-target').value,
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_URL}/services/${id}` : `${API_URL}/services`;

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(serviceData),
            });
            if (response.ok) {
                closeModal();
                getServices();
            } else {
                alert('Failed to save service.');
            }
        } catch (error) {
            console.error('Error saving service:', error);
        }
    };

    const openModal = (service = null) => {
        serviceForm.reset();
        if (service) {
            modalTitle.textContent = 'Edit Service';
            document.getElementById('service-id').value = service.id;
            document.getElementById('service-name').value = service.name;
            document.getElementById('service-type').value = service.type;
            document.getElementById('service-target').value = service.target;
        } else {
            modalTitle.textContent = 'Add Service';
            document.getElementById('service-id').value = '';
        }
        // Trigger change to set placeholder correctly
        serviceTypeInput.dispatchEvent(new Event('change'));
        modal.style.display = 'block';
    };

    const closeModal = () => {
        modal.style.display = 'none';
    };

    const handleContainerClick = async (e) => {
        const card = e.target.closest('.service-card');
        if (!card) return;
        const id = card.dataset.id;

        const goBtn = e.target.closest('.go-btn');
        if (goBtn && !goBtn.disabled) {
            const service = services.find(s => s.id === id);
            if (service && service.target) {
                window.open(service.target, '_blank', 'noopener,noreferrer');
            }
            return; // Stop processing to not trigger other buttons
        }

        if (e.target.closest('.ping-btn')) {
            const pingBtn = e.target.closest('.ping-btn');
            const statusIndicator = card.querySelector('.status-indicator');
            pingBtn.disabled = true;
            statusIndicator.classList.add('pinging');
            await fetch(`${API_URL}/ping/${id}`, { method: 'POST' });
            await getServices();
            pingBtn.disabled = false;
        }
        if (e.target.closest('.edit-btn')) {
            const service = services.find(s => s.id === id);
            openModal(service);
        }
        if (e.target.closest('.delete-btn')) {
            if (confirm('Are you sure you want to delete this service?')) {
                await fetch(`${API_URL}/services/${id}`, { method: 'DELETE' });
                await getServices();
            }
        }
    };

    const toggleTheme = () => {
        const isDark = document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeToggleBtn.innerHTML = isDark ? ICONS.theme_light : ICONS.theme_dark;
    };

    const pingAll = async () => {
        const pingPromises = services.map(s => fetch(`${API_URL}/ping/${s.id}`, { method: 'POST' }));
        await Promise.allSettled(pingPromises);
        await getServices();
    };

    const setupAutoPing = () => {
        if (autoPingTimer) clearInterval(autoPingTimer);
        const intervalMinutes = parseInt(autoPingIntervalInput.value, 10);
        if (isNaN(intervalMinutes) || intervalMinutes < 1) return;
        
        localStorage.setItem('autoPingInterval', intervalMinutes);
        
        pingAll(); // Ping immediately on setup
        autoPingTimer = setInterval(pingAll, intervalMinutes * 60 * 1000);
    };

    const setGridColumns = (columns, animate = true) => {
        const currentColumns = localStorage.getItem('gridColumns') || 'auto';
        if (columns === currentColumns && animate) return;

        const applyLayout = () => {
            serviceContainer.classList.remove('grid-3-cols', 'grid-4-cols');
            if (columns === '3') {
                serviceContainer.classList.add('grid-3-cols');
            } else if (columns === '4') {
                serviceContainer.classList.add('grid-4-cols');
            }
            localStorage.setItem('gridColumns', columns);
            gridColumnsSelect.value = columns;
        };

        if (!animate) {
            applyLayout();
            return;
        }

        serviceContainer.classList.add('re-shuffling'); // Fade out

        setTimeout(() => {
            applyLayout(); // Change layout while invisible
            serviceContainer.classList.remove('re-shuffling'); // Fade in
        }, 200); // Match CSS transition duration
    };

    // Event Listeners
    addServiceBtn.addEventListener('click', () => openModal());
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => e.target === modal && closeModal());
    serviceForm.addEventListener('submit', handleFormSubmit);
    serviceContainer.addEventListener('click', handleContainerClick);
    pingAllBtn.addEventListener('click', async () => {
        pingAllBtn.disabled = true;
        await pingAll();
    });
    themeToggleBtn.addEventListener('click', toggleTheme);
    autoPingIntervalInput.addEventListener('change', setupAutoPing);
    autoPingIntervalInput.addEventListener('keyup', (e) => e.key === 'Enter' && setupAutoPing());
    gridColumnsSelect.addEventListener('change', () => setGridColumns(gridColumnsSelect.value));

    // Initial Load
    const isDark = localStorage.getItem('theme') === 'dark';
    if (isDark) {
        document.body.classList.add('dark-theme');
    }
    document.getElementById('github-btn').innerHTML = ICONS.github;
    themeToggleBtn.innerHTML = isDark ? ICONS.theme_light : ICONS.theme_dark;
    pingAllBtn.innerHTML = ICONS.ping_all;
    addServiceBtn.innerHTML = ICONS.add;

    const savedGridColumns = localStorage.getItem('gridColumns') || 'auto';
    setGridColumns(savedGridColumns, false);

    const savedInterval = localStorage.getItem('autoPingInterval');
    if (savedInterval) {
        autoPingIntervalInput.value = savedInterval;
    }
    getServices().then(setupAutoPing);
});
    getServices().then(setupAutoPing);
