class TicketPool {
  constructor(maxTicketCapacity) {
    this.maxTicketCapacity = maxTicketCapacity;
    this.tickets = [];
  }

  addTickets(ticketIDs) {
    let ticketsAdded = 0;

    for (const ticket of ticketIDs) {
      if (this.tickets.length < this.maxTicketCapacity) {
        this.tickets.push(ticket);
        ticketsAdded++;
      } else {
        console.log('Max ticket capacity reached. No more tickets can be added.');
        break;
      }
    }
    console.log(`Tickets added: ${ticketsAdded}`);
  }

  removeTicket() {
    if (this.tickets.length > 0) {
      const ticket = this.tickets.shift();
      console.log(`Ticket removed: ${ticket.id}`);
      return ticket;
    }
    console.log('No tickets available.');
    return null;
  }

  getTicketCount() {
    return this.tickets.length;
  }
}

module.exports = TicketPool;
