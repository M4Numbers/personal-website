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

const animeHandlerInstance = require('../../../lib/AnimeHandler').getHandler();

const getOneAnime = async (req, res, next) => {
    animeHandlerInstance.findAnimeByRawId(req.params['animeId'])
        .catch(next)
        .then(anime => {
            res.render('./pages/anime/anime_one', {
                top_page: {
                    title: anime.title.romaji,
                    tagline: 'A list of all the strange things that I have seen at some point or another',
                    image_src: anime.cover_img.large,
                    image_alt: anime.title.romaji
                },

                content: {
                    show: anime,
                    comments: anime.review
                },

                head: {
                    title: 'J4Numbers :: Hobbies :: Anime :: ',
                    description: 'Home to the wild things',
                    current_page: 'hobbies',
                    current_sub_page: 'anime',
                }
            });
        }, next);
};

module.exports = getOneAnime;
