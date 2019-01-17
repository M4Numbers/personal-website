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

const StoryHandler = require("../../lib/StoryHandler");
const storyHandlerInstance = StoryHandler.getHandler();

const ChapterHandler = require("../../lib/ChapterHandler");
const chapterHandlerInstance = ChapterHandler.getHandler();

const loggingSystem = require("../../lib/Logger");
const logger = loggingSystem.getLogger("master");

// All endpoints below are prefixed with `/admin/stories/:storyId/chapter`

router.get("/:storyId/chapter/new", function (req, res, next) {
    logger.info(`Searching for story with id ${req.params["storyId"]}`);
    storyHandlerInstance.findStoryByRawId(req.params["storyId"])
        .catch(next)
        .then(story => {
            res.render("./pages/admin/stories/admin_chapter_create", {
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

router.post("/:storyId/chapter/new", function (req, res) {
    chapterHandlerInstance.addNewChapter(
        req.params["storyId"], req.body["chapter-number"],
        req.body["chapter-title"], req.body["chapter-text"],
        req.body["chapter-comments"]
    )
        .then((uploadedChapter) => {
            return storyHandlerInstance.addChapterToStory(
                req.params["storyId"], uploadedChapter.chapter_number,
                uploadedChapter._id
            );
        })
        .then(() => {
            res.redirect(303, `/admin/stories/${req.params["storyId"]}`);
        }, rejection => {
            logger.warn("story creation error");
            logger.warn(rejection);
            res.redirect(303, `/admin/stories/${req.params["storyId"]}/new`);
        });
});

router.get("/:storyId/chapter/:chapterNumber", function (req, res, next) {
    Promise.all([
        storyHandlerInstance.findStoryByRawId(req.params["storyId"]),
        chapterHandlerInstance.findChapterByStoryAndNumber(req.params["storyId"], req.params["chapterNumber"])
    ])
        .catch(next)
        .then(([story, chapters]) => {
            if (chapters.length > 0) {
                story.chapter = chapters.pop();
                return Promise.resolve(story);
            } else {
                next();
            }
        })
        .then(storyWithChapter => {
            res.render("./pages/admin/stories/admin_chapter_view_single", {
                top_page: {
                    title: "Administrator Toolkit",
                    tagline: "All the functions that the administrator of the site has available to them",
                    fa_type: "fas",
                    fa_choice: "fa-toolbox"
                },

                content: {
                    story: storyWithChapter
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

router.get("/:storyId/chapter/:chapterNumber/edit", function (req, res, next) {
    Promise.all([
        storyHandlerInstance.findStoryByRawId(req.params["storyId"]),
        chapterHandlerInstance.findChapterByStoryAndNumber(req.params["storyId"], req.params["chapterNumber"])
    ])
        .catch(next)
        .then(([story, chapter]) => {
            res.render("./pages/admin/stories/admin_chapter_edit_single", {
                top_page: {
                    title: "Administrator Toolkit",
                    tagline: "All the functions that the administrator of the site has available to them",
                    fa_type: "fas",
                    fa_choice: "fa-toolbox"
                },

                content: {
                    story: story,
                    chapter: chapter.pop()
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

router.post("/:storyId/chapter/:chapterNumber/edit", function (req, res) {
        chapterHandlerInstance.updateExistingChapter(
            req.body["chapter-id"], req.body["chapter-number"],
            req.body["chapter-title"], req.body["chapter-text"],
            req.body["chapter-comments"]
        ).then(() => {
            res.redirect(303, `/admin/stories/${req.params["storyId"]}/chapter/${req.params["chapterNumber"]}`);
        }, rejection => {
            res.cookie("chapter-update-error", {chapter_id: req.params["chapterNumber"], error: rejection}, {signed: true, maxAge: 1000});
            res.redirect(303, `/admin/stories/${req.params["storyId"]}/chapter/${req.params["chapterNumber"]}`);
        });
});

router.get("/:storyId/chapter/:chapterNumber/delete", function (req, res) {
    chapterHandlerInstance.findChapterByStoryAndNumber(req.params["storyId"], req.params["chapterNumber"]).then((chapter) => {
        res.render("./pages/admin/stories/admin_chapter_delete_single", {
            top_page: {
                title: "Administrator Toolkit",
                tagline: "All the functions that the administrator of the site has available to them",
                fa_type: "fas",
                fa_choice: "fa-toolbox"
            },

            content: {
                chapter: chapter.pop()
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

router.post("/:storyId/chapter/:chapterNumber/delete", function (req, res) {
    Promise.all([
        chapterHandlerInstance.deleteChapter(req.body["chapter-id"]),
        storyHandlerInstance.removeChapterFromStory(req.params["storyId"], req.body["chapter-id"])
    ])
        .then(() => {
            res.redirect(303, `/admin/stories/${req.params["storyId"]}`);
        }, rejection => {
            logger.warn("Failed to delete chapter");
            logger.warn(rejection);
            res.cookie("chapter-delete-error", {chapter_id: req.body["chapter-id"], error: rejection}, {signed: true, maxAge: 1000});
            res.redirect(303, `/admin/stories/${req.params["storyId"]}/chapter/${req.params["chapterNumber"]}`);
        });
});

module.exports = router;
