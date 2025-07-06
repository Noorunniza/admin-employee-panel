const Employee = require('../models/Employee');
const Order = require('../models/Order');
const EmployeeOrderHistory = require('../models/EmployeeOrderHistory');


// ✅ Get employee profile
const getEmployeeProfile = async (req, res) => {
  const empId = req.params.empId;
  try {
    const employee = await Employee.findOne({ empId });
    if (!employee) return res.status(404).json({ error: 'Employee not found' });

    const activeOrderCount = await Order.countDocuments({
      assignedEmployee: employee._id,
      employeeStatus: { $nin: ['Completed', 'Declined'] }
    });

    if (employee.activeOrders !== activeOrderCount) {
      employee.activeOrders = activeOrderCount;
      await employee.save();
    }

    res.json({ employee });
  } catch (err) {
    console.error('❌ Error fetching profile:', err);
    res.status(500).json({ error: 'Failed to fetch employee profile' });
  }
};

// ✅ Get orders assigned to an employee
const getEmployeeOrders = async (req, res) => {
  const empId = req.params.empId;
  try {
    const employee = await Employee.findOne({ empId });
    if (!employee) return res.status(404).json({ error: 'Employee not found' });

    const orders = await Order.find({ assignedEmployee: employee._id }).populate('addressId');
    res.json({ orders });
  } catch (err) {
    console.error('❌ Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// ✅ Update item status
const updateItemStatus = async (req, res) => {
  const { orderId, itemIndex, newStatus } = req.body;
  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (!order.items[itemIndex]) return res.status(400).json({ error: 'Invalid item index' });

    order.items[itemIndex].status = newStatus;
    const updatedOrder = await order.save();
    res.json({ updatedOrder });
  } catch (err) {
    console.error('❌ Error updating item status:', err);
    res.status(500).json({ error: 'Failed to update item status' });
  }
};
const completeOrder = async (req, res) => {
  const { orderId } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const allPacked = order.items.every(item => item.status === 'Packed');
    if (!allPacked) {
      return res.status(400).json({ error: 'Not all items are packed' });
    }

    order.employeeStatus = 'Completed';
    order.orderStatus = 'Ready for Delivery';
    await order.save();

    // 🔄 Update employee activeOrders
    if (order.assignedEmployee) {
      const activeCount = await Order.countDocuments({
        assignedEmployee: order.assignedEmployee,
        employeeStatus: { $nin: ['Completed', 'Declined'] }
      });

      await Employee.findByIdAndUpdate(order.assignedEmployee, {
        activeOrders: activeCount
      });
    }

    // ✅ Log to history
    await EmployeeOrderHistory.create({
      employee: order.assignedEmployee,
      orderId: order._id,
      status: 'Completed'
    });

    res.json({ updatedOrder: order });
  } catch (err) {
    console.error('❌ Error completing order:', err);
    res.status(500).json({ error: 'Failed to complete order' });
  }
};


// ✅ Employee declines order
// ✅ Employee declines order
const declineOrder = async (req, res) => {
  const { orderId, reason } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const employeeId = order.assignedEmployee;

    // 🧽 Clear employee assignment
    order.assignedEmployee = null;
    order.employeeStatus = 'Declined';
    order.orderStatus = 'Declined by Employee';
    order.declineReason = reason || ''; // ✅ ✅ ✅ You were missing this line!
    await order.save();

    // 📦 Recalculate active orders
    const employee = await Employee.findById(employeeId);
    if (employee && employee.activeOrders > 0) {
      employee.activeOrders -= 1;
      await employee.save();
    }

    // ✅ Log to history
    await EmployeeOrderHistory.create({
      employee: employeeId,
      orderId: order._id,
      status: 'Declined',
      declineReason: reason || ''
    });

    res.json({ message: 'Order declined and logged', updatedOrder: order });
  } catch (err) {
    console.error('❌ Error declining order:', err);
    res.status(500).json({ error: 'Failed to decline order' });
  }
};


const getEmployeeOrderHistory = async (req, res) => {
  const empId = req.params.empId;

  try {
    const employee = await Employee.findOne({ empId });
    if (!employee) return res.status(404).json({ error: 'Employee not found' });

    const history = await EmployeeOrderHistory.find({ employee: employee._id })
      .populate('orderId')
      .sort({ date: -1 });

    res.json({ history });
  } catch (err) {
    console.error('❌ Error fetching history:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

module.exports = {
  getEmployeeProfile,
  getEmployeeOrders,
  updateItemStatus,
  completeOrder,
  declineOrder,
  getEmployeeOrderHistory
};
