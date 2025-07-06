import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginViewModel } from '../viewmodels/useLoginViewModel';
import '../styles/Login.css';

const Login = () => {
  const navigate = useNavigate();

  const {
    loginType,
    formData,
    loading,
    error,
    success,
    handleInputChange,
    handleLoginTypeChange,
    handleSubmit
  } = useLoginViewModel();

  // ✅ Redirect to AdminDashboard after successful admin login
  useEffect(() => {
    if (success && loginType === 'admin') {
      navigate('/admin-dashboard');
    }
  }, [success, loginType, navigate]);

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Welcome</h1>
          <p className="login-subtitle">Please sign in to your account</p>
        </div>

        <div className="login-type-selection">
          <h3 className="login-type-title">Select Login Type</h3>
          <div className="checkbox-container">
            <div
              className={`checkbox-item ${loginType === 'admin' ? 'active' : ''}`}
              onClick={() => handleLoginTypeChange('admin')}
            >
              <input
                type="radio"
                id="admin"
                name="loginType"
                value="admin"
                checked={loginType === 'admin'}
                onChange={() => handleLoginTypeChange('admin')}
              />
              <label htmlFor="admin" className="checkbox-label">Admin</label>
            </div>

            <div
              className={`checkbox-item ${loginType === 'employee' ? 'active' : ''}`}
              onClick={() => handleLoginTypeChange('employee')}
            >
              <input
                type="radio"
                id="employee"
                name="loginType"
                value="employee"
                checked={loginType === 'employee'}
                onChange={() => handleLoginTypeChange('employee')}
              />
              <label htmlFor="employee" className="checkbox-label">Employee</label>
            </div>
          </div>
        </div>

        {/* Display Messages */}
        {error && <div className="message error-message">{error}</div>}
        {success && <div className="message success-message">{success}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          {loginType === 'admin' ? (
            <div className="form-group">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter admin username"
                className="form-input"
                required
              />
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="empId" className="form-label">Employee ID</label>
              <input
                type="text"
                id="empId"
                name="empId"
                value={formData.empId}
                onChange={handleInputChange}
                placeholder="Enter employee ID"
                className="form-input"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter password"
              className="form-input"
              required
            />
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
                Signing In...
              </div>
            ) : (
              `Sign In as ${loginType === 'admin' ? 'Admin' : 'Employee'}`
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
