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

const express = require('express');
const router = express.Router();

const markdown = require('markdown-it')();

const StaticHandler = require('../../../lib/StaticHandler');
const staticHandlerInstance = StaticHandler.getHandler();
const StaticDocumentTypes = require('../../../lib/StaticDocumentTypes');

const KinkHandler = require('../../../lib/KinkHandler');
const kinkHandlerInstance = KinkHandler.getHandler();

router.post('/', function (req, res) {
    if (req.body['over_18'] === 'yes') {
        res.cookie('over_18', req.body['over_18'], {signed: true, maxAge: 360000000});
    }
    res.redirect(302, '/hobbies/me/fetishes');
});

router.use(function (req, res, next) {
    if (!req.signedCookies['over_18']) {
        staticHandlerInstance.findStatic(StaticDocumentTypes.KINK_WARNING)
            .then(kinkWarning => {
                res.render('./pages/me/me_kinks_warn', {
                    top_page: {
                        title: 'Welcome to Me',
                        tagline: 'If you were looking for a more personal overview about yours truly, you\'ve come to the right place!',
                        image_src: '/images/handle_logo.png',
                        image_alt: 'My logo that I use to represent myself'
                    },

                    content: {
                        title: 'A warning, dear reader',
                        content: markdown.render((kinkWarning || {}).content || '')
                    },

                    head: {
                        title: 'M4Numbers :: Welcome to Me',
                        description: 'Home to the wild things',
                        current_page: 'hobbies',
                        current_sub_page: 'me',
                        current_sub_sub_page: 'fetishes'
                    }
                });
            }, next);
    } else {
        next();
    }
});

router.get('/', function (req, res, next) {
    Promise.all(
        [
            kinkHandlerInstance.findKinks(Math.max(0, ((req.query['page'] || 1) - 1)) * 20, 20, {'kink_name': 1}, req.query['category']),
            kinkHandlerInstance.getTotalKinkCount(false)
        ]
    ).then(([kinks, totalCount]) => {
        res.render('./pages/me/me_kinks_all', {
            top_page: {
                title: 'Welcome to Me',
                tagline: 'If you were looking for a more personal overview about yours truly, you\'ve come to the right place!',
                image_src: '/images/handle_logo.png',
                image_alt: 'My logo that I use to represent myself'
            },

            content: {
                title: 'A collection of kinks belonging to me',
                kinks: kinks
            },

            pagination: {
                base_url: '/hobbies/me/fetishes?',
                total: totalCount,
                page: Math.max((req.query['page'] || 1), 1),
                page_size: 20
            },

            head: {
                title: 'M4Numbers :: Welcome to Me',
                description: 'Home to the wild things',
                current_page: 'hobbies',
                current_sub_page: 'me',
                current_sub_sub_page: 'fetishes',
                current_category: req.query['category']
            }
        });
    }, rejection => next(rejection));
});

router.get('/:kinkId', function (req, res, next) {
    kinkHandlerInstance.findKinkByRawId(req.params['kinkId'])
        .then(foundKink => {
            res.render('./pages/me/me_kinks_single', {
                top_page: {
                    title: foundKink['kink_name'],
                    tagline: 'If you were looking for a more personal overview about yours truly, you\'ve come to the right place!',
                    image_src: '/images/handle_logo.png',
                    image_alt: 'My logo that I use to represent myself'
                },

                content: {
                    kink: foundKink
                },

                head: {
                    title: 'M4Numbers :: Welcome to Me',
                    description: 'Home to the wild things',
                    current_page: 'hobbies',
                    current_sub_page: 'me',
                    current_sub_sub_page: 'fetishes'
                }
            });
        }, rejection => next(rejection));
});

module.exports = router;