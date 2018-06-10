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
    }

    bootSchemas () {
        this.BlogPost = new Schema({
            "_id": ObjectId,
            "short_title": String,
            "long_title": String,
            "public": Boolean,
            "full_text": String,
            "time_posted": Date,
            "time_updated": Date,
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

    findBlogs (skip, limit, sort) {
        return new Promise((resolve, reject) => {
            this.BlogPostModel.find({}, {}, {skip: skip, limit: limit, sort: sort}, (err, blogs) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(blogs);
            });
        });
    }

    insertBlog (title, text, publiclyVisible, tags) {
        let newBlogPost = new this.BlogPostModel();
        newBlogPost._id = oId();
        newBlogPost.short_title = title.replace(/ /g, "-").replace(/\p/, "").toLocaleLowerCase();
        newBlogPost.long_title = title;
        newBlogPost.public = publiclyVisible;
        newBlogPost.full_text = text;
        newBlogPost.tags = tags;
        newBlogPost.save((err) => {
            if (err) {
                console.log(err);
            }
        });
    }
}

MongoDbHandler.mongoDbInstance = undefined;

module.exports = MongoDbHandler;
