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
const SiteError = require("../lib/SiteError");
const ProjectHandler = require("../lib/ProjectHandler");
const projectHandlerInstance = ProjectHandler.getHandler();

const loggingSystem = require("../lib/Logger");
const logger = loggingSystem.getLogger("master");


/* GET all projects posts */
router.get("/", function (req, res, next) {
    Promise.all(
        [
            projectHandlerInstance.findProjects(Math.max(0, ((req.query["page"] || 1) - 1)) * 10, 10, {"time_posted": -1}),
            projectHandlerInstance.getTotalProjectCount()
        ]
    ).then(([projects, totalCount]) => {
        logger.debug(`Found ${totalCount} available projects`);
        res.render("./pages/project_all", {
            top_page: {
                title: "My Projects",
                tagline: "A list of things that I have made in my spare time at some point or another.",
                image_src: "/images/handle_logo.png",
                image_alt: "Main face of the site"
            },

            content: {
                projects: projects
            },

            pagination: {
                base_url: "/projects?",
                total: totalCount,
                page: Math.max((req.query["page"] || 1), 1),
                page_size: 10
            },

            head: {
                title: "M4Numbers :: Projects",
                description: "Home to the wild things",
                current_page: "projects"
            }
        });
    }, rejection => {
        next(rejection);
    });
});

/* GET single blog post page. */
router.get("/:projectId", function (req, res, next) {
    projectHandlerInstance.findProject(req.params["projectId"])
        .then(project => {
            if (project !== null) {
                res.render("./pages/project_single", {
                    top_page: {
                        title: project.long_title,
                        project_tags: project.tags,
                        image_src: "/images/handle_logo.png",
                        image_alt: "Main face of the site",
                    },

                    content: {
                        project_text: project.description
                    },

                    head: {
                        title: `M4Numbers :: ${project.long_title}`,
                        description: "Home to the wild things",
                        current_page: "projects"
                    }
                });
            } else {
                next(new SiteError(404, "Not Found"));
            }
        }, rejection => {
            next(rejection);
        });
});

module.exports = router;
