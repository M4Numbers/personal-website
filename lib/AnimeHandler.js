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

    static getHandler () {
        if (this.animeHandlerInstance === undefined) {
            logger.debug("Starting up a new instance of the anime database handler");
            this.animeHandlerInstance = new AnimeHandler();
        }
        return this.animeHandlerInstance;
    }

    constructor () {
        this.mongoDbInstance = MongoDbHandler.getMongo();

        this.AnimeShow = new Schema({
            "_id": ObjectId,
            "anime_id": Number,
            "anime_status": String,
            "title": String,
            "score": Number,
            "status": String,
            "total_eps": Number,
            "current_ep": Number,
            "synopsis": String,
            "cover_img": String,
            "review": String
        });
        this.AnimeShowModel = this.mongoDbInstance.bootModel("AnimeShow", this.AnimeShow);
    }

    findAnimeByRawId (rawId) {
        return this.mongoDbInstance.findById(this.AnimeShowModel, rawId);
    }

    buildQuery (status="") {
        let query = {};
        if (status !== "") {
            query["status"] = status;
        }
        return query;
    }

    findAnimeShows (skip, limit, sort, category="") {
        return this.mongoDbInstance.findFromQuery(this.AnimeShowModel, this.buildQuery(category), skip, limit, sort);
    }

    getTotalShowCount (category="") {
        return this.mongoDbInstance.getTotalCountFromQuery(this.AnimeShowModel, this.buildQuery(category));
    }
}

AnimeHandler.animeHandlerInstance = undefined;

module.exports = AnimeHandler;
