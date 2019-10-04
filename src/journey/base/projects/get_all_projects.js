/*
 * MIT License
 *
 * Copyright (c) 2019 Jayne Doe
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

const renderer = require('../../../lib/renderer').nunjucksRenderer();

const projectHandlerInstance = require('../../../lib/ProjectHandler').getHandler();

const getAllProjects = async (req, res, next) => {
    Promise.all(
        [
            projectHandlerInstance.findProjects(Math.max(0, ((req.query['page'] || 1) - 1)) * 10, 10, {'time_posted': -1}),
            projectHandlerInstance.getTotalProjectCount()
        ]
    ).then(([projects, totalCount]) => {
        res.contentType = 'text/html';
        res.header('content-type', 'text/html');
        res.send(200, renderer.render('pages/project_all.njk', {
            top_page: {
                title: 'My Projects',
                tagline: 'A list of things that I have made in my spare time at some point or another.',
                image_src: '/assets/images/handle_logo.png',
                image_alt: 'Main face of the site'
            },

            content: {
                projects: projects
            },

            pagination: {
                base_url: '/projects?',
                total: totalCount,
                page: Math.max((req.query['page'] || 1), 1),
                page_size: 10
            },

            head: {
                title: 'J4Numbers :: Projects',
                description: 'Home to the wild things',
                current_page: 'projects'
            }
        }));
        next();
    }, rejection => {
        next(rejection);
    });
};

module.exports = (server) => {
    server.get('/projects', getAllProjects);
};
