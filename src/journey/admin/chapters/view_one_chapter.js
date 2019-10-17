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

const errors = require('restify-errors');

const renderer = require('../../../lib/renderer').nunjucksRenderer();

const StoryHandler = require('../../../lib/StoryHandler');
const storyHandlerInstance = StoryHandler.getHandler();

const ChapterHandler = require('../../../lib/ChapterHandler');
const chapterHandlerInstance = ChapterHandler.getHandler();

// All endpoints below are prefixed with `/admin/stories/:storyId/chapter`

const viewSingleChapter = async (req, res, next) => {
  try {
    const story = storyHandlerInstance.findStoryByRawId(req.params.storyId);
    const chapters = await chapterHandlerInstance
      .findChapterByStoryAndNumber(req.params.storyId, req.params.chapterNumber);
    if (chapters.length > 0) {
      story.chapter = chapters.pop();
    }
    res.contentType = 'text/html';
    res.header('content-type', 'text/html');
    res.send(200, renderer.render('pages/admin/stories/admin_chapter_view_single.njk', {
      top_page: {
        title:     'Administrator Toolkit',
        tagline:   'All the functions that the administrator of the site has available to them',
        fa_type:   'fas',
        fa_choice: 'fa-toolbox',
      },

      content: {
        story,
      },

      head: {
        title:            'J4Numbers',
        description:      'Home to the wild things',
        current_page:     'admin',
        current_sub_page: 'story-view',
      },
    }));
    next();
  } catch (e) {
    req.log.warn(`Issue found when trying to display chapter :: ${e.message}`);
    next(new errors.InternalServerError(e.message));
  }
};

module.exports = viewSingleChapter;
