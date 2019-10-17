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

const viewAllKinks = require('../../journey/admin/kinks/view_all_kinks');
const viewCreateNewKink = require('../../journey/admin/kinks/view_create_new_kink');
const createNewKink = require('../../journey/admin/kinks/create_new_kink');
const viewSingleKink = require('../../journey/admin/kinks/view_single_kink');
const viewEditSingleKink = require('../../journey/admin/kinks/view_edit_single_kink');
const editSingleKink = require('../../journey/admin/kinks/edit_single_kink');
const viewDeleteSingleKink = require('../../journey/admin/kinks/view_delete_single_kink');
const deleteSingleKink = require('../../journey/admin/kinks/delete_single_file');

module.exports = (server) => {
  server.get('/admin/fetishes', testLoggedIn, viewAllKinks);
  server.get('/admin/fetishes/new', testLoggedIn, viewCreateNewKink);
  server.post('/admin/fetishes/new', testLoggedIn, createNewKink);
  server.get('/admin/fetishes/:kinkId', testLoggedIn, viewSingleKink);
  server.get('/admin/fetishes/:kinkId/edit', testLoggedIn, viewEditSingleKink);
  server.post('/admin/fetishes/:kinkId/edit', testLoggedIn, editSingleKink);
  server.get('/admin/fetishes/:kinkId/delete', testLoggedIn, viewDeleteSingleKink);
  server.post('/admin/fetishes/:kinkId/delete', testLoggedIn, deleteSingleKink);
};
