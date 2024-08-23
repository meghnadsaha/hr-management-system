const Metrics = require('../models/Metrics');
const Employee = require('../models/Employee');
const Project = require('../models/Project');

// @desc    Get company metrics
// @route   GET /api/metrics
// @access  Private (Admin only)
exports.getCompanyMetrics = async (req, res) => {
  try {
    const metrics = await Metrics.findOne();

    if (!metrics) {
      return res.status(404).json({ message: 'Metrics not found' });
    }

    res.status(200).json(metrics);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Update company metrics (triggered periodically or on employee changes)
// @route   PUT /api/metrics
// @access  Private (Admin only)
exports.updateCompanyMetrics = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();

    const turnoverByDepartment = await Employee.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } }
    ]);

    // Placeholder for calculating actual turnover rate and engagement
    const turnoverRate = 5; // Example value, replace with actual calculation
    const employeeEngagement = 75; // Example value, replace with actual calculation

    const turnoverMap = {};
    turnoverByDepartment.forEach(department => {
      turnoverMap[department._id] = department.count;
    });

    let metrics = await Metrics.findOne();

    if (!metrics) {
      metrics = new Metrics();
    }

    metrics.totalEmployees = totalEmployees;
    metrics.turnoverRate = turnoverRate;
    metrics.employeeEngagement = employeeEngagement;
    metrics.turnoverByDepartment = turnoverMap;

    await metrics.save();

    res.status(200).json({ message: 'Metrics updated successfully', metrics });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};


// @desc    Get turnover by department
// @route   GET /api/metrics/turnover-by-department
// @access  Private (Admin only)
exports.getTurnoverByDepartment = async (req, res) => {
    try {
      // Assuming you have a field 'isEmployed' to track if an employee has left the company
      const turnoverByDepartment = await Employee.aggregate([
        { $match: { isEmployed: false } },  // Filter for employees who have left
        { $group: { _id: "$department", count: { $sum: 1 } } },
        { $sort: { count: -1 } }  // Sort by highest turnover
      ]);
  
      const turnoverMap = turnoverByDepartment.reduce((map, dept) => {
        map[dept._id] = dept.count;
        return map;
      }, {});
  
      res.status(200).json(turnoverMap);
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
    }
  };



// @desc    Create new metrics for a project
// @route   POST /api/metrics
// @access  Private (Manager only)
exports.createMetrics = async (req, res) => {
  try {
    const { project, progress, budget, deadlinesMet, issues } = req.body;

    // Check if the project exists
    const existingProject = await Project.findById(project);
    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const metrics = new Metrics({
      project,
      progress,
      budget,
      deadlinesMet,
      issues,
    });

    await metrics.save();
    res.status(201).json({ message: 'Metrics created successfully', metrics });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Get metrics for a specific project
// @route   GET /api/metrics/:projectId
// @access  Private (Manager only)
exports.getMetrics = async (req, res) => {
  try {
    const metrics = await Metrics.findOne({ project: req.params.projectId });

    if (!metrics) {
      return res.status(404).json({ message: 'Metrics not found for this project' });
    }

    res.status(200).json(metrics);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Update metrics for a project
// @route   PUT /api/metrics/:id
// @access  Private (Manager only)
exports.updateMetrics = async (req, res) => {
  try {
    const metrics = await Metrics.findById(req.params.id);

    if (!metrics) {
      return res.status(404).json({ message: 'Metrics not found' });
    }

    metrics.progress = req.body.progress || metrics.progress;
    metrics.budget = req.body.budget || metrics.budget;
    metrics.deadlinesMet = req.body.deadlinesMet || metrics.deadlinesMet;
    metrics.issues = req.body.issues || metrics.issues;
    metrics.lastUpdated = Date.now();

    await metrics.save();
    res.status(200).json({ message: 'Metrics updated successfully', metrics });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Delete metrics for a project
// @route   DELETE /api/metrics/:id
// @access  Private (Manager only)
exports.deleteMetrics = async (req, res) => {
  try {
    const metrics = await Metrics.findById(req.params.id);

    if (!metrics) {
      return res.status(404).json({ message: 'Metrics not found' });
    }

    await metrics.remove();
    res.status(200).json({ message: 'Metrics removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
