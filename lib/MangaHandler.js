/*
 * MIT License
 *
 * Copyright (c) 2018 Matthew D. Ball
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

const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const oId = mongoose.Types.ObjectId;

const MongoDbHandler = require("./MongoDbHandler");

const loggingSystem = require("./Logger");
const logger = loggingSystem.getLogger("master");

class MangaHandler {

    static getHandler() {
        if (this.mangaHandlerInstance === undefined) {
            logger.debug("Starting up a new instance of the manga database handler");
            this.mangaHandlerInstance = new MangaHandler();
        }
        return this.mangaHandlerInstance;
    }

    constructor() {
        this.mongoDbInstance = MongoDbHandler.getMongo();

        this.MangaBook = new Schema({
            "_id": ObjectId,
            "manga_id": {
                "ani_list": Number,
                "my_anime_list": Number,
                "ani_db": Number
            },
            "manga_status": String,
            "story_type": String,
            "title": String,
            "score": Number,
            "status": String,
            "total_vols": Number,
            "total_chaps": Number,
            "current_vol": Number,
            "current_chap": Number,
            "synopsis": String,
            "cover_img": String,
            "tags": Array,
            "time_updated": {type: Date, default: Date.now()},
            "review": String
        });
        this.MangaBookModel = this.mongoDbInstance.bootModel("MangaBook", this.MangaBook);
    }

    findMangaByRawId(rawId) {
        return new Promise(resolve => resolve({
            "_id": "acb123",
            "manga_id": {
                "my_anime_list": 12345,
                "ani_list": 12345
            },
            "manga_status": "Finished publishing",
            "story_type": "Light Novel",
            "title": "awesome manga title",
            "score": 6,
            "status": "Currently Reading",
            "total_vols": 32,
            "total_chaps": 160,
            "current_vol": 3,
            "current_chap": 17,
            "synopsis": "This is what happens in the awesome manga",
            "cover_img": "/images/handle_logo.png",
            "tags": [
                "tag_1",
                "tag_2"
            ],
            "review": "This is a review of that awesome manga"
        }));
        //return this.mongoDbInstance.findById(this.AnimeShowModel, rawId);
    }

    buildQuery(status = "") {
        let query = {};
        if (status !== "") {
            query["status"] = status;
        }
        return query;
    }

    findMangaBooks(skip, limit, sort, category = "") {
        return Array(limit).fill({
            "_id": "abc123",
            "manga_id": {
                "my_anime_list": 12345,
                "ani_list": 12345
            },
            "manga_status": "Finished publishing",
            "story_type": "Light Novel",
            "title": "awesome manga title",
            "score": 6,
            "status": "Currently Reading",
            "total_vols": 32,
            "total_chaps": 160,
            "current_vol": 3,
            "current_chap": 17,
            "synopsis": "This is what happens in the awesome manga",
            "cover_img": "/images/handle_logo.png",
            "tags": [
                "tag_1",
                "tag_2"
            ],
            "review": "This is a review of that awesome manga"
        });
        //return this.mongoDbInstance.findFromQuery(this.AnimeShowModel, this.buildQuery(category), skip, limit, sort);
    }

    getTotalBookCount(category = "") {
        return 50;
        //return this.mongoDbInstance.getTotalCountFromQuery(this.MangaBookModel, this.buildQuery(category));
    }

    upsertManga (mangaToUpsert) {
        return this.mongoDbInstance.upsertItem(mangaToUpsert);
    }

    editManga (mangaId, reviewText, tagList) {
        return new Promise((resolve, reject) => {
            this.findMangaByRawId(mangaId).then(oldMangaBook => {
                if (typeof oldMangaBook === "undefined") {
                    reject(new Error("Could not find given show to update"));
                } else {
                    oldMangaBook = this.fillInManga(oldMangaBook, reviewText, tagList);
                    this.upsertManga(oldMangaBook).then(resolve, reject).catch(reject);
                }
            }, reject).catch(reject);
        });
    }

    fillInManga (mangaToUpdate, reviewText, tagList) {
        mangaToUpdate.review = reviewText;
        mangaToUpdate.tags = tagList;
        mangaToUpdate.time_updated = Date.now();
        return mangaToUpdate;
    }

}

MangaHandler.mangaHandlerInstance = undefined;

module.exports = MangaHandler;
