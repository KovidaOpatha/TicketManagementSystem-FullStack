import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ConfigForm = () => {
  // State variables for each configuration input
  const [maxTicketCapacity, setMaxTicketCapacity] = useState('');
  const [ticketsPerRelease, setTicketsPerRelease] = useState('');
  const [ticketReleaseInterval, setTicketReleaseInterval] = useState(''); // Ticket release interval in seconds
  const [customerRetrievalInterval, setCustomerRetrievalInterval] = useState(''); // Customer retrieval interval in seconds
  const [vendorCount, setVendorCount] = useState('');
  const [customerCount, setCustomerCount] = useState('');
  const [totalTickets, setTotalTickets] = useState('');
  const navigate = useNavigate(); // React Router hook to navigate between pages

  // Load the last saved configuration from the backend
  const loadLastConfiguration = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/configuration/last'); // Fetch API to get the last configuration
      if (!response.ok) throw new Error('Failed to fetch last configuration');
      const config = await response.json();

      // Populate state variables with fetched configuration, converting intervals from milliseconds to seconds
      setTotalTickets(config.totalTickets);
      setMaxTicketCapacity(config.maxTicketCapacity);
      setTicketsPerRelease(config.ticketsPerRelease);
      setTicketReleaseInterval(config.ticketReleaseInterval / 1000); // Convert milliseconds to seconds
      setCustomerRetrievalInterval(config.customerRetrievalInterval / 1000); // Convert milliseconds to seconds
      setVendorCount(config.vendorCount);
      setCustomerCount(config.customerCount);
    } catch (error) {
      console.error('Error loading last configuration:', error); // Log any errors
    }
  };

  // Handle form submission to save the configuration and navigate to the display page
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Prepare the configuration data, converting intervals back to milliseconds
    const configData = {
      totalTickets: parseInt(totalTickets),
      maxTicketCapacity: parseInt(maxTicketCapacity),
      ticketsPerRelease: parseInt(ticketsPerRelease),
      ticketReleaseInterval: parseInt(ticketReleaseInterval) * 1000, // Convert seconds to milliseconds
      customerRetrievalInterval: parseInt(customerRetrievalInterval) * 1000, // Convert seconds to milliseconds
      vendorCount: parseInt(vendorCount),
      customerCount: parseInt(customerCount),
    };

    try {
      const response = await fetch('http://localhost:3001/api/configuration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configData), // Send configuration data to the backend
      });
      if (!response.ok) throw new Error('Failed to save configuration');
      console.log('Configuration saved'); // Log success message
    } catch (error) {
      console.error('Error saving configuration:', error); // Log any errors
    }

    navigate('/display', { state: configData }); // Navigate to the ConfigDisplay page with configuration data
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-gray-800 shadow-lg rounded-lg space-y-6">
      <h2 className="text-white text-2xl font-semibold text-center">Ticketing System Configuration</h2>
      <div className="space-y-4">
        {/* Input for Total Tickets */}
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

        {/* Input for Maximum Ticket Capacity */}
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

        {/* Input for Tickets Per Release */}
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

        {/* Input for Ticket Release Interval */}
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

        {/* Input for Customer Retrieval Interval */}
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

        {/* Input for Number of Vendors */}
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

        {/* Input for Number of Customers */}
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

      {/* Buttons for loading last configuration and submitting the form */}
      <div className="flex justify-between gap-4">
        <button
          type="button"
          onClick={loadLastConfiguration} // Load the last saved configuration
          className="flex-1 bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition"
        >
          Load Last Configuration
        </button>
        <button
          type="submit" // Submit the form to save the configuration
          className="flex-1 bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition"
        >
          Submit Configuration
        </button>
      </div>
    </form>
  );
};

export default ConfigForm;
