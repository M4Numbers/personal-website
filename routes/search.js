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

const Logger = require("../lib/Logger");
const logger = Logger.getLogger("master");

router.get("/", (req, res, next) => {
    let renderVars = {
        top_page: {
            title: "Search",
            tagline: "Search through all the items that are on offer",
            fa_type: "fas",
            fa_choice: "fa-search"
        },

        pagination: {
            base_url: `/search?q=${req.query["q"]}&`,
            page: Math.max((req.query["page"] || 1), 1),
            page_size: 12
        },

        head: {
            title: "M4Numbers :: Search",
            description: "Home to the wild things",
            current_page: "search",
            current_category: req.query["category"] || "all"
        },

        search: req.query["q"]
    };
    try {
        const tagList = renderVars.search.split(/, */);

        let query = {
            tags: {
                $all: tagList
            }
        };
        logger.info(query);
        res.render("./pages/search", renderVars);
    } catch (e) {
        renderVars["error"] = e;
        res.render("./pages/search", renderVars);
    }
});

module.exports = router;
