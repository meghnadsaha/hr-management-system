const express = require('express');
const { getAllRoles, createRole, updateRole, deleteRole } = require('../controllers/roleController');
const { protect } = require('../middleware/authMiddleware');
const logAction = require('../middleware/actionLogger');

const router = express.Router();

router.get('/', protect, getAllRoles);
router.post('/', protect, logAction('Create Role'), createRole);
router.put('/:id', protect, logAction('Update Role'), updateRole);
router.delete('/:id', protect, logAction('Delete Role'), deleteRole);

module.exports = router;
