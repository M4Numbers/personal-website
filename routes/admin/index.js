/*
 * MIT License
 *
 * Copyright (c) 2019 Matthew D. Ball
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

const router = require('express').Router();

router.use('/login', require('./auth'));

router.use(require('../../journey/misc/test_admin_logged_in'));

router.use('/blog', require('./admin_blog'));
router.use('/projects', require('./admin_projects'));
router.use('/art', require('./admin_art'));
router.use('/stories', [
    require('./admin_stories'),
    require('./admin_chapters')
]);
router.use('/anime', require('./admin_anime'));
router.use('/manga', require('./admin_manga'));
router.use('/fetishes', require('./admin_kinks'));
router.use('/statics', require('./admin_static'));

router.use('/', require('./admin_homepage'));

module.exports = router;
