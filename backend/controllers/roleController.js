const Role = require('../models/Role');

// @desc    Get all roles and their permissions
// @route   GET /api/roles
// @access  Private (Admin only)
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Create a new role with permissions
// @route   POST /api/roles
// @access  Private (Admin only)
exports.createRole = async (req, res) => {
  try {
    const { roleName, permissions } = req.body;

    const newRole = new Role({ roleName, permissions });

    await newRole.save();

    res.status(201).json({ message: 'Role created successfully', newRole });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Update an existing role's permissions
// @route   PUT /api/roles/:id
// @access  Private (Admin only)
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { roleName, permissions } = req.body;

    const updatedRole = await Role.findByIdAndUpdate(id, { roleName, permissions }, { new: true });

    if (!updatedRole) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.status(200).json({ message: 'Role updated successfully', updatedRole });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Delete a role
// @route   DELETE /api/roles/:id
// @access  Private (Admin only)
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRole = await Role.findByIdAndDelete(id);

    if (!deletedRole) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.status(200).json({ message: 'Role deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
