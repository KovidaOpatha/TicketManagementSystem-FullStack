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

    this.initializeTickets();
  }

  initializeTickets() {
    for (let i = 0; i < this.config.totalTickets; i++) {
      this.allTickets.push({ id: `Ticket-${i + 1}`, vendorID: `Vendor-${i % this.config.vendorCount}` });
    }
    console.log(`Preloaded ${this.allTickets.length} tickets into the system.`);
  }

  startSimulation() {
    console.log('Starting simulation...');
    this.isRunning = true;

    // Start vendors first
    for (let i = 0; i < this.config.vendorCount; i++) {
      const vendorInterval = this._startVendor(i);
      this.vendorThreads.push(vendorInterval);
    }

    // Delay customers slightly to ensure vendors add tickets first
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
  }

  _startVendor(vendorID) {
    return setInterval(() => {
      if (!this.isRunning) {
        clearInterval(this.vendorThreads[vendorID]);
        return;
      }

      const availableSpace = this.config.maxTicketCapacity - this.activeTicketPool.length;
      const ticketsToAdd = Math.min(this.config.ticketsPerRelease, availableSpace);

      if (ticketsToAdd > 0) {
        for (let i = 0; i < ticketsToAdd; i++) {
          if (this.allTickets.length > 0) {
            const ticket = this.allTickets.shift();
            this.activeTicketPool.push(ticket);
          }
        }
        console.log(`Vendor-${vendorID} added ${ticketsToAdd} tickets.`);
      } else {
        console.log(`Vendor-${vendorID} cannot add tickets. Max capacity reached.`);
      }

      if (this.allTickets.length === 0) {
        console.log(`Vendor-${vendorID} has no more tickets to add.`);
        clearInterval(this.vendorThreads[vendorID]);
      }
    }, this.config.ticketReleaseInterval);
  }

  _startCustomer(customerID) {
    return setInterval(() => {
      if (!this.isRunning) {
        clearInterval(this.customerThreads[customerID]);
        return;
      }

      if (this.activeTicketPool.length > 0) {
        const ticket = this.activeTicketPool.shift();
        console.log(`Customer-${customerID} purchased ticket ${ticket.id} from ${ticket.vendorID}`);
      } else if (this.allTickets.length === 0 && this.activeTicketPool.length === 0) {
        console.log(`Customer-${customerID} stopping: No more tickets available.`);
        clearInterval(this.customerThreads[customerID]);
      } else {
        console.log(`Customer-${customerID} found no tickets. Waiting for vendors...`);
      }
    }, this.config.customerRetrievalInterval);
  }
}

module.exports = TicketSystem;
