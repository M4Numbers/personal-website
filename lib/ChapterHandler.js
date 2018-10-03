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

class ChapterHandler {

    static getHandler () {
        if (this.chapterHandlerInstance === undefined) {
            logger.debug("Starting up a new instance of the chapter database handler");
            this.chapterHandlerInstance = new ChapterHandler();
        }
        return this.chapterHandlerInstance;
    }

    constructor () {
        this.mongoDbInstance = MongoDbHandler.getMongo();

        this.Chapter = new Schema({
            "_id": ObjectId,
            "chapter_title": String,
            "chapter_text": String,
            "time_posted": {type: Date, default: Date.now()},
            "time_updated": {type: Date, default: Date.now()},
            "author_notes": String
        });
        this.ChapterModel = this.mongoDbInstance.bootModel("Chapter", this.Chapter);
    }

    findChapterByRawId (rawId) {
        return this.mongoDbInstance.findById(this.ChapterModel, rawId);
    }

    upsertChapter (chapterToUpsert) {
        return this.mongoDbInstance.upsertItem(chapterToUpsert);
    }

    deleteChapter (chapterIdToRemove) {
        return this.mongoDbInstance.deleteById(this.ChapterModel, chapterIdToRemove);
    }

    updateExistingChapter (originalId, title, text, notes) {
        return new Promise((resolve, reject) => {
            this.findChapterByRawId(originalId).then(oldChapter => {
                if (typeof oldChapter === "undefined") {
                    reject(new Error("Could not find given chapter to update"));
                } else {
                    oldChapter = this.fillInChapterMetadata(oldChapter, title, text, notes);
                    this.upsertChapter(oldChapter).then(resolve, reject).catch(reject);
                }
            }, reject).catch(reject);
        });
    }

    addNewChapter (title, text, notes) {
        return new Promise((resolve, reject) => {
            let newChapter = new this.ChapterModel();
            newChapter._id = oId();
            newChapter = this.fillInChapterMetadata(newChapter, title, text, notes);
            this.upsertChapter(newChapter).then(resolve, reject).catch(reject);
        });
    }

    fillInChapterMetadata (chapterToUpdate, title, text, notes) {
        chapterToUpdate.chapter_title = title;
        chapterToUpdate.chapter_text = text;
        chapterToUpdate.author_notes = notes;
        chapterToUpdate.time_updated = Date.now();
        return chapterToUpdate;
    }

}

ChapterHandler.chapterHandlerInstance = undefined;

module.exports = ChapterHandler;
