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

const StoryHandler = require('../../lib/StoryHandler');
const storyHandlerInstance = StoryHandler.getHandler();

const ChapterHandler = require('../../lib/ChapterHandler');
const chapterHandlerInstance = ChapterHandler.getHandler();

// All endpoints below are prefixed with `/admin/stories/:storyId/chapter`

const viewCreateNewChapter = function (req, res, next) {
  req.log.info(`Searching for story with id ${req.params['storyId']}`);
  storyHandlerInstance.findStoryByRawId(req.params['storyId'])
      .catch(next)
      .then(story => {
        res.contentType = 'text/html';
        res.header('content-type', 'text/html');
        res.send(200, renderer.render('pages/admin/stories/admin_chapter_create.njk', {
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

const createNewChapter = function (req, res, next) {
  chapterHandlerInstance.addNewChapter(
      req.params['storyId'], req.body['chapter-number'],
      req.body['chapter-title'], req.body['chapter-text'],
      req.body['chapter-comments']
  )
      .then((uploadedChapter) => {
        return storyHandlerInstance.addChapterToStory(
            req.params['storyId'], uploadedChapter.chapter_number,
            uploadedChapter._id
        );
      })
      .then(() => {
        res.redirect(303, `/admin/stories/${req.params['storyId']}`, next);
      }, rejection => {
        req.log.warn('story creation error');
        req.log.warn(rejection);
        res.redirect(303, `/admin/stories/${req.params['storyId']}/new`, next);
      });
};

const viewSingleChapter = function (req, res, next) {
  Promise.all([
    storyHandlerInstance.findStoryByRawId(req.params['storyId']),
    chapterHandlerInstance.findChapterByStoryAndNumber(req.params['storyId'], req.params['chapterNumber'])
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
        res.contentType = 'text/html';
        res.header('content-type', 'text/html');
        res.send(200, renderer.render('pages/admin/stories/admin_chapter_view_single.njk', {
          top_page: {
            title: 'Administrator Toolkit',
            tagline: 'All the functions that the administrator of the site has available to them',
            fa_type: 'fas',
            fa_choice: 'fa-toolbox'
          },

          content: {
            story: storyWithChapter
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

const viewEditSingleChapter = function (req, res, next) {
  Promise.all([
    storyHandlerInstance.findStoryByRawId(req.params['storyId']),
    chapterHandlerInstance.findChapterByStoryAndNumber(req.params['storyId'], req.params['chapterNumber'])
  ])
      .catch(next)
      .then(([story, chapter]) => {
        res.contentType = 'text/html';
        res.header('content-type', 'text/html');
        res.send(200, renderer.render('pages/admin/stories/admin_chapter_edit_single.njk', {
          top_page: {
            title: 'Administrator Toolkit',
            tagline: 'All the functions that the administrator of the site has available to them',
            fa_type: 'fas',
            fa_choice: 'fa-toolbox'
          },

          content: {
            story: story,
            chapter: chapter.pop()
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

const editSingleChapter = function (req, res, next) {
  chapterHandlerInstance.updateExistingChapter(
      req.body['chapter-id'], req.body['chapter-number'],
      req.body['chapter-title'], req.body['chapter-text'],
      req.body['chapter-comments']
  ).then(() => {
    res.redirect(303, `/admin/stories/${req.params['storyId']}/chapter/${req.params['chapterNumber']}`, next);
  }, rejection => {
    req.log.warn({chapter_id: req.params['chapterNumber'], error: rejection});
    res.redirect(303, `/admin/stories/${req.params['storyId']}/chapter/${req.params['chapterNumber']}`, next);
  });
};

const viewDeleteSingleChapter = function (req, res, next) {
  chapterHandlerInstance.findChapterByStoryAndNumber(req.params['storyId'], req.params['chapterNumber']).then((chapter) => {
    res.contentType = 'text/html';
    res.header('content-type', 'text/html');
    res.send(200, renderer.render('pages/admin/stories/admin_chapter_delete_single.njk', {
      top_page: {
        title: 'Administrator Toolkit',
        tagline: 'All the functions that the administrator of the site has available to them',
        fa_type: 'fas',
        fa_choice: 'fa-toolbox'
      },

      content: {
        chapter: chapter.pop()
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

const deleteSingleChapter = function (req, res, next) {
  Promise.all([
    chapterHandlerInstance.deleteChapter(req.body['chapter-id']),
    storyHandlerInstance.removeChapterFromStory(req.params['storyId'], req.body['chapter-id'])
  ])
      .then(() => {
        res.redirect(303, `/admin/stories/${req.params['storyId']}`, next);
      }, rejection => {
        req.log.warn('Failed to delete chapter');
        req.log.warn(rejection);
        res.redirect(303, `/admin/stories/${req.params['storyId']}/chapter/${req.params['chapterNumber']}`, next);
      });
};

module.exports = (server) => {
  server.get('/admin/stories/:storyId/chapter/new', testLoggedIn, viewCreateNewChapter);
  server.post('/admin/stories/:storyId/chapter/new', testLoggedIn, createNewChapter);
  server.get('/admin/stories/:storyId/chapter/:chapterNumber', testLoggedIn, viewSingleChapter);
  server.get('/admin/stories/:storyId/chapter/:chapterNumber/edit', testLoggedIn, viewEditSingleChapter);
  server.post('/admin/stories/:storyId/chapter/:chapterNumber/edit', testLoggedIn, editSingleChapter);
  server.get('/admin/stories/:storyId/chapter/:chapterNumber/delete', testLoggedIn, viewDeleteSingleChapter);
  server.post('/admin/stories/:storyId/chapter/:chapterNumber/delete', testLoggedIn, deleteSingleChapter);
};
