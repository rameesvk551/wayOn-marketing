const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

const validateStartJob = [
  body('keyword').notEmpty().withMessage('Keyword is required').trim(),
  body('location').notEmpty().withMessage('Location is required').trim(),
  body('sources')
    .isArray({ min: 1 })
    .withMessage('At least one source is required')
    .custom((sources) => {
      const valid = ['google_maps', 'directory'];
      return sources.every((s) => valid.includes(s));
    })
    .withMessage('Invalid source. Valid values: google_maps, directory'),
  handleValidationErrors,
];

const validateJobId = [
  param('jobId').isMongoId().withMessage('Invalid job ID'),
  handleValidationErrors,
];

const validateExport = [
  body('jobId').isMongoId().withMessage('Invalid job ID'),
  body('format')
    .optional()
    .isIn(['csv', 'excel'])
    .withMessage('Format must be csv or excel'),
  handleValidationErrors,
];

module.exports = { validateStartJob, validateJobId, validateExport, handleValidationErrors };
