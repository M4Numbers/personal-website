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

const ChapterHandler = require('../../../lib/ChapterHandler');
const chapterHandlerInstance = ChapterHandler.getHandler();

// All endpoints below are prefixed with `/admin/stories/:storyId/chapter`

const editSingleChapter = async (req, res, next) => {
  try {
    await chapterHandlerInstance.updateExistingChapter(
      req.body[ 'chapter-id' ], req.body[ 'chapter-number' ],
      req.body[ 'chapter-title' ], req.body[ 'chapter-text' ],
      req.body[ 'chapter-comments' ],
    );
    res.redirect(
      303,
      `/admin/stories/${req.params.storyId}/chapter/${req.params.chapterNumber}`,
      next,
    );
  } catch (e) {
    req.log
      .warn(`Issue when trying to update chapter_id ${req.params.chapterNumber} :: ${e.message}`);
    res.redirect(
      303,
      `/admin/stories/${req.params.storyId}/chapter/${req.params.chapterNumber}`,
      next,
    );
  }
};

module.exports = editSingleChapter;
