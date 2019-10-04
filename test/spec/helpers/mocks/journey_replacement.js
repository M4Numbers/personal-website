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

module.exports = {
    './journey/generate_404': sinon.fake(),
    './journey/render_error': sinon.fake(),

    './journey/base/homepage': sinon.fake(),

    './journey/base/blog/get_all_blogs': sinon.fake(),
    './journey/base/blog/get_one_blog': sinon.fake(),

    './journey/base/projects/get_all_projects': sinon.fake(),
    './journey/base/projects/get_one_project': sinon.fake(),

    './journey/base/search/do_search': sinon.fake(),

    './journey/base/statics/get_sitemap': sinon.fake(),
    './journey/base/statics/get_about_me': sinon.fake(),
    './journey/base/statics/get_contact_me': sinon.fake(),
    './journey/base/statics/get_stats': sinon.fake(),

    './journey/hobbies/generate_homepage': sinon.fake(),

    './journey/hobbies/anime/get_all_anime': sinon.fake(),
    './journey/hobbies/anime/get_one_anime': sinon.fake(),

    './journey/hobbies/art/get_all_art': sinon.fake(),
    './journey/hobbies/art/get_one_art': sinon.fake(),

    './journey/hobbies/manga/get_all_manga': sinon.fake(),
    './journey/hobbies/manga/get_one_manga': sinon.fake(),

    //TODO: Put me here

    './journey/hobbies/story/get_all_stories': sinon.fake(),
    './journey/hobbies/story/get_one_story': sinon.fake(),
    './journey/hobbies/story/get_one_chapter': sinon.fake(),
};
