// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import React Router components
import ConfigForm from './pages/ConfigForm'; // Configuration form component
import ConfigDisplay from './pages/ConfigDisplays'; // Simulation display component
import SummaryPage from './pages/SummaryPage'; // Summary page component

const App = () => {
  // Function to handle form submission (currently logs the submitted data)
  const handleConfigSubmit = (configData) => {
    console.log('Config Submitted:', configData); // Log submitted configuration for debugging
  };

  return (
    <Router> {/* Set up React Router for navigation */}
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-t from-orange-700 via-orange-500 to-orange-300">
        <Routes> {/* Define application routes */}
          {/* Route to the ConfigForm component (default route) */}
          <Route path="/" element={<ConfigForm onSubmit={handleConfigSubmit} />} />
          
          {/* Route to the ConfigDisplay component */}
          <Route path="/display" element={<ConfigDisplay />} />
          
          {/* Route to the SummaryPage component */}
          <Route path="/summary" element={<SummaryPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App; // Export the App component as the default export
