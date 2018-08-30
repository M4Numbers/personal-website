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
const MangaHandler = require("../../lib/MangaHandler");
const mangaHandlerInstance = MangaHandler.getHandler();
const importHandler = require("../../lib/ImportHandler");

const loggingSystem = require("./../../lib/Logger");
const logger = loggingSystem.getLogger("master");

router.get("/", function (req, res) {
    Promise.all(
        [
            mangaHandlerInstance.findMangaBooks(Math.max(0, ((req.query["page"] || 1) - 1)) * 10, 10, {"title.romaji": 1}, false),
            mangaHandlerInstance.getTotalBookCount(false)
        ]
    ).then(([books, totalCount]) => {
        res.render("./pages/admin/admin_manga_view", {
            top_page: {
                title: "Administrator Toolkit",
                tagline: "All the functions that the administrator of the site has available to them",
                fa_type: "fas",
                fa_choice: "fa-toolbox"
            },

            content: {
                books: books
            },

            pagination: {
                base_url: "/admin/manga?",
                total: totalCount,
                page: Math.max((req.query["page"] || 1), 1),
                page_size: 10
            },

            head: {
                title: "M4Numbers",
                description: "Home to the wild things",
                current_page: "admin",
                current_sub_page: "manga-view"
            }
        });
    });
});

router.get("/:mangaId", function (req, res) {
    mangaHandlerInstance.findMangaByRawId(req.params["mangaId"]).then((book) => {
        res.render("./pages/admin/admin_manga_view_single", {
            top_page: {
                title: "Administrator Toolkit",
                tagline: "All the functions that the administrator of the site has available to them",
                fa_type: "fas",
                fa_choice: "fa-toolbox"
            },

            content: {
                book: book,
                book_text: markdown.render(book.review || "")
            },

            head: {
                title: "M4Numbers",
                description: "Home to the wild things",
                current_page: "admin",
                current_sub_page: "manga-view"
            }
        });
    });
});

router.get("/:mangaId/edit", function (req, res) {
    mangaHandlerInstance.findMangaByRawId(req.params["mangaId"]).then((book) => {
        res.render("./pages/admin/admin_manga_edit_single", {
            top_page: {
                title: "Administrator Toolkit",
                tagline: "All the functions that the administrator of the site has available to them",
                fa_type: "fas",
                fa_choice: "fa-toolbox"
            },

            content: {
                book: book
            },

            head: {
                title: "M4Numbers",
                description: "Home to the wild things",
                current_page: "admin",
                current_sub_page: "manga-edit"
            }
        });
    });
});

router.post("/:mangaId/edit", function (req, res) {
    mangaHandlerInstance.editManga(
        req.params["mangaId"], req.body["book-review"],
        req.body["book-tags"].split(/, ?/)
    ).then(() => {
        res.redirect(303, `/admin/manga/${req.params["mangaId"]}`);
    }, rejection => {
        res.cookie("manga-update-error", {manga_id: req.params["mangaId"], error: rejection}, {signed: true, maxAge: 1000});
        res.redirect(303, `/admin/manga/${req.params["mangaId"]}`);
    });
});

router.post("/refresh", function (req, res) {
    logger.info("Importing new manga into mongo...");
    importHandler.importMangaIntoMongo();
    res.status(200).json({});
});

module.exports = router;
