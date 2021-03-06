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
const mangaHandlerInstance = require('../../../lib/MangaHandler').getHandler();

const getOneManga = async (req, res, next) => {
  try {
    const manga = await mangaHandlerInstance.findMangaByRawId(req.params.mangaId);
    res.contentType = 'text/html';
    res.header('content-type', 'text/html');
    res.send(200, renderer.render('pages/manga/manga_one.njk', {
      top_page: {
        title:     manga.title.romaji,
        tagline:   'A list of all the strange things that I have read at some point or another',
        image_src: manga.cover_img.large,
        image_alt: manga.title.romaji,
      },

      content: {
        book:     manga,
        comments: manga.review,
      },

      head: {
        title:            'J4Numbers :: Hobbies :: Manga :: ',
        description:      'Home to the wild things',
        current_page:     'hobbies',
        current_sub_page: 'manga',
      },
    }));
    next();
  } catch (e) {
    req.log.warn(`Issue found when trying to get single manga :: ${e.message}`);
    next(new errors.InternalServerError(e.message));
  }
};

module.exports = getOneManga;
