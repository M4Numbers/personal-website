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
const crypto = require("crypto");
const router = express.Router();

/* GET home page. */
router.get("/login", function (req, res, next) {
    if (req.signedCookies.knows_me) {
        res.redirect(303, "/hobbies/me");
    } else {
        res.render("./pages/me/me_login", {
            top_page: {
                title: "Test Your Knowledge",
                tagline: "Log into the site as someone who knows me",
                fa_type: "fas",
                fa_choice: "fa-key"
            },

            head: {
                title: "M4Numbers",
                description: "Home to the wild things",
                current_page: "me_login"
            }
        });
    }
});

router.post("/login", function (req, res, next) {
    if (req.body["me_password"] && !req.signedCookies.knows_me) {
        let hash = crypto.createHash("sha256").update(req.body["me_password"]).digest("hex");
        if (hash === "c4c6754d992bee00451e7065c4c1ccf91bafefeaafed58e68b1008bb525c493b") {
            res.cookie("knows_me", 1, {signed: true, maxAge: 6000000});
        }
    }
    res.redirect(303, "/hobbies/me/login");
});

module.exports = router;
