/*
 * MIT License
 *
 * Copyright (c) 2018 Jayne Doe
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

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const oId = mongoose.Types.ObjectId;

const MongoDbHandler = require('./MongoDbHandler');

const logger = require('./logger').bunyanLogger();

class MangaHandler {

    static getHandler() {
        if (this.mangaHandlerInstance === undefined) {
            logger.debug('Starting up a new instance of the manga database handler');
            this.mangaHandlerInstance = new MangaHandler();
        }
        return this.mangaHandlerInstance;
    }

    constructor() {
        this.mongoDbInstance = MongoDbHandler.getMongo();

        this.MangaBook = new Schema({
            '_id': ObjectId,
            'manga_id': {
                'ani_list': Number,
                'my_anime_list': Number,
                'ani_db': Number
            },
            'manga_status': String,
            'story_type': String,
            'title': {
                'romaji': String,
                'english': String,
                'native': String
            },
            'score': Number,
            'status': String,
            'total_vols': Number,
            'total_chaps': Number,
            'current_vol': Number,
            'current_chap': Number,
            'synopsis': String,
            'cover_img': {
                'medium': String,
                'large': String
            },
            'tags': Array,
            'time_updated': {type: Date, default: Date.now()},
            'review': String,
            'last_hash': String
        });
        this.MangaBookModel = this.mongoDbInstance.bootModel('MangaBook', this.MangaBook);
    }

    async findMangaByRawId(rawId) {
        return this.mongoDbInstance.findById(this.MangaBookModel, rawId);
    }

    async findMangaByAniListId(aniListId) {
        return this.mongoDbInstance.findFromQuery(this.MangaBookModel, {'manga_id.ani_list': aniListId}, 0, 1, {});
    }

    buildQuery(status = '') {
        let query = {};
        if (status !== 'all') {
            if (status === 'read') {
                query['current_chap'] = {$gte: 1};
            }
            if (status === 'completed') {
                query['status'] = 'COMPLETED';
            }
            if (status === 'reading') {
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

    async findMangaBooks(skip, limit, sort, category = '') {
        return this.mongoDbInstance.findFromQuery(this.MangaBookModel, this.buildQuery(category), skip, limit, sort);
    }

    async findMangaBooksByQuery(query, skip, limit, sort) {
        return this.mongoDbInstance.findFromQuery(this.MangaBookModel, query, skip, limit, sort);
    }

    async getTotalBookCount(category = '') {
        return this.mongoDbInstance.getTotalCountFromQuery(this.MangaBookModel, this.buildQuery(category));
    }

    async upsertManga (mangaToUpsert) {
        return this.mongoDbInstance.upsertItem(mangaToUpsert);
    }

    async editManga (mangaId, reviewText, tagList) {
        let oldMangaBook = await this.findMangaByRawId(mangaId);
        if (typeof oldMangaBook === 'undefined') {
            throw new Error('Could not find given show to update');
        } else {
            oldMangaBook = this.fillInManga(oldMangaBook, reviewText, tagList);
            return await this.upsertManga(oldMangaBook);
        }
    }

    fillInManga (mangaToUpdate, reviewText, tagList) {
        mangaToUpdate.review = reviewText;
        mangaToUpdate.tags = tagList;
        mangaToUpdate.time_updated = Date.now();
        return mangaToUpdate;
    }

    async updateExistingManga(
        originalId, ids, titles, mangaType, myStatus, score, currentVol,
        currentChap, totalVols, totalChaps, airingStatus, synopsis,
        coverImgs, hash,
    ) {
        let oldMangaItem = await this.findMangaByRawId(originalId);
        if (typeof oldMangaItem === 'undefined') {
            throw new Error('Could not find given manga to update');
        } else {
            oldMangaItem = this.fillInMangaMetadata(
                oldMangaItem, ids, titles, mangaType, myStatus, score,
                currentVol, currentChap, totalVols, totalChaps, airingStatus,
                synopsis, coverImgs, hash,
            );
            return await this.upsertManga(oldMangaItem);
        }
    }

    async addNewManga(
        ids, titles, mangaType, myStatus, score, currentVol, currentChap,
        totalVols, totalChaps, airingStatus, synopsis, coverImgs, hash,
    ) {
        let newManga = new this.MangaBookModel();
        newManga._id = oId();
        newManga = this.fillInMangaMetadata(
            newManga, ids, titles, mangaType, myStatus, score, currentVol,
            currentChap, totalVols, totalChaps, airingStatus, synopsis,
            coverImgs, hash,
        );
        return await this.upsertManga(newManga);
    }

    fillInMangaMetadata(mangaToUpdate, ids, titles, mangaType, myStatus, score, currentVol, currentChap, totalVols, totalChaps, airingStatus, synopsis, coverImgs, hash) {
        mangaToUpdate.manga_id = ids;
        mangaToUpdate.title = titles;
        mangaToUpdate.story_type = mangaType;
        mangaToUpdate.status = myStatus;
        mangaToUpdate.score = score;
        mangaToUpdate.current_vol = currentVol;
        mangaToUpdate.current_chap = currentChap;
        mangaToUpdate.total_vols = totalVols;
        mangaToUpdate.total_chaps = totalChaps;
        mangaToUpdate.manga_status = airingStatus;
        mangaToUpdate.synopsis = synopsis;
        mangaToUpdate.cover_img = coverImgs;
        mangaToUpdate.last_hash = hash;
        return mangaToUpdate;
    }

}

MangaHandler.mangaHandlerInstance = undefined;

module.exports = MangaHandler;
