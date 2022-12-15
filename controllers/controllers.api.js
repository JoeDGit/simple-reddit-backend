const apiInfo = require('../endpoints.json');

exports.getEndpointInfo = (req, res) => {
  res.json(apiInfo);
};
