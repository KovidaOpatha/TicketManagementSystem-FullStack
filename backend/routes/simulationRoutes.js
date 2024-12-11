const express = require('express');
const { startSimulation, stopSimulation } = require('../logic/ticketSystem'); // Import simulation logic

const router = express.Router(); // Create an Express router for handling simulation-related routes

// Endpoint to start the simulation
router.post('/start', async (req, res) => {
  const config = req.body; // Retrieve simulation configuration from the request body
  try {
    await startSimulation(config); // Start the simulation with the provided configuration
    res.status(200).json({ status: 'Simulation started', config }); // Respond with success status and config
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle and respond with error if something goes wrong
  }
});

// Endpoint to stop the simulation
router.post('/stop', async (req, res) => {
  try {
    await stopSimulation(); // Stop the simulation
    res.status(200).json({ status: 'Simulation stopped' }); // Respond with success status
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle and respond with error if something goes wrong
  }
});

module.exports = router; // Export the router to be used in the application
