// src/components/DeliveryAgentList.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import useDeliveryAgentViewModel from '../viewmodels/useDeliveryAgentViewModel';
import '../styles/DeliveryAgent.css';

const DeliveryAgentList = () => {
  const { agents, remove } = useDeliveryAgentViewModel();
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleEdit = (agent) => {
    navigate('/delivery-agent-manager', { state: { editAgent: agent } });
  };

  return (
    <>
      {/* Home Button */}
      <div className="top-nav">
        <button className="icon-btn" onClick={() => navigate('/admin-dashboard')}>
          <FaHome />
        </button>
      </div>

      <div className="agent-wrapper">
        <h2>📋 Delivery Agents</h2>

        {agents.length === 0 ? (
          <p>No agents found.</p>
        ) : (
          agents.map(agent => (
            <div className="agent-card" key={agent._id}>
              <p>🆔 Agent ID: <strong>{agent.agentId || 'Generating...'}</strong></p>
              <p><strong>{agent.name}</strong> ({agent.vehicleType})</p>
              <p>📍 {agent.address}</p>
              <p>📞 {agent.phoneNumber}</p>
              <p>🔢 License #: {agent.licenseNumber}</p>
              <p>✅ Available: {agent.availability === null ? 'Unknown' : agent.availability ? 'Yes' : 'No'}</p>

              {agent.license && (
                <img
                  className="proof-image"
                  src={`http://localhost:5000/uploads/${agent.license}`}
                  alt="License"
                  onClick={() => setPreviewUrl(`http://localhost:5000/uploads/${agent.license}`)}
                />
              )}

              <div className="actions">
                <button onClick={() => handleEdit(agent)}>✏️ Edit</button>
                <button className="delete-btn" onClick={() => remove(agent._id)}>🗑️ Delete</button>
              </div>
            </div>
          ))
        )}

        {previewUrl && (
          <div className="modal-backdrop" onClick={() => setPreviewUrl(null)}>
            <div className="modal-image-container">
              <img src={previewUrl} alt="Preview" />
              <button className="close-btn" onClick={() => setPreviewUrl(null)}>✖</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DeliveryAgentList;
