// MIT License
//
// Copyright (c) 2019 Jayne Doe
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

const fs = require('fs');
const uuid = require('uuid').v4;
const config = require('config');
const restify = require('restify');

const loggerEngine = require('./lib/logger');
const routingEngine = require('./routes');
const onEventHandlers = require('./middleware/on_handlers');
const preRequestHandlers = require('./middleware/pre_handlers');

const log = loggerEngine.bunyanLogger();

let http2Config;
if (config.get('app.http2.enabled')) {
  log.info('HTTP/2 configuration accepted...');
  http2Config = {
    key:  fs.readFileSync(config.get('app.http2.key')),
    cert: fs.readFileSync(config.get('app.http2.cert')),
  };
}

const server = restify.createServer({
  name:                config.get('app.name'),
  url:                 config.get('app.hostname'),
  ignoreTrailingSlash: true,
  log,
  formatters:          {
    'text/html': (req, res, body) => {
      if (body instanceof Error) {
        return body.toHTML();
      }
      return body;
    },
    'application/yaml': (req, res, body) => body.toString(),
  },
  http2: http2Config,
});

server.pre(restify.plugins.pre.dedupeSlashes());
server.pre(restify.plugins.pre.sanitizePath());
preRequestHandlers(server);

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.use(restify.plugins.requestLogger({
  properties: {
    'correlation-id': uuid(),
  },
}));

onEventHandlers(server);

routingEngine(server);

server.listen(config.get('app.port'), () => {
  log.info(`${server.name} listening at ${server.url}`);
});

module.exports = server;
