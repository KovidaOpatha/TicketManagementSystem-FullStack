// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ConfigForm from './pages/ConfigForm';
import ConfigDisplay from './pages/ConfigDisplays';
import SummaryPage from './pages/SummaryPage';

const App = () => {
  // Ensure handleConfigSubmit is defined properly
  const handleConfigSubmit = (configData) => {
    console.log('Config Submitted:', configData);
  };

  return (
    <Router>
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-t from-orange-700 via-orange-500 to-orange-300">
        <Routes>
          <Route path="/" element={<ConfigForm onSubmit={handleConfigSubmit} />} />
          <Route path="/display" element={<ConfigDisplay />} />
          <Route path="/summary" element={<SummaryPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
