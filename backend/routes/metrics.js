const express = require('express');
const { getCompanyMetrics, updateCompanyMetrics, getTurnoverByDepartment, createMetrics, getMetrics, updateMetrics, deleteMetrics } = require('../controllers/metricsController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route    GET /api/metrics
// @desc     Get company metrics
// @access   Private (Admin only)
router.get('/', protect, getCompanyMetrics);

// @route    PUT /api/metrics
// @desc     Update company metrics
// @access   Private (Admin only)
router.put('/', protect, updateCompanyMetrics);


// @route    GET /api/metrics/turnover-by-department
// @desc     Get turnover by department
// @access   Private (Admin only)
router.get('/turnover-by-department', protect, getTurnoverByDepartment);


router.route('/')
  .post(protect, createMetrics);

router.route('/:projectId')
  .get(protect,  getMetrics);

router.route('/:id')
  .put(protect, updateMetrics)
  .delete(protect,  deleteMetrics);


module.exports = router;
