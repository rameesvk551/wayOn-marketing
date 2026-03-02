const { Parser: Json2CsvParser } = require('json2csv');
const ExcelJS = require('exceljs');
const leadRepository = require('../repository/lead.repository');

const LEAD_FIELDS = ['name', 'phones', 'emails', 'website', 'address', 'source', 'location', 'keyword', 'createdAt'];

const exportToCSV = async (jobId, res) => {
  const leads = await leadRepository.findLeadsByJobIdAll(jobId);
  const rows = leads.map((l) => ({
    name: l.name || '',
    phones: (l.phones || []).join('; '),
    emails: (l.emails || []).join('; '),
    website: l.website || '',
    address: l.address || '',
    source: l.source || '',
    location: l.location || '',
    keyword: l.keyword || '',
    createdAt: l.createdAt ? new Date(l.createdAt).toISOString() : '',
  }));

  const parser = new Json2CsvParser({ fields: LEAD_FIELDS });
  const csv = parser.parse(rows);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="leads-${jobId}.csv"`);
  res.send(csv);
};

const exportToExcel = async (jobId, res) => {
  const leads = await leadRepository.findLeadsByJobIdAll(jobId);

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Leads');

  sheet.columns = [
    { header: 'Name', key: 'name', width: 30 },
    { header: 'Phones', key: 'phones', width: 25 },
    { header: 'Emails', key: 'emails', width: 30 },
    { header: 'Website', key: 'website', width: 35 },
    { header: 'Address', key: 'address', width: 40 },
    { header: 'Source', key: 'source', width: 15 },
    { header: 'Location', key: 'location', width: 20 },
    { header: 'Keyword', key: 'keyword', width: 20 },
    { header: 'Created At', key: 'createdAt', width: 25 },
  ];

  leads.forEach((l) => {
    sheet.addRow({
      name: l.name || '',
      phones: (l.phones || []).join('; '),
      emails: (l.emails || []).join('; '),
      website: l.website || '',
      address: l.address || '',
      source: l.source || '',
      location: l.location || '',
      keyword: l.keyword || '',
      createdAt: l.createdAt ? new Date(l.createdAt).toISOString() : '',
    });
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="leads-${jobId}.xlsx"`);
  await workbook.xlsx.write(res);
  res.end();
};

module.exports = { exportToCSV, exportToExcel };
