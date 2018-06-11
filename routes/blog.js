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
const MongoDbHandler = require("../lib/MongoDbHandler");
const mongoInstance = MongoDbHandler.getMongo();

/* GET all blog posts */
router.get("/", function (req, res, next) {
    Promise.all(
        [
            mongoInstance.findBlogs(Math.max(0, ((req.query["page"] || 1) - 1)) * 10, 10, "_id"),
            mongoInstance.getTotalBlogCount()
        ]
    ).then(([blogs, totalCount]) => {
        res.render("./pages/blog_all", {
            top_page: {
                title: "My Blog",
                tagline: "A list of scribbled things that have been made over the years.",
                image_src: "/images/handle_logo.png",
                image_alt: "Main face of the site"
            },

            content: {
                blogs: blogs
            },

            pagination: {
                base: "/blog",
                total: totalCount,
                page: Math.max((req.query["page"] || 1), 1),
            },

            head: {
                title: "M4Numbers :: Blog",
                description: "Home to the wild things",
                current_page: "blog"
            }
        });
    }, rejection => {
        next(rejection);
    });
});

/* GET single blog post page. */
router.get("/:blogId", function (req, res, next) {
    mongoInstance.findBlog(req.params["blogId"])
        .then(blogPost => {
            res.render("./pages/blog_single", {
                top_page: {
                    title: blogPost.long_title,
                    blog_tags: blogPost.tags,
                    image_src: "/images/handle_logo.png",
                    image_alt: "Main face of the site",
                },

                content: {
                    blog_text: markdown.render(blogPost.full_text)
                },

                head: {
                    title: `M4Numbers :: ${blogPost.long_title}`,
                    description: "Home to the wild things",
                    current_page: "blog"
                }
            });
        }, rejection => {
            next(rejection);
        });
});

module.exports = router;
