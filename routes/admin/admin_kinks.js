/*
 * MIT License
 *
 * Copyright (c) 2018 Jayne Doe
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

const KinkHandler = require('../../lib/KinkHandler');
const kinkHandlerInstance = KinkHandler.getHandler();

router.get('/', function (req, res) {
    Promise.all(
        [
            kinkHandlerInstance.findKinks(Math.max(0, ((req.query['page'] || 1) - 1)) * 20, 20, {'time_posted': -1}, false),
            kinkHandlerInstance.getTotalKinkCount(false)
        ]
    ).then(([kinks, totalCount]) => {
        res.render('./pages/admin/kinks/admin_kink_view', {
            top_page: {
                title: 'Administrator Toolkit',
                tagline: 'All the functions that the administrator of the site has available to them',
                fa_type: 'fas',
                fa_choice: 'fa-toolbox'
            },

            content: {
                kinks: kinks
            },

            pagination: {
                base_url: '/admin/fetishes?',
                total: totalCount,
                page: Math.max((req.query['page'] || 1), 1),
                page_size: 20
            },

            head: {
                title: 'J4Numbers',
                description: 'Home to the wild things',
                current_page: 'admin',
                current_sub_page: 'kink-view'
            }
        });
    });
});

router.get('/new', function (req, res) {
    res.render('./pages/admin/kinks/admin_kink_create', {
        top_page: {
            title: 'Administrator Toolkit',
            tagline: 'All the functions that the administrator of the site has available to them',
            fa_type: 'fas',
            fa_choice: 'fa-toolbox'
        },

        head: {
            title: 'J4Numbers',
            description: 'Home to the wild things',
            current_page: 'admin',
            current_sub_page: 'kink-edit'
        }
    });
});

router.post('/new', function (req, res) {
    kinkHandlerInstance.addNewKink(
        req.body['kink-name'], req.body['kink-description'],
        req.body['kink-status'], req.body['kink-experience'],
        req.body['kink-image'], req.body['kink-tags'].split(/, ?/)
    ).then((savedKink) => {
        res.redirect(303, `/admin/fetishes/${savedKink._id}`);
    }, rejection => {
        res.cookie('kink-create-error', {error: rejection}, {signed: true, maxAge: 1000});
        res.redirect(303, '/admin/fetishes/new');
    });
});

router.get('/:kinkId', function (req, res) {
    kinkHandlerInstance.findKinkByRawId(req.params['kinkId']).then((kink) => {
        res.render('./pages/admin/kinks/admin_kink_view_single', {
            top_page: {
                title: 'Administrator Toolkit',
                tagline: 'All the functions that the administrator of the site has available to them',
                fa_type: 'fas',
                fa_choice: 'fa-toolbox'
            },

            content: {
                kink: kink
            },

            head: {
                title: 'J4Numbers',
                description: 'Home to the wild things',
                current_page: 'admin',
                current_sub_page: 'kink-view'
            }
        });
    });
});

router.get('/:kinkId/edit', function (req, res) {
    kinkHandlerInstance.findKinkByRawId(req.params['kinkId']).then((kink) => {
        res.render('./pages/admin/kinks/admin_kink_edit_single', {
            top_page: {
                title: 'Administrator Toolkit',
                tagline: 'All the functions that the administrator of the site has available to them',
                fa_type: 'fas',
                fa_choice: 'fa-toolbox'
            },

            content: {
                kink: kink
            },

            head: {
                title: 'J4Numbers',
                description: 'Home to the wild things',
                current_page: 'admin',
                current_sub_page: 'kink-edit'
            }
        });
    });
});

router.post('/:kinkId/edit', function (req, res) {
    kinkHandlerInstance.updateExistingKink(
        req.params['kinkId'], req.body['kink-name'],
        req.body['kink-description'], req.body['kink-status'],
        req.body['kink-experience'], req.body['kink-image'],
        req.body['kink-tags'].split(/, ?/)
    ).then(() => {
        res.redirect(303, `/admin/fetishes/${req.params['kinkId']}`);
    }, rejection => {
        res.cookie('kink-update-error', {blog_id: req.params['kinkId'], error: rejection}, {signed: true, maxAge: 1000});
        res.redirect(303, `/admin/fetishes/${req.params['kinkId']}`);
    });
});

router.get('/:kinkId/delete', function (req, res) {
    kinkHandlerInstance.findKinkByRawId(req.params['kinkId']).then((kink) => {
        res.render('./pages/admin/kinks/admin_kink_delete_single', {
            top_page: {
                title: 'Administrator Toolkit',
                tagline: 'All the functions that the administrator of the site has available to them',
                fa_type: 'fas',
                fa_choice: 'fa-toolbox'
            },

            content: {
                kink: kink
            },

            head: {
                title: 'J4Numbers',
                description: 'Home to the wild things',
                current_page: 'admin',
                current_sub_page: 'kink-delete'
            }
        });
    });
});

router.post('/:kinkId/delete', function (req, res) {
    kinkHandlerInstance.deleteKink(req.params['kinkId']).then(() => {
        res.redirect(303, '/admin/fetishes/');
    }, rejection => {
        res.cookie('kink-delete-error', {blog_id: req.params['kinkId'], error: rejection}, {signed: true, maxAge: 1000});
        res.redirect(303, `/admin/fetishes/${req.params['kinkId']}`);
    });
});

module.exports = router;
