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

class MongoDbHandler {

    static getMongo() {
        if (this.mongoDbInstance === undefined) {
            this.mongoDbInstance = new MongoDbHandler();
        }
        return this.mongoDbInstance;
    }

    constructor () {
        this.connection = mongoose.createConnection("mongodb://192.168.99.100:27017");
        this.bootSchemas();
        this.bootModels();
//        this.insertBlog("This was a triumph!", "I'm making a note here, Huge Success!", true, ["test", "success"]);
//        this.insertBlog("This was a different triumph!", "There are many ways to skin a cat", true, ["test", "potential-failure"]);
    }

    bootSchemas () {
        this.BlogPost = new Schema({
            "_id": ObjectId,
            "short_title": String,
            "long_title": String,
            "public": Boolean,
            "full_text": String,
            "time_posted": {type: Date, default: Date.now()},
            "time_updated": {type: Date, default: Date.now()},
            "tags": Array,
            "comments": Array
        });
    }

    bootModels () {
        this.BlogPostModel = this.connection.model("BlogPost", this.BlogPost);
    }

    findBlog (blogId) {
        return new Promise((resolve, reject) => {
            this.BlogPostModel.findById(blogId, function (err, blog) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(blog);
            });
        });
    }

    buildQuery (visible=false) {
        let query = {};
        if (visible === true) {
            query["public"] = true;
        }
        return query;
    }

    findBlogs (skip, limit, sort, visible=true) {
        return new Promise((resolve, reject) => {
            this.BlogPostModel.find(this.buildQuery(visible), {}, {skip: skip, limit: limit, sort: sort}, (err, blogs) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(blogs);
            });
        });
    }

    getTotalBlogCount(visible=true) {
        return new Promise(((resolve, reject) => {
            this.BlogPostModel.count(this.buildQuery(visible), (err, count) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(count);
            });
        }));
    }

    upsertBlog(blog) {
        return new Promise((resolve, reject) => {
            blog.save((err) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve();
            });
        });
    }

    editBlog (blogId, title, text, publiclyVisible, tags) {
        return new Promise((resolve, reject) => {
            this.findBlog(blogId).then(oldBlogPost => {
                if (typeof oldBlogPost === "undefined") {
                    reject(new Error("Could not find given blog to update"));
                } else {
                    oldBlogPost = this.fillInBlog(oldBlogPost, title, text, publiclyVisible, tags);
                    this.upsertBlog(oldBlogPost).then(resolve, reject).catch(reject);
                }
            }, reject).catch(reject);
        });
    }

    insertBlog (title, text, publiclyVisible, tags) {
        return new Promise((resolve, reject) => {
            let newBlogPost = new this.BlogPostModel();
            newBlogPost._id = oId();
            newBlogPost = this.fillInBlog(newBlogPost, title, text, publiclyVisible, tags);
            this.upsertBlog(newBlogPost).then(resolve, reject).catch(reject);
        });
    }

    fillInBlog(blog, title, text, publiclyVisible, tags) {
        blog.short_title = title.replace(/ /g, "-").replace(/\p/, "").toLocaleLowerCase();
        blog.long_title = title;
        blog.public = publiclyVisible;
        blog.full_text = text;
        blog.tags = tags;
        return blog;
    }
}

MongoDbHandler.mongoDbInstance = undefined;

module.exports = MongoDbHandler;
