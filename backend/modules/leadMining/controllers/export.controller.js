const { exportToCSV, exportToExcel } = require('../services/export.service');

const exportLeads = async (req, res) => {
  try {
    const { jobId, format = 'csv' } = req.body;
    if (format === 'excel') {
      await exportToExcel(jobId, res);
    } else {
      await exportToCSV(jobId, res);
    }
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};

const getLeadResults = async (req, res) => {
  try {
    const leadRepository = require('../repository/lead.repository');
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const result = await leadRepository.findLeadsByJobId(req.params.jobId, page, limit);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { exportLeads, getLeadResults };
