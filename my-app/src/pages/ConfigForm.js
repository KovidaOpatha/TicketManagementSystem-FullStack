// src/pages/ConfigForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultConfig from '../defaultConfig';

const ConfigForm = ({ onSubmit }) => {
  const [maxTicketCapacity, setMaxTicketCapacity] = useState('');
  const [ticketsPerRelease, setTicketsPerRelease] = useState('');
  const [ticketReleaseInterval, setTicketReleaseInterval] = useState('');
  const [customerRetrievalInterval, setCustomerRetrievalInterval] = useState('');
  const [vendorCount, setVendorCount] = useState('');
  const [customerCount, setCustomerCount] = useState('');
  const [totalTickets, setTotalTickets] = useState('');
  const [debug, setDebug] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const configData = {
      maxTicketCapacity,
      ticketsPerRelease,
      ticketReleaseInterval,
      customerRetrievalInterval,
      vendorCount,
      customerCount,
      totalTickets,
      debug,
    };

    // Call the onSubmit passed from App.js
    if (onSubmit) {
      onSubmit(configData);
    }

    navigate('/display', { state: configData });
  };

  const loadPreviousConfig = () => {
    navigate('/display', { state: defaultConfig });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg space-y-6">
      <h2 className="text-2xl font-semibold text-center">Ticketing System Configuration</h2>
      <div className="space-y-4">
        {/* Total Tickets Input */}
        <div>
          <label className="block text-gray-700">Total Tickets Available</label>
          <input
            type="number"
            value={totalTickets}
            onChange={(e) => setTotalTickets(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Max Ticket Capacity</label>
          <input
            type="number"
            value={maxTicketCapacity}
            onChange={(e) => setMaxTicketCapacity(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Tickets Per Release</label>
          <input
            type="number"
            value={ticketsPerRelease}
            onChange={(e) => setTicketsPerRelease(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Ticket Release Interval</label>
          <input
            type="number"
            value={ticketReleaseInterval}
            onChange={(e) => setTicketReleaseInterval(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Customer Retrieval Interval</label>
          <input
            type="number"
            value={customerRetrievalInterval}
            onChange={(e) => setCustomerRetrievalInterval(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Number of Vendors</label>
          <input
            type="number"
            value={vendorCount}
            onChange={(e) => setVendorCount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Number of Customers</label>
          <input
            type="number"
            value={customerCount}
            onChange={(e) => setCustomerCount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={debug}
            onChange={(e) => setDebug(e.target.checked)}
            id="debug"
            className="mr-2"
          />
          <label htmlFor="debug" className="text-gray-700">Enable Debugging</label>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition"
      >
        Submit Configuration
      </button>
    </form>
  );
};

export default ConfigForm;
