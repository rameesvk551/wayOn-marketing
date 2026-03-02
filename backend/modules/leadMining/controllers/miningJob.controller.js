const miningJobService = require('../services/miningJob.service');

const startMiningJob = async (req, res) => {
  try {
    const { keyword, location, sources } = req.body;
    const job = await miningJobService.createAndQueueJob({ keyword, location, sources });
    res.status(201).json({ success: true, data: job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getMiningJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const result = await miningJobService.getAllJobs(page, limit);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getMiningJob = async (req, res) => {
  try {
    const job = await miningJobService.getJobById(req.params.jobId);
    res.json({ success: true, data: job });
  } catch (err) {
    const status = err.message === 'Job not found' ? 404 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

const getJobProgress = async (req, res) => {
  try {
    const progress = await miningJobService.getJobProgress(req.params.jobId);
    res.json({ success: true, data: progress });
  } catch (err) {
    const status = err.message === 'Job not found' ? 404 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

module.exports = { startMiningJob, getMiningJobs, getMiningJob, getJobProgress };
