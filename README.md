# Ticketing System Simulation

This project simulates a ticketing system where vendors release tickets periodically, and customers purchase tickets in real-time. The system uses a Node.js backend for simulation logic and a React frontend for user interaction.

---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [File Structure](#file-structure)
- [API Endpoints](#api-endpoints)

---

## Features

1. **Dynamic Ticket Management**:
   - Vendors release tickets at configurable intervals.
   - Customers purchase tickets in real-time.

2. **Real-Time Updates**:
   - Live logs to track ticket activity.
   - Real-time ticket count display.

3. **Configurable Simulation**:
   - Configure parameters like total tickets, vendors, customers, release intervals, etc.

4. **Persistent Configuration**:
   - Save and load previous configurations using a SQLite database.

5. **Summary View**:
   - Displays detailed statistics of the simulation, including vendor sales, customer purchases, and total tickets sold.

---

## Technologies Used

### Frontend
- React
- Tailwind CSS
- React Router
- React Toastify

### Backend
- Node.js
- Express.js
- SQLite

---

## Installation

### Prerequisites
1. [Node.js](https://nodejs.org/) installed
2. [SQLite](https://www.sqlite.org/index.html) (optional, required for database browsing)
3. Visual Studio Code (VS Code)

### Steps

1. **Download the Project Files**:
   - Download and extract the project files from the provided archive.

2. **Open the Project in VS Code**:
   - Open VS Code and use the `File > Open Folder` option to navigate to the extracted project folder.

3. **Set Up the Backend**:
   - Navigate to the `backend` folder in the terminal:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```

4. **Set Up the Frontend**:
   - Open a new terminal in VS Code and navigate to the `my-app` folder:
     ```bash
     cd ../my-app
     ```
   - Install dependencies:
     ```bash
     npm install
     ```

5. **Run the Backend Server**:
   - Navigate back to the `backend` folder in the terminal:
     ```bash
     cd ../backend
     ```
   - Start the backend server:
     ```bash
     node server.js
     ```

6. **Run the Frontend Application**:
   - Open a new terminal in VS Code and navigate to the `my-app` folder:
     ```bash
     cd ../my-app
     ```
   - Start the frontend application:
     ```bash
     npm start
     ```

7. **Access the Application**:
   - Open your browser and navigate to:
     ```
     http://localhost:3000
     ```

---

## Usage

### Configure and Start the System

1. **Configure the Simulation**:
   - Fill out the configuration form on the homepage with the following fields:
     - **Total Tickets Available**: Total number of tickets in the simulation.
     - **Max Ticket Capacity**: Maximum tickets in the active pool.
     - **Tickets Per Release**: Number of tickets released at each interval.
     - **Ticket Release Interval (seconds)**: Interval at which vendors release tickets.
     - **Customer Retrieval Interval (seconds)**: Interval at which customers retrieve tickets.
     - **Number of Vendors**: Total vendors participating.
     - **Number of Customers**: Total customers participating.
   - Alternatively, click "Load Last Configuration" to load the previous settings.

2. **Start the Simulation**:
   - Click the "Start" button to begin the simulation.
   - Observe live logs on the right-hand side.
   - Monitor the "Remaining Tickets" count, which updates in real-time.

3. **Stop the Simulation**:
   - Click the "Stop" button to end the simulation.

4. **View Summary**:
   - After stopping the simulation, click "View Summary" to see detailed statistics:
     - Vendor sales
     - Customer purchases
     - Total tickets sold
     - Configuration used for the simulation

### Explanation of UI Controls

- **Configuration Form**:
  - Used to input simulation parameters or load the last saved configuration.

- **Start Button**:
  - Begins the simulation based on the provided configuration.

- **Stop Button**:
  - Ends the simulation and displays a summary button.

- **View Summary Button**:
  - Navigates to the summary page with detailed statistics.

- **Logs Section**:
  - Displays live activity logs, including ticket sales and vendor actions.

---

## File Structure

```
ticketing-system/
├── backend/
│   ├── logic/              # Core backend logic
│   │   └── ticketSystem.js # Simulation logic
│   ├── models/             # Ticket, Customer, Vendor models
│   │   ├── ticketPool.js   # Ticket pool logic
│   │   └── simulationRoutes.js # Simulation routes
│   ├── routes/             # API route handlers
│   ├── configurations.db   # SQLite database file
│   ├── database.js         # SQLite database setup
│   ├── server.js           # Main backend server
│   ├── package.json        # Backend dependencies
│   └── package-lock.json   # Backend lock file
├── my-app/
│   ├── public/             # Public assets
│   ├── src/
│   │   ├── pages/          # React components for pages
│   │   │   ├── ConfigForm.js   # Configuration form
│   │   │   ├── ConfigDisplay.js # Simulation display
│   │   │   └── SummaryPage.js  # Summary page
│   │   ├── App.js          # Root component
│   │   ├── index.js        # React DOM rendering
│   │   ├── index.css       # Global styles
│   │   └── tailwind.config.js # Tailwind configuration
│   ├── package.json        # Frontend dependencies
│   └── package-lock.json   # Frontend lock file
└── README.md               # Project documentation
```

---

## API Endpoints

### Backend

- **Start Simulation**
  - **URL**: `/api/start`
  - **Method**: POST
  - **Body**: Configuration data (JSON)
  - **Response**: `{ message: "Simulation started" }`

- **Stop Simulation**
  - **URL**: `/api/stop`
  - **Method**: POST
  - **Response**: `{ message: "Simulation stopped", summary: {...} }`

- **Status**
  - **URL**: `/api/status`
  - **Method**: GET
  - **Response**: `{ ticketPool: [...], logs: [...] }`

- **Save Configuration**
  - **URL**: `/api/configuration`
  - **Method**: POST
  - **Body**: Configuration data (JSON)
  - **Response**: `{ message: "Configuration saved successfully." }`

- **Load Last Configuration**
  - **URL**: `/api/configuration/last`
  - **Method**: GET
  - **Response**: Configuration data (JSON)
