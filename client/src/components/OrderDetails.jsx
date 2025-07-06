import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/OrderDetails.css';
import {
  FaUser, FaPhoneAlt, FaMapMarkerAlt, FaMoneyCheckAlt,
  FaUserTie, FaMotorcycle, FaImage, FaClock, FaHashtag
} from 'react-icons/fa';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/admin/orders/${id}`)
      .then(res => setOrder(res.data))
      .catch(err => console.error('Error fetching order:', err));
  }, [id]);

  if (!order) return <p className="loading-text">Loading...</p>;

  return (
    <div className="order-details">

      {/* Heading row with back button */}
      <div className="order-header">
        <h2><FaHashtag /> Order Overview</h2>
        <button className="back-button" onClick={() => navigate('/order')}>
          ← Back to All Orders
        </button>
      </div>

      <div className="info-card highlight">
        <p><FaHashtag /> <strong>Order ID:</strong> {order._id}</p>
        <p><FaClock /> <strong>Created:</strong> {new Date(order.createdAt).toLocaleString()}</p>
      </div>

      <div className="info-card status-card">
        <h3><FaMoneyCheckAlt /> Payment Information</h3>
        <p><strong>Payment Status:</strong></p>
        <span className={`status-tag ${order.paymentStatus === 'Paid' ? 'paid' : 'unpaid'}`}>
          {order.paymentStatus}
        </span>
      </div>

      <div className="info-card">
        <h3><FaUser /> Customer Info</h3>
        <p><strong>Name:</strong> {order.user?.name}</p>
        <p><FaPhoneAlt /> <strong>Phone:</strong> {order.user?.phone_no}</p>
      </div>

      <div className="info-card">
        <h3><FaMapMarkerAlt /> Delivery Address</h3>
        <p>{order.addressId?.house_building_name}, {order.addressId?.street_area},</p>
        <p>{order.addressId?.city} - {order.addressId?.pincode}</p>
      </div>

      <div className="info-card">
        <h3><FaUserTie /> Assigned Employee</h3>
        <p><strong>ID:</strong> {order.assignedEmployee?.empId || 'N/A'}</p>
        <p><strong>Name:</strong> {order.assignedEmployee?.name || 'N/A'}</p>
        <span className={`status-tag ${order.employeeStatus === 'Delivered' ? 'delivered' : 'pending'}`}>
          {order.employeeStatus || 'N/A'}
        </span>
      </div>

      <div className="info-card">
        <h3><FaMotorcycle /> Delivery Agent</h3>
        <p><strong>ID:</strong> {order.assignedAgent?.agentId || 'N/A'}</p>
        <p><strong>Name:</strong> {order.assignedAgent?.name || 'N/A'}</p>
        <span className={`status-tag ${order.agentStatus === 'Delivered Successful' ? 'delivered' : 'in-progress'}`}>
          {order.agentStatus || 'N/A'}
        </span>
      </div>

      <div className="info-card">
        <h3><FaImage /> Delivery Proof</h3>
        {order.deliveryProofImage ? (
          <img
            src={`http://localhost:5000/uploads/${encodeURIComponent(order.deliveryProofImage)}`}
            alt="Delivery Proof"
            className="proof-image"
          />
        ) : (
          <p className="no-proof">No proof uploaded</p>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
