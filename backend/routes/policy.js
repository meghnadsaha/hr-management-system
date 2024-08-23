const express = require('express');
const { getAllPolicies, createPolicy, updatePolicy, deletePolicy } = require('../controllers/policyController');
const { protect } = require('../middleware/authMiddleware');
const logAction = require('../middleware/actionLogger');

const router = express.Router();

router.get('/', protect, getAllPolicies);
router.post('/', protect, logAction('Create Policy'), createPolicy);
router.put('/:id', protect, logAction('Update Policy'), updatePolicy);
router.delete('/:id', protect, logAction('Delete Policy'), deletePolicy);

module.exports = router;
