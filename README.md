# 🚀 Homelab Dashboard


A sleek, modern, and lightweight dashboard for monitoring all your homelab services. Built with Node.js and vanilla JavaScript, it's designed to be simple, fast, and easy to use.


![Dashboard Screenshot](https://i.imgur.com/X3SiW3V.png) <!-- Replace with a real screenshot URL -->


---


## ✨ Features


-   **Service Display**: Dynamically loads and displays all your services from a `services.json` file.

-   **Advanced Pinging System**:

    -   ✅ Check service status via URL, IP address, or a specific IP:Port combination.

    -   ⚡️ Fast and responsive checks with configurable timeouts.

-   **Status History**: 📜 View the status and average latency of the last 3 pings for each service.

-   **Interactive Controls**:

    -   👆 **Manual Ping**: Ping any individual service with a single click.

    -   🌐 **Ping All**: Refresh the status of all services at once.

    -   ➡️ **Go to Site**: Quickly open URL-based services in a new tab.

-   **Service Management**:  CRUD functionality right from the UI.

    -   ➕ **Add**: Easily add new services.

    -   ✏️ **Edit**: Modify existing service details.

    -   🗑️ **Delete**: Remove services you no longer need.

-   **Customization**:

    -   🎨 **Theme Changer**: Switch between a beautiful light and dark mode. Your preference is saved locally!

    -   📏 **Grid Layout**: Choose between a responsive auto-grid, or fixed 3 or 4-column layouts.

    -   ⏱️ **Auto Ping**: Set a configurable interval (in minutes) for the dashboard to automatically ping all services.

-   **Modern & Lightweight**: Built with performance in mind. No heavy frameworks, just clean HTML, CSS, and JavaScript.


---


## 🏁 Getting Started


Getting your dashboard up and running is incredibly simple.


### Prerequisites


-   [Node.js](https://nodejs.org/) installed on your machine.


### Installation & Running


1.  **Install dependencies:**

    Open your terminal in the project directory and run:

    ```bash

    npm install

    ```


2.  **Start the server:**

    Once the dependencies are installed, simply run:

    ```bash

    node server.js

    ```


    Your Homelab Dashboard will be live at `http://localhost:3000`.


---


## ⚙️ Configuration


-   Services are stored in the `services.json` file. You can either add/edit services through the UI or by modifying this file directly.

-   Ping history is saved in `pings.json`.

-   The auto-ping interval and grid layout can be configured directly in the UI.


---


## ⚠️ Disclaimer


This project was created with significant assistance from the AI model **Gemini 2.5 Pro**. Its capabilities in code generation, debugging, and feature implementation were instrumental in the development process.

## License

MIT
