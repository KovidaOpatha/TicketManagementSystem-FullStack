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

  if (!config.totalTickets) {
    return res.status(400).json({ error: 'Total tickets field is missing or invalid.' });
  }

  ticketSystem = new TicketSystem(config);
  ticketSystem.startSimulation();
  res.status(200).json({ message: 'Simulation started successfully.' });
});

app.post('/api/stop', (req, res) => {
  if (ticketSystem) {
    ticketSystem.stopSimulation();
    ticketSystem = null;
    return res.status(200).json({ message: 'Simulation stopped successfully' });
  }
  return res.status(400).json({ error: 'No simulation is currently running' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
