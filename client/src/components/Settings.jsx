import React, { useState } from 'react';
import { FaHome, FaStore, FaMapMarkerAlt, FaClock, FaGlobe, FaEdit, FaSave } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/Settings.css';
import useStoreViewModel from '../viewmodels/useSettingsViewModel';

const Settings = () => {
  const {
    storeData,
    formData,
    loading,
    handleChange,
    saveChanges,
    uploadStoreLogo
  } = useStoreViewModel();

  const navigate = useNavigate();
  const [editingField, setEditingField] = useState(null);
  const [editingLogo, setEditingLogo] = useState(false);

  const fields = [
    ['storeName', 'Store Name', <FaStore />],
    ['address', 'Address', <FaMapMarkerAlt />],
    ['workingHours', 'Working Hours', <FaClock />],
    ['latitude', 'Latitude', <FaGlobe />],
    ['longitude', 'Longitude', <FaGlobe />],
    ['deliveryRadius', 'Delivery Radius (km)', <FaGlobe />]
  ];

  if (loading || !storeData) {
    return (
      <div className="settings-page-wrapper">
        <div className="settings-loading">Loading store details...</div>
      </div>
    );
  }

  return (
    <div className="settings-full-page">
      
      {/* 🏠 Home Button at Page Top */}
     <div className="top-home-icon">
  <button className="icon-btn" onClick={() => navigate('/admin-dashboard')}>
    <FaHome />
  </button>
</div>


      <div className="settings-page-wrapper">
        <div className="settings-card">
          <h2>🛒 Supermarket Settings</h2>

          {/* 🖼️ Logo Upload */}
          <div className="form-group logo-upload">
            <label>🖼️ Logo</label>
            {storeData.logoUrl && (
              <div className="logo-preview">
                <img
                  src={`http://localhost:5000${storeData.logoUrl}`}
                  alt="Store Logo"
                  width="120"
                />
              </div>
            )}
            {editingLogo ? (
              <input
                type="file"
                accept="image/*"
                onChange={e => {
                  const file = e.target.files[0];
                  if (file) {
                    uploadStoreLogo(file);
                    setEditingLogo(false);
                  }
                }}
              />
            ) : (
              <button
                className="btn edit inline"
                onClick={() => setEditingLogo(true)}
              >
                <FaEdit /> Edit
              </button>
            )}
          </div>

          {/* Editable Fields */}
          {fields.map(([field, label, icon]) => (
            <div key={field} className="form-group">
              <label htmlFor={field}>{icon} {label}</label>
              {editingField === field ? (
                <>
                  <input
                    type="text"
                    id={field}
                    name={field}
                    value={formData[field] || ''}
                    onChange={handleChange}
                  />
                  <button
                    className="btn save inline"
                    onClick={async () => {
                      await saveChanges(field);
                      setEditingField(null);
                    }}
                  >
                    <FaSave /> Save
                  </button>
                </>
              ) : (
               <div className="static-value">
  <span>{storeData[field]}</span>
  <button className="btn edit inline" onClick={() => setEditingField(field)}>
    <FaEdit /> Edit
  </button>
</div>

              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;
