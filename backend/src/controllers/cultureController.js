const cultureService = require('../services/indianCultureService');

exports.getAllStates = (req, res) => {
  const states = cultureService.getAllStates();
  res.json({ success: true, states });
};

exports.getStateDetail = (req, res) => {
  const { id } = req.params;
  const state = cultureService.getStateDetail(id);
  if (!state) {
    return res.status(404).json({ success: false, message: 'State not found' });
  }
  res.json({ success: true, state });
};

exports.searchCulture = (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ success: false, message: 'Search query required' });
  }
  const results = cultureService.searchCulture(q);
  res.json({ success: true, results });
};
