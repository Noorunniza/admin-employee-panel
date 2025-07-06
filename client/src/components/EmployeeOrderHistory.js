import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/EmployeeOrderHistory.css'; 

const EmployeeOrderHistory = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('none');

  useEffect(() => {
    const fetchHistory = async () => {
      const empId = localStorage.getItem('employeeId');
      if (!empId) {
        alert('No employee ID found!');
        navigate('/');
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/api/employee/history/${empId}`);
        setHistory(res.data.history || []);
      } catch (err) {
        console.error('❌ Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  useEffect(() => {
    let filtered = [...history];

    // Filter by status
    if (statusFilter === 'Completed') {
      filtered = filtered.filter(entry => entry.status === 'Completed');
    } else if (statusFilter === 'Declined') {
      filtered = filtered.filter(entry => entry.status === 'Declined');
    }

    // Sort by number of products
    if (sortOrder === 'asc') {
      filtered.sort((a, b) => (a.orderId?.items?.length || 0) - (b.orderId?.items?.length || 0));
    } else if (sortOrder === 'desc') {
      filtered.sort((a, b) => (b.orderId?.items?.length || 0) - (a.orderId?.items?.length || 0));
    }

    setFilteredHistory(filtered);
  }, [history, statusFilter, sortOrder]);

  const toggleDetails = (orderId) => {
    setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
  };

  return (
    <div className="employee-panel">
      <div className="top-bar">
        <h2>Order History</h2>
      </div>

      <div className="filters">
        <label>
          Status:&nbsp;
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Completed">Completed</option>
            <option value="Declined">Declined</option>
          </select>
        </label>

        <label>
          Sort by Item Count:&nbsp;
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="none">None</option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>

      {loading ? (
        <p>Loading history...</p>
      ) : filteredHistory.length === 0 ? (
        <p>No history found.</p>
      ) : (
        filteredHistory.map((entry) => (
          <div key={entry._id} className="employee-order-card">
            <p><strong>Order ID:</strong> {entry.orderId?._id || 'N/A'}</p>
            <p><strong>Status:</strong> {entry.status}</p>
            {entry.status === 'Declined' && (
              <p><strong>Reason:</strong> {entry.declineReason || 'Not provided'}</p>
            )}
            <p><strong>Date:</strong> {new Date(entry.date).toLocaleString()}</p>
            <p><strong>Items Count:</strong> {entry.orderId?.items?.length || 0}</p>

            <button
              className="view-details-btn"
              onClick={() => toggleDetails(entry.orderId?._id)}
            >
              {expandedOrderId === entry.orderId?._id ? 'Hide Details' : 'View Details'}
            </button>

            {expandedOrderId === entry.orderId?._id && entry.orderId && (
              <div className="order-details">
                <p><strong>Items:</strong></p>
                <ul>
                  {entry.orderId.items?.map((item, index) => (
                    <li key={index}>
                      {item.ProductName} - ₹{item.Price}
                    </li>
                  ))}
                </ul>
                <p><strong>Total Price:</strong> ₹{entry.orderId.totalPrice || 0}</p>
                <p><strong>Grand Total:</strong> ₹{entry.orderId.grandTotal || 0}</p>
                <p><strong>Payment Status:</strong> {entry.orderId.paymentStatus}</p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default EmployeeOrderHistory;