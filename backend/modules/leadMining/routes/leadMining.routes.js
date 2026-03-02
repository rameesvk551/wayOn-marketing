const express = require('express');
const router = express.Router();

const miningJobController = require('../controllers/miningJob.controller');
const exportController = require('../controllers/export.controller');
const { validateStartJob, validateJobId, validateExport } = require('../validators/mining.validator');

// Job management
router.post('/start', validateStartJob, miningJobController.startMiningJob);
router.get('/jobs', miningJobController.getMiningJobs);
router.get('/jobs/:jobId', validateJobId, miningJobController.getMiningJob);
router.get('/jobs/:jobId/progress', validateJobId, miningJobController.getJobProgress);

// Results
router.get('/jobs/:jobId/results', validateJobId, exportController.getLeadResults);

// Export
router.post('/export', validateExport, exportController.exportLeads);

module.exports = router;
