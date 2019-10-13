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

const fs = require('fs');

const StoryHandler = require('../../lib/StoryHandler');
const storyHandlerInstance = StoryHandler.getHandler();

const ChapterHandler = require('../../lib/ChapterHandler');
const chapterHandlerInstance = ChapterHandler.getHandler();

const viewAllStories = function (req, res, next) {
  Promise.all(
      [
        storyHandlerInstance.findAllStories(Math.max(0, ((req.query['page'] || 1) - 1)) * 10, 10, {'title': 1}),
        storyHandlerInstance.getTotalStoryCount()
      ]
  ).then(([stories, totalCount]) => {
    res.send(200, renderer.render('pages/admin/stories/admin_story_view.njk', {
      top_page: {
        title: 'Administrator Toolkit',
        tagline: 'All the functions that the administrator of the site has available to them',
        fa_type: 'fas',
        fa_choice: 'fa-toolbox'
      },

      content: {
        stories: stories
      },

      pagination: {
        base_url: '/admin/stories?',
        total: totalCount,
        page: Math.max((req.query['page'] || 1), 1),
        page_size: 10
      },

      head: {
        title: 'J4Numbers',
        description: 'Home to the wild things',
        current_page: 'admin',
        current_sub_page: 'story-view'
      }
    }));
    next();
  });
};

const viewCreateNewStory = function (req, res, next) {
  res.contentType = 'text/html';
  res.header('content-type', 'text/html');
  res.send(200, renderer.render('pages/admin/stories/admin_story_create.njk', {
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
      current_sub_page: 'story-edit'
    }
  }));
  next();
};

const createNewStory = function (req, res, next) {
  let imageAsBase64 = '';
  if (typeof req.files['story-image'] !== 'undefined') {
    req.log.info(`Reading in new image from ${req.files['story-image'].path}`);
    imageAsBase64 = fs.readFileSync(req.files['story-image'].path, 'base64');
  }
  storyHandlerInstance.addNewStory(
      req.body['story-title'], req.body['story-status'], req.body['story-type'],
      req.body['story-synopsis'], imageAsBase64, req.body['story-tags'].split(/, ?/),
      req.body['story-notes']
  ).then((savedStory) => {
    res.redirect(303, `/admin/stories/${savedStory._id}`, next);
  }, rejection => {
    req.log.warn({error: rejection});
    res.redirect(303, '/admin/stories/new', next);
  });
};

const viewSingleStory = function (req, res, next) {
  Promise.all([
    storyHandlerInstance.findStoryByRawId(req.params['storyId']),
    chapterHandlerInstance.findChaptersByStory(req.params['storyId'], Math.max(0, ((req.query['page'] || 1) - 1)) * 25, 25)
  ])
      .catch(next)
      .then(([story, sortedChapterList]) => {
        res.contentType = 'text/html';
        res.header('content-type', 'text/html');
        res.send(200, renderer.render('pages/admin/stories/admin_story_view_single.njk', {
          top_page: {
            title: 'Administrator Toolkit',
            tagline: 'All the functions that the administrator of the site has available to them',
            fa_type: 'fas',
            fa_choice: 'fa-toolbox'
          },

          content: {
            story: story,
            chapters: sortedChapterList
          },

          pagination: {
            base_url: `/admin/stories/${req.params['storyId']}?`,
            total: story.chapters.length,
            page: Math.max((req.query['page'] || 1), 1),
            page_size: 25
          },

          head: {
            title: 'J4Numbers',
            description: 'Home to the wild things',
            current_page: 'admin',
            current_sub_page: 'story-view'
          }
        }));
        next();
      });
};

const viewEditSingleStory = function (req, res, next) {
  storyHandlerInstance.findStoryByRawId(req.params['storyId']).then((story) => {
    res.contentType = 'text/html';
    res.header('content-type', 'text/html');
    res.send(200, renderer.render('pages/admin/stories/admin_story_edit_single.njk', {
      top_page: {
        title: 'Administrator Toolkit',
        tagline: 'All the functions that the administrator of the site has available to them',
        fa_type: 'fas',
        fa_choice: 'fa-toolbox'
      },

      content: {
        story: story
      },

      head: {
        title: 'J4Numbers',
        description: 'Home to the wild things',
        current_page: 'admin',
        current_sub_page: 'story-edit'
      }
    }));
    next();
  });
};

const editSingleStory = function (req, res, next) {
  let imageAsBase64 = '';
  if (typeof req.files['story-image'] !== 'undefined') {
    req.log.info(`Reading in new image from ${req.files['story-image'].path}`);
    imageAsBase64 = fs.readFileSync(req.files['story-image'].path, 'base64');
  }
  storyHandlerInstance.updateExistingStory(
      req.params['storyId'], req.body['story-title'],
      req.body['story-status'], req.body['story-type'],
      req.body['story-synopsis'], imageAsBase64,
      req.body['story-tags'].split(/, ?/), req.body['story-notes']
  ).then(() => {
    res.redirect(303, `/admin/stories/${req.params['storyId']}`, next);
  }, rejection => {
    req.log.warn({story_id: req.params['storyId'], error: rejection});
    res.redirect(303, `/admin/stories/${req.params['storyId']}`, next);
  });
};

const viewDeleteSingleStory = function (req, res, next) {
  storyHandlerInstance.findStoryByRawId(req.params['storyId']).then((story) => {
    res.contentType = 'text/html';
    res.header('content-type', 'text/html');
    res.send(200, renderer.render('pages/admin/stories/admin_story_delete_single.njk', {
      top_page: {
        title: 'Administrator Toolkit',
        tagline: 'All the functions that the administrator of the site has available to them',
        fa_type: 'fas',
        fa_choice: 'fa-toolbox'
      },

      content: {
        story: story
      },

      head: {
        title: 'J4Numbers',
        description: 'Home to the wild things',
        current_page: 'admin',
        current_sub_page: 'story-delete'
      }
    }));
    next();
  });
};
const deleteSingleStory = function (req, res, next) {
  storyHandlerInstance.deleteStory(req.params['storyId']).then(() => {
    res.redirect(303, '/admin/stories/', next);
  }, rejection => {
    req.log.warn({story_id: req.params['storyId'], error: rejection});
    res.redirect(303, `/admin/stories/${req.params['storyId']}`, next);
  });
};

module.exports = (server) => {
  server.get('/admin/stories', testLoggedIn, viewAllStories);
  server.get('/admin/stories/new', testLoggedIn, viewCreateNewStory);
  server.post('/admin/stories/new', testLoggedIn, createNewStory);
  server.get('/admin/stories/:storyId', testLoggedIn, viewSingleStory);
  server.get('/admin/stories/:storyId/edit', testLoggedIn, viewEditSingleStory);
  server.post('/admin/stories/:storyId/edit', testLoggedIn, editSingleStory);
  server.get('/admin/stories/:storyId/delete', testLoggedIn, viewDeleteSingleStory);
  server.post('/admin/stories/:storyId/delete', testLoggedIn, deleteSingleStory);
};
