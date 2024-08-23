const mongoose = require('mongoose');

const MetricsSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  progress: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  budget: {
    type: Number,
    required: true,
    min: 0,
  },
  deadlinesMet: {
    type: Number,
    required: true,
    min: 0,
  },
  issues: {
    type: [String],
    default: [],
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  totalEmployees: {
    type: Number,
    required: true,
    default: 0,
  },
  turnoverRate: {
    type: Number,
    required: true,
    default: 0,
  },
  employeeEngagement: {
    type: Number,
    required: true,
    default: 0,
  },
  turnoverByDepartment: {
    type: Map,
    of: Number,
    default: {},
  },
});

module.exports = mongoose.model('Metrics', MetricsSchema);
