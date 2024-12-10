const { EventEmitter } = require('events');

class TicketSystem extends EventEmitter {
  constructor(config) {
    super();
    this.config = config;
    this.vendorThreads = [];
    this.customerThreads = [];
    this.isRunning = false;

    this.vendorTickets = {}; // Pre-assigned tickets for each vendor
    this.activeTicketPool = []; // Tickets available for customers to purchase
    this.vendorSales = {}; // Track tickets sold by each vendor
    this.customerPurchases = {}; // Track how many tickets each customer purchased

    this.initializeTickets();
  }

  initializeTickets() {
    const ticketsPerVendor = Math.floor(this.config.totalTickets / this.config.vendorCount);
    let remainingTickets = this.config.totalTickets % this.config.vendorCount;

    for (let i = 0; i < this.config.vendorCount; i++) {
      const ticketsToAdd = ticketsPerVendor + (remainingTickets > 0 ? 1 : 0);
      remainingTickets--;

      this.vendorTickets[`Vendor-${i}`] = [];

      for (let j = 0; j < ticketsToAdd; j++) {
        this.vendorTickets[`Vendor-${i}`].push({
          id: `Ticket-${Object.keys(this.vendorTickets).reduce((sum, key) => sum + this.vendorTickets[key].length, 1)}`,
          vendorID: `Vendor-${i}`,
        });
      }

      this.vendorSales[`Vendor-${i}`] = 0; // Initialize each vendor's ticket sales
    }

    for (let i = 0; i < this.config.customerCount; i++) {
      this.customerPurchases[`Customer-${i}`] = 0; // Initialize purchases for each customer
    }

    console.log(`Preloaded ${this.config.totalTickets} tickets evenly across vendors.`);
  }

  startSimulation() {
    console.log('Starting simulation...');
    this.isRunning = true;

    for (let i = 0; i < this.config.vendorCount; i++) {
      const vendorInterval = this._startVendor(`Vendor-${i}`);
      this.vendorThreads.push(vendorInterval);
    }

    setTimeout(() => {
      for (let i = 0; i < this.config.customerCount; i++) {
        const customerID = `Customer-${i}`;
        const customerInterval = this._startCustomer(customerID);
        this.customerThreads.push(customerInterval);
      }
    }, this.config.ticketReleaseInterval);
  }

  stopSimulation() {
    console.log('Stopping simulation...');
    this.isRunning = false;

    // Clear vendor and customer intervals
    this.vendorThreads.forEach((interval) => clearInterval(interval));
    this.customerThreads.forEach((interval) => clearInterval(interval));

    console.log('Simulation stopped. All threads cleared.');

    const summary = this.getSummary();
    console.log('Simulation Summary:', summary);
    return summary;
  }

  _startVendor(vendorID) {
    const vendorInterval = setInterval(() => {
      if (!this.isRunning) {
        clearInterval(vendorInterval); // Stop the vendor thread if the simulation is stopped
        return;
      }

      const ticketsForVendor = this.vendorTickets[vendorID];
      if (!ticketsForVendor || ticketsForVendor.length === 0) {
        console.log(`${vendorID} stopping. No more tickets to add.`);
        clearInterval(vendorInterval); // Stop the vendor thread if no tickets are left
        return;
      }

      const availableSpace = this.config.maxTicketCapacity - this.activeTicketPool.length;
      const ticketsToAdd = Math.min(this.config.ticketsPerRelease, availableSpace, ticketsForVendor.length);

      for (let i = 0; i < ticketsToAdd; i++) {
        const ticket = ticketsForVendor.shift();
        this.activeTicketPool.push(ticket);
      }

      console.log(`${vendorID} added ${ticketsToAdd} tickets.`);
    }, this.config.ticketReleaseInterval);

    return vendorInterval; // Return the interval ID for later clearing
  }

  _startCustomer(customerID) {
    const customerInterval = setInterval(() => {
      if (!this.isRunning) {
        clearInterval(customerInterval); // Stop the customer thread if the simulation is stopped
        return;
      }

      if (this.activeTicketPool.length > 0) {
        const ticket = this.activeTicketPool.shift();
        this.customerPurchases[customerID]++;
        this.vendorSales[ticket.vendorID]++;
        console.log(`${customerID} purchased ticket ${ticket.id} from ${ticket.vendorID}`);
      } else if (Object.values(this.vendorTickets).every((tickets) => tickets.length === 0) && this.activeTicketPool.length === 0) {
        console.log(`${customerID} stopping: No more tickets available.`);
        clearInterval(customerInterval); // Stop the customer thread if no tickets are left
      } else {
        console.log(`${customerID} found no tickets.`);
      }

      if (
        this.activeTicketPool.length === 0 &&
        Object.values(this.vendorTickets).every((tickets) => tickets.length === 0) &&
        Object.values(this.customerPurchases).reduce((sum, val) => sum + val, 0) >= this.config.totalTickets
      ) {
        console.log('All tickets have been sold. Stopping simulation.');
        this.stopSimulation();
      }
    }, this.config.customerRetrievalInterval);

    return customerInterval; // Return the interval ID for later clearing
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
}

module.exports = TicketSystem;
