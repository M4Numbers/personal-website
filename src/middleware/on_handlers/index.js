const restifyHandler = require('./restify_handler');
const outboundLogger = require('./outbound_logger');

const onEventHandler = (server) => {
  server.on('restifyError', restifyHandler);
  server.on('after', outboundLogger);
};

module.exports = onEventHandler;
