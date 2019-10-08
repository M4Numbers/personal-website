/*
 * MIT License
 *
 * Copyright (c) 2019 Jayne Doe
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

const config = require('config');
const crypto = require('crypto');

const tokenHandler = require('../../lib/login');

const friendLoginCompare = async (req, res, next) => {
    if (req.body['me_password'] && !(res.nunjucks['friendly'])) {
        let hash = crypto.createHash('sha256').update(req.body['me_password']).digest('hex');
        if (hash === config.get('protected.hash')) {
            res.header(
                'Set-Cookie',
                `login-token=${await tokenHandler.generateSignature({ friendly: true })}; `
                + `Max-Age=3600; `
                + `Domain=${config.get('app.hostname')}; `
                + `Secure; `
                + `HttpOnly; `
                + `SameSite=Strict`
            );
        }
    }
    res.redirect(303, '/hobbies/me/login', next);
};

module.exports = friendLoginCompare;
