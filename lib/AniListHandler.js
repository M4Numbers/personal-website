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

const fs = require("fs");
const path = require("path");
const request = require("request-promise-native");

const MediaTypes = require("./MediaTypes");
const SiteError = require("./SiteError");

const loggingSystem = require("./Logger");
const logger = loggingSystem.getLogger("master");

class AniListHandler {

    static getHandler() {
        if (this.aniListHandlerInstance === undefined) {
            this.aniListHandlerInstance = new AniListHandler();
        }
        return this.aniListHandlerInstance;
    }

    constructor() {
        this.readQueryFile("animeAniList.gql")
            .then(file => {
                this.aniListAnimeQuery = file;
            });
        this.readQueryFile("mangaAniList.gql")
            .then(file => {
                this.aniListMangaQuery = file;
            });
    }

    readQueryFile(fileName) {
        return new Promise(resolve => {
            fs.readFile(path.join(__dirname, "../", "gql", fileName), {encoding: "utf-8"}, function (err, data) {
                if (err) {
                    logger.error(`Error during reading the ${fileName} query file :: ${err}`);
                    throw new SiteError(500, err);
                }
                resolve(data);
            });
        });
    }

    performRequest(body) {
        return request({
            url: "https://graphql.anilist.co",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: body,
            json: true
        });
    }

    getPageOfAniListAnimeResults(page=0) {
        return new Promise((resolve, reject) => {
            let variables = {
                page: page,
                mediaType: MediaTypes.ANIME
            };
            this.performRequest({
                query: this.aniListAnimeQuery,
                variables: variables
            }).then(resolve, reject)
                .catch(reason => {
                    logger.warn(`Unhandled exception when requesting aniList data :: ${reason}`);
                    throw new SiteError(500, reason);
                });
        });
    }

    getPageOfAniListMangaResults(page=0) {
        return new Promise((resolve, reject) => {
            let variables = {
                page: page,
                mediaType: MediaTypes.MANGA
            };
            this.performRequest({
                query: this.aniListMangaQuery,
                variables: variables
            }).then(resolve, reject)
                .catch(reason => {
                    logger.warn(`Unhandled exception when requesting aniList data :: ${reason}`);
                    throw new SiteError(500, reason);
                });
        });
    }

}

AniListHandler.aniListHandlerInstance = undefined;
AniListHandler.aniListMangaQuery = undefined;
AniListHandler.aniListAnimeQuery = undefined;

module.exports = AniListHandler;
