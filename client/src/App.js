// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Login and Employee components
import Login from './components/Login';
import EmployeePanel from './components/EmployeePannel';
import EmployeeOrderHistory from './components/EmployeeOrderHistory';

// Admin components
import AdminDashboard from './components/AdminDashboard';
import ViewComplaints from './components/ViewComplaints';
import ComplaintDetail from './components/ComplaintDetail'; // ✅ Correct importimport DeliveryAgentManager from './components/DeliveryAgentManager';
import EmployeeManager from './components/EmployeeManager';
import EmployeeList from './components/EmployeeList';
import OrderManager from './components/OrderManager';
import Settings from './components/Settings';
import DeliveryAgentList from './components/DeliveryAgentList';
import AllOrders from './components/AllOrders';
import OrderDetails from './components/OrderDetails';
import DeliveryAgentManager from './components/DeliveryAgentManager';

const App = () => {
  const employeeId = localStorage.getItem('employeeId');
  const adminToken = localStorage.getItem('token'); // ✅ Use this to check admin login

  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<Login />} />

        {/* Admin Protected Routes */}
        <Route
          path="/admin-dashboard"
          element={adminToken ? <AdminDashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/view-complaints"
          element={adminToken ? <ViewComplaints /> : <Navigate to="/" />}
          
        />
         <Route path="/view-complaints/:id" element={adminToken ? <ComplaintDetail /> : <Navigate to="/" />} /> {/* ✅ Fixed */}
        <Route
          path="/delivery-agent-manager"
          element={adminToken ? <DeliveryAgentManager /> : <Navigate to="/" />}
          
        />
         <Route path="/delivery-agents" element={<DeliveryAgentList />} />
        <Route
          path="/employee-manager"
          element={adminToken ? <EmployeeManager /> : <Navigate to="/" />}
        />
        <Route
          path="/employees"
          element={adminToken ? <EmployeeList /> : <Navigate to="/" />}
        />
        <Route
          path="/order-manager"
          element={adminToken ? <OrderManager /> : <Navigate to="/" />}
        />
        <Route
          path="/settings"
          element={adminToken ? <Settings /> : <Navigate to="/" />}
        />

        {/* Employee Protected Routes */}
        <Route
          path="/employee-panel"
          element={employeeId ? <EmployeePanel /> : <Navigate to="/" />}
        />
        <Route
          path="/employee/order-history"
          element={employeeId ? <EmployeeOrderHistory /> : <Navigate to="/" />}
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/order" element={adminToken ? <AllOrders /> : <Navigate to="/" />} />
        <Route path="/order/:id" element={adminToken ? <OrderDetails /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
