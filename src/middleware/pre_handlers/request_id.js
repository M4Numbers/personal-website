const uuid = require('uuid/v4');

const requestId = (req, res, next) => {
  req.id = uuid();
  next();
};

module.exports = requestId;
