const Issue = require('../models/Issue');

// @desc    Get analytics for dashboard
// @route   GET /api/analytics
// @access  Public
const getAnalytics = async (req, res) => {
  try {
    const totalIssues = await Issue.countDocuments();
    const resolvedIssues = await Issue.countDocuments({ status: 'resolved' });
    
    // Category distribution
    const categoryStats = await Issue.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Issue status distribution
    const statusStats = await Issue.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Heatmap data (simplified)
    const heatmapData = await Issue.find({}, 'location title status category');

    res.json({
      summary: {
        totalIssues,
        resolvedIssues,
        resolutionRate: totalIssues > 0 ? (resolvedIssues / totalIssues) * 100 : 0
      },
      categoryStats,
      statusStats,
      heatmapData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAnalytics };
