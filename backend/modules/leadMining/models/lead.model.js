const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    phones: [{ type: String }],
    emails: [{ type: String }],
    website: { type: String, trim: true },
    address: { type: String, trim: true },
    source: { type: String, enum: ['google_maps', 'directory', 'manual'], required: true },
    location: { type: String, trim: true },
    keyword: { type: String, trim: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'MiningJob' },
    hash: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

leadSchema.index({ jobId: 1 });
leadSchema.index({ hash: 1 });
leadSchema.index({ keyword: 1, location: 1 });

const Lead = mongoose.model('Lead', leadSchema);
module.exports = Lead;
