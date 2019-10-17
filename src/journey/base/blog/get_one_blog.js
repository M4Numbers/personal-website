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

const blogHandlerInstance = require('../../../lib/BlogHandler').getHandler();
const renderer = require('../../../lib/renderer').nunjucksRenderer();

const getOneBlog = async (req, res, next) => {
  try {
    const blogPost = await blogHandlerInstance.findBlog(req.params.blogId);

    if (blogPost !== null) {
      res.contentType = 'text/html';
      res.header('content-type', 'text/html');
      res.send(200, renderer.render('pages/blog_single.njk', {
        ...res.nunjucks,

        top_page: {
          title:     blogPost.long_title,
          blog_tags: blogPost.tags,
          image_src: '/assets/images/J_handle.png',
          image_alt: 'Main face of the site',
        },

        content: {
          blog_text: blogPost.full_text,
        },

        head: {
          title:        `J4Numbers :: ${blogPost.long_title}`,
          description:  'Home to the wild things',
          current_page: 'blog',
        },
      }));
      next();
    } else {
      next(new errors.NotFoundError());
    }
  } catch (rejection) {
    req.log.warn(`Issue found when trying to find single blog post :: ${rejection.message}`);
    next(new errors.InternalServerError(rejection.message));
  }
};

module.exports = getOneBlog;
