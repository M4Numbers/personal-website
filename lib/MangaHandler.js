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
            "title": {
                "romaji": String,
                "english": String,
                "native": String
            },
            "score": Number,
            "status": String,
            "total_vols": Number,
            "total_chaps": Number,
            "current_vol": Number,
            "current_chap": Number,
            "synopsis": String,
            "cover_img": {
                "medium": String,
                "large": String
            },
            "tags": Array,
            "time_updated": {type: Date, default: Date.now()},
            "review": String,
            "last_hash": String
        });
        this.MangaBookModel = this.mongoDbInstance.bootModel("MangaBook", this.MangaBook);
    }

    findMangaByRawId(rawId) {
        return this.mongoDbInstance.findById(this.MangaBookModel, rawId);
    }

    findMangaByAniListId(aniListId) {
        return this.mongoDbInstance.findFromQuery(this.MangaBookModel, {"manga_id.ani_list": aniListId}, 0, 1, {});
    }

    buildQuery(status = "") {
        let query = {};
        if (status !== "all") {
            if (status === "read") {
                query["current_chap"] = {$gte: 1};
            }
            if (status === "completed") {
                query["status"] = "COMPLETED";
            }
            if (status === "reading") {
                query["status"] = "CURRENT";
            }
            if (status === "held") {
                query["status"] = "PAUSED";
            }
            if (status === "dropped") {
                query["status"] = "DROPPED";
            }
            if (status === "planned") {
                query["status"] = "PLANNING";
            }
        }
        return query;
    }

    findMangaBooks(skip, limit, sort, category = "") {
        return this.mongoDbInstance.findFromQuery(this.MangaBookModel, this.buildQuery(category), skip, limit, sort);
    }

    getTotalBookCount(category = "") {
        return this.mongoDbInstance.getTotalCountFromQuery(this.MangaBookModel, this.buildQuery(category));
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

    updateExistingManga(originalId, ids, titles, mangaType, myStatus, score, currentVol, currentChap, totalVols, totalChaps, airingStatus, synopsis, coverImgs, hash) {
        return new Promise((resolve, reject) => {
            this.findMangaByRawId(originalId).then(oldMangaItem => {
                if (typeof oldMangaItem === "undefined") {
                    reject(new Error("Could not find given manga to update"));
                } else {
                    oldMangaItem = this.fillInMangaMetadata(oldMangaItem, ids, titles, mangaType, myStatus, score, currentVol, currentChap, totalVols, totalChaps, airingStatus, synopsis, coverImgs, hash);
                    this.upsertManga(oldMangaItem).then(resolve, reject).catch(reject);
                }
            }, reject).catch(reject);
        });
    }

    addNewManga(ids, titles, mangaType, myStatus, score, currentVol, currentChap, totalVols, totalChaps, airingStatus, synopsis, coverImgs, hash) {
        return new Promise((resolve, reject) => {
            let newManga = new this.MangaBookModel();
            newManga._id = oId();
            newManga = this.fillInMangaMetadata(newManga, ids, titles, mangaType, myStatus, score, currentVol, currentChap, totalVols, totalChaps, airingStatus, synopsis, coverImgs, hash);
            this.upsertManga(newManga).then(resolve, reject).catch(reject);
        });
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
