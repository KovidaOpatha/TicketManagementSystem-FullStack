const { EventEmitter } = require('events');

class TicketSystem extends EventEmitter {
  constructor(config) {
    super();
    this.config = config;
    this.vendorThreads = [];
    this.customerThreads = [];
    this.isRunning = false;

    this.vendorTickets = {};
    this.activeTicketPool = [];
    this.vendorSales = {};
    this.customerPurchases = {};
    this.logs = []; // Logging mechanism

    this.initializeTickets();
  }

  logActivity(message) {
    this.logs.push(message);
    if (this.logs.length > 1000) this.logs.shift(); // Keep log size manageable
  }

  initializeTickets() {
    const ticketsPerVendor = Math.floor(this.config.totalTickets / this.config.vendorCount);
    let remainingTickets = this.config.totalTickets % this.config.vendorCount;

    for (let i = 1; i <= this.config.vendorCount; i++) {
      const ticketsToAdd = ticketsPerVendor + (remainingTickets > 0 ? 1 : 0);
      remainingTickets--;

      this.vendorTickets[`Vendor-${i}`] = [];

      for (let j = 0; j < ticketsToAdd; j++) {
        this.vendorTickets[`Vendor-${i}`].push({
          id: `Ticket-${Object.keys(this.vendorTickets).reduce((sum, key) => sum + this.vendorTickets[key].length, 0) + 1}`,
          vendorID: `Vendor-${i}`,
        });
      }

      this.vendorSales[`Vendor-${i}`] = 0;
    }

    for (let i = 1; i <= this.config.customerCount; i++) {
      this.customerPurchases[`Customer-${i}`] = 0;
    }

    this.logActivity(`Initialized ${this.config.totalTickets} tickets.`);
  }

  startSimulation() {
    this.logActivity('Starting simulation...');
    this.isRunning = true;

    for (let i = 1; i <= this.config.vendorCount; i++) {
      const vendorInterval = this._startVendor(`Vendor-${i}`);
      this.vendorThreads.push(vendorInterval);
    }

    setTimeout(() => {
      for (let i = 1; i <= this.config.customerCount; i++) {
        const customerID = `Customer-${i}`;
        const customerInterval = this._startCustomer(customerID);
        this.customerThreads.push(customerInterval);
      }
    }, this.config.ticketReleaseInterval);
  }

  stopSimulation() {
    this.logActivity('Stopping simulation...');
    this.isRunning = false;

    this.vendorThreads.forEach((interval) => clearInterval(interval));
    this.customerThreads.forEach((interval) => clearInterval(interval));

    const summary = this.getSummary();
    this.logActivity('Simulation stopped.');
    this.logActivity('Summary: ' + JSON.stringify(summary));
    return summary;
  }

  _startVendor(vendorID) {
    const vendorInterval = setInterval(() => {
      if (!this.isRunning) {
        clearInterval(vendorInterval);
        return;
      }

      const ticketsForVendor = this.vendorTickets[vendorID];
      if (!ticketsForVendor || ticketsForVendor.length === 0) {
        this.logActivity(`${vendorID} has no more tickets.`);
        clearInterval(vendorInterval);
        return;
      }

      const availableSpace = this.config.maxTicketCapacity - this.activeTicketPool.length;
      const ticketsToAdd = Math.min(this.config.ticketsPerRelease, availableSpace, ticketsForVendor.length);

      for (let i = 0; i < ticketsToAdd; i++) {
        const ticket = ticketsForVendor.shift();
        this.activeTicketPool.push(ticket);
      }

      this.logActivity(`${vendorID} added ${ticketsToAdd} tickets.`);
    }, this.config.ticketReleaseInterval);

    return vendorInterval;
  }

  _startCustomer(customerID) {
    const customerInterval = setInterval(() => {
      if (!this.isRunning) {
        clearInterval(customerInterval);
        return;
      }

      if (this.activeTicketPool.length > 0) {
        const ticket = this.activeTicketPool.shift();
        this.customerPurchases[customerID]++;
        this.vendorSales[ticket.vendorID]++;
        this.logActivity(`${customerID} purchased ticket ${ticket.id} from ${ticket.vendorID}`);
      } else if (Object.values(this.vendorTickets).every((tickets) => tickets.length === 0) && this.activeTicketPool.length === 0) {
        this.logActivity(`${customerID} stopping: No more tickets available.`);
        clearInterval(customerInterval);
      } else {
        this.logActivity(`${customerID} found no tickets.`);
      }
    }, this.config.customerRetrievalInterval);

    return customerInterval;
  }

  getSummary() {
    return {
      vendorSales: this.vendorSales,
      customerPurchases: this.customerPurchases,
      totalTicketsSold: Object.values(this.vendorSales).reduce((sum, value) => sum + value, 0),
      totalCustomerTickets: Object.values(this.customerPurchases).reduce((sum, value) => sum + value, 0),
      config: this.config,
    };
  }

  getLogs() {
    return this.logs;
  }
}

module.exports = TicketSystem;