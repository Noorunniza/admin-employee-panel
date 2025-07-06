import axios from 'axios';

const BASE = 'http://localhost:5000/api/deliveryagents'; // Make sure backend route matches

export const fetchAgents = () => axios.get(BASE);
export const addAgent = (data) => axios.post(BASE, data);
export const updateAgent = (id, data) => axios.put(`${BASE}/${id}`, data);
export const deleteAgent = (id) => axios.delete(`${BASE}/${id}`);
