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

const MongoDbHandler = require("./MongoDbHandler");

class BlogHandler {

    static getHandler() {
        if (this.blogHandlerInstance === undefined) {
            this.blogHandlerInstance = new BlogHandler();
        }
        return this.blogHandlerInstance;
    }

    constructor () {
        this.mongoDbInstance = MongoDbHandler.getMongo();

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
        this.BlogPostModel = this.mongoDbInstance.bootModel("BlogPost", this.BlogPost);
    }

    findBlog (blogId) {
        return this.mongoDbInstance.findById(this.BlogPostModel, blogId);
    }

    deleteBlog (blogId) {
        return this.mongoDbInstance.deleteById(this.BlogPostModel, blogId);
    }

    buildQuery (visible=false) {
        let query = {};
        if (visible === true) {
            query["public"] = true;
        }
        return query;
    }

    findBlogs (skip, limit, sort, visible=true) {
        return this.mongoDbInstance.findFromQuery(this.BlogPostModel, this.buildQuery(visible), skip, limit, sort);
    }

    findBlogsByQuery(query, skip, limit, sort) {
        return this.mongoDbInstance.findFromQuery(this.BlogPostModel, query, skip, limit, sort);
    }

    getTotalBlogCount(visible=true) {
        return this.mongoDbInstance.getTotalCountFromQuery(this.BlogPostModel, this.buildQuery(visible));
    }

    upsertBlog(blog) {
        return this.mongoDbInstance.upsertItem(blog);
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
        blog.time_updated = Date.now();
        return blog;
    }
}

BlogHandler.blogHandlerInstance = undefined;

module.exports = BlogHandler;
