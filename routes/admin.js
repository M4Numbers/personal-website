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

const MongoDbHandler = require("../lib/MongoDbHandler");
const mongoInstance = MongoDbHandler.getMongo();

router.get("/", function (req, res, next) {
    if (!req.signedCookies.logged_in) {
        res.redirect(303, "/login");
    } else {
        res.redirect(303, "/admin/blog");
    }
});

router.get("/blog", function (req, res, next) {
    if (!req.signedCookies.logged_in) {
        res.redirect(303, "/login");
    } else {
        Promise.all(
            [
                mongoInstance.findBlogs(Math.max(0, ((req.query["page"] || 1) - 1)) * 10, 10, {"time_posted": -1}),
                mongoInstance.getTotalBlogCount()
            ]
        ).then(([blogs, totalCount]) => {
            res.render("./pages/admin_blog_view", {
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
    }
});

module.exports = router;
