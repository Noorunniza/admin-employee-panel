import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import useEmployeeViewModel from '../viewmodels/useEmployeeViewModel';
import '../styles/EmployeeManager.css';

const EmployeeList = () => {
  const { employees, remove } = useEmployeeViewModel();
  const navigate = useNavigate();

  const [previewUrl, setPreviewUrl] = useState(null);

  const handleEdit = (emp) => {
    navigate('/employee-manager', { state: { editEmployee: emp } });
  };

  const handleImageClick = (imagePath) => {
    setPreviewUrl(`http://localhost:5000/uploads/${imagePath}`);
  };

  const closePreview = () => {
    setPreviewUrl(null);
  };

  return (
    <>
      {/* 🏠 Home Button */}
      <div className="top-nav">
        <button className="icon-btn" onClick={() => navigate('/admin-dashboard')}>
          <FaHome />
        </button>
      </div>

      <div className="emp-wrapper">
        <h2>👥 All Employees</h2>

        {employees.length === 0 ? (
          <p>No employees found.</p>
        ) : (
          employees.map(emp => (
            <div className="emp-card" key={emp._id}>
              <p><b>ID:</b> {emp.empId}</p>
              <p><b>Name:</b> {emp.name}</p>
              <p><b>Phone:</b> {emp.phoneNumber}</p>
              <p><b>Address:</b> {emp.address}</p>
              {emp.idProof && (
                <img
                  src={`http://localhost:5000/uploads/${emp.idProof}`}
                  alt="ID Proof"
                  className="proof-image"
                  onClick={() => handleImageClick(emp.idProof)}
                  style={{ cursor: 'pointer' }}
                />
              )}

              <div className="actions">
                <button onClick={() => handleEdit(emp)}>✏️ Edit</button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this employee?')) {
                      remove(emp._id);
                    }
                  }}
                >🗑️ Delete</button>
              </div>
            </div>
          ))
        )}

        {/* Image Preview Modal */}
        {previewUrl && (
          <div className="modal-backdrop" onClick={closePreview}>
            <div className="modal-image-container">
              <img src={previewUrl} alt="Preview" />
              <button onClick={closePreview} className="close-btn">✖</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EmployeeList;
