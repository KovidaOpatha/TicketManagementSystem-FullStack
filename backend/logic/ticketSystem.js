const { EventEmitter } = require('events');

class TicketSystem extends EventEmitter {
  constructor(config) {
    super();
    this.config = config; // Configuration object containing system settings
    this.vendorThreads = []; // Array to store vendor threads
    this.customerThreads = []; // Array to store customer threads
    this.isRunning = false; // Flag to track the simulation status

    this.vendorTickets = {}; // Object to hold tickets assigned to each vendor
    this.activeTicketPool = []; // Array to represent the current pool of tickets available for purchase
    this.vendorSales = {}; // Object to store sales count for each vendor
    this.customerPurchases = {}; // Object to store the number of tickets purchased by each customer
    this.logs = []; // Logging mechanism to record system activities

    this.initializeTickets(); // Initialize tickets for the simulation
  }

  // Method to log activity messages
  logActivity(message) {
    this.logs.push(message); // Add message to the logs array
    if (this.logs.length > 1000) this.logs.shift(); // Remove oldest logs to manage size
  }

  // Method to initialize tickets and assign them to vendors
  initializeTickets() {
    const ticketsPerVendor = Math.floor(this.config.totalTickets / this.config.vendorCount); // Tickets per vendor
    let remainingTickets = this.config.totalTickets % this.config.vendorCount; // Remaining tickets to distribute

    for (let i = 1; i <= this.config.vendorCount; i++) {
      const ticketsToAdd = ticketsPerVendor + (remainingTickets > 0 ? 1 : 0); // Distribute remaining tickets
      remainingTickets--;

      this.vendorTickets[`Vendor-${i}`] = []; // Initialize ticket array for the vendor

      for (let j = 0; j < ticketsToAdd; j++) {
        // Assign unique tickets to the vendor
        this.vendorTickets[`Vendor-${i}`].push({
          id: `Ticket-${Object.keys(this.vendorTickets).reduce((sum, key) => sum + this.vendorTickets[key].length, 0) + 1}`,
          vendorID: `Vendor-${i}`,
        });
      }

      this.vendorSales[`Vendor-${i}`] = 0; // Initialize sales count for the vendor
    }

    for (let i = 1; i <= this.config.customerCount; i++) {
      this.customerPurchases[`Customer-${i}`] = 0; // Initialize purchase count for the customer
    }

    this.logActivity(`Initialized ${this.config.totalTickets} tickets.`); // Log ticket initialization
  }

  // Method to start the simulation
  startSimulation() {
    this.logActivity('Starting simulation...');
    this.isRunning = true; // Set the running flag to true

    // Start vendor threads
    for (let i = 1; i <= this.config.vendorCount; i++) {
      const vendorInterval = this._startVendor(`Vendor-${i}`);
      this.vendorThreads.push(vendorInterval); // Store vendor intervals
    }

    // Delay customer thread start to align with ticket release interval
    setTimeout(() => {
      for (let i = 1; i <= this.config.customerCount; i++) {
        const customerID = `Customer-${i}`;
        const customerInterval = this._startCustomer(customerID);
        this.customerThreads.push(customerInterval); // Store customer intervals
      }
    }, this.config.ticketReleaseInterval);
  }

  // Method to stop the simulation
  stopSimulation() {
    this.logActivity('Stopping simulation...');
    this.isRunning = false; // Set the running flag to false

    this.vendorThreads.forEach((interval) => clearInterval(interval)); // Stop vendor threads
    this.customerThreads.forEach((interval) => clearInterval(interval)); // Stop customer threads
    this.vendorThreads = [];
    this.customerThreads = [];

    const summary = this.getSummary(); // Get simulation summary
    this.logActivity('Simulation stopped.');
    this.logActivity('Summary: ' + JSON.stringify(summary)); // Log simulation summary
    return summary;
  }

  // Method to handle vendor activities
  _startVendor(vendorID) {
    const vendorInterval = setInterval(() => {
      if (!this.isRunning) {
        clearInterval(vendorInterval); // Stop if simulation is not running
        return;
      }

      const ticketsForVendor = this.vendorTickets[vendorID];
      if (!ticketsForVendor || ticketsForVendor.length === 0) {
        // Stop vendor thread if no tickets left
        this.logActivity(`${vendorID} has no more tickets.`);
        clearInterval(vendorInterval);
        return;
      }

      // Calculate tickets to add based on configuration and pool availability
      const availableSpace = this.config.maxTicketCapacity - this.activeTicketPool.length;
      const ticketsToAdd = Math.min(this.config.ticketsPerRelease, availableSpace, ticketsForVendor.length);

      for (let i = 0; i < ticketsToAdd; i++) {
        const ticket = ticketsForVendor.shift();
        this.activeTicketPool.push(ticket); // Add ticket to the active pool
      }

      this.logActivity(`${vendorID} added ${ticketsToAdd} tickets.`); // Log ticket addition
    }, this.config.ticketReleaseInterval);

    return vendorInterval;
  }

  // Method to handle customer activities
  _startCustomer(customerID) {
    const customerInterval = setInterval(() => {
      if (!this.isRunning) {
        clearInterval(customerInterval); // Stop if simulation is not running
        return;
      }

      if (this.activeTicketPool.length > 0) {
        // Customer purchases a ticket
        const ticket = this.activeTicketPool.shift();
        this.customerPurchases[customerID]++;
        this.vendorSales[ticket.vendorID]++;
        this.logActivity(`${customerID} purchased ticket ${ticket.id} from ${ticket.vendorID}`);
      } else if (Object.values(this.vendorTickets).every((tickets) => tickets.length === 0) && this.activeTicketPool.length === 0) {
        // Stop customer thread if no tickets are available
        this.logActivity(`${customerID} stopping: No more tickets available.`);
        clearInterval(customerInterval);
      } else {
        this.logActivity(`${customerID} found no tickets.`);
      }
    }, this.config.customerRetrievalInterval);

    return customerInterval;
  }

  // Method to generate simulation summary
  getSummary() {
    return {
      vendorSales: this.vendorSales, // Total sales by each vendor
      customerPurchases: this.customerPurchases, // Total purchases by each customer
      totalTicketsSold: Object.values(this.vendorSales).reduce((sum, value) => sum + value, 0), // Total tickets sold
      totalCustomerTickets: Object.values(this.customerPurchases).reduce((sum, value) => sum + value, 0), // Total tickets purchased
      config: this.config, // Configuration details
    };
  }

  // Method to retrieve logs
  getLogs() {
    return this.logs;
  }
}

module.exports = TicketSystem; // Export the TicketSystem class
