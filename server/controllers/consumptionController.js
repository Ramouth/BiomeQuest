import ConsumptionLog from '../models/ConsumptionLog.js';
import Plant from '../models/Plant.js';
import User from '../models/User.js';
import Points from '../models/Points.js';

// Helper: Get start and end of week
const getWeekDates = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  const weekStart = new Date(d.setDate(diff));
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  return { weekStart, weekEnd };
};

// @route   POST /api/consumptions/log
// @desc    Log plant consumption and calculate points
// @access  Private
export const logConsumption = async (req, res) => {
  try {
    const { plantId } = req.body;
    const userId = req.user.id;

    // Validate plant exists
    const plant = await Plant.findById(plantId);
    if (!plant) {
      return res.status(404).json({
        success: false,
        message: 'Plant not found'
      });
    }

    // Check if user has consumed this plant before
    const previousConsumption = await ConsumptionLog.findOne({
      userId,
      plantId
    });

    const isFirstConsumption = !previousConsumption;
    const pointsEarned = isFirstConsumption
      ? plant.pointsForNewConsumption
      : plant.pointsForRepeatConsumption;

    // Create consumption log
    const consumption = await ConsumptionLog.create({
      userId,
      plantId,
      plantName: plant.name,
      isFirstConsumption,
      pointsEarned
    });

    // Update user stats
    const user = await User.findById(userId);
    user.totalPoints += pointsEarned;

    if (isFirstConsumption) {
      user.diversityScore += 1;
    }

    await user.save();

    // Update or create Points record
    let points = await Points.findOne({ userId });

    if (!points) {
      points = await Points.create({
        userId,
        totalPoints: pointsEarned,
        weeklyPoints: [],
        monthlyPoints: [],
        allTimeStats: {
          uniquePlantsConsumed: isFirstConsumption ? 1 : 0,
          totalConsumptions: 1,
          lastLoggedDate: new Date()
        }
      });
    } else {
      points.totalPoints += pointsEarned;
      points.allTimeStats.totalConsumptions += 1;
      points.allTimeStats.lastLoggedDate = new Date();

      if (isFirstConsumption) {
        points.allTimeStats.uniquePlantsConsumed += 1;
      }

      // Update weekly points
      const { weekStart, weekEnd } = getWeekDates();
      let weeklyRecord = points.weeklyPoints.find(
        w => new Date(w.weekStart).getTime() === weekStart.getTime()
      );

      if (weeklyRecord) {
        weeklyRecord.points += pointsEarned;
        if (isFirstConsumption) {
          weeklyRecord.plantCount += 1;
        }
      } else {
        points.weeklyPoints.push({
          weekStart,
          weekEnd,
          points: pointsEarned,
          plantCount: isFirstConsumption ? 1 : 0
        });
      }

      // Update monthly points
      const now = new Date();
      const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      let monthlyRecord = points.monthlyPoints.find(m => m.month === monthKey);

      if (monthlyRecord) {
        monthlyRecord.points += pointsEarned;
        if (isFirstConsumption) {
          monthlyRecord.plantCount += 1;
        }
      } else {
        points.monthlyPoints.push({
          month: monthKey,
          points: pointsEarned,
          plantCount: isFirstConsumption ? 1 : 0
        });
      }

      await points.save();
    }

    res.status(201).json({
      success: true,
      message: isFirstConsumption
        ? 'Congrats! You just helped your biome with a new plant! 🎉'
        : 'Plants are good, but diversity is KING! 👑',
      consumption: {
        id: consumption._id,
        plantName: plant.name,
        pointsEarned,
        isFirstConsumption,
        userStats: {
          totalPoints: user.totalPoints,
          diversityScore: user.diversityScore
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @route   GET /api/consumptions
// @desc    Get user's consumption history
// @access  Private
export const getConsumptionHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 20, skip = 0 } = req.query;

    const consumptions = await ConsumptionLog.find({ userId })
      .sort({ consumedAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await ConsumptionLog.countDocuments({ userId });

    res.status(200).json({
      success: true,
      total,
      consumptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @route   GET /api/consumptions/plants
// @desc    Get unique plants consumed by user
// @access  Private
export const getConsumedPlants = async (req, res) => {
  try {
    const userId = req.user.id;

    const consumedPlants = await ConsumptionLog.aggregate([
      { $match: { userId: require('mongoose').Types.ObjectId(userId) } },
      { $group: { _id: '$plantId', count: { $sum: 1 }, plantName: { $first: '$plantName' } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      plants: consumedPlants
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @route   GET /api/consumptions/stats
// @desc    Get user's consumption statistics
// @access  Private
export const getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const points = await Points.findOne({ userId });
    const user = await User.findById(userId);

    if (!points) {
      return res.status(404).json({
        success: false,
        message: 'No stats found'
      });
    }

    // Get this week's points
    const { weekStart, weekEnd } = getWeekDates();
    const weeklyData = await ConsumptionLog.aggregate([
      {
        $match: {
          userId: require('mongoose').Types.ObjectId(userId),
          consumedAt: { $gte: weekStart, $lte: weekEnd }
        }
      },
      {
        $group: {
          _id: null,
          totalPoints: { $sum: '$pointsEarned' },
          uniquePlants: { $sum: { $cond: ['$isFirstConsumption', 1, 0] } }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalPoints: user.totalPoints,
        diversityScore: user.diversityScore,
        weeklyGoal: user.weeklyGoal,
        weeklyPoints: weeklyData[0]?.totalPoints || 0,
        weeklyUniquePlants: weeklyData[0]?.uniquePlants || 0,
        allTimeStats: points.allTimeStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
