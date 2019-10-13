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

class StoryHandler {

  static getHandler() {
    if (this.storyHandlerInstance === undefined) {
      logger.debug('Starting up a new instance of the story database handler');
      this.storyHandlerInstance = new StoryHandler();
    }
    return this.storyHandlerInstance;
  }

  constructor() {
    this.mongoDbInstance = MongoDbHandler.getMongo();

    this.Story = new Schema({
      '_id': ObjectId,
      'story_status': String,
      'story_type': String,
      'title': String,
      'synopsis': String,
      'cover_img': String,
      'chapters': Array,
      'time_posted': {type: Date, default: Date.now()},
      'time_updated': {type: Date, default: Date.now()},
      'tags': Array,
      'meta_review': String
    });
    this.StoryModel = this.mongoDbInstance.bootModel('Story', this.Story);
  }

  async findStoryByRawId(rawId) {
    return this.mongoDbInstance.findById(this.StoryModel, rawId);
  }

  async findAllStories(skip, limit, sort) {
    return this.mongoDbInstance.findFromQuery(this.StoryModel, {}, skip, limit, sort);
  }

  async findStoriesByQuery(query, skip, limit, sort) {
    return this.mongoDbInstance.findFromQuery(this.StoryModel, query, skip, limit, sort);
  }

  async getTotalStoryCount() {
    return this.mongoDbInstance.getTotalCountFromQuery(this.StoryModel, {});
  }

  async upsertStory(storyToUpsert) {
    return this.mongoDbInstance.upsertItem(storyToUpsert);
  }

  async addChapterToStory(storyIdToUpdate, chapterNumber, chapterIdToAdd) {
    let story = await this.findStoryByRawId(storyIdToUpdate);
    story.chapters.push(chapterIdToAdd);
    return await this.upsertStory(story);
  }

  async removeChapterFromStory(storyIdToUpdate, chapterIdToRemove) {
    let story = await this.findStoryByRawId(storyIdToUpdate);
    story.chapters = story.chapters.filter(item => item !== chapterIdToRemove);
    return await this.upsertStory(story);
  }

  async deleteStory(storyIdToRemove) {
    return this.mongoDbInstance.deleteById(this.StoryModel, storyIdToRemove);
  }

  async updateExistingStory(originalId, title, status, type, synopsis, image, tags, meta) {
    let oldStory = await this.findStoryByRawId(originalId);
    if (typeof oldStory === 'undefined') {
      throw new Error('Could not find given story to update');
    } else {
      oldStory = this.fillInStoryMetadata(oldStory, title, status, type, synopsis, image, tags, meta);
      return this.upsertStory(oldStory);
    }
  }

  async addNewStory(title, status, type, synopsis, image, tags, meta) {
    let newStory = new this.StoryModel();
    newStory._id = oId();
    newStory = this.fillInStoryMetadata(newStory, title, status, type, synopsis, image, tags, meta);
    return await this.upsertStory(newStory);
  }

  fillInStoryMetadata(storyToUpdate, title, status, type, synopsis, image, tags, meta) {
    storyToUpdate.title = title;
    storyToUpdate.story_status = status;
    storyToUpdate.story_type = type;
    storyToUpdate.synopsis = synopsis;
    storyToUpdate.cover_img = image;
    storyToUpdate.tags = tags;
    storyToUpdate.meta_review = meta;
    storyToUpdate.time_updated = Date.now();
    return storyToUpdate;
  }

}

StoryHandler.storyHandlerInstance = undefined;

module.exports = StoryHandler;
