import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ConfigDisplay = () => {
  const location = useLocation();
  const configData = location.state || {};
  const [isRunning, setIsRunning] = useState(false);
  const [summary, setSummary] = useState(null); // Store summary data
  const [logs, setLogs] = useState([]); // Logs from the backend
  const [systemStatus, setSystemStatus] = useState("Stopped"); // New system status
  const navigate = useNavigate();

  // Fetch logs periodically
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        fetch('http://localhost:3001/api/status')
          .then((response) => {
            if (!response.ok) throw new Error('Failed to fetch status');
            return response.json();
          })
          .then((data) => {
            setLogs((prevLogs) => (data.logs ? [...prevLogs, ...data.logs] : prevLogs));

            // Check if all tickets are sold out
            if (data.ticketPool.length === 0 && systemStatus === "Active") {
              setSystemStatus("Completed");
              toast.success("All tickets have been sold out!");
            }
          })
          .catch((error) => console.error('Error fetching status:', error));
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isRunning, systemStatus]);

  const handleStart = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configData),
      });
      if (!response.ok) throw new Error('Failed to start');
      setIsRunning(true);
      setSystemStatus("Active");
      toast.info("Simulation started!");
    } catch (error) {
      console.error('Error starting simulation:', error);
    }
  };

  const handleStop = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/stop', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to stop');
      const result = await response.json();
      setSummary(result.summary); // Store the summary locally
      setIsRunning(false);
      setSystemStatus("Stopped");
      toast.warn("Simulation stopped.");
    } catch (error) {
      console.error('Error stopping simulation:', error);
    }
  };

  const handleViewSummary = () => {
    if (summary) {
      navigate('/summary', { state: summary }); // Navigate to summary page with state
    } else {
      alert('No summary available. Please stop the simulation first.');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <ToastContainer />
      {/* Fixed Layout Container */}
      <div className="w-[1200px] bg-gray-800 shadow-lg p-8 rounded-lg">
        {/* Title Section */}
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-gray-800">Ticketing System Configuration</h2>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Section: Configuration + Buttons */}
          <div className="bg-gray-900 shadow p-6 rounded-md border border-gray-300">
            <h3 className="text-xl text-white font-semibold mb-4">Configuration Details</h3>
            <div className="text-white space-y-2 text-sm">
              <p><strong>Total Tickets:</strong> {configData.totalTickets}</p>
              <p><strong>Max Ticket Capacity:</strong> {configData.maxTicketCapacity}</p>
              <p><strong>Tickets Per Release:</strong> {configData.ticketsPerRelease}</p>
              <p><strong>Ticket Release Interval:</strong> {configData.ticketReleaseInterval} ms</p>
              <p><strong>Customer Retrieval Interval:</strong> {configData.customerRetrievalInterval} ms</p>
              <p><strong>Number of Vendors:</strong> {configData.vendorCount}</p>
              <p><strong>Number of Customers:</strong> {configData.customerCount}</p>
              <p><strong>Debugging:</strong> {configData.debug ? 'Enabled' : 'Disabled'}</p>
            </div>

            {/* System Status */}
            <div className="mt-4">
              <h3 className="text-lg text-yellow-400 font-bold">System Status: {systemStatus}</h3>
            </div>

            {/* Start/Stop/View Summary Buttons */}
            <div className="mt-6 flex justify-between gap-4">
              <button
                onClick={handleStart}
                disabled={isRunning}
                className={`w-24 p-2 bg-green-500 text-white rounded hover:bg-green-600 transition ${
                  isRunning ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Start
              </button>
              <button
                onClick={handleStop}
                disabled={!isRunning}
                className={`w-24 p-2 bg-red-500 text-white rounded hover:bg-red-600 transition ${
                  !isRunning ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Stop
              </button>
              <button
                onClick={handleViewSummary}
                className="w-32 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                View Summary
              </button>
            </div>
          </div>

          {/* Right Section: Logs */}
          <div className="bg-gray-800 shadow p-6 rounded-md">
            <h3 className="text-white text-xl font-semibold mb-4">Logs Live Stream</h3>
            <div className="h-[500px] overflow-y-auto border border-gray-300 p-4 bg-gray-900 rounded-md">
              {logs.length > 0 ? (
                <ul className="space-y-2">
                  {logs.slice(-100).map((log, index) => (
                    <li
                      key={index}
                      className={`p-2 rounded ${
                        index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'
                      }`}
                      style={{ fontFamily: 'monospace', lineHeight: '1.5' }}
                    >
                      {log}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-white">No logs available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigDisplay;
