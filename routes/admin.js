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

const blogAdmin = require("./admin/admin_blog");
const projectAdmin = require("./admin/admin_projects");
const artAdmin = require("./admin/admin_art");
const artStories = require("./admin/admin_stories");
const animeAdmin = require("./admin/admin_anime");
const mangaAdmin = require("./admin/admin_manga");
const kinkAdmin = require("./admin/admin_kinks");

router.use((req, res, next) => {
    if (!req.signedCookies.logged_in) {
        res.redirect(303, "/login");
    } else {
        next();
    }
});

router.use("/blog", [blogAdmin]);
router.use("/projects", [projectAdmin]);
router.use("/art", [artAdmin]);
router.use("/stories", [artStories]);
router.use("/anime", [animeAdmin]);
router.use("/manga", [mangaAdmin]);
router.use("/fetishes", [kinkAdmin]);

router.get("/", function (req, res, next) {
    res.redirect(303, "/admin/blog");
});

module.exports = router;
