// src/viewmodels/useDeliveryAgentViewModel.js
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000/api/delivery-agents';

const useDeliveryAgentViewModel = () => {
  const [agents, setAgents] = useState([]);
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const location = useLocation();
  const navigate = useNavigate(); // ✅ for clearing state after prefill

  // Load agent list
  const load = async () => {
    try {
      const res = await axios.get(API);
      setAgents(res.data);
    } catch (err) {
      console.error('❌ Failed to load agents:', err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Preload form for editing
  useEffect(() => {
    const editAgent = location.state?.editAgent;
    if (editAgent) {
      setForm({
        _id: editAgent._id,
        name: editAgent.name,
        address: editAgent.address,
        phoneNumber: editAgent.phoneNumber,
        licenseNumber: editAgent.licenseNumber,
        vehicleType: editAgent.vehicleType,
        password: '',
        license: null,
      });
      setEditingId(editAgent._id);

      // ✅ Clear route state to avoid reuse on back
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const validate = () => {
    const { name, address, phoneNumber, licenseNumber, password, vehicleType, license } = form;

    if (!name || name.length < 3) return 'Name must be at least 3 characters';
    if (!address || address.length < 5) return 'Address must be at least 5 characters';
    if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) return 'Phone must be 10 digits';
    if (!licenseNumber || licenseNumber.length < 5) return 'License number must be at least 5 characters';
    if (!vehicleType) return 'Please select a vehicle type';
    if (!editingId && (!password || password.length < 6)) return 'Password must be at least 6 characters';
    if (!editingId && !license) return 'License file is required';

    return '';
  };

  const save = async (onAddSuccess) => {
    const errorMsg = validate();
    if (errorMsg) return setError(`⚠️ ${errorMsg}`);

    const formData = new FormData();
    for (let key in form) {
      if (editingId && key === 'password' && !form[key]) continue;
      if (form[key] !== undefined && form[key] !== null) {
        formData.append(key, form[key]);
      }
    }

    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, formData);
        alert('✅ Agent updated successfully');
        await load(); // just reload agents
      } else {
        await axios.post(API, formData);
        alert('✅ Agent added successfully');
        if (onAddSuccess) onAddSuccess(); // navigate only on add
      }
      resetForm();
    } catch (err) {
      console.error('❌ Failed to save:', err);
      setError('❌ Failed to save agent');
    }
  };

  const remove = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      await load();
    } catch (err) {
      console.error('❌ Failed to delete:', err);
    }
  };

  const resetForm = () => {
    setForm({});
    setEditingId(null);
    setError('');
  };

  return {
    agents,
    form,
    error,
    editingId,
    handleChange,
    save,
    remove,
    resetForm,
  };
};

export default useDeliveryAgentViewModel;
