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

const errors = require('restify-errors');

const testLoggedIn = require('../../journey/misc/test_admin_logged_in');
const renderer = require('../../lib/renderer').nunjucksRenderer();

const MangaHandler = require('../../lib/MangaHandler');
const mangaHandlerInstance = MangaHandler.getHandler();
const importHandler = require('../../lib/ImportHandler');

const viewAllManga = async function (req, res, next) {
    try {
        const books = await mangaHandlerInstance.findMangaBooks(
            Math.max(0, ((req.query['page'] || 1) - 1)) * 10,
            10,
            {'title.romaji': 1},
            false
        );
        const bookCount = await mangaHandlerInstance.getTotalBookCount(false);

        res.contentType = 'text/html';
        res.header('content-type', 'text/html');
        res.send(200, renderer.render('pages/admin/manga/admin_manga_view.njk', {
            top_page: {
                title: 'Administrator Toolkit',
                tagline: 'All the functions that the administrator of the site has available to them',
                fa_type: 'fas',
                fa_choice: 'fa-toolbox'
            },

            content: {
                books: books
            },

            pagination: {
                base_url: '/admin/manga?',
                total: bookCount,
                page: Math.max((req.query['page'] || 1), 1),
                page_size: 10
            },

            head: {
                title: 'J4Numbers',
                description: 'Home to the wild things',
                current_page: 'admin',
                current_sub_page: 'manga-view'
            }
        }));
        next();
    } catch (e) {
        req.log.warn(`Issue when getting a list of all mangas :: ${e.message}`);
        next(new errors.InternalServerError(e.message));
    }
};

const viewSingleManga = async function (req, res, next) {
    try {
        const book = await mangaHandlerInstance.findMangaByRawId(req.params['mangaId']);
        res.contentType = 'text/html';
        res.header('content-type', 'text/html');
        res.send(200, renderer.render('pages/admin/manga/admin_manga_view_single.njk', {
            top_page: {
                title: 'Administrator Toolkit',
                tagline: 'All the functions that the administrator of the site has available to them',
                fa_type: 'fas',
                fa_choice: 'fa-toolbox'
            },

            content: {
                book: book
            },

            head: {
                title: 'J4Numbers',
                description: 'Home to the wild things',
                current_page: 'admin',
                current_sub_page: 'manga-view'
            }
        }));
        next();
    } catch (e) {
        req.log.warn(`Issue while trying to fetch manga :: ${e.message}`);
        next(new errors.InternalServerError(e.message));
    }
};

const viewEditSingleManga = async function (req, res, next) {
    try {
        const book = await mangaHandlerInstance.findMangaByRawId(req.params['mangaId'])
        res.contentType = 'text/html';
        res.header('content-type', 'text/html');
        res.send(200, renderer.render('pages/admin/manga/admin_manga_edit_single.njk', {
            top_page: {
                title: 'Administrator Toolkit',
                tagline: 'All the functions that the administrator of the site has available to them',
                fa_type: 'fas',
                fa_choice: 'fa-toolbox'
            },

            content: {
                book: book
            },

            head: {
                title: 'J4Numbers',
                description: 'Home to the wild things',
                current_page: 'admin',
                current_sub_page: 'manga-edit'
            }
        }));
        next();
    } catch (e) {
        req.log.warn(`Error while trying to view the edit view of a manga :: ${e.message}`);
        next(new errors.InternalServerError(e.message));
    }
};

const editSingleManga = async function (req, res, next) {
    try {
        await mangaHandlerInstance.editManga(
            req.params['mangaId'], req.body['book-review'],
            req.body['book-tags'].split(/, ?/)
        );
        res.redirect(303, `/admin/manga/${req.params['mangaId']}`, next);
    } catch (rejection) {
        req.log.warn({ manga_id: req.params['mangaId'], error: rejection });
        res.redirect(303, `/admin/manga/${req.params['mangaId']}`, next);
    }
};

const refreshMangaDatabase = async function (req, res, next) {
    try {
        req.log.info('Importing new manga into mongo...');
        await importHandler.importMangaIntoMongo();
        res.contentType = 'application/json';
        res.header('content-type', 'application/json');
        res.send(200, {});
        next();
    } catch (e) {
        req.log.warn(`Error found when refreshing manga list :: ${e.message}`);
        next(new errors.InternalServerError(e.message));
    }
};

module.exports = (server) => {
    server.get('/admin/manga', testLoggedIn, viewAllManga);
    server.get('/admin/manga/:mangaId', testLoggedIn, viewSingleManga);
    server.get('/admin/manga/:mangaId/edit', testLoggedIn, viewEditSingleManga);
    server.post('/admin/manga/:mangaId/edit', testLoggedIn, editSingleManga);
    server.post('/admin/manga/refresh', testLoggedIn, refreshMangaDatabase);
};
