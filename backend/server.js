const express = require('express');
const cors = require('cors');
const TicketSystem = require('./logic/ticketSystem');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
}));

let ticketSystem = null;

app.post('/api/start', (req, res) => {
  const config = req.body;
  try {
    ticketSystem = new TicketSystem(config);
    ticketSystem.startSimulation();
    res.status(200).json({ message: 'Simulation started' });
  } catch (error) {
    console.error('Error starting simulation:', error.message);
    res.status(500).json({ error: 'Failed to start simulation' });
  }
});

app.post('/api/stop', (req, res) => {
  if (ticketSystem) {
    try {
      const summary = ticketSystem.stopSimulation();
      ticketSystem = null;
      res.status(200).json({ message: 'Simulation stopped', summary });
    } catch (error) {
      console.error('Error stopping simulation:', error.message);
      res.status(500).json({ error: 'Failed to stop simulation' });
    }
  } else {
    res.status(400).json({ error: 'No simulation is currently running' });
  }
});

app.get('/api/status', (req, res) => {
  if (ticketSystem) {
    try {
      const status = {
        ticketPool: ticketSystem.activeTicketPool,
        logs: ticketSystem.getLogs(),
      };
      res.status(200).json(status);
    } catch (error) {
      console.error('Error fetching status:', error.message);
      res.status(500).json({ error: 'Failed to fetch status' });
    }
  } else {
    res.status(400).json({ error: 'Simulation not running' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
