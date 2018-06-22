/*
 * MIT License
 *
 * Copyright (c) 2018 Matthew D. Ball
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

const express = require("express");
const router = express.Router();

const markdown = require("markdown-it")();
const BlogHandler = require("../lib/BlogHandler");
const blogHandlerInstance = BlogHandler.getHandler();

router.get("/", function (req, res) {
    Promise.all(
        [
            blogHandlerInstance.findBlogs(Math.max(0, ((req.query["page"] || 1) - 1)) * 10, 10, {"time_posted": -1}, false),
            blogHandlerInstance.getTotalBlogCount(false)
        ]
    ).then(([blogs, totalCount]) => {
        res.render("./pages/admin/admin_blog_view", {
            top_page: {
                title: "Administrator Toolkit",
                tagline: "All the functions that the administrator of the site has available to them",
                fa_type: "fas",
                fa_choice: "fa-toolbox"
            },

            content: {
                blogs: blogs
            },

            pagination: {
                base: "/admin/blog",
                total: totalCount,
                page: Math.max((req.query["page"] || 1), 1),
            },

            head: {
                title: "M4Numbers",
                description: "Home to the wild things",
                current_page: "admin",
                current_sub_page: "blog-view"
            }
        });
    });
});

router.get("/new", function (req, res) {
    res.render("./pages/admin/admin_blog_create", {
        top_page: {
            title: "Administrator Toolkit",
            tagline: "All the functions that the administrator of the site has available to them",
            fa_type: "fas",
            fa_choice: "fa-toolbox"
        },

        head: {
            title: "M4Numbers",
            description: "Home to the wild things",
            current_page: "admin",
            current_sub_page: "blog-edit"
        }
    });
});

router.post("/new", function (req, res) {
    blogHandlerInstance.insertBlog(
        req.body["blog-title"], req.body["blog-text"],
        req.body["blog-visible"] === "Y", req.body["blog-tags"].split(/, ?/)
    ).then((savedBlog) => {
        res.redirect(303, `/admin/blog/${savedBlog._id}`);
    }, rejection => {
        res.cookie("blog-create-error", {error: rejection}, {signed: true, maxAge: 1000});
        res.redirect(303, "/admin/blog/new");
    });
});

router.get("/:blogId", function (req, res) {
    blogHandlerInstance.findBlog(req.params["blogId"]).then((blog) => {
        res.render("./pages/admin/admin_blog_view_single", {
            top_page: {
                title: "Administrator Toolkit",
                tagline: "All the functions that the administrator of the site has available to them",
                fa_type: "fas",
                fa_choice: "fa-toolbox"
            },

            content: {
                blog: blog,
                blog_text: markdown.render(blog.full_text)
            },

            head: {
                title: "M4Numbers",
                description: "Home to the wild things",
                current_page: "admin",
                current_sub_page: "blog-view"
            }
        });
    });
});

router.get("/:blogId/edit", function (req, res) {
    blogHandlerInstance.findBlog(req.params["blogId"]).then((blog) => {
        res.render("./pages/admin/admin_blog_edit_single", {
            top_page: {
                title: "Administrator Toolkit",
                tagline: "All the functions that the administrator of the site has available to them",
                fa_type: "fas",
                fa_choice: "fa-toolbox"
            },

            content: {
                blog: blog
            },

            head: {
                title: "M4Numbers",
                description: "Home to the wild things",
                current_page: "admin",
                current_sub_page: "blog-edit"
            }
        });
    });
});

router.post("/:blogId/edit", function (req, res) {
    blogHandlerInstance.editBlog(
        req.params["blogId"], req.body["blog-title"],
        req.body["blog-text"], req.body["blog-visible"] === "Y",
        req.body["blog-tags"].split(/, ?/)
    ).then(() => {
        res.redirect(303, `/admin/blog/${req.params["blogId"]}`);
    }, rejection => {
        res.cookie("blog-update-error", {blog_id: req.params["blogId"], error: rejection}, {signed: true, maxAge: 1000});
        res.redirect(303, `/admin/blog/${req.params["blogId"]}`);
    });
});

router.get("/:blogId/delete", function (req, res) {
    blogHandlerInstance.findBlog(req.params["blogId"]).then((blog) => {
        res.render("./pages/admin/admin_blog_delete_single", {
            top_page: {
                title: "Administrator Toolkit",
                tagline: "All the functions that the administrator of the site has available to them",
                fa_type: "fas",
                fa_choice: "fa-toolbox"
            },

            content: {
                blog: blog
            },

            head: {
                title: "M4Numbers",
                description: "Home to the wild things",
                current_page: "admin",
                current_sub_page: "blog-delete"
            }
        });
    });
});

router.post("/:blogId/delete", function (req, res) {
    blogHandlerInstance.deleteBlog(req.params["blogId"]).then(() => {
        res.redirect(303, "/admin/blog/");
    }, rejection => {
        res.cookie("blog-delete-error", {blog_id: req.params["blogId"], error: rejection}, {signed: true, maxAge: 1000});
        res.redirect(303, `/admin/blog/${req.params["blogId"]}`);
    });
});

module.exports = router;
