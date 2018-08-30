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
const AnimeHandler = require("../../lib/AnimeHandler");
const animeHandlerInstance = AnimeHandler.getHandler();
const importHandler = require("../../lib/ImportHandler");

router.get("/", function (req, res) {
    Promise.all(
        [
            animeHandlerInstance.findAnimeShows(Math.max(0, ((req.query["page"] || 1) - 1)) * 10, 10, {"time_posted": -1}, false),
            animeHandlerInstance.getTotalShowCount(false)
        ]
    ).then(([shows, totalCount]) => {
        res.render("./pages/admin/admin_anime_view", {
            top_page: {
                title: "Administrator Toolkit",
                tagline: "All the functions that the administrator of the site has available to them",
                fa_type: "fas",
                fa_choice: "fa-toolbox"
            },

            content: {
                shows: shows
            },

            pagination: {
                base_url: "/admin/anime?",
                total: totalCount,
                page: Math.max((req.query["page"] || 1), 1),
            },

            head: {
                title: "M4Numbers",
                description: "Home to the wild things",
                current_page: "admin",
                current_sub_page: "anime-view"
            }
        });
    });
});

router.get("/:animeId", function (req, res) {
    animeHandlerInstance.findAnimeByRawId(req.params["animeId"]).then((show) => {
        res.render("./pages/admin/admin_anime_view_single", {
            top_page: {
                title: "Administrator Toolkit",
                tagline: "All the functions that the administrator of the site has available to them",
                fa_type: "fas",
                fa_choice: "fa-toolbox"
            },

            content: {
                show: show,
                show_text: markdown.render(show.review)
            },

            head: {
                title: "M4Numbers",
                description: "Home to the wild things",
                current_page: "admin",
                current_sub_page: "anime-view"
            }
        });
    });
});

router.get("/:animeId/edit", function (req, res) {
    animeHandlerInstance.findAnimeByRawId(req.params["animeId"]).then((show) => {
        res.render("./pages/admin/admin_anime_edit_single", {
            top_page: {
                title: "Administrator Toolkit",
                tagline: "All the functions that the administrator of the site has available to them",
                fa_type: "fas",
                fa_choice: "fa-toolbox"
            },

            content: {
                show: show
            },

            head: {
                title: "M4Numbers",
                description: "Home to the wild things",
                current_page: "admin",
                current_sub_page: "anime-edit"
            }
        });
    });
});

router.post("/:animeId/edit", function (req, res) {
    animeHandlerInstance.editAnime(
        req.params["animeId"], req.body["show-review"],
        req.body["show-tags"].split(/, ?/)
    ).then(() => {
        res.redirect(303, `/admin/anime/${req.params["animeId"]}`);
    }, rejection => {
        res.cookie("anime-update-error", {anime_id: req.params["animeId"], error: rejection}, {signed: true, maxAge: 1000});
        res.redirect(303, `/admin/anime/${req.params["animeId"]}`);
    });
});

router.post("/refresh", function (req, res) {
    importHandler.importAnimeIntoMongo();
    res.status(200).end();
});

module.exports = router;
