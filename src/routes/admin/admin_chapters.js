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

// All endpoints below are prefixed with `/admin/stories/:storyId/chapter`

const viewCreateNewChapter = require('../../journey/admin/chapters/view_create_new_chapter');
const createNewChapter = require('../../journey/admin/chapters/create_new_chapter');
const viewSingleChapter = require('../../journey/admin/chapters/view_one_chapter');
const viewEditSingleChapter = require('../../journey/admin/chapters/view_edit_one_chapter');
const editSingleChapter = require('../../journey/admin/chapters/edit_one_chapter');
const viewDeleteSingleChapter = require('../../journey/admin/chapters/view_delete_one_chapter');
const deleteSingleChapter = require('../../journey/admin/chapters/delete_one_chapter');

module.exports = (server) => {
  server.get('/admin/stories/:storyId/chapter/new', testLoggedIn, viewCreateNewChapter);
  server.post('/admin/stories/:storyId/chapter/new', testLoggedIn, createNewChapter);
  server.get('/admin/stories/:storyId/chapter/:chapterNumber', testLoggedIn, viewSingleChapter);
  server.get(
    '/admin/stories/:storyId/chapter/:chapterNumber/edit',
    testLoggedIn, viewEditSingleChapter,
  );
  server.post(
    '/admin/stories/:storyId/chapter/:chapterNumber/edit',
    testLoggedIn, editSingleChapter,
  );
  server.get(
    '/admin/stories/:storyId/chapter/:chapterNumber/delete',
    testLoggedIn, viewDeleteSingleChapter,
  );
  server.post(
    '/admin/stories/:storyId/chapter/:chapterNumber/delete',
    testLoggedIn, deleteSingleChapter,
  );
};
