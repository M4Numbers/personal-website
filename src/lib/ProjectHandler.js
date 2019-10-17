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

class ProjectHandler {
  static getHandler () {
    if (this.projectHandlerInstance === undefined) {
      this.projectHandlerInstance = new ProjectHandler();
    }
    return this.projectHandlerInstance;
  }

  constructor () {
    this.mongoDbInstance = MongoDbHandler.getMongo();

    this.DevProject = new Schema({
      '_id':          ObjectId,
      'short_title':  String,
      'long_title':   String,
      'public':       Boolean,
      'description':  String,
      'time_posted':  {
        type:    Date,
        default: Date.now(),
      },
      'time_updated': {
        type:    Date,
        default: Date.now(),
      },
      'tags':         Array,
      'comments':     Array,
    });
    this.DevProjectModel = this.mongoDbInstance.bootModel('DevProject', this.DevProject);
  }

  async findProject (projectId) {
    return this.mongoDbInstance.findById(this.DevProjectModel, projectId);
  }

  async deleteProject (projectId) {
    return this.mongoDbInstance.deleteById(this.DevProjectModel, projectId);
  }

  buildQuery (visible = false) {
    const query = {};
    if (visible === true) {
      query.public = true;
    }
    return query;
  }

  async findProjects (skip, limit, sort, visible = true) {
    return this.mongoDbInstance
      .findFromQuery(this.DevProjectModel, this.buildQuery(visible), skip, limit, sort);
  }

  async getTotalProjectCount (visible = true) {
    return this.mongoDbInstance
      .getTotalCountFromQuery(this.DevProjectModel, this.buildQuery(visible));
  }

  async editProject (projectId, title, text, publiclyVisible, tags) {
    let oldDevProject = await this.findProject(projectId);
    if (typeof oldDevProject === 'undefined') {
      throw new Error('Could not find given blog to update');
    } else {
      oldDevProject = this.fillInProject(oldDevProject, title, text, publiclyVisible, tags);
      return this.mongoDbInstance.upsertItem(oldDevProject);
    }
  }

  async insertProject (title, text, publiclyVisible, tags) {
    let newDevProject = new this.DevProjectModel();
    newDevProject._id = oId();
    newDevProject = this.fillInProject(newDevProject, title, text, publiclyVisible, tags);
    return this.mongoDbInstance.upsertItem(newDevProject);
  }

  fillInProject (project, title, text, publiclyVisible, tags) {
    project.short_title = title
      .replace(/ /g, '-')
      .replace(/\p/u, '')
      .toLocaleLowerCase();
    project.long_title = title;
    project.public = publiclyVisible;
    project.description = text;
    project.tags = tags;
    project.time_updated = Date.now();
    return project;
  }
}

ProjectHandler.projectHandlerInstance = undefined;

module.exports = ProjectHandler;
