// src/pages/ConfigDisplays.js
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const ConfigDisplay = () => {
  const location = useLocation();
  const configData = location.state;
  const [isRunning, setIsRunning] = useState(false);

  const handleStart = async () => {
    const configPayload = {
      maxTicketCapacity: parseInt(configData?.maxTicketCapacity, 10),
      ticketsPerRelease: parseInt(configData?.ticketsPerRelease, 10),
      ticketReleaseInterval: parseInt(configData?.ticketReleaseInterval, 10),
      customerRetrievalInterval: parseInt(configData?.customerRetrievalInterval, 10),
      vendorCount: parseInt(configData?.vendorCount, 10),
      customerCount: parseInt(configData?.customerCount, 10),
      totalTickets: 50,
      debug: true,
    };

    try {
      const response = await fetch('http://localhost:3001/api/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configPayload),
      });

      if (!response.ok) throw new Error('Bad Request');
      const result = await response.json();
      console.log(result.message);
      setIsRunning(true);
    } catch (error) {
      console.error("Failed to start simulation:", error);
    }
  };

  const handleStop = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/stop', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to stop');
      const result = await response.json();
      console.log(result.message);
      setIsRunning(false);
    } catch (error) {
      console.error('Error stopping simulation:', error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-lg rounded-lg mt-10 space-y-6">
      <h2 className="text-2xl font-semibold text-center mb-4">Ticket Simulation</h2>
      <div>
        <button
          onClick={handleStart}
          disabled={isRunning}
          className={`w-1/2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded`}
        >
          Start Simulation
        </button>
        <button
          onClick={handleStop}
          disabled={!isRunning}
          className={`w-1/2 bg-red-500 hover:bg-red-600 text-white p-2 rounded`}
        >
          Stop Simulation
        </button>
      </div>
    </div>
  );
};

export default ConfigDisplay;
