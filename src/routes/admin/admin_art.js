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

const testLoggedIn = require('../../journey/misc/test_admin_logged_in');

const renderer = require('../../lib/renderer').nunjucksRenderer();

const fs = require('fs');

const ArtHandler = require('../../lib/ArtHandler');
const artHandlerInstance = ArtHandler.getHandler();

const viewAllArtPieces = function (req, res, next) {
    Promise.all(
        [
            artHandlerInstance.findAllArtPieces(Math.max(0, ((req.query['page'] || 1) - 1)) * 10, 10, {'date_completed': -1}),
            artHandlerInstance.getTotalArtPieceCount()
        ]
    ).then(([pictures, totalCount]) => {
        res.contentType = 'text/html';
        res.header('content-type', 'text/html');
        res.send(200, renderer.render('pages/admin/art/admin_art_view.njk', {
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
        }));
        next();
    });
};

const viewCreateNewArtPiece = function (req, res, next) {
    res.contentType = 'text/html';
    res.header('content-type', 'text/html');
    res.send(200, renderer.render('pages/admin/art/admin_art_create.njk', {
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
    }));
    next();
};

const postNewArtPiece = function (req, res, next) {
    req.log.info(`Reading in new image from ${req.files['art-image'].path}`);
    let imageAsBase64 = fs.readFileSync(req.files['art-image'].path, 'base64');
    artHandlerInstance.addNewArtItem(
        req.body['art-title'], req.body['art-completed-date'],
        imageAsBase64, req.body['art-tags'].split(/, ?/),
        req.body['art-notes']
    ).then((savedArt) => {
        res.redirect(303, `/admin/art/${savedArt._id}`, next);
    }, rejection => {
        req.log.warn({ error: rejection });
        res.redirect(303, '/admin/art/new', next);
    });
};

const viewArtPiece = function (req, res, next) {
    artHandlerInstance.findArtByRawId(req.params['artId']).then((picture) => {
        res.contentType = 'text/html';
        res.header('content-type', 'text/html');
        res.send(200, renderer.render('pages/admin/art/admin_art_view_single.njk', {
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
        }));
        next();
    });
};

const viewEditArtPiece = function (req, res, next) {
    artHandlerInstance.findArtByRawId(req.params['artId']).then((picture) => {
        res.contentType = 'text/html';
        res.header('content-type', 'text/html');
        res.send(200, renderer.render('pages/admin/art/admin_art_edit_single.njk', {
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
        }));
        next();
    });
};

const submitEditedArtPiece = function (req, res, next) {
    artHandlerInstance.updateExistingArtPiece(
        req.params['artId'], req.body['art-title'],
        req.body['art-completed-date'], req.files['art-image'],
        req.body['art-tags'].split(/, ?/), req.body['art-notes']
    ).then(() => {
        res.redirect(303, `/admin/art/${req.params['artId']}`, next);
    }, rejection => {
        req.log.warn({ art_id: req.params['artId'], error: rejection });
        res.redirect(303, `/admin/art/${req.params['artId']}`, next);
    });
};

const viewDeleteArtPiece = function (req, res, next) {
    artHandlerInstance.findArtByRawId(req.params['artId']).then((picture) => {
        res.contentType = 'text/html';
        res.header('content-type', 'text/html');
        res.send(200, renderer.render('pages/admin/art/admin_art_delete_single.njk', {
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
        }));
        next();
    });
};

const deleteArtPiece = function (req, res, next) {
    artHandlerInstance.deleteArt(req.params['artId']).then(() => {
        res.redirect(303, '/admin/art/', next);
    }, rejection => {
        req.log.warn({ art_id: req.params['artId'], error: rejection });
        res.redirect(303, `/admin/art/${req.params['artId']}`, next);
    });
};

module.exports = (server) => {
    server.get('/admin/art', testLoggedIn, viewAllArtPieces);
    server.get('/admin/art/new', testLoggedIn, viewCreateNewArtPiece);
    server.post('/admin/art/new', testLoggedIn, postNewArtPiece);
    server.get('/admin/art/:artId', testLoggedIn, viewArtPiece);
    server.get('/admin/art/:artId/edit', testLoggedIn, viewEditArtPiece);
    server.post('/admin/art/:artId/edit', testLoggedIn, submitEditedArtPiece);
    server.get('/admin/art/:artId/delete', testLoggedIn, viewDeleteArtPiece);
    server.post('/admin/art/:artId/delete', testLoggedIn, deleteArtPiece);
};
