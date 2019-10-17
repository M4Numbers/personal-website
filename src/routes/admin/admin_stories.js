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

const viewAllStories = require('../../journey/admin/stories/view_all_stories');
const viewCreateNewStory = require('../../journey/admin/stories/view_create_new_story');
const createNewStory = require('../../journey/admin/stories/create_new_story');
const viewSingleStory = require('../../journey/admin/stories/view_single_story');
const viewEditSingleStory = require('../../journey/admin/stories/view_edit_single_story');
const editSingleStory = require('../../journey/admin/stories/edit_single_story');
const viewDeleteSingleStory = require('../../journey/admin/stories/view_delete_single_story');
const deleteSingleStory = require('../../journey/admin/stories/delete_single_story');

module.exports = (server) => {
  server.get('/admin/stories', testLoggedIn, viewAllStories);
  server.get('/admin/stories/new', testLoggedIn, viewCreateNewStory);
  server.post('/admin/stories/new', testLoggedIn, createNewStory);
  server.get('/admin/stories/:storyId', testLoggedIn, viewSingleStory);
  server.get('/admin/stories/:storyId/edit', testLoggedIn, viewEditSingleStory);
  server.post('/admin/stories/:storyId/edit', testLoggedIn, editSingleStory);
  server.get('/admin/stories/:storyId/delete', testLoggedIn, viewDeleteSingleStory);
  server.post('/admin/stories/:storyId/delete', testLoggedIn, deleteSingleStory);
};
