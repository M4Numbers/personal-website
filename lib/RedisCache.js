/*
 * MIT License
 *
 * Copyright (c) 2019 Matthew D. Ball
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

const RedisClient = require('redis');
const RedisClustr = require('redis-clustr');
const BasicCache = require('./BasicCache');
const logger = require('./Logger').getLogger('master');

class RedisCache extends BasicCache {
    constructor(props) {
        super(props);
        try {
            if (props.cluster === true) {
                this.client = new RedisClustr({
                    servers: [
                        {
                            host: props.host,
                            port: props.port
                        }
                    ],
                    createClient: (port, host) => RedisClient.createClient(port, host)
                });
            } else {
                this.client = RedisClient.createClient(props.port, props.host);
            }
            this.client.on('error', (err) => {
                logger.warn(err.message);
                this.end();
            });
        } catch (e) {
            logger.warn(e.message);
            this.end();
        }
    }

    quit() {
        try {
            logger.debug('Received request to quit cache connection gracefully');
            return Object.prototype.hasOwnProperty.call(this, 'client') ? this.client.quit() : false;
        } catch (e) {
            logger.warn('Error during cache quit...');
            logger.warn(e.message);
            return false;
        }
    }

    end() {
        try {
            logger.debug('Received request to end cache connection');
            return Object.prototype.hasOwnProperty.call(this, 'client') ? this.client.end(true) : false;
        } catch (e) {
            logger.warn('Error during closing the cache...');
            logger.warn(e.message);
            return false;
        }
    }

    async get(key) {
        return new Promise((resolve, reject) => this.client.get(key, (err, value) => {
            if (err) {
                reject(err);
            }
            resolve(JSON.parse(value));
        }));
    }

    async set(key, value) {
        return new Promise((resolve, reject) => this.client.set(key, JSON.stringify(value), 'EX', 3600, (err) => {
            if (err) {
                reject(err);
            }
            resolve(value);
        }));
    }
}

module.exports = RedisCache;
