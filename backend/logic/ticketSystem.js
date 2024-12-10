const { EventEmitter } = require('events');

class TicketSystem extends EventEmitter {
  constructor(config) {
    super();
    this.config = config;
    this.vendorThreads = [];
    this.customerThreads = [];
    this.isRunning = false;

    this.allTickets = []; // Pool of all tickets
    this.activeTicketPool = []; // Tickets available for customers to purchase
    this.vendorSales = {}; // Track tickets sold by each vendor
    this.customerPurchases = {}; // Track how many tickets each customer purchased

    this.initializeTickets();
  }

  initializeTickets() {
    // Evenly distribute tickets across vendors
    const ticketsPerVendor = Math.floor(this.config.totalTickets / this.config.vendorCount);

    for (let i = 0; i < this.config.vendorCount; i++) {
      for (let j = 0; j < ticketsPerVendor; j++) {
        this.allTickets.push({
          id: `Ticket-${this.allTickets.length + 1}`,
          vendorID: `Vendor-${i}`,
        });
      }

      this.vendorSales[`Vendor-${i}`] = 0; // Initialize each vendor's ticket sales
    }

    console.log(`Preloaded ${this.allTickets.length} tickets evenly across vendors.`);
  }

  startSimulation() {
    console.log('Starting simulation...');
    this.isRunning = true;

    for (let i = 0; i < this.config.vendorCount; i++) {
      const vendorInterval = this._startVendor(i);
      this.vendorThreads.push(vendorInterval);
    }

    setTimeout(() => {
      for (let i = 0; i < this.config.customerCount; i++) {
        const customerID = `Customer-${i}`;
        this.customerPurchases[customerID] = 0;
        const customerInterval = this._startCustomer(customerID);
        this.customerThreads.push(customerInterval);
      }
    }, this.config.ticketReleaseInterval);
  }

  stopSimulation() {
    console.log('Stopping simulation...');
    this.isRunning = false;

    this.vendorThreads.forEach(clearInterval);
    this.customerThreads.forEach(clearInterval);

    console.log('Simulation stopped. All threads cleared.');

    const summary = this.getSummary();
    console.log('Simulation Summary:', summary);
    return summary;
  }

  _startVendor(vendorID) {
    return setInterval(() => {
      if (!this.isRunning) {
        clearInterval();
        return;
      }

      if (this.allTickets.length === 0) {
        console.log(`Vendor-${vendorID} stopping. No more tickets to add.`);
        clearInterval();
        return;
      }

      const availableSpace = this.config.maxTicketCapacity - this.activeTicketPool.length;
      const ticketsToAdd = Math.min(this.config.ticketsPerRelease, availableSpace);

      if (ticketsToAdd > 0) {
        for (let i = 0; i < ticketsToAdd; i++) {
          const ticket = this.allTickets.shift();
          this.activeTicketPool.push(ticket);
          this.vendorSales[ticket.vendorID]++;
        }

        console.log(`Vendor-${vendorID} added ${ticketsToAdd} tickets.`);
      } else {
        console.log(`Vendor-${vendorID} cannot add tickets. Max capacity reached.`);
      }

      // Stop vendors automatically if no more tickets to add
      if (this.allTickets.length === 0) {
        console.log(`Vendor-${vendorID} has no more tickets to add.`);
        clearInterval();
      }
    }, this.config.ticketReleaseInterval);
  }

  _startCustomer(customerID) {
    return setInterval(() => {
      if (!this.isRunning) {
        clearInterval();
        return;
      }

      if (this.activeTicketPool.length > 0) {
        const ticket = this.activeTicketPool.shift();
        this.customerPurchases[customerID]++;
        console.log(`Customer-${customerID} purchased ticket ${ticket.id} from ${ticket.vendorID}`);
      } else if (this.allTickets.length === 0 && this.activeTicketPool.length === 0) {
        console.log(`Customer-${customerID} stopping: No more tickets available.`);
        clearInterval();
      } else {
        console.log(`Customer-${customerID} found no tickets.`);
      }

      // Check if all tickets are purchased and stop simulation
      if (
        this.activeTicketPool.length === 0 &&
        this.allTickets.length === 0 &&
        Object.values(this.customerPurchases).reduce((sum, val) => sum + val, 0) >= this.config.totalTickets
      ) {
        console.log('All tickets have been sold. Stopping simulation.');
        this.stopSimulation();
      }
    }, this.config.customerRetrievalInterval);
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
