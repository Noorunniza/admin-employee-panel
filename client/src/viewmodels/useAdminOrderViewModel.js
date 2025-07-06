import { useEffect, useState } from 'react';
import {
  fetchOrders,
  fetchAvailableEmployees,
  fetchAvailableAgents,
  assignEmployee,
  assignDeliveryAgent,
} from '../models/orderService';

const useAdminOrderViewModel = () => {
  const [orders, setOrders] = useState([]);
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [availableAgents, setAvailableAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 🔄 Fetch all admin data (orders, employees, agents)
  const loadData = async () => {
    try {
      const [ordersRes, employeesRes, agentsRes] = await Promise.all([
        fetchOrders(),
        fetchAvailableEmployees(),
        fetchAvailableAgents(),
      ]);
      setOrders(ordersRes.data);
      setAvailableEmployees(employeesRes.data);
      setAvailableAgents(agentsRes.data);
      setError('');
    } catch (err) {
      console.error('❌ Error loading admin order data:', err);
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Assign employee
  const assignEmployeeToOrder = async (orderId, empId) => {
    try {
      await assignEmployee(orderId, empId);
      await loadData();
    } catch (err) {
      console.error('❌ Failed to assign employee:', err);
      setError('Failed to assign employee');
    }
  };

  // ✅ Assign delivery agent
  const assignAgentToOrder = async (orderId, agentId) => {
    try {
      await assignDeliveryAgent(orderId, agentId);
      await loadData();
    } catch (err) {
      console.error('❌ Failed to assign delivery agent:', err);
      setError('Failed to assign delivery agent');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    orders,
    availableEmployees,
    availableAgents,
    loading,
    error,
    assignEmployee: assignEmployeeToOrder,
    assignAgent: assignAgentToOrder,
  };
};

export default useAdminOrderViewModel;
