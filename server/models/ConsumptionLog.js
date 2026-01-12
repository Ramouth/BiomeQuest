import mongoose from 'mongoose';

const ConsumptionLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    plantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plant',
      required: true
    },
    plantName: {
      type: String,
      required: true // Denormalized for quick access and historical records
    },
    isFirstConsumption: {
      type: Boolean,
      default: false // True if this is the first time the user consumed this plant
    },
    pointsEarned: {
      type: Number,
      required: true
    },
    consumedAt: {
      type: Date,
      default: Date.now,
      index: true // Index for efficient date-based queries
    },
    notes: String // Optional notes about when/where consumed
  },
  { timestamps: true }
);

// Compound index for efficient queries by user and date range
ConsumptionLogSchema.index({ userId: 1, consumedAt: -1 });

export default mongoose.model('ConsumptionLog', ConsumptionLogSchema);
