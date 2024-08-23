const Project = require("../models/Project");
const Performance = require('../models/Performance');
const Employee = require('../models/Employee');


// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (Manager only)
exports.createProject = async (req, res) => {
  try {
    const { name, description, startDate, endDate, teamMembers, metrics } =
      req.body;

    if (req.user.role !== "manager") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Check for duplicate project name under the same manager
    const existingProject = await Project.findOne({
      name,
      manager: req.user._id,
    });

    if (existingProject) {
      return res
        .status(400)
        .json({
          message:
            "Project with this name already exists under your management",
        });
    }

    const project = new Project({
      name,
      description,
      startDate,
      endDate,
      teamMembers,
      metrics,
      manager: req.user._id, // Assuming req.user contains the logged-in user
    });

    await project.save();

    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private (Manager only)
exports.getProjects = async (req, res) => {
  try {
    if (req.user.role !== "manager") {
      return res.status(403).json({ message: "Access denied" });
    }
    const projects = await Project.find({ manager: req.user._id })
      // .populate(
      //   "teamMembers",
      //   "name email"
      // );
      .populate("teamMembers", "firstName lastName");
    if (!projects) {
      return res.status(404).json({ message: "No projects found" });
    }

    // Transform the data if needed
    const projectMetrics = projects.map((project) => ({
      _id: project._id,
      name: project.name,
      progress: project.metrics.progress,
      budget: project.metrics.budget,
      performanceScore: project.metrics.performanceScore,
      teamMembers: project.teamMembers.map((member) => ({
        name: `${member.firstName} ${member.lastName}`,
        _id:  member._id
      })),
    }));

    // res.status(200).json(projectMetrics);

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// @desc    Get a project by ID
// @route   GET /api/projects/:id
// @access  Private (Manager only)
exports.getProjectById = async (req, res) => {
  try {
    if (req.user.role !== "manager") {
      return res.status(403).json({ message: "Access denied" });
    }
    const project = await Project.findById(req.params.id).populate(
      "teamMembers",
      "name email"
    );

    if (!project || project.manager.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private (Manager only)
exports.updateProjectMetrics = async (req, res) => {
  try {
    if (req.user.role !== "manager") {
      return res.status(403).json({ message: "Access denied" });
    }
    const { name, description, startDate, endDate, teamMembers, metrics } =
      req.body;

    let project = await Project.findById(req.params.id);

    if (!project || project.manager.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.name = name || project.name;
    project.description = description || project.description;
    project.startDate = startDate || project.startDate;
    project.endDate = endDate || project.endDate;
    project.teamMembers = teamMembers || project.teamMembers;
    project.metrics = metrics || project.metrics;

    const { progress, budget, performanceScore } = metrics;

    console.log("progress ", progress);
    console.log("budget ", budget);
    console.log("performanceScore ", performanceScore);
    project.metrics.progress = progress || project.metrics.progress;
    project.metrics.budget = budget || project.metrics.budget;
    project.metrics.performanceScore =
      performanceScore || project.metrics.performanceScore;

    await project.save();

    res.status(200).json({ message: "Project updated successfully", project });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private (Manager only)
exports.deleteProject = async (req, res) => {
  try {
    if (req.user.role !== "manager") {
      return res.status(403).json({ message: "Access denied" });
    }
    const project = await Project.findById(req.params.id);

    if (!project || project.manager.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Project not found" });
    }

    // await project.remove();
    await Project.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" + error, error });
  }
};

// @desc    Filter projects by project name, time period, or specific team members
// @route   GET /api/projects
// @access  Private (Manager only)
exports.filterProjects = async (req, res) => {
  try {
    const { name, startDate, endDate, teamMemberId } = req.query;

    const filter = {};

    if (name) {
      filter.name = { $regex: name, $options: 'i' }; // Case-insensitive search
    }

    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) filter.startDate.$gte = new Date(startDate);
      if (endDate) filter.startDate.$lte = new Date(endDate);
    }

    if (teamMemberId) {
      filter.teamMembers = teamMemberId;
    }

    const projects = await Project.find(filter).populate('teamMembers', 'firstName lastName');

    if (!projects.length) {
      return res.status(404).json({ message: 'No projects found' });
    }

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};




// @desc    Get individual performance details
// @route   GET /api/performance/:employeeId
// @access  Private (Manager only)
exports.getIndividualPerformance = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const performanceDetails = await Performance.find({ employee: employeeId })
      .populate('employee', 'firstName lastName')
      .populate('project', 'name');

    if (!performanceDetails) {
      return res.status(404).json({ message: 'Performance details not found' });
    }

    res.status(200).json(performanceDetails);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};



// @desc    Rate an employee
// @route   POST /api/projects/rate
// @access  Private (Manager or Admin only)
exports.rateEmployee = async (req, res) => {
  const { employeeId, projectId, rating, feedback } = req.body;

  try {
    // Check if the employee and project exist
    const employee = await Employee.findById(employeeId);
    const project = await Project.findById(projectId);

    if (!employee || !project) {
      return res.status(404).json({ message: 'Employee or Project not found' });
    }

    // Create a new performance record
    const performance = new Performance({
      employee: employeeId,
      project: projectId,
      rating,
      feedback,
    });

    await performance.save();
    res.status(201).json({ message: 'Performance rated successfully', performance });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};