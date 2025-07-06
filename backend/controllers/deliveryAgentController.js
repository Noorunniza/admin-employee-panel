const DeliveryAgent = require('../models/DeliveryAgent');
const bcrypt = require('bcrypt');

// 👉 Get all agents
exports.getAll = async (req, res) => {
  try {
    const agents = await DeliveryAgent.find();
    res.json(agents);
  } catch (err) {
    console.error('❌ Failed to fetch agents:', err);
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
};

// 👉 Add new agent with agentId & agentNumber
exports.add = async (req, res) => {
  try {
    const { name, address, phoneNumber, password, vehicleType, licenseNumber } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const license = req.file?.filename;

    let agent = new DeliveryAgent({
      name,
      address,
      phoneNumber,
      licenseNumber,
      password: hashedPassword,
      vehicleType,
      license,
      availability: null,
    });

    // Save once to trigger agentNumber
    agent = await agent.save();

    // Generate and save agentId if not already set
    if (!agent.agentId && agent.agentNumber) {
      agent.agentId = 'AGENT' + agent.agentNumber.toString().padStart(3, '0'); // AGENT001 format
      await agent.save(); // Save again with agentId
    }

    res.status(201).json(agent);
  } catch (err) {
    console.error('❌ Failed to add agent:', err);
    res.status(500).json({ error: 'Failed to add agent' });
  }
};

// 👉 Update existing agent
exports.update = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    if (req.file) {
      updateData.license = req.file.filename;
    }

    const updated = await DeliveryAgent.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    console.error('❌ Failed to update agent:', err);
    res.status(500).json({ error: 'Failed to update agent' });
  }
};

// 👉 Delete agent
exports.remove = async (req, res) => {
  try {
    await DeliveryAgent.findByIdAndDelete(req.params.id);
    res.json({ message: '✅ Agent deleted' });
  } catch (err) {
    console.error('❌ Failed to delete agent:', err);
    res.status(500).json({ error: 'Failed to delete agent' });
  }
};
