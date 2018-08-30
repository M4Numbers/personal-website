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

class AnimeHandler {

    static getHandler() {
        if (this.animeHandlerInstance === undefined) {
            logger.debug("Starting up a new instance of the anime database handler");
            this.animeHandlerInstance = new AnimeHandler();
        }
        return this.animeHandlerInstance;
    }

    constructor() {
        this.mongoDbInstance = MongoDbHandler.getMongo();

        this.AnimeShow = new Schema({
            "_id": ObjectId,
            "last_hash": String,
            "anime_id": {
                "ani_list": Number,
                "my_anime_list": Number,
                "ani_db": Number
            },
            "anime_status": String,
            "title": {
                "romaji": String,
                "english": String,
                "native": String
            },
            "score": Number,
            "status": String,
            "total_eps": Number,
            "current_ep": Number,
            "synopsis": String,
            "cover_img": {
                "large": String,
                "medium": String
            },
            "tags": Array,
            "time_updated": {type: Date, default: Date.now()},
            "review": String
        });
        this.AnimeShowModel = this.mongoDbInstance.bootModel("AnimeShow", this.AnimeShow);
    }

    findAnimeByAniListId(aniListId) {
        return this.mongoDbInstance.findFromQuery(this.AnimeShowModel, {"anime_id.ani_list": aniListId}, 0, 1, {});
    }

    findAnimeByRawId(rawId) {
        return this.mongoDbInstance.findById(this.AnimeShowModel, rawId);
    }

    buildQuery(status = "") {
        let query = {};
        if (status !== "all") {
            if (status === "seen") {
                query["current_ep"] = {$gte: 1};
            }
            if (status === "completed") {
                query["status"] = "COMPLETED";
            }
            if (status === "watching") {
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

    findAnimeShows(skip, limit, sort, category = "") {
        return this.mongoDbInstance.findFromQuery(this.AnimeShowModel, this.buildQuery(category), skip, limit, sort);
    }

    getTotalShowCount(category = "") {
        return this.mongoDbInstance.getTotalCountFromQuery(this.AnimeShowModel, this.buildQuery(category));
    }

    upsertAnime (animeToUpsert) {
        return this.mongoDbInstance.upsertItem(animeToUpsert);
    }

    editAnime(animeId, reviewText, tagList) {
        return new Promise((resolve, reject) => {
            this.findAnimeByRawId(animeId).then(oldAnimeShow => {
                if (typeof oldAnimeShow === "undefined") {
                    reject(new Error("Could not find given show to update"));
                } else {
                    oldAnimeShow = this.fillInAnime(oldAnimeShow, reviewText, tagList);
                    this.upsertAnime(oldAnimeShow).then(resolve, reject).catch(reject);
                }
            }, reject).catch(reject);
        });
    }

    fillInAnime (animeToUpdate, reviewText, tagList) {
        animeToUpdate.review = reviewText;
        animeToUpdate.tags = tagList;
        animeToUpdate.time_updated = Date.now();
        return animeToUpdate;
    }

    updateExistingAnime(originalId, ids, titles, myStatus, score, currentEps, totalEps, airingStatus, synopsis, coverImgs, hash) {
        return new Promise((resolve, reject) => {
            this.findAnimeByRawId(originalId).then(oldAnimeItem => {
                if (typeof oldAnimeItem === "undefined") {
                    reject(new Error("Could not find given anime to update"));
                } else {
                    oldAnimeItem = this.fillInAnimeMetadata(oldAnimeItem, ids, titles, myStatus, score, currentEps, totalEps, airingStatus, synopsis, coverImgs, hash);
                    this.upsertAnime(oldAnimeItem).then(resolve, reject).catch(reject);
                }
            }, reject).catch(reject);
        });
    }

    addNewAnime(ids, titles, myStatus, score, currentEps, totalEps, airingStatus, synopsis, coverImgs, hash) {
        return new Promise((resolve, reject) => {
            let newAnime = new this.AnimeShowModel();
            newAnime._id = oId();
            newAnime = this.fillInAnimeMetadata(newAnime, ids, titles, myStatus, score, currentEps, totalEps, airingStatus, synopsis, coverImgs, hash);
            this.upsertAnime(newAnime).then(resolve, reject).catch(reject);
        });
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
