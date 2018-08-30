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

const StaticHandler = require("../../lib/StaticHandler");
const staticHandlerInstance = StaticHandler.getHandler();
const StaticDocumentTypes = require("../../lib/StaticDocumentTypes");

const blogAdmin = require("./me_blog");

router.use((req, res, next) => {
    if (!req.signedCookies.knows_me) {
        res.redirect(303, "/hobbies/me/login");
    } else {
        next();
    }
});

router.get("/", function (req, res, next) {
    res.redirect(303, "/hobbies/me/overview");
});

router.use("/extended-blog", [blogAdmin]);

router.get("/overview", function (req, res, next) {
    staticHandlerInstance.findStatic(StaticDocumentTypes.KNOWING_ME).then(staticContent => {
        res.render("./pages/me/me_index", {
            top_page: {
                title: "Welcome to Me",
                tagline: "If you were looking for a more personal overview about yours truly, you've come to the right place!",
                image_src: "/images/handle_logo.png",
                image_alt: "My logo that I use to represent myself"
            },

            content: {
                title: "Welcome to Me",
                text: markdown.render(staticContent.content || ""),
            },

            head: {
                title: "M4Numbers :: Welcome to Me",
                description: "Home to the wild things",
                current_page: "hobbies",
                current_sub_page: "me",
                current_sub_sub_page: "overview"
            }
        });
    }, next);
});

module.exports = router;
