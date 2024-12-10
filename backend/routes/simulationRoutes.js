const express = require('express');
const { startSimulation, stopSimulation } = require('../logic/ticketSystem');

const router = express.Router();

// Start simulation
router.post('/start', async (req, res) => {
  const config = req.body;
  try {
    await startSimulation(config);
    res.status(200).json({ status: 'Simulation started', config });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stop simulation
router.post('/stop', async (req, res) => {
  try {
    await stopSimulation();
    res.status(200).json({ status: 'Simulation stopped' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
