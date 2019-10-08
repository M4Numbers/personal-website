const outboundLogger = (req, res) => {
  req.log.info(`${req.id} :: ${req.method} call to ${req.getPath()} returned ${res.statusCode}`);
};

module.exports = outboundLogger;
