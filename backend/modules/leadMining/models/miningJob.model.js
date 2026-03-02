const mongoose = require('mongoose');

const miningJobSchema = new mongoose.Schema(
  {
    keyword: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    sources: [{ type: String, enum: ['google_maps', 'directory'] }],
    status: {
      type: String,
      enum: ['pending', 'running', 'completed', 'failed'],
      default: 'pending',
    },
    totalTasks: { type: Number, default: 0 },
    completedTasks: { type: Number, default: 0 },
    progress: { type: Number, default: 0 },
    errorMessage: { type: String },
    finishedAt: { type: Date },
    leadsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

miningJobSchema.index({ status: 1 });
miningJobSchema.index({ createdAt: -1 });

const MiningJob = mongoose.model('MiningJob', miningJobSchema);
module.exports = MiningJob;
