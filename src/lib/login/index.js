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

const fs = require('fs');
const config = require('config');
const jwt = require('jsonwebtoken');

const certificateFile = fs.readFileSync(config.get('jwt.public_cert'));
const keyFile = fs.readFileSync(config.get('jwt.private_key'));

const decodeToken = async (token) => {
  try {
    return jwt.verify(token, certificateFile)
  } catch (e) {
    return {};
  }
};

const generateSignature = async (payload) =>
    jwt.sign(payload, keyFile, {
      algorithm: 'RS256',
      expiresIn: '60m',
      issuer: 'J4Numbers',
    });

const isLoggedIn = async (token) => {
  if (token === '') {
    return false;
  }
  const decoded = await decodeToken(token);
  if (!Object.prototype.hasOwnProperty.call(decoded, 'admin')) {
    return false;
  }
  return decoded.admin;
};

module.exports = {
  generateSignature,
  isLoggedIn,
  decodeToken
};
