// src/components/DeliveryAgentManager.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import useDeliveryAgentViewModel from '../viewmodels/useDeliveryAgentViewModel';
import '../styles/DeliveryAgent.css';

const DeliveryAgentManager = () => {
  const {
    form,
    error,
    editingId,
    handleChange,
    save,
    resetForm,
  } = useDeliveryAgentViewModel();

  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  // Show form if editing on mount
  useEffect(() => {
    if (editingId) {
      setShowForm(true);
    }
  }, [editingId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    save(() => {
      navigate('/delivery-agents');
      setShowForm(false);
    });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    resetForm();
    setShowForm(false);
  };

  const handleAddAgentClick = () => {
    resetForm();
    setShowForm(true);
  };

  return (
    <>
      {/* Top-left Home icon */}
      <div className="top-nav">
        <button className="icon-btn" onClick={() => navigate('/admin-dashboard')}>
          <FaHome />
        </button>
      </div>

      <div className="agent-wrapper">
        <h2>🚚 Delivery Agent Manager</h2>

        {/* Add Button */}
        {!showForm && !editingId && (
          <button className="toggle-agent-btn" onClick={handleAddAgentClick}>
            ➕ Add Delivery Agent
          </button>
        )}

        {/* Edit/Add Banner with Cancel */}
        {showForm && (
          <div className="edit-banner">
            {editingId ? (
              <>
                ✏️ <strong>Editing: {form.name || 'Unnamed'}</strong>
              </>
            ) : (
              <>
                ➕ <strong>Adding New Delivery Agent</strong>
              </>
            )}
            <button className="cancel-btn" onClick={handleCancel}>❌ Cancel</button>
          </div>
        )}

        {/* Error Display */}
        {error && <p className="error-message">{error}</p>}

        {/* Form */}
        {showForm && (
          <form className="agent-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name || ''}
              onChange={handleChange}
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={form.address || ''}
              onChange={handleChange}
            />
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={form.phoneNumber || ''}
              onChange={handleChange}
            />
            <input
              type="text"
              name="licenseNumber"
              placeholder="License Number"
              value={form.licenseNumber || ''}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password || ''}
              onChange={handleChange}
            />
            <select
              name="vehicleType"
              value={form.vehicleType || ''}
              onChange={handleChange}
            >
              <option value="">Select Vehicle Type</option>
              <option value="Bike">Bike</option>
              <option value="Scooter">Scooter</option>
              <option value="Car">Car</option>
            </select>
            <input
              type="file"
              name="license"
              onChange={handleChange}
            />

            <button type="submit">
              {editingId ? 'Update Agent' : 'Add Agent'}
            </button>
          </form>
        )}

        {/* View Agents Button */}
        <button className="toggle-agent-btn" onClick={() => navigate('/delivery-agents')}>
          👁️ View Agents
        </button>
      </div>
    </>
  );
};

export default DeliveryAgentManager;
