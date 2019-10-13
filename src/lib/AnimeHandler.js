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

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const oId = mongoose.Types.ObjectId;

const MongoDbHandler = require('./MongoDbHandler');

const logger = require('./logger').bunyanLogger();

class AnimeHandler {

  static getHandler() {
    if (this.animeHandlerInstance === undefined) {
      logger.debug('Starting up a new instance of the anime database handler');
      this.animeHandlerInstance = new AnimeHandler();
    }
    return this.animeHandlerInstance;
  }

  constructor() {
    this.mongoDbInstance = MongoDbHandler.getMongo();

    this.AnimeShow = new Schema({
      '_id': ObjectId,
      'last_hash': String,
      'anime_id': {
        'ani_list': Number,
        'my_anime_list': Number,
        'ani_db': Number
      },
      'anime_status': String,
      'title': {
        'romaji': String,
        'english': String,
        'native': String
      },
      'score': Number,
      'status': String,
      'total_eps': Number,
      'current_ep': Number,
      'synopsis': String,
      'cover_img': {
        'large': String,
        'medium': String
      },
      'tags': Array,
      'time_updated': {type: Date, default: Date.now()},
      'review': String
    });
    this.AnimeShowModel = this.mongoDbInstance.bootModel('AnimeShow', this.AnimeShow);
  }

  async findAnimeByAniListId(aniListId) {
    return this.mongoDbInstance.findFromQuery(this.AnimeShowModel, {'anime_id.ani_list': aniListId}, 0, 1, {});
  }

  async findAnimeByRawId(rawId) {
    return this.mongoDbInstance.findById(this.AnimeShowModel, rawId);
  }

  buildQuery(status = '') {
    let query = {};
    if (status !== 'all') {
      if (status === 'seen') {
        query['current_ep'] = {$gte: 1};
      }
      if (status === 'completed') {
        query['status'] = 'COMPLETED';
      }
      if (status === 'watching') {
        query['status'] = 'CURRENT';
      }
      if (status === 'held') {
        query['status'] = 'PAUSED';
      }
      if (status === 'dropped') {
        query['status'] = 'DROPPED';
      }
      if (status === 'planned') {
        query['status'] = 'PLANNING';
      }
    }
    return query;
  }

  async findAnimeShows(skip, limit, sort, category = '') {
    return this.mongoDbInstance.findFromQuery(this.AnimeShowModel, this.buildQuery(category), skip, limit, sort);
  }

  async findAnimeShowsByQuery(query, skip, limit, sort) {
    return this.mongoDbInstance.findFromQuery(this.AnimeShowModel, query, skip, limit, sort);
  }

  async getTotalShowCount(category = '') {
    return this.mongoDbInstance.getTotalCountFromQuery(this.AnimeShowModel, this.buildQuery(category));
  }

  async upsertAnime(animeToUpsert) {
    return this.mongoDbInstance.upsertItem(animeToUpsert);
  }

  async editAnime(animeId, reviewText, tagList) {
    let oldAnimeShow = await this.findAnimeByRawId(animeId);
    if (typeof oldAnimeShow === 'undefined') {
      throw new Error('Could not find given show to update');
    } else {
      oldAnimeShow = this.fillInAnime(oldAnimeShow, reviewText, tagList);
      return await this.upsertAnime(oldAnimeShow);
    }
  }

  fillInAnime(animeToUpdate, reviewText, tagList) {
    animeToUpdate.review = reviewText;
    animeToUpdate.tags = tagList;
    animeToUpdate.time_updated = Date.now();
    return animeToUpdate;
  }

  async updateExistingAnime(
      originalId, ids, titles, myStatus, score, currentEps, totalEps,
      airingStatus, synopsis, coverImgs, hash,
  ) {
    let oldAnimeItem = await this.findAnimeByRawId(originalId);
    if (typeof oldAnimeItem === 'undefined') {
      throw new Error('Could not find given anime to update');
    } else {
      oldAnimeItem = this.fillInAnimeMetadata(
          oldAnimeItem, ids, titles, myStatus, score, currentEps,
          totalEps, airingStatus, synopsis, coverImgs, hash,
      );
      return await this.upsertAnime(oldAnimeItem);
    }
  }

  async addNewAnime(
      ids, titles, myStatus, score, currentEps, totalEps, airingStatus,
      synopsis, coverImgs, hash,
  ) {
    let newAnime = new this.AnimeShowModel();
    newAnime._id = oId();
    newAnime = this.fillInAnimeMetadata(
        newAnime, ids, titles, myStatus, score, currentEps,
        totalEps, airingStatus, synopsis, coverImgs, hash,
    );
    return await this.upsertAnime(newAnime);
  }

  fillInAnimeMetadata(animeToUpdate, ids, titles, myStatus, score, currentEps, totalEps, airingStatus, synopsis, coverImgs, hash) {
    animeToUpdate.anime_id = ids;
    animeToUpdate.title = titles;
    animeToUpdate.status = myStatus;
    animeToUpdate.score = score;
    animeToUpdate.current_ep = currentEps;
    animeToUpdate.total_eps = totalEps;
    animeToUpdate.anime_status = airingStatus;
    animeToUpdate.synopsis = synopsis;
    animeToUpdate.cover_img = coverImgs;
    animeToUpdate.last_hash = hash;
    return animeToUpdate;
  }

}

AnimeHandler.animeHandlerInstance = undefined;

module.exports = AnimeHandler;
