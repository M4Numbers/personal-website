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

const fs = require('fs');

const StoryHandler = require('../../../lib/StoryHandler');
const storyHandlerInstance = StoryHandler.getHandler();

const createNewStory = async (req, res, next) => {
  try {
    let imageAsBase64 = '';
    if (typeof req.files[ 'story-image' ] !== 'undefined') {
      req.log.info(`Reading in new image from ${req.files[ 'story-image' ].path}`);
      imageAsBase64 = fs.readFileSync(req.files[ 'story-image' ].path, 'base64');
    }
    const savedStory = await storyHandlerInstance.addNewStory(
      req.body[ 'story-title' ], req.body[ 'story-status' ], req.body[ 'story-type' ],
      req.body[ 'story-synopsis' ], imageAsBase64,
      req.body[ 'story-tags' ].split(/, ?/u).map((tag) => tag.trim()).filter((tag) => tag !== ''),
      req.body[ 'story-notes' ],
    );
    res.redirect(303, `/admin/stories/${savedStory._id}`, next);
  } catch (e) {
    req.log.warn(`Issue found when creating new story :: ${e.message}`);
    res.redirect(303, '/admin/stories/new', next);
  }
};

module.exports = createNewStory;
