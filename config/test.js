// MIT License
// Copyright (c) 2019 Jayne Doe
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

module.exports = {
  app: {
    http2: {
      enabled: false,
      key:     '/path/to/key/file',
      cert:    '/path/to/cert/file',
    },
    name:     'j4numbers',
    hostname: 'localhost',
    port:     '8080',
  },
  jwt: {
    public_cert: 'test/spec/helpers/certs/localhost-cert.pem',
    private_key: 'test/spec/helpers/certs/localhost-privkey.pem',
  },
  nunjucks: {
    options: {
      autoescape: true,
    },
  },
  functionality: {},
  cookies:       {
    domain:        'localhost',
    secure_domain: 'localhost',
    path:          '/',
    passphrase:    'TO_BE_FILLED_IN_ON_PRODUCTION',
  },
  database: {
    uri: 'mongodb://user@password:mongodb-server:27017/database',
  },
  logger: {
    level: 'info',
  },
  admin: {
    hash: 'TO_BE_FILLED_IN_ON_PRODUCTION',
  },
  protected: {
    question: 'TO_BE_FILLED_IN_ON_PRODUCTION',
    hint:     'TO_BE_FILLED_IN_ON_PRODUCTION',
    hash:     'TO_BE_FILLED_IN_ON_PRODUCTION',
  },
};
