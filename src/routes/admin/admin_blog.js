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

const errors = require('restify-errors');

const testLoggedIn = require('../../journey/misc/test_admin_logged_in');

const BlogHandler = require('../../lib/BlogHandler');
const blogHandlerInstance = BlogHandler.getHandler();
const renderer = require('../../lib/renderer').nunjucksRenderer();

const viewBlogHome = function (req, res, next) {
    Promise.all(
        [
            blogHandlerInstance.findBlogs(Math.max(0, ((req.query['page'] || 1) - 1)) * 10, 10, {'time_posted': -1}, false),
            blogHandlerInstance.getTotalBlogCount(false)
        ]
    ).then(([blogs, totalCount]) => {
        res.contentType = 'text/html';
        res.header('content-type', 'text/html');
        res.send(200, renderer.render('pages/admin/blogs/admin_blog_view.njk', {
            top_page: {
                title: 'Administrator Toolkit',
                tagline: 'All the functions that the administrator of the site has available to them',
                fa_type: 'fas',
                fa_choice: 'fa-toolbox'
            },

            content: {
                blogs: blogs
            },

            pagination: {
                base_url: '/admin/blog?',
                total: totalCount,
                page: Math.max((req.query['page'] || 1), 1),
                page_size: 10
            },

            head: {
                title: 'J4Numbers',
                description: 'Home to the wild things',
                current_page: 'admin',
                current_sub_page: 'blog-view'
            }
        }));
        next();
    });
};

const createNewBlog = function (req, res, next) {
    res.contentType = 'text/html';
    res.header('content-type', 'text/html');
    res.send(200, renderer.render('pages/admin/blogs/admin_blog_create.njk', {
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
            current_sub_page: 'blog-edit'
        }
    }));
    next();
};

const postNewBlog = function (req, res, next) {
    blogHandlerInstance.insertBlog(
        req.body['blog-title'], req.body['blog-text'],
        req.body['blog-visible'] === 'Y', req.body['blog-tags'].split(/, ?/)
    ).then((savedBlog) => {
        console.log(savedBlog);
        res.redirect(303, `/admin/blog/${savedBlog._id}`, next);
        next();
    }, rejection => {
        req.log.warn({error: rejection});
        res.redirect(303, '/admin/blog/new', next);
    });
};

const viewOneBlog = function (req, res, next) {
    res.log.info(`Searching for blog of id ${req.params['blogId']}`);
    blogHandlerInstance.findBlog(req.params['blogId']).then((blog) => {
        res.contentType = 'text/html';
        res.header('content-type', 'text/html');
        const page = renderer.render('pages/admin/blogs/admin_blog_view_single.njk', {
            top_page: {
                title: 'Administrator Toolkit',
                tagline: 'All the functions that the administrator of the site has available to them',
                fa_type: 'fas',
                fa_choice: 'fa-toolbox'
            },

            content: {
                blog: blog
            },

            head: {
                title: 'J4Numbers',
                description: 'Home to the wild things',
                current_page: 'admin',
                current_sub_page: 'blog-view'
            }
        });
        res.send(200, page);
        next();
    }, reject => next(new errors.InternalServerError(reject)))
        .catch(rejected => next(new errors.InternalServerError(rejected)));
};

const viewEditDetails = function (req, res, next) {
    blogHandlerInstance.findBlog(req.params['blogId']).then((blog) => {
        res.contentType = 'text/html';
        res.header('content-type', 'text/html');
        res.send(200, renderer.render('pages/admin/blogs/admin_blog_edit_single.njk', {
            top_page: {
                title: 'Administrator Toolkit',
                tagline: 'All the functions that the administrator of the site has available to them',
                fa_type: 'fas',
                fa_choice: 'fa-toolbox'
            },

            content: {
                blog: blog
            },

            head: {
                title: 'J4Numbers',
                description: 'Home to the wild things',
                current_page: 'admin',
                current_sub_page: 'blog-edit'
            }
        }));
        next();
    });
};

const postEditDetails = function (req, res, next) {
    blogHandlerInstance.editBlog(
        req.params['blogId'], req.body['blog-title'],
        req.body['blog-text'], req.body['blog-visible'] === 'Y',
        req.body['blog-tags'].split(/, ?/)
    ).then(() => {
        res.redirect(303, `/admin/blog/${req.params['blogId']}`, next);
    }, rejection => {
        req.log.warn({blog_id: req.params['blogId'], error: rejection});
        res.redirect(303, `/admin/blog/${req.params['blogId']}`, next);
    });
};

const viewDeleteBlog =  function (req, res, next) {
    blogHandlerInstance.findBlog(req.params['blogId']).then((blog) => {
        res.contentType = 'text/html';
        res.header('content-type', 'text/html');
        res.send(200, renderer.render('pages/admin/blogs/admin_blog_delete_single.njk', {
            top_page: {
                title: 'Administrator Toolkit',
                tagline: 'All the functions that the administrator of the site has available to them',
                fa_type: 'fas',
                fa_choice: 'fa-toolbox'
            },

            content: {
                blog: blog
            },

            head: {
                title: 'J4Numbers',
                description: 'Home to the wild things',
                current_page: 'admin',
                current_sub_page: 'blog-delete'
            }
        }));
        next();
    });
};

const deleteOneBlog = function (req, res, next) {
    blogHandlerInstance.deleteBlog(req.params['blogId']).then(() => {
        res.redirect(303, '/admin/blog/', next);
    }, rejection => {
        req.log.warn({blog_id: req.params['blogId'], error: rejection});
        res.redirect(303, `/admin/blog/${req.params['blogId']}`, next);
    });
};

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
