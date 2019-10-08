const bunyan = require('bunyan');
const config = require('config');

let logger;

const createLogger = () => bunyan.createLogger({
  name: config.get('app.name'),
  level: config.get('logger.level'),
});

module.exports = () => {
  if (logger === undefined) {
    logger = createLogger();
  }
  return logger;
};
