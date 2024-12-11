class TicketPool {
  constructor(maxTicketCapacity) {
    this.maxTicketCapacity = maxTicketCapacity; // Maximum number of tickets the pool can hold
    this.tickets = []; // Queue to hold the tickets
  }

  // Method to add tickets to the pool
  addTickets(ticketIDs) {
    let ticketsAdded = 0; // Counter for successfully added tickets

    for (const ticket of ticketIDs) {
      if (this.tickets.length < this.maxTicketCapacity) {
        // Add ticket to the pool if there's available capacity
        this.tickets.push(ticket);
        ticketsAdded++;
      } else {
        // If the pool is at maximum capacity, stop adding tickets
        console.log('Max ticket capacity reached. No more tickets can be added.');
        break;
      }
    }
    console.log(`Tickets added: ${ticketsAdded}`); // Log the number of tickets added
  }

  // Method to remove a ticket from the pool
  removeTicket() {
    if (this.tickets.length > 0) {
      // Remove and return the first ticket in the pool
      const ticket = this.tickets.shift();
      console.log(`Ticket removed: ${ticket.id}`); // Log the removed ticket
      return ticket;
    }
    // If no tickets are available, log a message
    console.log('No tickets available.');
    return null; // Return null if the pool is empty
  }

  // Method to get the current number of tickets in the pool
  getTicketCount() {
    return this.tickets.length; // Return the size of the ticket queue
  }
}

module.exports = TicketPool; // Export the TicketPool class
