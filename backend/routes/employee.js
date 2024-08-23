const express = require('express');
const {
  addEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  bulkUpdateEmployees,
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route    POST /api/employees
// @desc     Add a new employee
// @access   Private (Admin only)
router.post('/', protect, addEmployee);

// @route    GET /api/employees
// @desc     Get all employees or search by name
// @access   Private
router.get('/', protect, getEmployees);

// @route    GET /api/employees/:id
// @desc     Get employee by ID
// @access   Private
router.get('/:id', protect, getEmployeeById);

// @route    PUT /api/employees/:id
// @desc     Update employee
// @access   Private (Admin only)
router.put('/:id', protect, updateEmployee);

// @route    DELETE /api/employees/:id
// @desc     Delete employee
// @access   Private (Admin only)
router.delete('/:id', protect, deleteEmployee);

// @route    PUT /api/employees/bulk
// @desc     Perform bulk actions on employees
// @access   Private (Admin only)
router.put('/bulk', protect, bulkUpdateEmployees);

module.exports = router;
