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

const KinkHandler = require('../../lib/KinkHandler');
const kinkHandlerInstance = KinkHandler.getHandler();

const viewAllKinks = function (req, res, next) {
  Promise.all(
      [
        kinkHandlerInstance.findKinks(Math.max(0, ((req.query['page'] || 1) - 1)) * 20, 20, {'time_posted': -1}, false),
        kinkHandlerInstance.getTotalKinkCount(false)
      ]
  ).then(([kinks, totalCount]) => {
    res.contentType = 'text/html';
    res.header('content-type', 'text/html');
    res.send(200, renderer.render('pages/admin/kinks/admin_kink_view.njk', {
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
    }));
    next();
  });
};

const viewCreateNewKink = function (req, res, next) {
  res.contentType = 'text/html';
  res.header('content-type', 'text/html');
  res.send(200, renderer.render('pages/admin/kinks/admin_kink_create.njk', {
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
  }));
  next();
};

const createNewKink = function (req, res, next) {
  kinkHandlerInstance.addNewKink(
      req.body['kink-name'], req.body['kink-description'],
      req.body['kink-status'], req.body['kink-experience'],
      req.body['kink-image'], req.body['kink-tags'].split(/, ?/)
  ).then((savedKink) => {
    res.redirect(303, `/admin/fetishes/${savedKink._id}`, next);
  }, rejection => {
    req.log.warn({error: rejection});
    res.redirect(303, '/admin/fetishes/new', next);
  });
};

const viewSingleKink = function (req, res, next) {
  kinkHandlerInstance.findKinkByRawId(req.params['kinkId']).then((kink) => {
    res.contentType = 'text/html';
    res.header('content-type', 'text/html');
    res.send(200, renderer.render('pages/admin/kinks/admin_kink_view_single.njk', {
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
    }));
    next();
  });
};

const viewEditSingleKink = function (req, res, next) {
  kinkHandlerInstance.findKinkByRawId(req.params['kinkId']).then((kink) => {
    res.contentType = 'text/html';
    res.header('content-type', 'text/html');
    res.send(200, renderer.render('pages/admin/kinks/admin_kink_edit_single.njk', {
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
    }));
    next();
  });
};

const editSingleKink = function (req, res, next) {
  kinkHandlerInstance.updateExistingKink(
      req.params['kinkId'], req.body['kink-name'],
      req.body['kink-description'], req.body['kink-status'],
      req.body['kink-experience'], req.body['kink-image'],
      req.body['kink-tags'].split(/, ?/)
  ).then(() => {
    res.redirect(303, `/admin/fetishes/${req.params['kinkId']}`, next);
  }, rejection => {
    req.log.warn({kink_id: req.params['kinkId'], error: rejection});
    res.redirect(303, `/admin/fetishes/${req.params['kinkId']}`, next);
  });
};

const viewDeleteSingleKink = function (req, res, next) {
  kinkHandlerInstance.findKinkByRawId(req.params['kinkId']).then((kink) => {
    res.contentType = 'text/html';
    res.header('content-type', 'text/html');
    res.send(200, renderer.render('pages/admin/kinks/admin_kink_delete_single.njk', {
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
    }));
    next();
  });
};

const deleteSingleKink = function (req, res, next) {
  kinkHandlerInstance.deleteKink(req.params['kinkId']).then(() => {
    res.redirect(303, '/admin/fetishes/', next);
  }, rejection => {
    req.log.warn({kink_id: req.params['kinkId'], error: rejection});
    res.redirect(303, `/admin/fetishes/${req.params['kinkId']}`, next);
  });
};

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
