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
const fs = require("fs");
const Multer = require("multer");
const uploads = Multer({dest: "../../tmp/uploads"});

const StoryHandler = require("../../lib/StoryHandler");
const storyHandlerInstance = StoryHandler.getHandler();

const loggingSystem = require("../../lib/Logger");
const logger = loggingSystem.getLogger("master");

router.get("/", function (req, res) {
    Promise.all(
        [
            storyHandlerInstance.findAllStories(Math.max(0, ((req.query["page"] || 1) - 1)) * 10, 10, {"title": 1}),
            storyHandlerInstance.getTotalStoryCount()
        ]
    ).then(([stories, totalCount]) => {
        res.render("./pages/admin/stories/admin_story_view", {
            top_page: {
                title: "Administrator Toolkit",
                tagline: "All the functions that the administrator of the site has available to them",
                fa_type: "fas",
                fa_choice: "fa-toolbox"
            },

            content: {
                stories: stories
            },

            pagination: {
                base_url: "/admin/stories?",
                total: totalCount,
                page: Math.max((req.query["page"] || 1), 1),
                page_size: 10
            },

            head: {
                title: "M4Numbers",
                description: "Home to the wild things",
                current_page: "admin",
                current_sub_page: "story-view"
            }
        });
    });
});

router.get("/new", function (req, res) {
    res.render("./pages/admin/stories/admin_story_create", {
        top_page: {
            title: "Administrator Toolkit",
            tagline: "All the functions that the administrator of the site has available to them",
            fa_type: "fas",
            fa_choice: "fa-toolbox"
        },

        head: {
            title: "M4Numbers",
            description: "Home to the wild things",
            current_page: "admin",
            current_sub_page: "story-edit"
        }
    });
});

router.post("/new", uploads.single("story-image"), function (req, res) {
    logger.info(`Reading in new image from ${req.file.path}`);
    let imageAsBase64 = fs.readFileSync(req.file.path, "base64");
    storyHandlerInstance.addNewStory(
        req.body["story-title"], req.body["story-status"], req.body["story-type"],
        req.body["story-synopsis"], imageAsBase64, req.body["story-tags"].split(/, ?/),
        req.body["story-notes"]
    ).then((savedStory) => {
        res.redirect(303, `/admin/stories/${savedStory._id}`);
    }, rejection => {
        res.cookie("story-create-error", {error: rejection}, {signed: true, maxAge: 1000});
        res.redirect(303, "/admin/stories/new");
    });
});

router.get("/:storyId", function (req, res) {
    storyHandlerInstance.findStoryByRawId(req.params["storyId"]).then((story) => {
        res.render("./pages/admin/stories/admin_story_view_single", {
            top_page: {
                title: "Administrator Toolkit",
                tagline: "All the functions that the administrator of the site has available to them",
                fa_type: "fas",
                fa_choice: "fa-toolbox"
            },

            content: {
                story: story
            },

            head: {
                title: "M4Numbers",
                description: "Home to the wild things",
                current_page: "admin",
                current_sub_page: "story-view"
            }
        });
    });
});

router.get("/:storyId/edit", function (req, res) {
    storyHandlerInstance.findStoryByRawId(req.params["storyId"]).then((story) => {
        res.render("./pages/admin/stories/admin_story_edit_single", {
            top_page: {
                title: "Administrator Toolkit",
                tagline: "All the functions that the administrator of the site has available to them",
                fa_type: "fas",
                fa_choice: "fa-toolbox"
            },

            content: {
                story: story
            },

            head: {
                title: "M4Numbers",
                description: "Home to the wild things",
                current_page: "admin",
                current_sub_page: "story-edit"
            }
        });
    });
});

router.post("/:storyId/edit", uploads.single("story-image"), function (req, res) {
    let imageAsBase64 = fs.readFileSync(req.file.path, "base64");
    storyHandlerInstance.updateExistingStory(
        req.params["storyId"], req.body["story-title"],
        req.body["story-status"], req.body["story-type"],
        req.body["story-synopsis"], imageAsBase64,
        req.body["story-tags"].split(/, ?/), req.body["story-notes"]
    ).then(() => {
        res.redirect(303, `/admin/stories/${req.params["storyId"]}`);
    }, rejection => {
        res.cookie("story-update-error", {art_id: req.params["storyId"], error: rejection}, {signed: true, maxAge: 1000});
        res.redirect(303, `/admin/stories/${req.params["storyId"]}`);
    });
});

router.get("/:storyId/delete", function (req, res) {
    storyHandlerInstance.findStoryByRawId(req.params["storyId"]).then((story) => {
        res.render("./pages/admin/stories/admin_story_delete_single", {
            top_page: {
                title: "Administrator Toolkit",
                tagline: "All the functions that the administrator of the site has available to them",
                fa_type: "fas",
                fa_choice: "fa-toolbox"
            },

            content: {
                story: story
            },

            head: {
                title: "M4Numbers",
                description: "Home to the wild things",
                current_page: "admin",
                current_sub_page: "story-delete"
            }
        });
    });
});

router.post("/:storyId/delete", function (req, res) {
    storyHandlerInstance.deleteStory(req.params["storyId"]).then(() => {
        res.redirect(303, "/admin/stories/");
    }, rejection => {
        res.cookie("story-delete-error", {art_id: req.params["storyId"], error: rejection}, {signed: true, maxAge: 1000});
        res.redirect(303, `/admin/stories/${req.params["storyId"]}`);
    });
});

module.exports = router;
