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

const config = require('config');
const mongoose = require('mongoose');

const logger = require('./logger').bunyanLogger();

class MongoDbHandler {
  static getMongo () {
    if (this.mongoDbInstance === undefined) {
      this.mongoDbInstance = new MongoDbHandler();
    }
    return this.mongoDbInstance;
  }

  constructor () {
    this.connection = mongoose
      .createConnection(config.get('database.uri'), { useNewUrlParser: true });
  }

  bootModel (modelName, model) {
    return this.connection.model(modelName, model);
  }

  async findById (model, id) {
    try {
      return await model.findById(id);
    } catch (e) {
      logger.warn(e.message);
      throw e;
    }
  }

  async findOrCreate (model, id) {
    try {
      return await model.findOneAndUpdate(
        { '_id': id },
        {},
        { upsert: true,
          new:    true }
      );
    } catch (err) {
      logger.warn(err.message);
      throw err;
    }
  }

  async deleteById (model, id) {
    try {
      return await model.deleteOne({ '_id': id });
    } catch (e) {
      logger.warn(e.message);
      throw e;
    }
  }

  async findFromQuery (model, query, skip, limit, sort) {
    try {
      return await model.find(
        query,
        {},
        { skip,
          limit,
          sort }
      );
    } catch (e) {
      logger.warn(e.message);
      throw e;
    }
  }

  async getTotalCountFromQuery (model, query) {
    try {
      return await model.countDocuments(query);
    } catch (e) {
      logger.warn(e.message);
      throw e;
    }
  }

  async upsertItem (itemToSave) {
    try {
      return await itemToSave.save();
    } catch (e) {
      logger.warn(e.message);
      throw e;
    }
  }
}

MongoDbHandler.mongoDbInstance = undefined;

module.exports = MongoDbHandler;
