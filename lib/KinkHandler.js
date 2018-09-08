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

class KinkHandler {

    static getHandler() {
        if (this.kinkHandlerInstance === undefined) {
            logger.debug("Starting up a new instance of the kink database handler");
            this.kinkHandlerInstance = new KinkHandler();
        }
        return this.kinkHandlerInstance;
    }

    constructor() {
        this.mongoDbInstance = MongoDbHandler.getMongo();

        this.KinkCollection = new Schema({
            "_id": ObjectId,
            "kink_name": String,
            "kink_description": String,
            "practicing_status": String,
            "personal_experience": String,
            "cover_img": String,
            "tags": Array,
            "time_updated": {type: Date, default: Date.now()}
        });
        this.KinkCollectionModel = this.mongoDbInstance.bootModel("KinkCollection", this.KinkCollection);
    }

    findKinkByRawId(rawId) {
        return this.mongoDbInstance.findById(this.KinkCollectionModel, rawId);
    }

    deleteKink(kinkId) {
        return this.mongoDbInstance.deleteById(this.KinkCollectionModel, kinkId);
    }

    buildQuery(status = "") {
        let query = {};
        return query;
    }

    findKinks(skip, limit, sort, category = "") {
        return this.mongoDbInstance.findFromQuery(this.KinkCollectionModel, this.buildQuery(category), skip, limit, sort);
    }

    getTotalKinkCount(category = "") {
        return this.mongoDbInstance.getTotalCountFromQuery(this.KinkCollectionModel, this.buildQuery(category));
    }

    upsertKink (kinkToUpsert) {
        return this.mongoDbInstance.upsertItem(kinkToUpsert);
    }

    updateExistingKink(originalId, title, description, status, experience, coverImg, tags) {
        return new Promise((resolve, reject) => {
            this.findKinkByRawId(originalId).then(oldAnimeItem => {
                if (typeof oldAnimeItem === "undefined") {
                    reject(new Error("Could not find given anime to update"));
                } else {
                    oldAnimeItem = this.fillInKink(oldAnimeItem, title, description, status, experience, coverImg, tags);
                    this.upsertKink(oldAnimeItem).then(resolve, reject).catch(reject);
                }
            }, reject).catch(reject);
        });
    }

    addNewKink(title, description, status, experience, image, tags) {
        return new Promise((resolve, reject) => {
            let newKink = new this.KinkCollectionModel();
            newKink._id = oId();
            newKink = this.fillInKink(newKink, title, description, status, experience, image, tags);
            this.upsertKink(newKink).then(resolve, reject).catch(reject);
        });
    }

    fillInKink(kinkToUpdate, title, description, status, experience, image, tags) {
        kinkToUpdate.kink_name = title;
        kinkToUpdate.kink_description = description;
        kinkToUpdate.practicing_status = status;
        kinkToUpdate.personal_experience = experience;
        kinkToUpdate.cover_img = image;
        kinkToUpdate.tags = tags;
        return kinkToUpdate;
    }

}

KinkHandler.kinkHandlerInstance = undefined;

module.exports = KinkHandler;
