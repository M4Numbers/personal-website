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

const StaticHandler = require("../lib/StaticHandler");
const staticHandlerInstance = StaticHandler.getHandler();
const StaticDocumentTypes = require("../lib/StaticDocumentTypes");

/* GET home page. */
router.get("/map", function (req, res, next) {
    res.render("./pages/sitemap", {
        top_page: {
            title: "Sitemap",
            tagline: "If you want to get somewhere, why not use the links below to navigate!",
            fa_type: "fas",
            fa_choice: "fa-map"
        },

        head: {
            title: "M4Numbers :: Sitemap",
            description: "Home to the wild things",
            current_page: "sitemap"
        }
    });
});

router.get("/about", function (req, res, next) {
    staticHandlerInstance.findStatic(StaticDocumentTypes.ABOUT_ME).then(staticContent => {
        res.render("./pages/about", {
            top_page: {
                title: "About Me",
                tagline: "If you were looking for a general overview about yours truly, you've come to the right place!",
                image_src: "images/handle_logo.png",
                image_alt: "My logo that I use to represent myself"
            },

            content: {
                title: "About Me",
                text: markdown.render(staticContent.content || ""),
            },

            head: {
                title: "M4Numbers :: About Me",
                description: "Home to the wild things",
                current_page: "about"
            }
        });
    }, next);
});

router.get("/contact", function (req, res, next) {
    staticHandlerInstance.findStatic(StaticDocumentTypes.CONTACT_ME).then(staticContent => {
        res.render("./pages/contact", {
            top_page: {
                title: "Contact Me",
                tagline: "If, for whatever reason, you want to get in touch with me, use the links below to find my other" +
                " hidey-holes.",
                fa_type: "fas",
                fa_choice: "fa-phone"
            },

            content: {
                options: staticContent.content
            },

            head: {
                title: "M4Numbers :: Contact Me",
                description: "Home to the wild things",
                current_page: "contact"
            }
        });
    }, next);
});

module.exports = router;
