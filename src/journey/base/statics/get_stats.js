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

const moment = require('moment');
const envs = process.env;

const renderer = require('../../../lib/renderer').nunjucksRenderer();

const getStatistics = async (req, res, next) => {
  res.contentType = 'text/html';
  res.header('content-type', 'text/html');
  res.send(200, renderer.render('pages/stats.njk', {
    top_page: {
      title:     'Statistics',
      tagline:   'Some statistics that relate directly to the site',
      fa_type:   'fas',
      fa_choice: 'fa-clipboard-check',
    },

    content: {
      time:    moment(),
      version: envs.NPM_PACKAGE_VERSION,
    },

    head: {
      title:        'J4Numbers :: Statistics',
      description:  'Home to the wild things',
      current_page: 'stats',
    },
  }));
  next();
};

module.exports = (server) => {
  server.get('/stats', getStatistics);
};
