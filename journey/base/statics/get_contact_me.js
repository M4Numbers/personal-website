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

const staticHandlerInstance = require('../../../lib/StaticHandler').getHandler();
const StaticDocumentTypes = require('../../../lib/StaticDocumentTypes');

const getContactMe = async (req, res, next) => {
    staticHandlerInstance.findStatic(StaticDocumentTypes.CONTACT_ME).then(staticContent => {
        res.render('./pages/contact', {
            top_page: {
                title: 'Contact Me',
                tagline: 'If, for whatever reason, you want to get in touch with me, use the links below to find my other' +
                    ' hidey-holes.',
                fa_type: 'fas',
                fa_choice: 'fa-phone'
            },

            content: {
                options: (staticContent || {}).content
            },

            head: {
                title: 'J4Numbers :: Contact Me',
                description: 'Home to the wild things',
                current_page: 'contact'
            }
        });
    }, next);
};

module.exports = getContactMe;
