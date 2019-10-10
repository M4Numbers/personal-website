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

const errors = require('restify-errors');

const renderer = require('../../../lib/renderer').nunjucksRenderer();
const artHandlerInstance = require('../../../lib/ArtHandler').getHandler();

const getOneArt = async (req, res, next) => {
    try {
        const picture = await artHandlerInstance.findArtByRawId(req.params['artId']);
        res.contentType = 'text/html';
        res.header('content-type', 'text/html');
        res.send(200, renderer.render('pages/art/art_one.njk', {
            top_page: {
                title: picture.title,
                tagline: 'A collection of the things that I have attempted to draw at some point or another',
                image_src: `data:image/png;base64,${picture.image.thumb}`,
                image_alt: picture.title
            },

            content: {
                picture: picture
            },

            head: {
                title: 'J4Numbers :: Hobbies :: Art :: ',
                description: 'Home to the wild things',
                current_page: 'hobbies',
                current_sub_page: 'art',
            }
        }));
        next();
    } catch (e) {
        next(new errors.InternalServerError(e.message));
    }
};

module.exports = getOneArt;
