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
- [Future Enhancements](#future-enhancements)

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

### Steps

1. Download the project files and extract them.

2. Navigate to the `backend` folder and install dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Navigate to the `my-app` folder (frontend) and install dependencies:
   ```bash
   cd ../my-app
   npm install
   ```

4. Run the backend server:
   ```bash
   cd ../backend
   node server.js
   ```

5. Run the frontend application:
   ```bash
   cd ../my-app
   npm start
   ```

6. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## Usage

1. **Configure the Simulation**:
   - Fill out the form on the homepage or load the last configuration.

2. **Start the Simulation**:
   - Click the "Start" button to begin the simulation.
   - Watch live logs and real-time ticket count updates.

3. **Stop the Simulation**:
   - Click the "Stop" button to end the simulation.

4. **View Summary**:
   - Click "View Summary" to see vendor and customer statistics.

5. **Save Configuration**:
   - All configurations are automatically saved for future use.

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

---
