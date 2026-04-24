const Issue = require('../models/Issue');

// @desc    Get analytics for dashboard
// @route   GET /api/analytics
// @access  Public
const getAnalytics = async (req, res) => {
  try {
    const { lat, lng, dist } = req.query;

    let totalIssues, resolvedIssues, categoryStats, statusStats;

    if (lat && lng) {
      // When geo params are present, use $geoNear aggregation pipeline
      // because $near is NOT allowed inside countDocuments() or $match
      const geoNearStage = {
        $geoNear: {
          near: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          distanceField: 'dist.calculated',
          maxDistance: parseFloat(dist) || 15000,
          spherical: true
        }
      };

      // Count total using aggregation + $count
      const totalResult = await Issue.aggregate([geoNearStage, { $count: 'total' }]);
      totalIssues = totalResult.length > 0 ? totalResult[0].total : 0;

      // Count resolved using aggregation + $match + $count
      const resolvedResult = await Issue.aggregate([
        geoNearStage,
        { $match: { status: 'resolved' } },
        { $count: 'total' }
      ]);
      resolvedIssues = resolvedResult.length > 0 ? resolvedResult[0].total : 0;

      // Category distribution
      categoryStats = await Issue.aggregate([
        geoNearStage,
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]);

      // Status distribution
      statusStats = await Issue.aggregate([
        geoNearStage,
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);

    } else {
      // No geo filter — use simple countDocuments (no $near, so safe)
      totalIssues = await Issue.countDocuments();
      resolvedIssues = await Issue.countDocuments({ status: 'resolved' });

      categoryStats = await Issue.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]);

      statusStats = await Issue.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);
    }

    // Heatmap data — return all issue locations for map plotting
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
    console.error('Analytics error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAnalytics };
