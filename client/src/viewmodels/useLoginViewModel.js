import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../models/authService';

export const useLoginViewModel = () => {
  const [loginType, setLoginType] = useState('employee');
  const [formData, setFormData] = useState({
    username: '',
    empId: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleLoginTypeChange = (type) => {
    setLoginType(type);
    setFormData({
      username: '',
      empId: '',
      password: ''
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let response;

      if (loginType === 'admin') {
        if (!formData.username || !formData.password) {
          throw new Error('Please fill in all fields');
        }
        response = await authService.adminLogin(formData.username, formData.password);
        if (response.success) {
          authService.setToken(response.token);
          setSuccess(`${response.message}! Welcome ${response.user.username}!`);
          navigate('/admin-dashboard'); // ✅ Redirect admin
        }
      } else {
        if (!formData.empId || !formData.password) {
          throw new Error('Please fill in all fields');
        }
        response = await authService.employeeLogin(formData.empId, formData.password);
        if (response.success) {
          authService.setToken(response.token);
          localStorage.setItem('employeeId', response.user.empId);
          setSuccess(`${response.message}! Welcome ${response.user.name}!`);
          navigate('/employee-panel'); // ✅ Redirect employee
        }
      }

      setFormData({
        username: '',
        empId: '',
        password: ''
      });

    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      empId: '',
      password: ''
    });
    setError('');
    setSuccess('');
  };

  return {
    loginType,
    formData,
    loading,
    error,
    success,
    handleInputChange,
    handleLoginTypeChange,
    handleSubmit,
    resetForm
  };
};
