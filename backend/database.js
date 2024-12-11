const sqlite3 = require('sqlite3').verbose(); // Import SQLite3 for database operations

// Initialize the SQLite database
const db = new sqlite3.Database('configurations.db', (err) => {
  if (err) {
    // Log error if the database fails to open
    console.error('Error opening database:', err.message);
  } else {
    // Log success message when the database connection is established
    console.log('Connected to the SQLite database.');

    // Create the "configurations" table if it doesn't already exist
    db.run(`
      CREATE TABLE IF NOT EXISTS configurations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,  -- Auto-incrementing unique ID for each configuration
        totalTickets INTEGER,                  -- Total number of tickets available
        maxTicketCapacity INTEGER,             -- Maximum capacity of the ticket pool
        ticketsPerRelease INTEGER,             -- Number of tickets released per interval
        ticketReleaseInterval INTEGER,         -- Interval for ticket release in milliseconds
        customerRetrievalInterval INTEGER,     -- Interval for customer ticket retrieval in milliseconds
        vendorCount INTEGER,                   -- Number of vendors in the simulation
        customerCount INTEGER,                 -- Number of customers in the simulation
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp of when the configuration was created
      )
    `);
  }
});

module.exports = db; // Export the database instance for use in other parts of the application
