/*
 * MIT License
 *
 * Copyright (c) 2017 Matthew D. Ball
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

'use strict';

const config = require('config');
const express = require('express');
const nunjucks = require('nunjucks');
const nunjucksDate = require('nunjucks-date');
const path = require('path');
const favicon = require('serve-favicon');
const morgan = require('morgan');
const loggingSystem = require('./lib/Logger');
const logger = loggingSystem.getLogger('master');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const nunjucksFilters = require('./middleware/NunjucksFilters');
const sessionGenerator = require('./middleware/session_generator');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'njk');

const njk = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(app.get('views'), {
        autoescape: true,
        watch: true
    })
);
njk.express(app);
njk.addFilter('date', nunjucksDate);
nunjucksFilters(njk);

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicons', 'favicon.ico')));

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser(config.get('cookies.passphrase')));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use(express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use(express.static(path.join(__dirname, 'node_modules/popper.js/dist')));
app.use(express.static(path.join(__dirname, 'node_modules/font-awesome')));

app.use(sessionGenerator);

app.use('/', require('./routes/index'));

// catch 404 and forward to error handler
app.use(require('./journey/generate_404'));

// error handler
app.use(require('./journey/render_error'));

module.exports = app;
