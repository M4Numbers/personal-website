/*
 * MIT License
 *
 * Copyright (c) 2019 Jayne Doe
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

const handleLoginEndpoints = require('./auth');
const handleAdminHomepage = require('./admin_homepage');
const handleAdminBlogEndpoints = require('./admin_blog');
const handleAdminProjectEndpoints = require('./admin_projects');
const handleAdminArtEndpoints = require('./admin_art');
const handleAdminStoryEndpoints = require('./admin_stories');
const handleAdminChapterEndpoints = require('./admin_chapters');
// const handleAdminKinkEndpoints = require('./admin_kinks');
const handleAdminAnimeEndpoints = require('./admin_anime');
const handleAdminMangaEndpoints = require('./admin_manga');
const handleAdminStaticEndpoints = require('./admin_static');

module.exports = (server) => {
    handleLoginEndpoints(server);
    handleAdminHomepage(server);
    handleAdminBlogEndpoints(server);
    handleAdminProjectEndpoints(server);
    handleAdminArtEndpoints(server);
    handleAdminStoryEndpoints(server);
    handleAdminChapterEndpoints(server);
    // handleAdminKinkEndpoints(server);
    handleAdminAnimeEndpoints(server);
    handleAdminMangaEndpoints(server);
    handleAdminStaticEndpoints(server);
    return server;
};
