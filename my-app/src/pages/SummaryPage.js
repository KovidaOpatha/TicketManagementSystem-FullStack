// src/pages/SummaryPage.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SummaryPage = () => {
  const location = useLocation(); // React Router hook to get location state
  const summary = location.state || {}; // Retrieve summary data passed through navigation
  const navigate = useNavigate(); // React Router hook to navigate between pages

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-white">
      <div className="w-11/12 max-w-7xl p-8 bg-gray-800 rounded-lg shadow-lg space-y-8">
        {/* Page Title */}
        <h2 className="text-4xl font-bold text-center mb-4">Simulation Summary</h2>

        {/* Grid Layout to Display Summary Sections */}
        <div className="grid grid-cols-4 gap-6">
          {/* Vendor Sales Section */}
          <div className="p-4 bg-gray-900 rounded-lg shadow-md h-auto">
            <h3 className="text-2xl font-semibold mb-4 text-center">Vendor Sales</h3>
            <ul className="list-disc pl-4 space-y-2 text-sm">
              {/* Map through vendorSales to display each vendor's sales */}
              {Object.entries(summary.vendorSales || {}).map(([vendor, sales]) => (
                <li key={vendor}>
                  <strong>{vendor}:</strong> {sales} tickets sold
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Purchases Section */}
          <div className="p-4 bg-gray-900 rounded-lg shadow-md h-auto">
            <h3 className="text-2xl font-semibold mb-4 text-center">Customer Purchases</h3>
            <ul className="list-disc pl-4 space-y-2 text-sm">
              {/* Map through customerPurchases to display each customer's purchases */}
              {Object.entries(summary.customerPurchases || {}).map(([customer, purchases]) => (
                <li key={customer}>
                  <strong>{customer}:</strong> {purchases} tickets purchased
                </li>
              ))}
            </ul>
          </div>

          {/* Overall Statistics Section */}
          <div className="p-4 bg-gray-900 rounded-lg shadow-md h-auto">
            <h3 className="text-2xl font-semibold mb-4 text-center">Overall Stats</h3>
            <ul className="list-disc pl-4 space-y-2 text-sm">
              {/* Display total tickets sold and total customer tickets */}
              <li><strong>Total Tickets Sold:</strong> {summary.totalTicketsSold}</li>
              <li><strong>Total Customer Tickets:</strong> {summary.totalCustomerTickets}</li>
            </ul>
          </div>

          {/* Configuration Details Section */}
          <div className="p-4 bg-gray-900 rounded-lg shadow-md h-auto">
            <h3 className="text-2xl font-semibold mb-4 text-center">Configuration</h3>
            <ul className="list-disc pl-4 space-y-2 text-sm">
              {/* Map through the configuration object to display key-value pairs */}
              {Object.entries(summary.config || {}).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong> {value}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Back to Configuration Button */}
        <div className="flex justify-center mt-4">
          <button
            className="px-8 py-3 bg-green-600 text-white text-lg font-semibold rounded-md hover:bg-green-700 transition"
            onClick={() => navigate('/')} // Navigate back to the ConfigForm page
          >
            Back to Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;
