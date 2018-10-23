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

const config = require("config");
const mongoose = require("mongoose");

class MongoDbHandler {

    static getMongo() {
        if (this.mongoDbInstance === undefined) {
            this.mongoDbInstance = new MongoDbHandler();
        }
        return this.mongoDbInstance;
    }

    constructor () {
        this.connection = mongoose.createConnection(config.get("database.uri"));
    }

    bootModel (modelName, model) {
        return this.connection.model(modelName, model);
    }

    findById (model, id) {
        return new Promise((resolve, reject) => {
            model.findById(id, function (err, result) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(result);
            });
        });
    }

    deleteById (model, id) {
        return new Promise((resolve, reject) => {
            model.deleteOne({"_id": id}, function(err) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve();
            });
        });
    }

    findFromQuery (model, query, skip, limit, sort) {
        return new Promise((resolve, reject) => {
            model.find(query, {}, {skip: skip, limit: limit, sort: sort}, (err, results) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(results);
            });
        });
    }

    getTotalCountFromQuery(model, query) {
        return new Promise(((resolve, reject) => {
            model.count(query, (err, count) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(count);
            });
        }));
    }

    upsertItem(itemToSave) {
        return new Promise((resolve, reject) => {
            itemToSave.save((err, itemToSave) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(itemToSave);
            });
        });
    }

}

MongoDbHandler.mongoDbInstance = undefined;

module.exports = MongoDbHandler;
