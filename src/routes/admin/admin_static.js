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

const statics = require('../../lib/StaticDocumentTypes');

const { extractStatic } = require('../../journey/admin/statics/misc');
const viewAllStatics = require('../../journey/admin/statics/view_all_statics');
const viewSingleTextStaticDocument = require('../../journey/admin/statics/view_static_text_document');
const viewSingleListContactStaticDocument = require('../../journey/admin/statics/view_static_contact_document');
const viewSingleListSiteMapStaticDocument = require('../../journey/admin/statics/view_static_sitemap_document');
const editSingleTextStaticDocument = require('../../journey/admin/statics/view_edit_static_text_document');
const editSingleListContactStaticDocument = require('../../journey/admin/statics/view_edit_static_contact_document');
const editSingleListSiteMapStaticDocument = require('../../journey/admin/statics/view_edit_static_sitemap_document');
const editTextDocument = require('../../journey/admin/statics/edit_static_text_document');
const editSitemapListDocument = require('../../journey/admin/statics/edit_static_sitemap_document');
const editContactListDocument = require('../../journey/admin/statics/edit_static_contact_document');

module.exports = (server) => {
  server.get('/admin/statics', testLoggedIn, viewAllStatics);

  server.get(`/admin/statics/${statics.ABOUT_ME}`, testLoggedIn, extractStatic, viewSingleTextStaticDocument);
  server.get(`/admin/statics/${statics.KINK_WARNING}`, testLoggedIn, extractStatic, viewSingleTextStaticDocument);
  server.get(`/admin/statics/${statics.KNOWING_ME}`, testLoggedIn, extractStatic, viewSingleTextStaticDocument);
  server.get(`/admin/statics/${statics.CONTACT_ME}`, testLoggedIn, extractStatic, viewSingleListContactStaticDocument);
  server.get(`/admin/statics/${statics.SITEMAP}`, testLoggedIn, extractStatic, viewSingleListSiteMapStaticDocument);

  server.get(`/admin/statics/${statics.ABOUT_ME}/edit`, testLoggedIn, extractStatic, editSingleTextStaticDocument);
  server.get(`/admin/statics/${statics.KINK_WARNING}/edit`, testLoggedIn, extractStatic, editSingleTextStaticDocument);
  server.get(`/admin/statics/${statics.KNOWING_ME}/edit`, testLoggedIn, extractStatic, editSingleTextStaticDocument);
  server.get(`/admin/statics/${statics.CONTACT_ME}/edit`, testLoggedIn, extractStatic, editSingleListContactStaticDocument);
  server.get(`/admin/statics/${statics.SITEMAP}/edit`, testLoggedIn, extractStatic, editSingleListSiteMapStaticDocument);

  server.post(`/admin/statics/${statics.ABOUT_ME}/edit`, testLoggedIn, extractStatic, editTextDocument);
  server.post(`/admin/statics/${statics.KINK_WARNING}/edit`, testLoggedIn, extractStatic, editTextDocument);
  server.post(`/admin/statics/${statics.KNOWING_ME}/edit`, testLoggedIn, extractStatic, editTextDocument);
  server.post(`/admin/statics/${statics.CONTACT_ME}/edit`, testLoggedIn, extractStatic, editContactListDocument);
  server.post(`/admin/statics/${statics.SITEMAP}/edit`, testLoggedIn, extractStatic, editSitemapListDocument);
};
