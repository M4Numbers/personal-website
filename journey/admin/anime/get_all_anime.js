/*
 * MIT License
 *
 * Copyright (c) 2019 Matthew D. Ball
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

const getAllAnime = async (req, res) => {
    Promise.all(
        [
            animeHandlerInstance.findAnimeShows(Math.max(0, ((req.query['page'] || 1) - 1)) * 10, 10, {'title.romaji': 1}, false),
            animeHandlerInstance.getTotalShowCount(false)
        ]
    ).then(([shows, totalCount]) => {
        res.render('./pages/admin/anime/admin_anime_view', {
            top_page: {
                title: 'Administrator Toolkit',
                tagline: 'All the functions that the administrator of the site has available to them',
                fa_type: 'fas',
                fa_choice: 'fa-toolbox'
            },

            content: {
                shows: shows
            },

            pagination: {
                base_url: '/admin/anime?',
                total: totalCount,
                page: Math.max((req.query['page'] || 1), 1),
                page_size: 10
            },

            head: {
                title: 'M4Numbers',
                description: 'Home to the wild things',
                current_page: 'admin',
                current_sub_page: 'anime-view'
            }
        });
    });
};

module.exports = getAllAnime;
