// MIT License
//
// Copyright (c) 2019 Jayne Doe
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

const testLoggedIn = require('../../journey/misc/test_admin_logged_in');

const renderer = require('../../lib/renderer').nunjucksRenderer();

const ProjectHandler = require('../../lib/ProjectHandler');
const projectHandlerInstance = ProjectHandler.getHandler();

const viewAllProjects = function (req, res, next) {
  Promise.all(
      [
        projectHandlerInstance.findProjects(Math.max(0, ((req.query['page'] || 1) - 1)) * 10, 10, {'time_posted': -1}, false),
        projectHandlerInstance.getTotalProjectCount(false)
      ]
  ).then(([projects, totalCount]) => {
    res.contentType = 'text/html';
    res.header('content-type', 'text/html');
    res.send(200, renderer.render('pages/admin/projects/admin_project_view.njk', {
      top_page: {
        title: 'Administrator Toolkit',
        tagline: 'All the functions that the administrator of the site has available to them',
        fa_type: 'fas',
        fa_choice: 'fa-toolbox'
      },

      content: {
        projects: projects
      },

      pagination: {
        base_url: '/admin/projects?',
        total: totalCount,
        page: Math.max((req.query['page'] || 1), 1),
        page_size: 10
      },

      head: {
        title: 'J4Numbers',
        description: 'Home to the wild things',
        current_page: 'admin',
        current_sub_page: 'project-view'
      }
    }));
    next();
  });
};

const createNewProject = function (req, res, next) {
  res.contentType = 'text/html';
  res.header('content-type', 'text/html');
  res.send(200, renderer.render('pages/admin/projects/admin_project_create.njk', {
    top_page: {
      title: 'Administrator Toolkit',
      tagline: 'All the functions that the administrator of the site has available to them',
      fa_type: 'fas',
      fa_choice: 'fa-toolbox'
    },

    head: {
      title: 'J4Numbers',
      description: 'Home to the wild things',
      current_page: 'admin',
      current_sub_page: 'project-edit'
    }
  }));
  next();
};

const postNewProject = function (req, res, next) {
  projectHandlerInstance.insertProject(
      req.body['project-title'], req.body['project-text'],
      req.body['project-visible'] === 'Y', req.body['project-tags'].split(/, */)
  ).then((savedProject) => {
    res.redirect(303, `/admin/projects/${savedProject._id}`, next);
  }, rejection => {
    req.log.warn({error: rejection});
    res.redirect(303, '/admin/projects/new', next);
  });
};

const getOneProject = function (req, res, next) {
  projectHandlerInstance.findProject(req.params['projectId']).then((project) => {
    res.contentType = 'text/html';
    res.header('content-type', 'text/html');
    res.send(200, renderer.render('pages/admin/projects/admin_project_view_single.njk', {
      top_page: {
        title: 'Administrator Toolkit',
        tagline: 'All the functions that the administrator of the site has available to them',
        fa_type: 'fas',
        fa_choice: 'fa-toolbox'
      },

      content: {
        project: project
      },

      head: {
        title: 'J4Numbers',
        description: 'Home to the wild things',
        current_page: 'admin',
        current_sub_page: 'project-view'
      }
    }));
    next();
  });
};

const editOneProject = function (req, res, next) {
  projectHandlerInstance.findProject(req.params['projectId']).then((project) => {
    res.contentType = 'text/html';
    res.header('content-type', 'text/html');
    res.send(200, renderer.render('pages/admin/projects/admin_project_edit_single.njk', {
      top_page: {
        title: 'Administrator Toolkit',
        tagline: 'All the functions that the administrator of the site has available to them',
        fa_type: 'fas',
        fa_choice: 'fa-toolbox'
      },

      content: {
        project: project
      },

      head: {
        title: 'J4Numbers',
        description: 'Home to the wild things',
        current_page: 'admin',
        current_sub_page: 'project-edit'
      }
    }));
    next();
  });
};

const postProjectEdits = function (req, res, next) {
  projectHandlerInstance.editProject(
      req.params['projectId'], req.body['project-title'],
      req.body['project-text'], req.body['project-visible'] === 'Y',
      req.body['project-tags'].split(/, */)
  ).then(() => {
    res.redirect(303, `/admin/projects/${req.params['projectId']}`, next);
  }, rejection => {
    req.log.warn({blog_id: req.params['projectId'], error: rejection});
    res.redirect(303, `/admin/projects/${req.params['projectId']}`, next);
  });
};

const viewDeleteProject = function (req, res, next) {
  projectHandlerInstance.findProject(req.params['projectId']).then((project) => {
    res.contentType = 'text/html';
    res.header('content-type', 'text/html');
    res.send(200, renderer.render('pages/admin/projects/admin_project_delete_single.njk', {
      top_page: {
        title: 'Administrator Toolkit',
        tagline: 'All the functions that the administrator of the site has available to them',
        fa_type: 'fas',
        fa_choice: 'fa-toolbox'
      },

      content: {
        project: project
      },

      head: {
        title: 'J4Numbers',
        description: 'Home to the wild things',
        current_page: 'admin',
        current_sub_page: 'project-delete'
      }
    }));
    next();
  });
};

const deleteSingleProject = function (req, res, next) {
  projectHandlerInstance.deleteProject(req.params['projectId']).then(() => {
    res.redirect(303, '/admin/projects', next);
  }, rejection => {
    req.log.warn({project_id: req.params['projectId'], error: rejection});
    res.redirect(303, `/admin/projects/${req.params['projectId']}`, next);
  });
};

module.exports = (server) => {
  server.get('/admin/projects', testLoggedIn, viewAllProjects);
  server.get('/admin/projects/new', testLoggedIn, createNewProject);
  server.post('/admin/projects/new', testLoggedIn, postNewProject);
  server.get('/admin/projects/:projectId', testLoggedIn, getOneProject);
  server.get('/admin/projects/:projectId/edit', testLoggedIn, editOneProject);
  server.post('/admin/projects/:projectId/edit', testLoggedIn, postProjectEdits);
  server.get('/admin/projects/:projectId/delete', testLoggedIn, viewDeleteProject);
  server.post('/admin/projects/:projectId/delete', testLoggedIn, deleteSingleProject);
};
