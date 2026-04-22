const Project = require('../models/Project');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
  const projects = await Project.find({});
  res.json(projects);
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private (Admin/Authority)
const createProject = async (req, res) => {
  const { title, description, budgetAllocated, startDate, endDate } = req.body;

  const project = new Project({
    title,
    description,
    budgetAllocated,
    timeline: {
      startDate,
      endDate
    }
  });

  const createdProject = await project.save();
  res.status(201).json(createdProject);
};

// @desc    Update project progress/budget
// @route   PATCH /api/projects/:id
// @access  Private (Admin/Authority)
const updateProject = async (req, res) => {
  const { progress, budgetUsed, status } = req.body;
  const project = await Project.findById(req.params.id);

  if (project) {
    project.progress = progress !== undefined ? progress : project.progress;
    project.budgetUsed = budgetUsed !== undefined ? budgetUsed : project.budgetUsed;
    project.status = status || project.status;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } else {
    res.status(404).json({ message: 'Project not found' });
  }
};

module.exports = { getProjects, createProject, updateProject };
