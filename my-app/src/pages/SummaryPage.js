// src/pages/SummaryPage.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SummaryPage = () => {
  const location = useLocation();
  const summary = location.state || {};
  const navigate = useNavigate();

  const handleExit = () => {
    navigate('/');
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 space-y-6">
      <h2 className="text-2xl font-semibold text-center mb-4">Simulation Summary</h2>

      {/* Display Vendor Sales */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold mb-2">Vendor Sales</h3>
        <ul className="list-disc pl-4">
          {summary?.vendorSales &&
            Object.entries(summary.vendorSales).map(([vendor, tickets]) => (
              <li key={vendor}>
                {vendor}: {tickets} tickets sold
              </li>
            ))}
        </ul>
      </div>

      {/* Display Customer Sales */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold mb-2">Customer Purchases</h3>
        <ul className="list-disc pl-4">
          {summary?.customerPurchases &&
            Object.entries(summary.customerPurchases).map(([customer, tickets]) => (
              <li key={customer}>
                {customer}: {tickets} tickets purchased
              </li>
            ))}
        </ul>
      </div>

      {/* Display Configuration Used */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold mb-2">Configuration Used</h3>
        <ul className="list-disc pl-4">
          {summary?.config &&
            Object.entries(summary.config).map(([key, value]) => (
              <li key={key}>
                {key}: {value}
              </li>
            ))}
        </ul>
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={handleExit}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
        >
          Exit
        </button>
      </div>
    </div>
  );
};

export default SummaryPage;
