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

const viewBlogHome = require('../../journey/admin/blog/view_all_blogs');
const createNewBlog = require('../../journey/admin/blog/view_create_new_blog');
const postNewBlog = require('../../journey/admin/blog/create_new_blog');
const viewOneBlog = require('../../journey/admin/blog/view_one_blog');
const viewEditDetails = require('../../journey/admin/blog/view_edit_one_blog');
const postEditDetails = require('../../journey/admin/blog/edit_one_blog');
const viewDeleteBlog = require('../../journey/admin/blog/view_delete_one_blog');
const deleteOneBlog = require('../../journey/admin/blog/delete_one_blog');

module.exports = (server) => {
  server.get('/admin/blog', testLoggedIn, viewBlogHome);
  server.get('/admin/blog/new', testLoggedIn, createNewBlog);
  server.post('/admin/blog/new', testLoggedIn, postNewBlog);
  server.get('/admin/blog/:blogId', testLoggedIn, viewOneBlog);
  server.get('/admin/blog/:blogId/edit', testLoggedIn, viewEditDetails);
  server.post('/admin/blog/:blogId/edit', testLoggedIn, postEditDetails);
  server.get('/admin/blog/:blogId/delete', testLoggedIn, viewDeleteBlog);
  server.post('/admin/blog/:blogId/delete', testLoggedIn, deleteOneBlog);
};
