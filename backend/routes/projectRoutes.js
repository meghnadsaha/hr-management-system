const express = require("express");
const {
  createProject,
  updateProjectMetrics,
  getProjectById,
  getProjects,
  deleteProject,
  filterProjects,
  getIndividualPerformance,
  rateEmployee,
} = require("../controllers/projectController");
const { protect, authorize } = require('../middleware/authMiddleware');


const router = express.Router();



router.route("/").post(createProject).get(getProjects);

router
  .route("/:id")
  .get(getProjectById)
  .put(updateProjectMetrics)
  .delete(deleteProject); // Manager only

// Route for filtering projects
router.route("/").get(filterProjects); // Manager only




// Ensure only managers or admins can rate employees
router.post('/performance/rating', protect, authorize('manager', 'admin'), rateEmployee);
router.route('/performance/:employeeId').get( getIndividualPerformance);


module.exports = router;
