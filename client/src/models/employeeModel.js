import axios from 'axios';

const BASE = 'http://localhost:5000/api/employees';

export const fetchEmployees = () => axios.get(BASE);
export const addEmployee = (data) => axios.post(BASE, data);
export const updateEmployee = (id, data) => axios.put(`${BASE}/${id}`, data);
export const deleteEmployee = (id) => axios.delete(`${BASE}/${id}`);
