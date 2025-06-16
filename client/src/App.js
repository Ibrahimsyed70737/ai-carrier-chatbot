// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Removed Navigate for this test
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ChatPage from './pages/ChatPage';
import { AuthProvider } from './AuthContext'; // Only AuthProvider needed for this test

// Removed PrivateRoute component temporarily

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          {/* Temporarily make ChatPage directly accessible */}
          <Route path="/chat" element={<ChatPage />} />
          {/* Set a default route to login for easy access */}
          <Route path="/" element={<LoginPage />} />
          {/* Catch-all for any other path, redirect to login for this test */}
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
