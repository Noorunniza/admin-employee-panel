import { useState, useCallback } from 'react';
import axios from 'axios';

export const useEmployeePannelViewModel = () => {
  const [employee, setEmployee] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ✅ Fetch employee profile and assigned orders
  const fetchEmployeeData = useCallback(async () => {
    try {
      const empId = localStorage.getItem('employeeId');
      if (!empId) {
        setError('No employee ID found. Please log in again.');
        setLoading(false);
        return;
      }

      const [profileRes, ordersRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/employee/profile/${empId}`),
        axios.get(`http://localhost:5000/api/employee/orders/${empId}`)
      ]);

      setEmployee(profileRes.data.employee);
      setOrders(ordersRes.data.orders || []);
    } catch (err) {
      console.error('❌ Error fetching data:', err.response?.data || err.message);
      setError('Failed to load employee data');
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Update item status
  const updateItemStatus = async (orderId, itemIndex, newStatus) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/employee/update-item-status`, {
        orderId,
        itemIndex,
        newStatus
      });

      const updatedOrder = res.data.updatedOrder;
      setOrders(prev =>
        prev.map(order => (order._id === updatedOrder._id ? updatedOrder : order))
      );
    } catch (err) {
      console.error('❌ Error updating item status:', err.response?.data || err.message);
    }
  };

  // ✅ Complete order
  const completeOrder = async (orderId) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/employee/complete-order`, { orderId });
      const updatedOrder = res.data.updatedOrder;

      setOrders(prev =>
        prev.map(order => (order._id === updatedOrder._id ? updatedOrder : order))
      );

      await fetchEmployeeData(); // Refresh activeOrders count
    } catch (err) {
      console.error('❌ Error completing order:', err.response?.data || err.message);
    }
  };

  // ✅ Decline order with reason
  const declineOrder = async (orderId, reason = '') => {
    try {
      const res = await axios.post('http://localhost:5000/api/employee/decline-order', {
        orderId,
        reason
      });

      const updatedOrder = res.data.order || res.data.updatedOrder;
      console.log('⚠️ Order declined:', updatedOrder);

      setOrders(prev =>
        prev.map(order => (order._id === updatedOrder._id ? updatedOrder : order))
      );

      await fetchEmployeeData(); // ✅ refresh view
    } catch (err) {
      console.error('❌ Error declining order:', err.response?.data || err.message);
    }
  };

  return {
    employee,
    orders,
    loading,
    error,
    fetchEmployeeData,
    updateItemStatus,
    completeOrder,
    declineOrder
  };
};
