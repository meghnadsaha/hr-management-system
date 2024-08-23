const mongoose = require('mongoose');

const CompanyPolicySchema = new mongoose.Schema({
  policyName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('CompanyPolicy', CompanyPolicySchema);
