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
    this.vendorTicketSales = {}; // Track tickets sold by each vendor

    this.initializeTickets();
  }

  initializeTickets() {
    for (let i = 0; i < this.config.totalTickets; i++) {
      this.allTickets.push({ id: `Ticket-${i + 1}`, vendorID: `Vendor-${i % this.config.vendorCount}` });
    }
    console.log(`Preloaded ${this.allTickets.length} tickets into the system.`);
  }

  startSimulation() {
    console.log("Starting simulation...");
    this.isRunning = true;

    for (let i = 0; i < this.config.vendorCount; i++) {
      this.vendorTicketSales[`Vendor-${i}`] = 0; // Initialize ticket sales for each vendor
      const vendorInterval = this._startVendor(i);
      this.vendorThreads.push(vendorInterval);
    }

    setTimeout(() => {
      for (let i = 0; i < this.config.customerCount; i++) {
        const customerInterval = this._startCustomer(i);
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

    // Return the summary
    return {
      vendorSales: this.vendorTicketSales,
      config: this.config,
    };
  }

  _startVendor(vendorID) {
    return setInterval(() => {
      if (!this.isRunning) {
        clearInterval();
        return;
      }

      const availableSpace = this.config.maxTicketCapacity - this.activeTicketPool.length;
      const ticketsToAdd = Math.min(this.config.ticketsPerRelease, availableSpace);

      if (ticketsToAdd > 0) {
        for (let i = 0; i < ticketsToAdd; i++) {
          if (this.allTickets.length > 0) {
            const ticket = this.allTickets.shift();
            this.activeTicketPool.push(ticket);
            this.vendorTicketSales[ticket.vendorID] += 1; // Log ticket sale by vendor
          }
        }
        console.log(`Vendor-${vendorID} added ${ticketsToAdd} tickets.`);
      } else {
        console.log(`Vendor-${vendorID} cannot add tickets. Max capacity reached.`);
      }

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
        console.log(`Customer-${customerID} purchased ticket ${ticket.id} from ${ticket.vendorID}`);
      } else {
        console.log(`Customer-${customerID} found no tickets.`);
      }
    }, this.config.customerRetrievalInterval);
  }

  getSummary() {
    return {
      vendorSales: this.vendorTicketSales,
      config: this.config,
    };
  }
}

module.exports = TicketSystem;
