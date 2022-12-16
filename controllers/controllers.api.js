const apiInfo = require('../endpoints.json');

exports.getEndpointInfo = (req, res) => {
  res.status(200).json({ apiInfo });
};
