import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ConfigDisplay = () => {
  const location = useLocation(); // React Router hook to access the location state
  const configData = location.state || {}; // Retrieve configuration data passed from the previous page
  const [isRunning, setIsRunning] = useState(false); // State to track if the simulation is running
  const [summary, setSummary] = useState(null); // State to store the simulation summary
  const [logs, setLogs] = useState([]); // State to store logs fetched from the backend
  const [remainingTickets, setRemainingTickets] = useState(configData.totalTickets); // Real-time ticket count
  const [systemStatus, setSystemStatus] = useState("Stopped"); // State to track the system status (e.g., "Active" or "Stopped")
  const logsEndRef = useRef(null); // Ref to ensure the logs section scrolls to the latest log
  const navigate = useNavigate(); // React Router hook to navigate between pages

  // Automatically scroll to the bottom of the logs section when new logs are added
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Fetch logs and ticket pool status from the backend at regular intervals when the simulation is running
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        fetch('http://localhost:3001/api/status') // API endpoint to fetch status
          .then((response) => {
            if (!response.ok) throw new Error('Failed to fetch status');
            return response.json();
          })
          .then((data) => {
            setLogs((prevLogs) => (data.logs ? [...prevLogs, ...data.logs] : prevLogs)); // Update logs
            setRemainingTickets(data.ticketPool.length); // Update remaining tickets
          })
          .catch((error) => console.error('Error fetching status:', error));
      }, 2000); // Fetch every 2 seconds
    }
    return () => clearInterval(interval); // Cleanup interval when the component unmounts or simulation stops
  }, [isRunning]);

  // Function to handle the start simulation action
  const handleStart = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configData), // Pass configuration data to the backend
      });
      if (!response.ok) throw new Error('Failed to start');
      setIsRunning(true); // Mark the simulation as running
      setSystemStatus("Active"); // Update system status
      toast.info("Simulation started!"); // Display a notification
    } catch (error) {
      console.error('Error starting simulation:', error);
    }
  };

  // Function to handle the stop simulation action
  const handleStop = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/stop', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to stop');
      const result = await response.json();
      setSummary(result.summary); // Store the summary data
      setIsRunning(false); // Mark the simulation as stopped
      setSystemStatus("Stopped"); // Update system status
      toast.warn("Simulation stopped."); // Display a notification
    } catch (error) {
      console.error('Error stopping simulation:', error);
    }
  };

  // Function to navigate to the summary page with the simulation summary
  const handleViewSummary = () => {
    if (summary) {
      navigate('/summary', { state: summary }); // Pass summary data as state to the summary page
    } else {
      alert('No summary available. Please stop the simulation first.'); // Alert if no summary is available
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <ToastContainer /> {/* Notification container for alerts */}
      {/* Layout Container */}
      <div className="w-[1200px] bg-gray-800 shadow-lg p-8 rounded-lg">
        {/* Title Section */}
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-gray-800">Ticketing System Configuration</h2>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Section: Configuration Details and Controls */}
          <div className="bg-gray-900 shadow p-6 rounded-md border border-gray-300">
            <h3 className="text-xl text-white font-semibold mb-4">Configuration Details</h3>
            <div className="text-white space-y-2 text-sm">
              {/* Display configuration details */}
              <p><strong>Total Tickets:</strong> {configData.totalTickets}</p>
              <p><strong>Max Ticket Capacity:</strong> {configData.maxTicketCapacity}</p>
              <p><strong>Tickets Per Release:</strong> {configData.ticketsPerRelease}</p>
              <p><strong>Ticket Release Interval:</strong> {configData.ticketReleaseInterval} ms</p>
              <p><strong>Customer Retrieval Interval:</strong> {configData.customerRetrievalInterval} ms</p>
              <p><strong>Number of Vendors:</strong> {configData.vendorCount}</p>
              <p><strong>Number of Customers:</strong> {configData.customerCount}</p>
            </div>

            {/* Display real-time remaining ticket count */}
            <div className="mt-4">
              <h3 className="text-lg text-green-400 font-bold">Remaining Tickets: {remainingTickets}</h3>
            </div>

            {/* Display system status */}
            <div className="mt-4">
              <h3 className="text-lg text-yellow-400 font-bold">System Status: {systemStatus}</h3>
            </div>

            {/* Start, Stop, and View Summary Buttons */}
            <div className="mt-6 flex justify-between gap-4">
              <button
                onClick={handleStart}
                disabled={isRunning} // Disable if already running
                className={`w-24 p-2 bg-green-500 text-white rounded hover:bg-green-600 transition ${
                  isRunning ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Start
              </button>
              <button
                onClick={handleStop}
                disabled={!isRunning} // Disable if not running
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
              {/* Display logs dynamically */}
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
                  <div ref={logsEndRef} />
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
