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

const MongoDbHandler = require('./MongoDbHandler');

const logger = require('./logger').bunyanLogger();

class StaticHandler {

    static getHandler() {
        if (this.staticHandlerInstance === undefined) {
            logger.debug('Starting up a new instance of the static database handler');
            this.staticHandlerInstance = new StaticHandler();
        }
        return this.staticHandlerInstance;
    }

    constructor () {
        this.mongoDbInstance = MongoDbHandler.getMongo();

        this.StaticDocument = new Schema({
            '_id': String,
            'content': Object
        });
        this.StaticDocumentModel = this.mongoDbInstance.bootModel('StaticDocument', this.StaticDocument);
    }

    findStatic (id) {
        return this.mongoDbInstance.findById(this.StaticDocumentModel, id);
    }

    updateStatic (id, content) {
        return this.mongoDbInstance.findOrCreate(this.StaticDocumentModel, id)
            .then(document => {
                return this.mongoDbInstance.upsertItem(this.fillInStatic(document, id, content));
            });
    }

    fillInStatic (document, id, content) {
        document._id = id;
        document.content = content;
        return document;
    }

}

StaticHandler.staticHandlerInstance = undefined;

module.exports = StaticHandler;
