// src/pages/ConfigDisplay.js
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const ConfigDisplay = () => {
  const location = useLocation();
  const configData = location.state || {}; // Fallback to an empty object if no data is passed
  const [isRunning, setIsRunning] = useState(false);

  const handleStart = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configData),
      });

      if (!response.ok) throw new Error('Failed to start the simulation');
      const result = await response.json();
      console.log(result.message);
      setIsRunning(true);
    } catch (error) {
      console.error("Error starting simulation:", error);
    }
  };

  const handleStop = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/stop', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to stop the simulation');
      const result = await response.json();
      console.log(result.message);
      setIsRunning(false);
    } catch (error) {
      console.error("Error stopping simulation:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 space-y-6">
      <h2 className="text-2xl font-semibold text-center mb-4">Ticketing System Configuration</h2>

      {/* Display the configuration details */}
      <div className="space-y-2 text-sm">
        <p><strong>Total Tickets:</strong> {configData.totalTickets}</p>
        <p><strong>Max Ticket Capacity:</strong> {configData.maxTicketCapacity}</p>
        <p><strong>Tickets Per Release:</strong> {configData.ticketsPerRelease}</p>
        <p><strong>Ticket Release Interval:</strong> {configData.ticketReleaseInterval} ms</p>
        <p><strong>Customer Retrieval Interval:</strong> {configData.customerRetrievalInterval} ms</p>
        <p><strong>Number of Vendors:</strong> {configData.vendorCount}</p>
        <p><strong>Number of Customers:</strong> {configData.customerCount}</p>
        <p><strong>Debugging:</strong> {configData.debug ? 'Enabled' : 'Disabled'}</p>
      </div>

      {/* Control buttons */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={handleStart}
          disabled={isRunning}
          className={`w-24 p-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition ${
            isRunning ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Start
        </button>
        <button
          onClick={handleStop}
          disabled={!isRunning}
          className={`w-24 p-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition ${
            !isRunning ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Stop
        </button>
      </div>
    </div>
  );
};

export default ConfigDisplay;
