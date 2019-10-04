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
const fs = require('fs');
const Multer = require('multer');
const uploads = Multer({dest: '../../tmp/uploads'});

const ArtHandler = require('../../lib/ArtHandler');
const artHandlerInstance = ArtHandler.getHandler();

const loggingSystem = require('../../lib/Logger');
const logger = loggingSystem.getLogger('master');

router.get('/', function (req, res) {
    Promise.all(
        [
            artHandlerInstance.findAllArtPieces(Math.max(0, ((req.query['page'] || 1) - 1)) * 10, 10, {'date_completed': -1}),
            artHandlerInstance.getTotalArtPieceCount()
        ]
    ).then(([pictures, totalCount]) => {
        res.render('./pages/admin/art/admin_art_view', {
            top_page: {
                title: 'Administrator Toolkit',
                tagline: 'All the functions that the administrator of the site has available to them',
                fa_type: 'fas',
                fa_choice: 'fa-toolbox'
            },

            content: {
                pictures: pictures
            },

            pagination: {
                base_url: '/admin/art?',
                total: totalCount,
                page: Math.max((req.query['page'] || 1), 1),
                page_size: 10
            },

            head: {
                title: 'J4Numbers',
                description: 'Home to the wild things',
                current_page: 'admin',
                current_sub_page: 'art-view'
            }
        });
    });
});

router.get('/new', function (req, res) {
    res.render('./pages/admin/art/admin_art_create', {
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
            current_sub_page: 'art-edit'
        }
    });
});

router.post('/new', uploads.single('art-image'), function (req, res) {
    logger.info(`Reading in new image from ${req.file.path}`);
    let imageAsBase64 = fs.readFileSync(req.file.path, 'base64');
    artHandlerInstance.addNewArtItem(
        req.body['art-title'], req.body['art-completed-date'],
        imageAsBase64, req.body['art-tags'].split(/, ?/),
        req.body['art-notes']
    ).then((savedArt) => {
        res.redirect(303, `/admin/art/${savedArt._id}`);
    }, rejection => {
        res.cookie('art-create-error', {error: rejection}, {signed: true, maxAge: 1000});
        res.redirect(303, '/admin/art/new');
    });
});

router.get('/:artId', function (req, res) {
    artHandlerInstance.findArtByRawId(req.params['artId']).then((picture) => {
        res.render('./pages/admin/art/admin_art_view_single', {
            top_page: {
                title: 'Administrator Toolkit',
                tagline: 'All the functions that the administrator of the site has available to them',
                fa_type: 'fas',
                fa_choice: 'fa-toolbox'
            },

            content: {
                picture: picture
            },

            head: {
                title: 'J4Numbers',
                description: 'Home to the wild things',
                current_page: 'admin',
                current_sub_page: 'art-view'
            }
        });
    });
});

router.get('/:artId/edit', function (req, res) {
    artHandlerInstance.findArtByRawId(req.params['artId']).then((picture) => {
        res.render('./pages/admin/art/admin_art_edit_single', {
            top_page: {
                title: 'Administrator Toolkit',
                tagline: 'All the functions that the administrator of the site has available to them',
                fa_type: 'fas',
                fa_choice: 'fa-toolbox'
            },

            content: {
                picture: picture
            },

            head: {
                title: 'J4Numbers',
                description: 'Home to the wild things',
                current_page: 'admin',
                current_sub_page: 'art-edit'
            }
        });
    });
});

router.post('/:artId/edit', uploads.single('art-image'), function (req, res) {
    artHandlerInstance.updateExistingArtPiece(
        req.params['artId'], req.body['art-title'],
        req.body['art-completed-date'], req.file['art-image'],
        req.body['art-tags'].split(/, ?/), req.body['art-notes']
    ).then(() => {
        res.redirect(303, `/admin/art/${req.params['artId']}`);
    }, rejection => {
        res.cookie('art-update-error', {art_id: req.params['artId'], error: rejection}, {signed: true, maxAge: 1000});
        res.redirect(303, `/admin/art/${req.params['artId']}`);
    });
});

router.get('/:artId/delete', function (req, res) {
    artHandlerInstance.findArtByRawId(req.params['artId']).then((picture) => {
        res.render('./pages/admin/art/admin_art_delete_single', {
            top_page: {
                title: 'Administrator Toolkit',
                tagline: 'All the functions that the administrator of the site has available to them',
                fa_type: 'fas',
                fa_choice: 'fa-toolbox'
            },

            content: {
                picture: picture
            },

            head: {
                title: 'J4Numbers',
                description: 'Home to the wild things',
                current_page: 'admin',
                current_sub_page: 'art-delete'
            }
        });
    });
});

router.post('/:artId/delete', function (req, res) {
    artHandlerInstance.deleteArt(req.params['artId']).then(() => {
        res.redirect(303, '/admin/art/');
    }, rejection => {
        res.cookie('art-delete-error', {art_id: req.params['artId'], error: rejection}, {signed: true, maxAge: 1000});
        res.redirect(303, `/admin/art/${req.params['artId']}`);
    });
});

module.exports = router;
