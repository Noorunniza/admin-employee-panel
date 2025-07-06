import { useState, useEffect } from 'react';
import * as api from '../models/employeeModel';

const useEmployeeViewModel = () => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);

  // Load employees initially
  const load = async () => {
    const res = await api.fetchEmployees();
    setEmployees(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  // Save or update employee
  const save = async () => {
    const formData = new FormData();

    // Append all fields
    for (let key in form) {
      if (form[key] !== null && form[key] !== undefined) {
        formData.append(key, form[key]);
      }
    }

    try {
      if (form._id || editingId) {
        const id = form._id || editingId; // ensure _id is used if available
        await api.updateEmployee(id, formData);
      } else {
        await api.addEmployee(formData);
      }

      await load();
      setForm({});
      setEditingId(null);
    } catch (err) {
      console.error('❌ Failed to save/update employee', err);
    }
  };

  // Set form for editing
  const edit = (emp) => {
    setForm({
      _id: emp._id,
      empId: emp.empId,
      name: emp.name,
      address: emp.address,
      phoneNumber: emp.phoneNumber,
      password: '',
      idProof: null,
    });
    setEditingId(emp._id);
  };

  // Delete employee
  const remove = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
  if (!confirmDelete) return;

  await api.deleteEmployee(id);
  load();
};

  return {
    employees,
    form,
    setForm,
    editingId,
    setEditingId, // helpful if needed from outside
    handleChange,
    save,
    edit,
    remove
  };
};

export default useEmployeeViewModel;
