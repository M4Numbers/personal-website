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

const logger = require('../../../lib/Logger').getLogger('master');

const animeHandler = require('../../../lib/AnimeHandler').getHandler();
const artHandler = require('../../../lib/ArtHandler').getHandler();
const blogHandler = require('../../../lib/BlogHandler').getHandler();
const kinkHandler = require('../../../lib/KinkHandler').getHandler();
const mangaHandler = require('../../../lib/MangaHandler').getHandler();
const storyHandler = require('../../../lib/StoryHandler').getHandler();

// TODO: Fix
const doSearch = async (req, res) => {
    let renderVars = {
        top_page: {
            title: 'Search',
            tagline: 'Search through all the items that are on offer',
            fa_type: 'fas',
            fa_choice: 'fa-search'
        },

        pagination: {
            base_url: `/search?q=${req.query['q']}&`,
            page: Math.max((req.query['page'] || 1), 1),
            page_size: 12
        },

        head: {
            title: 'M4Numbers :: Search',
            description: 'Home to the wild things',
            current_page: 'search',
            current_category: req.query['category'] || 'all'
        },

        translators: {
            anilist: (item) => item['title']['romaji'],
            blogs: (item) => item['long_title'],
            kinks: (item) => item['kink_name'],
            title: (item) => item['title']
        },

        search: req.query['q']
    };
    try {
        const tagList = renderVars.search.split(/, */);

        let query = {
            tags: {
                $all: tagList
            }
        };

        Promise.all([
            animeHandler.findAnimeShowsByQuery(query, 0, 10, {'title.romaji': -1}),
            artHandler.findArtPiecesByQuery(query, 0, 10, {'title': -1}),
            blogHandler.findBlogsByQuery(query, 0, 10, {'long_title': -1}),
            kinkHandler.findKinksByQuery(query, 0, 10, {'kink_name': -1}),
            mangaHandler.findMangaBooksByQuery(query, 0, 10, {'title.romaji': -1}),
            storyHandler.findStoriesByQuery(query, 0, 10, {'title': -1})
        ])
            .then(([animeItems, artItems, blogItems, kinkItems, mangaItems, storyItems]) => {
                if (!req.signedCookies.knows_me) {
                    logger.debug('Not signed in... filtering unprotected items');
                    blogItems.filter((item) => item.public);
                    kinkItems = undefined;
                }
                return Promise.resolve([animeItems, artItems, blogItems, kinkItems, mangaItems, storyItems]);
            })
            .then(([animeItems, artItems, blogItems, kinkItems, mangaItems, storyItems]) => {
                renderVars['content'] = {
                    'anime': animeItems,
                    'art': artItems,
                    'blogs': blogItems,
                    'manga': mangaItems,
                    'stories': storyItems
                };
                if (typeof  kinkItems !== 'undefined') {
                    renderVars['content']['kinks'] = kinkItems;
                }
                return Promise.resolve();
            })
            .then(() => {
                res.render('./pages/search', renderVars);
            });
    } catch (e) {
        logger.warn('Error when trying to search items');
        logger.warn(e.message);
        renderVars['error'] = e;
        res.render('./pages/search', renderVars);
    }
};

module.exports = doSearch;
