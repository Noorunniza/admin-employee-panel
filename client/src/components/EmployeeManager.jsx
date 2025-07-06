// src/components/EmployeeManager.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import useEmployeeViewModel from '../viewmodels/useEmployeeViewModel';
import '../styles/EmployeeManager.css';

const EmployeeManager = () => {
  const { form, setForm, handleChange, save } = useEmployeeViewModel();
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.editEmployee) {
      const emp = location.state.editEmployee;
      setForm({
        _id: emp._id,
        empId: emp.empId,
        name: emp.name,
        address: emp.address,
        phoneNumber: emp.phoneNumber,
        password: '',
        idProof: null,
      });
      setShowForm(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state, setForm]);

  const validateForm = () => {
    const isEditMode = !!form._id;

    if (!isEditMode) {
      if (!form.name || !form.address || !form.phoneNumber || !form.password || !form.idProof) {
        setError('⚠️ All fields are required, including PNG proof');
        return false;
      }
    }

    if (form.phoneNumber && !/^\d{10}$/.test(form.phoneNumber)) {
      setError('⚠️ Phone number must be exactly 10 digits');
      return false;
    }

    if (form.idProof?.type && form.idProof.type !== 'image/png') {
      setError('⚠️ Only PNG format is allowed for ID proof');
      return false;
    }

    if (form.password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(form.password)) {
      setError('⚠️ Password must be 8+ characters with uppercase, lowercase, number, and symbol');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      save(() => {
        setShowForm(false);
        setForm({});
      });
    }
  };

  const handleCancelEdit = () => {
    setForm({
      name: '',
      address: '',
      phoneNumber: '',
      password: '',
      idProof: null,
      _id: null,
    });
    setShowForm(false);
  };

  return (
    <>
      {/* Home Button */}
      <div className="top-nav">
        <button className="icon-btn" onClick={() => navigate('/admin-dashboard')}>
          <FaHome />
        </button>
      </div>

      <div className="emp-wrapper">
        <h2>👷 Employee Management</h2>

        {!form._id && !showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            ➕ Add Employee
          </button>
        )}

        {showForm && (
          <>
            <div className="edit-banner">
              📝 <strong>{form._id ? `Editing: ${form.name || 'Unnamed'}` : 'Adding New Employee'}</strong>
              <button className="btn btn-cancel" onClick={handleCancelEdit}>❌ Cancel</button>
            </div>

            <form className="emp-form" onSubmit={handleSubmit}>
              {error && <p>{error}</p>}
              <input type="text" name="name" value={form.name || ''} onChange={handleChange} placeholder="Name" />
              <input type="text" name="address" value={form.address || ''} onChange={handleChange} placeholder="Address" />
              <input type="text" name="phoneNumber" value={form.phoneNumber || ''} onChange={handleChange} placeholder="Phone Number" maxLength={10} />
              <input type="password" name="password" value={form.password || ''} onChange={handleChange} placeholder="Password" />
              <input type="file" name="idProof" onChange={handleChange} accept="image/png" />
              <button type="submit" className="btn btn-primary">
                💾 {form._id ? 'Update' : 'Add'} Employee
              </button>
            </form>
          </>
        )}

        <button className="btn btn-primary" onClick={() => navigate('/employees')}>👁️ View Employees</button>
      </div>
    </>
  );
};

export default EmployeeManager;
