import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaTachometerAlt, FaBoxOpen, FaUserTie, FaTruck,
  FaExclamationCircle, FaListAlt, FaCog
} from 'react-icons/fa';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [quoteIndex, setQuoteIndex] = useState(0);

  const quotes = [
    "Welcome back, Admin! 🌟",
    "Wishing you a productive day ahead! 💼",
    "Thank you for leading with excellence! 🙌",
    "Your leadership makes a difference. 🚀",
    "Stay safe and inspired always! 🛡️"
  ];

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Rotate quotes every 5 seconds
  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(quoteTimer);
  }, [quotes.length]); // ✅ fix warning

  const formatTime = (date) =>
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const formatDate = (date) =>
    date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="admin-dashboard">
      <div className="topbar">
        <h2>Admin Panel</h2>
        <div className="datetime">
          <span className="date">{formatDate(currentTime)}</span>
          <span className="time">{formatTime(currentTime)}</span>
        </div>
      </div>

      <div className="dashboard-body">
        <div className="sidebar">
          <Link to="/admin-dashboard" className="sidebar-item"><FaTachometerAlt /> Dashboard</Link>
          <Link to="/order-manager" className="sidebar-item"><FaBoxOpen /> Incoming Request</Link>
          <Link to="/employee-manager" className="sidebar-item"><FaUserTie /> Manage Employee</Link>
          <Link to="/delivery-agent-manager" className="sidebar-item"><FaTruck /> Manage Delivery Agent</Link>
          <Link to="/view-complaints" className="sidebar-item"><FaExclamationCircle /> View Complaints</Link>
          <Link to="/order" className="sidebar-item"><FaListAlt /> All Orders</Link>

          <Link to="/settings" className="sidebar-item"><FaCog /> Settings</Link>
        </div>

        <div className="main-content">
          <div className="quote-container">
            <p className="welcome-quote">{quotes[quoteIndex]}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
