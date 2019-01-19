/*
 * MIT License
 *
 * Copyright (c) 2019 Matthew D. Ball
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

const projectHandlerInstance = require('../../../lib/ProjectHandler').getHandler();

const getAllProjects = async (req, res, next) => {
    Promise.all(
        [
            projectHandlerInstance.findProjects(Math.max(0, ((req.query['page'] || 1) - 1)) * 10, 10, {'time_posted': -1}),
            projectHandlerInstance.getTotalProjectCount()
        ]
    ).then(([projects, totalCount]) => {
        res.render('./pages/project_all', {
            top_page: {
                title: 'My Projects',
                tagline: 'A list of things that I have made in my spare time at some point or another.',
                image_src: '/images/handle_logo.png',
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
                title: 'M4Numbers :: Projects',
                description: 'Home to the wild things',
                current_page: 'projects'
            }
        });
    }, rejection => {
        next(rejection);
    });
};

module.exports = getAllProjects;
