import React from 'react'; // Import React library
import ReactDOM from 'react-dom/client'; // Import React DOM for rendering components
import './index.css'; // Import global CSS styles
import App from './App'; // Import the main App component
import reportWebVitals from './reportWebVitals'; // Import for measuring app performance (optional)

const root = ReactDOM.createRoot(document.getElementById('root')); // Create a root DOM node for React rendering
root.render(
  <React.StrictMode> {/* StrictMode is a tool for highlighting potential problems in the app */}
    <App /> {/* Render the App component, which serves as the root of the application */}
  </React.StrictMode>
);

// Call reportWebVitals for performance measurement (optional)
// This can be used to monitor and log app performance metrics
reportWebVitals();
