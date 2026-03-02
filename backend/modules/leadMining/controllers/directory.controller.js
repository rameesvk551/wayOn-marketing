const { scrapeDirectory } = require('../services/directory.service');

const triggerDirectoryScrape = async (req, res) => {
  try {
    const { keyword, location, jobId } = req.body;
    const leads = await scrapeDirectory({ keyword, location, jobId });
    res.json({ success: true, data: { count: leads.length, leads } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { triggerDirectoryScrape };
