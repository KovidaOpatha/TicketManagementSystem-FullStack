const sqlite3 = require('sqlite3').verbose();

// Initialize the database
const db = new sqlite3.Database('configurations.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');

    // Create the configurations table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS configurations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        totalTickets INTEGER,
        maxTicketCapacity INTEGER,
        ticketsPerRelease INTEGER,
        ticketReleaseInterval INTEGER,
        customerRetrievalInterval INTEGER,
        vendorCount INTEGER,
        customerCount INTEGER,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
});

module.exports = db;
