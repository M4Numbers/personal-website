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
const ProjectHandler = require("../lib/ProjectHandler");
const projectHandlerInstance = ProjectHandler.getHandler();

router.get("/", function (req, res) {
    Promise.all(
        [
            projectHandlerInstance.findProjects(Math.max(0, ((req.query["page"] || 1) - 1)) * 10, 10, {"time_posted": -1}, false),
            projectHandlerInstance.getTotalProjectCount(false)
        ]
    ).then(([projects, totalCount]) => {
        res.render("./pages/admin/admin_project_view", {
            top_page: {
                title: "Administrator Toolkit",
                tagline: "All the functions that the administrator of the site has available to them",
                fa_type: "fas",
                fa_choice: "fa-toolbox"
            },

            content: {
                projects: projects
            },

            pagination: {
                base_url: "/admin/projects?",
                total: totalCount,
                page: Math.max((req.query["page"] || 1), 1),
            },

            head: {
                title: "M4Numbers",
                description: "Home to the wild things",
                current_page: "admin",
                current_sub_page: "project-view"
            }
        });
    });
});

router.get("/new", function (req, res) {
    res.render("./pages/admin/admin_project_create", {
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
            current_sub_page: "project-edit"
        }
    });
});

router.post("/new", function (req, res) {
    projectHandlerInstance.insertProject(
        req.body["project-title"], req.body["project-text"],
        req.body["project-visible"] === "Y", req.body["project-tags"].split(/, */)
    ).then((savedProject) => {
        res.redirect(303, `/admin/projects/${savedProject._id}`);
    }, rejection => {
        res.cookie("project-create-error", {error: rejection}, {signed: true, maxAge: 1000});
        res.redirect(303, "/admin/projects/new");
    });
});

router.get("/:projectId", function (req, res) {
    projectHandlerInstance.findProject(req.params["projectId"]).then((project) => {
        res.render("./pages/admin/admin_project_view_single", {
            top_page: {
                title: "Administrator Toolkit",
                tagline: "All the functions that the administrator of the site has available to them",
                fa_type: "fas",
                fa_choice: "fa-toolbox"
            },

            content: {
                project: project,
                project_text: markdown.render(project.description)
            },

            head: {
                title: "M4Numbers",
                description: "Home to the wild things",
                current_page: "admin",
                current_sub_page: "project-view"
            }
        });
    });
});

router.get("/:projectId/edit", function (req, res) {
    projectHandlerInstance.findProject(req.params["projectId"]).then((project) => {
        res.render("./pages/admin/admin_project_edit_single", {
            top_page: {
                title: "Administrator Toolkit",
                tagline: "All the functions that the administrator of the site has available to them",
                fa_type: "fas",
                fa_choice: "fa-toolbox"
            },

            content: {
                project: project
            },

            head: {
                title: "M4Numbers",
                description: "Home to the wild things",
                current_page: "admin",
                current_sub_page: "project-edit"
            }
        });
    });
});

router.post("/:projectId/edit", function (req, res) {
    projectHandlerInstance.editProject(
        req.params["projectId"], req.body["project-title"],
        req.body["project-text"], req.body["project-visible"] === "Y",
        req.body["project-tags"].split(/, */)
    ).then(() => {
        res.redirect(303, `/admin/projects/${req.params["projectId"]}`);
    }, rejection => {
        res.cookie("project-update-error", {blog_id: req.params["projectId"], error: rejection}, {signed: true, maxAge: 1000});
        res.redirect(303, `/admin/projects/${req.params["projectId"]}`);
    });
});

router.get("/:project/delete", function (req, res) {
    projectHandlerInstance.findProject(req.params["projectId"]).then((project) => {
        res.render("./pages/admin/admin_project_delete_single", {
            top_page: {
                title: "Administrator Toolkit",
                tagline: "All the functions that the administrator of the site has available to them",
                fa_type: "fas",
                fa_choice: "fa-toolbox"
            },

            content: {
                project: project
            },

            head: {
                title: "M4Numbers",
                description: "Home to the wild things",
                current_page: "admin",
                current_sub_page: "project-delete"
            }
        });
    });
});

router.post("/:projectId/delete", function (req, res) {
    projectHandlerInstance.deleteProject(req.params["projectId"]).then(() => {
        res.redirect(303, "/admin/projects");
    }, rejection => {
        res.cookie("project-delete-error", {project_id: req.params["projectId"], error: rejection}, {signed: true, maxAge: 1000});
        res.redirect(303, `/admin/projects/${req.params["projectId"]}`);
    });
});

module.exports = router;
