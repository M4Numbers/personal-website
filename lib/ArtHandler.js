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

class ArtHandler {

    static getHandler() {
        if (this.artHandlerInstance === undefined) {
            logger.debug("Starting up a new instance of the art database handler");
            this.artHandlerInstance = new ArtHandler();
        }
        return this.artHandlerInstance;
    }

    constructor() {
        this.mongoDbInstance = MongoDbHandler.getMongo();

        this.ArtPiece = new Schema({
            "_id": ObjectId,
            "title": String,
            "image": {
                "full_size": String,
                "thumb": String
            },
            "date_completed": {type: Date},
            "tags": Array,
            "time_updated": {type: Date, default: Date.now()},
            "notes": String
        });
        this.ArtPieceModel = this.mongoDbInstance.bootModel("ArtPiece", this.ArtPiece);
    }

    findArtByRawId(rawId) {
        return this.mongoDbInstance.findById(this.ArtPieceModel, rawId);
    }

    findAllArtPieces(skip, limit, sort) {
        return this.mongoDbInstance.findFromQuery(this.ArtPieceModel, {}, skip, limit, sort);
    }

    getTotalArtPieceCount() {
        return this.mongoDbInstance.getTotalCountFromQuery(this.ArtPieceModel, {});
    }

    upsertArt (pieceToUpsert) {
        return this.mongoDbInstance.upsertItem(pieceToUpsert);
    }

    updateExistingArtPiece(originalId, title, completedDate, image, tags, notes) {
        return new Promise((resolve, reject) => {
            this.findArtByRawId(originalId).then(oldArtItem => {
                if (typeof oldArtItem === "undefined") {
                    reject(new Error("Could not find given art piece to update"));
                } else {
                    oldArtItem = this.fillInArtMetadata(oldArtItem, title, completedDate, image, tags, notes);
                    this.upsertArt(oldArtItem).then(resolve, reject).catch(reject);
                }
            }, reject).catch(reject);
        });
    }

    addNewArtItem(title, completedDate, image, tags, notes) {
        return new Promise((resolve, reject) => {
            let newArtPiece = new this.ArtPieceModel();
            newArtPiece._id = oId();
            newArtPiece = this.fillInArtMetadata(newArtPiece, title, completedDate, image, tags, notes);
            this.upsertArt(newArtPiece).then(resolve, reject).catch(reject);
        });
    }

    fillInArtMetadata(artPieceToUpdate, title, completedDate, image, tags, notes) {
        artPieceToUpdate.title = title;
        artPieceToUpdate.date_completed = completedDate;
        artPieceToUpdate.image.thumb = image;
        artPieceToUpdate.image.full_size = image;
        artPieceToUpdate.tags = tags;
        artPieceToUpdate.notes = notes;
        return artPieceToUpdate;
    }

}

ArtHandler.artHandlerInstance = undefined;

module.exports = ArtHandler;
