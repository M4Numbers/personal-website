/*
 * MIT License
 *
 * Copyright (c) 2019 Matthew D. Ball
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const requestIdHandler = require('./request_id');
const localsStarter = require('./locals_starter');
const loginCookiesConverter = require('./login_cookie_translater');
const over18CookiesConverter = require('./over_18_cookie_translater');
const confirmLoggedIn = require('./login_checker');
const inboundLogger = require('./inbound_logger');

const loadHandlers = (server) => {
  server.pre(requestIdHandler);
  server.pre(inboundLogger);
  server.pre(localsStarter);
  server.pre(loginCookiesConverter);
  server.pre(over18CookiesConverter);
  server.pre(confirmLoggedIn);
  return server;
};

module.exports = loadHandlers;
