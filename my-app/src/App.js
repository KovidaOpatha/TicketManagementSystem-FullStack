// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ConfigForm from './pages/ConfigForm';
import ConfigDisplay from './pages/ConfigDisplays';

const App = () => {
    const handleConfigSubmit = (configData) => {
        console.log('Form Submitted:', configData);
    };

    return (
        <Router>
            <div className="min-h-screen flex justify-center items-center bg-gradient-to-t from-orange-700 via-orange-500 to-orange-300">
                <Routes>
                    <Route
                        path="/"
                        element={<ConfigForm onSubmit={handleConfigSubmit} />}
                    />
                    <Route
                        path="/display"
                        element={<ConfigDisplay />}
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
