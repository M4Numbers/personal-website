// MIT License
//
// Copyright (c) 2019 Jayne Doe
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

const testLoggedIn = require('../../journey/misc/test_admin_logged_in');

const viewAllManga = require('../../journey/admin/manga/view_all_manga');
const viewSingleManga = require('../../journey/admin/manga/view_single_manga');
const viewEditSingleManga = require('../../journey/admin/manga/view_edit_single_manga');
const editSingleManga = require('../../journey/admin/manga/edit_single_manga');
const refreshMangaDatabase = require('../../journey/admin/manga/refresh_manga_database');

module.exports = (server) => {
  server.get('/admin/manga', testLoggedIn, viewAllManga);
  server.get('/admin/manga/:mangaId', testLoggedIn, viewSingleManga);
  server.get('/admin/manga/:mangaId/edit', testLoggedIn, viewEditSingleManga);
  server.post('/admin/manga/:mangaId/edit', testLoggedIn, editSingleManga);
  server.post('/admin/manga/refresh', testLoggedIn, refreshMangaDatabase);
};
