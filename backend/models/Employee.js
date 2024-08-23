const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
  },
  position: {
    type: String,
  },
  department: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  salary: {
    type: Number,
  }, 
  performanceMetrics: {
    type: Map,
    of: Number,
    default: {},
  },
});

module.exports = mongoose.model('Employee', EmployeeSchema);
