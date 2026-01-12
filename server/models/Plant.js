import mongoose from 'mongoose';

const PlantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a plant name'],
      unique: true,
      trim: true,
      lowercase: true
    },
    commonName: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      enum: ['fruit', 'vegetable', 'grain', 'legume', 'herb', 'nut', 'seed'],
      required: true
    },
    pointsForNewConsumption: {
      type: Number,
      default: 5,
      min: 0
    },
    pointsForRepeatConsumption: {
      type: Number,
      default: 1,
      min: 0
    },
    healthBenefits: [String], // e.g., ['high in fiber', 'rich in vitamin C']
    icon: String, // Icon emoji or reference
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model('Plant', PlantSchema);
