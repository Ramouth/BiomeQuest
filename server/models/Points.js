import mongoose from 'mongoose';

const PointsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    totalPoints: {
      type: Number,
      default: 0
    },
    weeklyPoints: [
      {
        weekStart: Date,
        weekEnd: Date,
        points: Number,
        plantCount: Number // Number of unique plants consumed this week
      }
    ],
    monthlyPoints: [
      {
        month: String, // e.g., "2024-01"
        points: Number,
        plantCount: Number
      }
    ],
    allTimeStats: {
      uniquePlantsConsumed: {
        type: Number,
        default: 0
      },
      totalConsumptions: {
        type: Number,
        default: 0
      },
      currentStreak: {
        type: Number,
        default: 0 // Number of consecutive days logged
      },
      longestStreak: {
        type: Number,
        default: 0
      },
      lastLoggedDate: Date
    }
  },
  { timestamps: true }
);

// Compound index for efficient user lookup
PointsSchema.index({ userId: 1 });

export default mongoose.model('Points', PointsSchema);
