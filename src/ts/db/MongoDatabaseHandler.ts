/*
 * MIT License
 *
 * Copyright (c) 2020 Jayne Doe
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

import {StandardDatabaseHandler} from './StandardDatabaseHandler';

import * as mg from "mongoose";
import {MongoConfiguration} from '../objects/MongoConfiguration';
import {MongoConnectionHandler} from './MongoConnectionHandler';
import {MongoModelLoader} from '../objects/MongoModelLoader';

import loggerHandler from '../logger/handleLoggerGeneration';
import Logger from 'bunyan';

const logger: Logger = loggerHandler();

export class MongoDatabaseHandler<T> extends StandardDatabaseHandler<T> {
    private connectionHandler: MongoConnectionHandler;
    private model: mg.Model<mg.Document, T>;

    constructor (config: MongoConfiguration, model: MongoModelLoader) {
        super();
        this.connectionHandler = new MongoConnectionHandler(config);
        this.model = this.connectionHandler.bootModel(model.name, model.schema) as mg.Model<mg.Document, T>;
    }

    async findById (id: string): Promise<T> {
        try {
            return this.model.findById(id) as T;
        } catch (e) {
            logger.warn(e.message);
            throw e;
        }
    }

    async findOrCreate (id: string): Promise<T> {
        try {
            return this.model.findOneAndUpdate(
                { '_id': id },
                {},
                { upsert: true,
                    new:    true }
            ) as T;
        } catch (err) {
            logger.warn(err.message);
            throw err;
        }
    }

    async deleteById (id: string): Promise<T> {
        try {
            return this.model.deleteOne({ '_id': id }) as T;
        } catch (e) {
            logger.warn(e.message);
            throw e;
        }
    }

    async findFromQuery (query: any, skip: number, limit: number, sort: any): Promise<Array<T>> {
        try {
            return this.model.find(
                query,
                {},
                { skip,
                    limit,
                    sort }
            ) as unknown as Array<T>;
        } catch (e) {
            logger.warn(e.message);
            throw e;
        }
    }

    async getTotalCountFromQuery (query: any): Promise<number> {
        try {
            return this.model.countDocuments(query);
        } catch (e) {
            logger.warn(e.message);
            throw e;
        }
    }

    async upsertItem (itemToSave: T): Promise<T> {
        try {
            const docToSave = new this.model(itemToSave);
            const saved = await docToSave.save();
            return saved as unknown as T;
        } catch (e) {
            logger.warn(e.message);
            throw e;
        }
    }
}
