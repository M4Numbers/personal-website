// MIT License
//
// Copyright (c) 2019 Jayne Doe
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const oId = mongoose.Types.ObjectId;

const MongoDbHandler = require('./MongoDbHandler');

const logger = require('./logger').bunyanLogger();

class KinkHandler {
  static getHandler () {
    if (this.kinkHandlerInstance === undefined) {
      logger.debug('Starting up a new instance of the kink database handler');
      this.kinkHandlerInstance = new KinkHandler();
    }
    return this.kinkHandlerInstance;
  }

  constructor () {
    this.mongoDbInstance = MongoDbHandler.getMongo();

    this.KinkCollection = new Schema({
      '_id':                 ObjectId,
      'kink_name':           String,
      'kink_description':    String,
      'practising_status':   String,
      'personal_experience': String,
      'cover_img':           String,
      'tags':                Array,
      'time_updated':        {
        type:    Date,
        default: Date.now(),
      },
    });
    this.KinkCollectionModel = this.mongoDbInstance
      .bootModel('KinkCollection', this.KinkCollection);
  }

  async findKinkByRawId (rawId) {
    return this.mongoDbInstance.findById(this.KinkCollectionModel, rawId);
  }

  async deleteKink (kinkId) {
    return this.mongoDbInstance.deleteById(this.KinkCollectionModel, kinkId);
  }

  buildQuery (status = '') {
    let query = {};
    if (status !== 'all') {
      if (status === 'practised') {
        query = { $or: [ { practising_status: 'PRACTISING' }, { practising_status: 'RETIRED' } ] };
      }
      if (status === 'practising') {
        query.practising_status = 'PRACTISING';
      }
      if (status === 'retired') {
        query.practising_status = 'RETIRED';
      }
      if (status === 'fantasising') {
        query.practising_status = 'FANTASISING';
      }
    }
    return query;
  }

  async findKinks (skip, limit, sort, category = '') {
    return this.mongoDbInstance
      .findFromQuery(this.KinkCollectionModel, this.buildQuery(category), skip, limit, sort);
  }

  async findKinksByQuery (query, skip, limit, sort) {
    return this.mongoDbInstance.findFromQuery(this.KinkCollectionModel, query, skip, limit, sort);
  }

  async getTotalKinkCount (category = '') {
    return this.mongoDbInstance
      .getTotalCountFromQuery(this.KinkCollectionModel, this.buildQuery(category));
  }

  async upsertKink (kinkToUpsert) {
    return this.mongoDbInstance.upsertItem(kinkToUpsert);
  }

  async updateExistingKink (originalId, title, description, status, experience, coverImg, tags) {
    let oldKink = await this.findKinkByRawId(originalId);
    if (typeof oldKink === 'undefined') {
      throw new Error('Could not find given anime to update');
    } else {
      oldKink = this.fillInKink(oldKink, title, description, status, experience, coverImg, tags);
      return this.upsertKink(oldKink);
    }
  }

  async addNewKink (title, description, status, experience, image, tags) {
    let newKink = new this.KinkCollectionModel();
    newKink._id = oId();
    newKink = this.fillInKink(newKink, title, description, status, experience, image, tags);
    return this.upsertKink(newKink);
  }

  fillInKink (kinkToUpdate, title, description, status, experience, image, tags) {
    kinkToUpdate.kink_name = title;
    kinkToUpdate.kink_description = description;
    kinkToUpdate.practising_status = status;
    kinkToUpdate.personal_experience = experience;
    kinkToUpdate.cover_img = image;
    kinkToUpdate.tags = tags;
    return kinkToUpdate;
  }
}

KinkHandler.kinkHandlerInstance = undefined;

module.exports = KinkHandler;
