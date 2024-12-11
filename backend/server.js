const express = require('express'); // Import express framework
const cors = require('cors'); // Import CORS for handling cross-origin requests
const TicketSystem = require('./logic/ticketSystem'); // Import the TicketSystem class
const bodyParser = require('body-parser'); // Import body-parser for handling JSON requests
const db = require('./database'); // Import the database module

const app = express(); // Initialize express app
app.use(bodyParser.json()); // Middleware to parse JSON request bodies

const PORT = 3001; // Define the server port

app.use(express.json()); // Middleware for parsing JSON payloads
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from the frontend application
}));

let ticketSystem = null; // Variable to store the running ticket system instance

// Endpoint to start the ticket simulation
app.post('/api/start', (req, res) => {
  const config = req.body; // Retrieve configuration data from request body
  try {
    ticketSystem = new TicketSystem(config); // Initialize a new TicketSystem instance
    ticketSystem.startSimulation(); // Start the simulation
    res.status(200).json({ message: 'Simulation started' }); // Respond with success
  } catch (error) {
    console.error('Error starting simulation:', error.message); // Log error
    res.status(500).json({ error: 'Failed to start simulation' }); // Respond with error
  }
});

// Endpoint to stop the ticket simulation
app.post('/api/stop', (req, res) => {
  if (ticketSystem) {
    try {
      const summary = ticketSystem.stopSimulation(); // Stop the simulation and get summary
      ticketSystem = null; // Clear the instance
      res.status(200).json({ message: 'Simulation stopped', summary }); // Respond with success and summary
    } catch (error) {
      console.error('Error stopping simulation:', error.message); // Log error
      res.status(500).json({ error: 'Failed to stop simulation' }); // Respond with error
    }
  } else {
    res.status(400).json({ error: 'No simulation is currently running' }); // Handle case where no simulation is running
  }
});

// Endpoint to get the current status of the ticket simulation
app.get('/api/status', (req, res) => {
  if (ticketSystem) {
    try {
      const status = {
        ticketPool: ticketSystem.activeTicketPool, // Get the active ticket pool
        logs: ticketSystem.getLogs(), // Get the logs
      };
      res.status(200).json(status); // Respond with the current status
    } catch (error) {
      console.error('Error fetching status:', error.message); // Log error
      res.status(500).json({ error: 'Failed to fetch status' }); // Respond with error
    }
  } else {
    res.status(400).json({ error: 'Simulation not running' }); // Handle case where simulation is not running
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`); // Log server start
});

// Endpoint to save a new configuration
app.post('/api/configuration', (req, res) => {
  const {
    totalTickets,
    maxTicketCapacity,
    ticketsPerRelease,
    ticketReleaseInterval,
    customerRetrievalInterval,
    vendorCount,
    customerCount,
  } = req.body; // Destructure configuration data from request body

  const sql = `
    INSERT INTO configurations (
      totalTickets,
      maxTicketCapacity,
      ticketsPerRelease,
      ticketReleaseInterval,
      customerRetrievalInterval,
      vendorCount,
      customerCount
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `; // SQL query to insert configuration data

  db.run(
    sql,
    [
      totalTickets,
      maxTicketCapacity,
      ticketsPerRelease,
      ticketReleaseInterval,
      customerRetrievalInterval,
      vendorCount,
      customerCount,
    ],
    function (err) {
      if (err) {
        console.error('Error saving configuration:', err.message); // Log error
        return res.status(500).send('Error saving configuration.'); // Respond with error
      }
      res.status(201).json({ id: this.lastID, message: 'Configuration saved successfully.' }); // Respond with success
    }
  );
});

// Endpoint to retrieve the last saved configuration
app.get('/api/configuration/last', (req, res) => {
  const sql = `
    SELECT *
    FROM configurations
    ORDER BY createdAt DESC
    LIMIT 1
  `; // SQL query to get the last saved configuration

  db.get(sql, (err, row) => {
    if (err) {
      console.error('Error fetching last configuration:', err.message); // Log error
      return res.status(500).send('Error fetching last configuration.'); // Respond with error
    }
    if (!row) {
      return res.status(404).send('No configurations found.'); // Handle case where no configurations exist
    }
    res.json(row); // Respond with the last configuration
  });
});
