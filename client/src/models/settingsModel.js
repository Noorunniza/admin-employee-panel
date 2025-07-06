// src/models/settingsModel.js
import axios from 'axios';

const API_BASE = 'http://localhost:5000/admin';

export const getStoreData = async () => {
  const response = await axios.get(`${API_BASE}/get-store`);
  return response.data;
};

export const updateStoreData = async (id, data) => {
  const response = await axios.put(`${API_BASE}/update-store/${id}`, data);
  return response.data;
};
// Upload logo function
export const uploadLogo = async (id, file) => {
  const formData = new FormData();
  formData.append('logo', file);

  const res = await fetch(`http://localhost:5000/api/settings/upload-logo/${id}`, {
    method: 'POST',
    body: formData
  });

  if (!res.ok) throw new Error('Upload failed');
  return res.json();
};

