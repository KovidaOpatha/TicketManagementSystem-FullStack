// src/pages/ConfigForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ConfigForm = ({ onSubmit }) => {
  const [maxTicketCapacity, setMaxTicketCapacity] = useState('');
  const [ticketsPerRelease, setTicketsPerRelease] = useState('');
  const [ticketReleaseInterval, setTicketReleaseInterval] = useState('');
  const [customerRetrievalInterval, setCustomerRetrievalInterval] = useState('');
  const [vendorCount, setVendorCount] = useState('');
  const [customerCount, setCustomerCount] = useState('');
  const [totalTickets, setTotalTickets] = useState('');
  const [debug, setDebug] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!totalTickets || totalTickets <= 0) newErrors.totalTickets = 'Total Tickets must be a positive number.';
    if (!maxTicketCapacity || maxTicketCapacity <= 0) newErrors.maxTicketCapacity = 'Max Ticket Capacity must be a positive number.';
    if (!ticketsPerRelease || ticketsPerRelease <= 0) newErrors.ticketsPerRelease = 'Tickets Per Release must be a positive number.';
    if (!ticketReleaseInterval || ticketReleaseInterval <= 0) newErrors.ticketReleaseInterval = 'Ticket Release Interval must be a positive number.';
    if (!customerRetrievalInterval || customerRetrievalInterval <= 0) newErrors.customerRetrievalInterval = 'Customer Retrieval Interval must be a positive number.';
    if (!vendorCount || vendorCount <= 0) newErrors.vendorCount = 'Vendor Count must be a positive number.';
    if (!customerCount || customerCount <= 0) newErrors.customerCount = 'Customer Count must be a positive number.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const configData = {
      maxTicketCapacity: parseInt(maxTicketCapacity),
      ticketsPerRelease: parseInt(ticketsPerRelease),
      ticketReleaseInterval: parseInt(ticketReleaseInterval),
      customerRetrievalInterval: parseInt(customerRetrievalInterval),
      vendorCount: parseInt(vendorCount),
      customerCount: parseInt(customerCount),
      totalTickets: parseInt(totalTickets),
      debug,
    };

    if (onSubmit) {
      onSubmit(configData);
    }

    navigate('/display', { state: configData });
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
          {errors.totalTickets && <p className="text-red-500 text-sm">{errors.totalTickets}</p>}
        </div>

        {/* Other Inputs with Validation */}
        <div>
          <label className="block text-gray-700">Max Ticket Capacity</label>
          <input
            type="number"
            value={maxTicketCapacity}
            onChange={(e) => setMaxTicketCapacity(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
          {errors.maxTicketCapacity && <p className="text-red-500 text-sm">{errors.maxTicketCapacity}</p>}
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
          {errors.ticketsPerRelease && <p className="text-red-500 text-sm">{errors.ticketsPerRelease}</p>}
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
          {errors.ticketReleaseInterval && <p className="text-red-500 text-sm">{errors.ticketReleaseInterval}</p>}
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
          {errors.customerRetrievalInterval && <p className="text-red-500 text-sm">{errors.customerRetrievalInterval}</p>}
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
          {errors.vendorCount && <p className="text-red-500 text-sm">{errors.vendorCount}</p>}
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
          {errors.customerCount && <p className="text-red-500 text-sm">{errors.customerCount}</p>}
        </div>

        {/* Debugging Checkbox */}
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
