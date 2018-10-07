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

const SiteError = require("../../lib/SiteError");
const StoryHandler = require("../../lib/StoryHandler");
const storyHandlerInstance = StoryHandler.getHandler();

const ChapterHandler = require("../../lib/ChapterHandler");
const chapterHandlerInstance = ChapterHandler.getHandler();

const loggingSystem = require("../../lib/Logger");
const logger = loggingSystem.getLogger("master");

router.get("/", function (req, res, next) {
    Promise.all([
        storyHandlerInstance.findAllStories(Math.max(0, ((req.query["page"] || 1) - 1)) * 12, 12, {"title": 1}),
        storyHandlerInstance.getTotalStoryCount()
    ]).catch(next)
        .then(([allStories, totalCount]) => {
            let baseUrl = "";
            if (req.query.q) {
                baseUrl += `q=${req.query.q}&`;
            }
            res.render("./pages/stories/stories_all", {
                top_page: {
                    title: "My Writings",
                    tagline: "A collection of all the things that I've scribbled down at one point or another",
                    image_src: "/images/handle_logo.png",
                    image_alt: "Main face of the site"
                },

                content: {
                    stories: allStories
                },

                pagination: {
                    base_url: `/hobbies/writing?${baseUrl}`,
                    total: totalCount,
                    page: Math.max((req.query["page"] || 1), 1),
                    page_size: 12
                },

                head: {
                    title: "M4Numbers :: Hobbies :: Writing",
                    description: "Home to the wild things",
                    current_page: "hobbies",
                    current_sub_page: "writing"
                }
            });
        }, next);
});

router.get("/:storyId", (req, res, next) => {
    Promise.all([
        storyHandlerInstance.findStoryByRawId(req.params["storyId"]),
        chapterHandlerInstance.findChaptersByStory(req.params["storyId"], Math.max(0, ((req.query["page"] || 1) - 1)) * 25, 25)
    ])
        .catch(next)
        .then(([story, sortedChapterList]) => {
            story.chapters = sortedChapterList;
            return Promise.resolve(story);
        })
        .then(storyWithChapters => {
            res.render("./pages/stories/stories_one", {
                top_page: {
                    title: storyWithChapters.title,
                    tagline: "A collection of all the things that I've scribbled down at one point or another",
                    image_src: `data:image/png;base64,${storyWithChapters.cover_img}`,
                    image_alt: storyWithChapters.title
                },

                content: {
                    story: storyWithChapters
                },

                pagination: {
                    base_url: `/hobbies/writing/${req.params["storyId"]}?`,
                    total: storyWithChapters.total_chaps,
                    page: Math.max((req.query["page"] || 1), 1),
                    page_size: 25
                },

                head: {
                    title: "M4Numbers :: Hobbies :: Writing :: ",
                    description: "Home to the wild things",
                    current_page: "hobbies",
                    current_sub_page: "writing",
                }
            });
        }, next);
});

router.get("/:storyId/chapter/:chapterId", (req, res, next) => {
    Promise.all([
        storyHandlerInstance.findStoryByRawId(req.params["storyId"]),
        chapterHandlerInstance.findChapterByRawId(req.params["chapterId"])
    ])
        .catch(next)
        .then(([story, chapter]) => {
            res.render("./pages/stories/chapters_one", {
                top_page: {
                    title: story.title,
                    tagline: chapter.chapter_title,
                    image_src: `data:image/png;base64,${story.cover_img}`,
                    image_alt: story.title
                },

                content: {
                    story: story,
                    chapter: chapter
                },

                head: {
                    title: "M4Numbers :: Hobbies :: Writing :: ",
                    description: "Home to the wild things",
                    current_page: "hobbies",
                    current_sub_page: "writing",
                }
            });
        }, next);
});

module.exports = router;
