const express = require('express');
const cors = require('cors');
const TicketSystem = require('./logic/ticketSystem');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
app.use(bodyParser.json());

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

app.post('/api/configuration', (req, res) => {
  const {
    totalTickets,
    maxTicketCapacity,
    ticketsPerRelease,
    ticketReleaseInterval,
    customerRetrievalInterval,
    vendorCount,
    customerCount,
  } = req.body;

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
  `;

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
        console.error('Error saving configuration:', err.message);
        return res.status(500).send('Error saving configuration.');
      }
      res.status(201).json({ id: this.lastID, message: 'Configuration saved successfully.' });
    }
  );
});

app.get('/api/configuration/last', (req, res) => {
  const sql = `
    SELECT *
    FROM configurations
    ORDER BY createdAt DESC
    LIMIT 1
  `;

  db.get(sql, (err, row) => {
    if (err) {
      console.error('Error fetching last configuration:', err.message);
      return res.status(500).send('Error fetching last configuration.');
    }
    if (!row) {
      return res.status(404).send('No configurations found.');
    }
    res.json(row);
  });
});
