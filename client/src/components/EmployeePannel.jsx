// src/components/EmployeePannel.jsx
import React, { useEffect, useState } from 'react';
import { useEmployeePannelViewModel } from '../viewmodels/useEmployeePannelViewModel';
import { useNavigate } from 'react-router-dom';
import '../styles/EmployeePanel.css'; // Make sure this name matches the renamed CSS

const EmployeePanel = () => {
  const navigate = useNavigate();
  const {
    employee,
    orders,
    loading,
    error,
    fetchEmployeeData,
    updateItemStatus,
    completeOrder,
    declineOrder
  } = useEmployeePannelViewModel();

  const [declineReasons, setDeclineReasons] = useState({});
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    fetchEmployeeData();
  }, [fetchEmployeeData]);

  const handleReasonChange = (orderId, reason) => {
    setDeclineReasons(prev => ({
      ...prev,
      [orderId]: reason
    }));
  };

  const activeOrders = orders.filter(
    order => order.employeeStatus !== 'Completed' && order.employeeStatus !== 'Declined'
  );

  console.log("Fetched Orders:", orders);
  console.log("Active Orders:", activeOrders);

  if (loading) return <p className="loading-msg">Loading employee dashboard...</p>;
  if (error) return <p className="error-msg">{error}</p>;

  return (
    <div className="employee-dashboard">
      <div className="employee-panel">
        <div className="top-bar">
          <h2>Employee Dashboard</h2>
          <div className="settings-wrapper">
            <button className="settings-btn" onClick={() => setShowSettings(!showSettings)}>⚙️</button>
            {showSettings && (
              <div className="settings-dropdown">
                <button onClick={() => navigate('/employee/order-history')}>🕓 View Order History</button>
                <button onClick={() => {
                  localStorage.removeItem('employeeId');
                  navigate('/');
                }}>🔓 Logout</button>
              </div>
            )}
          </div>
        </div>

        {employee && (
          <div className="employee-info">
            <p><strong>Name:</strong> {employee.name}</p>
            <p><strong>Employee ID:</strong> {employee.empId}</p>
          </div>
        )}

        <h3>Assigned Orders</h3>

        {activeOrders.length === 0 ? (
          <div className="empty-message">No active orders assigned.</div>
        ) : (
          activeOrders.map((order) => {
            const allPacked = order.items.every(item => item.status === 'Packed');
            const reason = declineReasons[order._id]?.trim() || '';

            return (
              <div key={order._id} className="employee-order-card">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Status:</strong> {order.employeeStatus || 'Pending'}</p>
                <p><strong>Total Price:</strong> ₹{order.totalPrice}</p>

                <div className="order-items">
                  <strong>Items:</strong>
                  <table className="item-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.ProductName}</td>
                          <td>{item.quantity}</td>
                          <td>
                            <select
                              value={item.status || 'Pending'}
                              onChange={(e) => updateItemStatus(order._id, idx, e.target.value)}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Packed">Packed</option>
                              <option value="Out of Stock">Out of Stock</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="order-actions">
                  {allPacked ? (
                    <button className="complete-btn" onClick={() => completeOrder(order._id)}>
                      ✅ Complete Order
                    </button>
                  ) : (
                    <div className="decline-section">
                      <textarea
                        placeholder="Enter reason for declining..."
                        value={declineReasons[order._id] || ''}
                        onChange={(e) => handleReasonChange(order._id, e.target.value)}
                        className="decline-reason-input"
                        rows={2}
                      />
                      <button
                        className="decline-btn"
                        onClick={() => {
                          if (!reason) {
                            alert('⚠️ Please enter a reason before declining the order.');
                            return;
                          }
                          if (window.confirm('Are you sure you want to decline this order?')) {
                            declineOrder(order._id, reason);
                          }
                        }}
                      >
                        ❌ Decline Order
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default EmployeePanel;
