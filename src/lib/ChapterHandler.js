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

class ChapterHandler {

  static getHandler() {
    if (this.chapterHandlerInstance === undefined) {
      logger.debug('Starting up a new instance of the chapter database handler');
      this.chapterHandlerInstance = new ChapterHandler();
    }
    return this.chapterHandlerInstance;
  }

  constructor() {
    this.mongoDbInstance = MongoDbHandler.getMongo();

    this.Chapter = new Schema({
      '_id': ObjectId,
      'parent_story_id': String,
      'chapter_number': Number,
      'chapter_title': String,
      'chapter_text': String,
      'time_posted': {type: Date, default: Date.now()},
      'time_updated': {type: Date, default: Date.now()},
      'author_notes': String
    });
    this.ChapterModel = this.mongoDbInstance.bootModel('Chapter', this.Chapter);
  }

  async findChapterByRawId(rawId) {
    return this.mongoDbInstance.findById(this.ChapterModel, rawId);
  }

  buildQuery(storyId) {
    return {
      'parent_story_id': {'$eq': storyId}
    };
  }

  async findChaptersByStory(storyId, skip = 0, limit = 25, sort = {'chapter_number': 1}) {
    return this.mongoDbInstance.findFromQuery(this.ChapterModel, this.buildQuery(storyId), skip, limit, sort);
  }

  async findChapterByStoryAndNumber(storyId, chapterNumber) {
    return this.mongoDbInstance.findFromQuery(this.ChapterModel, {
      'parent_story_id': {'$eq': storyId},
      'chapter_number': {'$eq': chapterNumber}
    }, 0, 1, {});
  }

  async upsertChapter(chapterToUpsert) {
    return this.mongoDbInstance.upsertItem(chapterToUpsert);
  }

  async deleteChapter(chapterIdToRemove) {
    return this.mongoDbInstance.deleteById(this.ChapterModel, chapterIdToRemove);
  }

  async updateExistingChapter(originalId, chapterNumber, title, text, notes) {
    logger.info(`Updating chapter with raw id of ${originalId}`);
    let oldChapter = await this.findChapterByRawId(originalId);
    if (typeof oldChapter === 'undefined') {
      logger.warn('Could not find given chapter to update');
      throw new Error('Could not find given chapter to update');
    } else {
      oldChapter = this.fillInChapterMetadata(oldChapter, chapterNumber, title, text, notes);
      return await this.upsertChapter(oldChapter);
    }
  }

  async addNewChapter(parentStoryId, chapterNumber, title, text, notes) {
    let newChapter = new this.ChapterModel();
    newChapter._id = oId();
    newChapter.parent_story_id = parentStoryId;
    newChapter = this.fillInChapterMetadata(newChapter, chapterNumber, title, text, notes);
    return await this.upsertChapter(newChapter);
  }

  fillInChapterMetadata(chapterToUpdate, chapterNumber, title, text, notes) {
    chapterToUpdate.chapter_number = chapterNumber;
    chapterToUpdate.chapter_title = title;
    chapterToUpdate.chapter_text = text;
    chapterToUpdate.author_notes = notes;
    chapterToUpdate.time_updated = Date.now();
    return chapterToUpdate;
  }

}

ChapterHandler.chapterHandlerInstance = undefined;

module.exports = ChapterHandler;
