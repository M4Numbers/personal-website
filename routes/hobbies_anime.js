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
const SiteError = require("../lib/SiteError");
const AnimeHandler = require("../lib/AnimeHandler");
const animeHandlerInstance = AnimeHandler.getHandler();

router.get("/", function (req, res, next) {
    Promise.all([
        animeHandlerInstance.findAnimeShows(Math.max(0, ((req.query["page"] || 1) - 1)) * 10, 12),
        animeHandlerInstance.getTotalShowCount()
    ]).then(([allShows, totalCount]) => {
        let baseUrl = "";
        if (req.query.category) {
            baseUrl += `category=${req.query.category}&`;
        }
        if (req.query.q) {
            baseUrl += `q=${req.query.q}&`;
        }
        res.render("./pages/anime/anime_all", {
            top_page: {
                title: "My Anime Watchlist",
                tagline: "A list of all the strange things that I have seen at some point or another",
                image_src: "/images/handle_logo.png",
                image_alt: "Main face of the site"
            },

            content: {
                shows: allShows
            },

            pagination: {
                base_url: `/hobbies/anime?${baseUrl}`,
                total: totalCount,
                page: Math.max((req.query["page"] || 1), 1),
            },

            head: {
                title: "M4Numbers :: Hobbies :: Anime",
                description: "Home to the wild things",
                current_page: "hobbies",
                current_sub_page: "anime",
                current_category: req.query["category"] || "all"
            }
        });
    }, next);
});

module.exports = router;
