import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ConfigForm = () => {
  const [maxTicketCapacity, setMaxTicketCapacity] = useState('');
  const [ticketsPerRelease, setTicketsPerRelease] = useState('');
  const [ticketReleaseInterval, setTicketReleaseInterval] = useState(''); // In seconds
  const [customerRetrievalInterval, setCustomerRetrievalInterval] = useState(''); // In seconds
  const [vendorCount, setVendorCount] = useState('');
  const [customerCount, setCustomerCount] = useState('');
  const [totalTickets, setTotalTickets] = useState('');
  const navigate = useNavigate();

  const loadLastConfiguration = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/configuration/last');
      if (!response.ok) throw new Error('Failed to fetch last configuration');
      const config = await response.json();

      // Convert milliseconds to seconds for display
      setTotalTickets(config.totalTickets);
      setMaxTicketCapacity(config.maxTicketCapacity);
      setTicketsPerRelease(config.ticketsPerRelease);
      setTicketReleaseInterval(config.ticketReleaseInterval / 1000); // Convert ms to s
      setCustomerRetrievalInterval(config.customerRetrievalInterval / 1000); // Convert ms to s
      setVendorCount(config.vendorCount);
      setCustomerCount(config.customerCount);
    } catch (error) {
      console.error('Error loading last configuration:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const configData = {
      totalTickets: parseInt(totalTickets),
      maxTicketCapacity: parseInt(maxTicketCapacity),
      ticketsPerRelease: parseInt(ticketsPerRelease),
      ticketReleaseInterval: parseInt(ticketReleaseInterval) * 1000, // Convert s to ms
      customerRetrievalInterval: parseInt(customerRetrievalInterval) * 1000, // Convert s to ms
      vendorCount: parseInt(vendorCount),
      customerCount: parseInt(customerCount),
    };

    try {
      const response = await fetch('http://localhost:3001/api/configuration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configData),
      });
      if (!response.ok) throw new Error('Failed to save configuration');
      console.log('Configuration saved');
    } catch (error) {
      console.error('Error saving configuration:', error);
    }

    navigate('/display', { state: configData });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-gray-800 shadow-lg rounded-lg space-y-6">
      <h2 className="text-white text-2xl font-semibold text-center">Ticketing System Configuration</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-white">Total Tickets Available</label>
          <input
            type="number"
            value={totalTickets}
            onChange={(e) => setTotalTickets(e.target.value)}
            placeholder="Enter total number of tickets"
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-white">Max Ticket Capacity</label>
          <input
            type="number"
            value={maxTicketCapacity}
            onChange={(e) => setMaxTicketCapacity(e.target.value)}
            placeholder="Enter maximum ticket capacity"
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-white">Tickets Per Release</label>
          <input
            type="number"
            value={ticketsPerRelease}
            onChange={(e) => setTicketsPerRelease(e.target.value)}
            placeholder="Enter tickets released per batch"
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-white">Ticket Release Interval (seconds)</label>
          <input
            type="number"
            value={ticketReleaseInterval}
            onChange={(e) => setTicketReleaseInterval(e.target.value)}
            placeholder="Enter interval between releases in seconds"
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-white">Customer Retrieval Interval (seconds)</label>
          <input
            type="number"
            value={customerRetrievalInterval}
            onChange={(e) => setCustomerRetrievalInterval(e.target.value)}
            placeholder="Enter interval for customer retrieval in seconds"
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-white">Number of Vendors</label>
          <input
            type="number"
            value={vendorCount}
            onChange={(e) => setVendorCount(e.target.value)}
            placeholder="Enter number of vendors"
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-white">Number of Customers</label>
          <input
            type="number"
            value={customerCount}
            onChange={(e) => setCustomerCount(e.target.value)}
            placeholder="Enter number of customers"
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
      </div>
      <div className="flex justify-between gap-4">
        <button
          type="button"
          onClick={loadLastConfiguration}
          className="flex-1 bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition"
        >
          Load Last Configuration
        </button>
        <button
          type="submit"
          className="flex-1 bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition"
        >
          Submit Configuration
        </button>
      </div>
    </form>
  );
};

export default ConfigForm;
