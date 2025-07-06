// frontend/src/models/orderService.js
import axios from 'axios';

const BASE = 'http://localhost:5000/api/admin/orders';

// ✅ Fetch all orders
export const fetchOrders = () => axios.get(BASE);

// ✅ Fetch available employees
export const fetchAvailableEmployees = () =>
  axios.get(`${BASE}/available-employees`);

// ✅ Assign employee to order
export const assignEmployee = (orderId, employeeId) =>
  axios.put(`${BASE}/assign-employee`, { orderId, employeeId });

// ✅ Fetch available delivery agents
export const fetchAvailableAgents = () =>
  axios.get(`${BASE}/available-agents`);

// ✅ Assign delivery agent to order
export const assignDeliveryAgent = (orderId, agentId) =>
  axios.put(`${BASE}/assign-agent`, { orderId, agentId });
