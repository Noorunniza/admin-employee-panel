import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAdminOrderViewModel from '../viewmodels/useAdminOrderViewModel';
import '../styles/OrderManager.css';

const OrderManager = () => {
  const {
    orders,
    availableEmployees,
    availableAgents,
    loading,
    error,
    assignEmployee,
    assignAgent,
  } = useAdminOrderViewModel();

  const navigate = useNavigate();
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const toggleCustomerInfo = (orderId) => {
    setExpandedOrderId((prevId) => (prevId === orderId ? null : orderId));
  };

  const activeOrders = orders
    .filter((order) => order.agentStatus?.toLowerCase() !== 'delivered successful')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // sort by latest

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="order-manager">
      <button className="back-button" onClick={() => navigate('/admin-dashboard')}>
        ← Back to Dashboard
      </button>

      <h2 className="page-title">Admin: Orders</h2>

      {activeOrders.length === 0 ? (
        <div className="no-orders">No active orders found.</div>
      ) : (
        <div className="orders-grid">
          {activeOrders.map((order) => (
            <div key={order._id} className="order-card">

              {/* Order Header */}
              <div className="order-header">
                <div className="order-id"><strong>ID:</strong> {order._id}</div>
                <div className="order-date"><strong>Created:</strong> {new Date(order.createdAt).toLocaleString()}</div>
              </div>

              {/* Toggle Address */}
              <div className="customer-info-toggle" onClick={() => toggleCustomerInfo(order._id)}>
                📍 Customer Information {expandedOrderId === order._id ? '▲' : '▼'}
              </div>

              {expandedOrderId === order._id && order.addressId && (
                <div className="customer-info">
                  <div><strong>Name:</strong> {order.addressId.full_name}</div>
                  <div><strong>Phone:</strong> {order.addressId.phone_no}</div>
                  <div>
                    <strong>Address:</strong><br />
                    {order.addressId.house_building_name},<br />
                    {order.addressId.street_area},<br />
                    {order.addressId.locality && `${order.addressId.locality},`}<br />
                    {order.addressId.city} - {order.addressId.pincode},<br />
                    {order.addressId.state}
                  </div>
                </div>
              )}

              {/* Assignment Panel */}
              <div className="card-split">
                {/* Employee */}
                <div className="split-box left">
                  <h4>👨‍💼 Employee Assignment</h4>
                  <div><strong>Assigned:</strong> {order.assignedEmployee ? `${order.assignedEmployee.empId} - ${order.assignedEmployee.name}` : 'None'}</div>
                  <div><strong>Status:</strong> <span className={`status-badge employee-${order.employeeStatus?.toLowerCase()}`}>{order.employeeStatus || '-'}</span></div>
                  {order.employeeStatus === 'Declined' && (
                    <div><strong>Reason:</strong> {order.declineReason || 'Not specified'}</div>
                  )}
                  {!order.assignedEmployee && (
                    <div className="assign-section">
                      <label>
                        <select
                          className="assign-select"
                          onChange={(e) => assignEmployee(order._id, e.target.value)}
                          defaultValue=""
                        >
                          <option value="" disabled>Select Employee</option>
                          {availableEmployees.map((emp) => (
                            <option key={emp._id} value={emp._id}>
                              {emp.empId} - {emp.name} ({emp.activeOrders || 0} active)
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  )}
                </div>

                {/* Agent */}
                <div className="split-box right">
                  <h4>🚚 Delivery Agent Assignment</h4>
                  <div><strong>Assigned:</strong> {order.assignedAgent ? `${order.assignedAgent.agentId} - ${order.assignedAgent.name}` : 'None'}</div>
                  <div><strong>Status:</strong> <span className={`status-badge agent-${order.agentStatus?.toLowerCase()}`}>{order.agentStatus || '-'}</span></div>
                  {order.employeeStatus === 'Completed' &&
                    (!order.assignedAgent || order.agentStatus === 'Declined') && (
                      <div className="assign-section">
                        <label>
                          <select
                            className="assign-select"
                            onChange={(e) => assignAgent(order._id, e.target.value)}
                            defaultValue=""
                          >
                            <option value="" disabled>Select Agent</option>
                            {availableAgents.map((agent) => (
                              <option key={agent._id} value={agent._id}>
                                {agent.agentId} - {agent.name} ({agent.activeDeliveries || 0} deliveries)
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="items-section">
                <h4>🛒 Order Items</h4>
                {order.items.map((item, idx) => (
                  <div key={idx} className="item-card">
                    <div><strong>{item.ProductName}</strong></div>
                    <div>Qty: {item.quantity} | ₹{item.Price}</div>
                    <div className={`status-badge item-${item.status?.toLowerCase()}`}>{item.status}</div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderManager;
