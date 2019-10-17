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
const path = require('path');
const request = require('request-promise-native');

const MediaTypes = require('./MediaTypes');

const logger = require('./logger').bunyanLogger();

class AniListHandler {
  static getHandler () {
    if (this.aniListHandlerInstance === undefined) {
      this.aniListHandlerInstance = new AniListHandler();
    }
    return this.aniListHandlerInstance;
  }

  constructor () {
    this.aniListMangaQuery = fs.readFileSync(
      path.join(__dirname, '../', 'gql', 'animeAniList.gql'),
      { encoding: 'utf-8' },
    );
    this.aniListMangaQuery = fs.readFileSync(
      path.join(__dirname, '../', 'gql', 'mangaAniList.gql'),
      { encoding: 'utf-8' },
    );
  }

  async getMangaQueryTemplate () {
    if (this.aniListMangaQuery === undefined) {
      this.aniListMangaQuery = fs.readFileSync(
        path.join(__dirname, '../', 'gql', 'mangaAniList.gql'),
        { encoding: 'utf-8' },
      );
    }
    return this.aniListMangaQuery;
  }

  async getAnimeQueryTemplate () {
    if (this.aniListAnimeQuery === undefined) {
      this.aniListAnimeQuery = fs.readFileSync(
        path.join(__dirname, '../', 'gql', 'animeAniList.gql'),
        { encoding: 'utf-8' },
      );
    }
    return this.aniListAnimeQuery;
  }

  async performRequest (body) {
    return request({
      url:     'https://graphql.anilist.co',
      method:  'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept':       'application/json',
      },
      body,
      json: true,
    });
  }

  async getPageOfAniListAnimeResults (page = 0) {
    try {
      const query = await this.getAnimeQueryTemplate();
      const variables = {
        page,
        mediaType: MediaTypes.ANIME,
      };

      return await this.performRequest({
        query,
        variables,
      });
    } catch (e) {
      logger.warn(`Unhandled exception when requesting aniList data :: ${e.message}`);
      throw e;
    }
  }

  async getPageOfAniListMangaResults (page = 0) {
    try {
      const query = await this.getMangaQueryTemplate();
      const variables = {
        page,
        mediaType: MediaTypes.MANGA,
      };

      return await this.performRequest({
        query,
        variables,
      });
    } catch (e) {
      logger.warn(`Unhandled exception when requesting aniList data :: ${e.message}`);
      throw e;
    }
  }
}

AniListHandler.aniListHandlerInstance = undefined;
AniListHandler.aniListMangaQuery = undefined;
AniListHandler.aniListAnimeQuery = undefined;

module.exports = AniListHandler;
