const mongoose = require('mongoose'); // Add this line to import mongoose
const Employee = require('../models/Employee');

// @desc    Add a new employee
// @route   POST /api/employees
// @access  Private (Admin only)
exports.addEmployee = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, position, department, startDate, salary } = req.body;

  try {
    const employee = new Employee({
      firstName,
      lastName,
      email,
      phoneNumber,
      position,
      department,
      startDate,
      salary,
    });

    await employee.save();

    res.status(201).json({ message: 'Employee added successfully', employee });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Get all employees or search by name
// @route   GET /api/employees
// @access  Private
exports.getEmployees = async (req, res) => {
  const { search } = req.query;

  try {
    let employees;

    if (search) {
      const regex = new RegExp(search, 'i');
      employees = await Employee.find({
        $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
      });
    } else {
      employees = await Employee.find();
    }

    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Get employee by ID
// @route   GET /api/employees/:id
// @access  Private
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private (Admin only)
exports.updateEmployee = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, position, department, startDate, salary } = req.body;

  try {
    let employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    employee.firstName = firstName || employee.firstName;
    employee.lastName = lastName || employee.lastName;
    employee.email = email || employee.email;
    employee.phoneNumber = phoneNumber || employee.phoneNumber;
    employee.position = position || employee.position;
    employee.department = department || employee.department;
    employee.startDate = startDate || employee.startDate;
    employee.salary = salary || employee.salary;

    await employee.save();

    res.status(200).json({ message: 'Employee updated successfully', employee });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private (Admin only)
exports.deleteEmployee = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid employee ID' });
    }

    const result = await Employee.deleteOne({ _id: req.params.id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee removed' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


// @desc    Perform bulk actions on employees
// @route   PUT /api/employees/bulk
// @access  Private (Admin only)
exports.bulkUpdateEmployees = async (req, res) => {
  const { employeeIds, updateFields } = req.body;

  try {
    const employees = await Employee.updateMany(
      { _id: { $in: employeeIds } },
      { $set: updateFields },
      { multi: true }
    );

    res.status(200).json({ message: 'Bulk update successful', employees });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
