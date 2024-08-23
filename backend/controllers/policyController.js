const CompanyPolicy = require('../models/CompanyPolicy');

// @desc    Get all company policies
// @route   GET /api/policies
// @access  Private (Admin only)
exports.getAllPolicies = async (req, res) => {
  try {
    const policies = await CompanyPolicy.find().sort({ createdAt: -1 });
    res.status(200).json(policies);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Create a new company policy
// @route   POST /api/policies
// @access  Private (Admin only)
exports.createPolicy = async (req, res) => {
  try {
    const { policyName, description, value } = req.body;

    const newPolicy = new CompanyPolicy({ policyName, description, value });

    await newPolicy.save();

    res.status(201).json({ message: 'Policy created successfully', newPolicy });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Update an existing company policy
// @route   PUT /api/policies/:id
// @access  Private (Admin only)
exports.updatePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const { policyName, description, value } = req.body;

    const updatedPolicy = await CompanyPolicy.findByIdAndUpdate(id, { policyName, description, value }, { new: true });

    if (!updatedPolicy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    res.status(200).json({ message: 'Policy updated successfully', updatedPolicy });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Delete a company policy
// @route   DELETE /api/policies/:id
// @access  Private (Admin only)
exports.deletePolicy = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPolicy = await CompanyPolicy.findByIdAndDelete(id);

    if (!deletedPolicy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    res.status(200).json({ message: 'Policy deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
