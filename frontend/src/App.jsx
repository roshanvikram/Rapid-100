import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import CommandCenterPage from './pages/CommandCenterPage';
import LiveConsole from './pages/LiveConsole';
import DispatcherPage from './pages/DispatcherPage';

// Wrapper for AnimatePresence to work with Routes
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<CommandCenterPage />} />
        <Route path="/live" element={<LiveConsole />} />
        <Route path="/dispatcher" element={<DispatcherPage />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
