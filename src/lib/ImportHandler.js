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

const crypto = require('crypto');

const aniListHandlerInstance = require('./AniListHandler').getHandler();
const mongoAnimeHandlerInstance = require('./AnimeHandler').getHandler();
const mongoMangaHandlerInstance = require('./MangaHandler').getHandler();

const logger = require('./logger').bunyanLogger();

async function resolveInsertNewAnime(newAnimetoInsert) {
  logger.info(`Inserting new show with id ${newAnimetoInsert['media']['id']}`);
  await mongoAnimeHandlerInstance.addNewAnime(
      {
        'ani_list': newAnimetoInsert['media']['id'],
        'my_anime_list': newAnimetoInsert['media']['idMal']
      },
      newAnimetoInsert['media']['title'],
      newAnimetoInsert['status'],
      newAnimetoInsert['score'],
      newAnimetoInsert['progress'],
      newAnimetoInsert['media']['episodes'],
      newAnimetoInsert['media']['status'],
      newAnimetoInsert['media']['description'],
      newAnimetoInsert['media']['coverImage'],
      crypto.createHash('sha256').update(JSON.stringify(newAnimetoInsert)).digest('hex')
  );
}

async function resolveOverwriteExistingAnime(oldId, oldAnimeToOverwrite) {
  logger.info(`Overwriting existing show with id ${oldAnimeToOverwrite['media']['id']}`);
  await mongoAnimeHandlerInstance.updateExistingAnime(
      oldId,
      {
        'ani_list': oldAnimeToOverwrite['media']['id'],
        'my_anime_list': oldAnimeToOverwrite['media']['idMal']
      },
      oldAnimeToOverwrite['media']['title'],
      oldAnimeToOverwrite['status'],
      oldAnimeToOverwrite['score'],
      oldAnimeToOverwrite['progress'],
      oldAnimeToOverwrite['media']['episodes'],
      oldAnimeToOverwrite['media']['status'],
      oldAnimeToOverwrite['media']['description'],
      oldAnimeToOverwrite['media']['coverImage'],
      crypto.createHash('sha256').update(JSON.stringify(oldAnimeToOverwrite)).digest('hex')
  );
}

//ids, titles, mangaType, myStatus, score, currentVol, currentChap, totalVols, totalChaps, airingStatus, synopsis, coverImgs, hash
async function resolveInsertNewManga(newMangatoInsert) {
  logger.info(`Inserting new book with id ${newMangatoInsert['media']['id']}`);
  await mongoMangaHandlerInstance.addNewManga(
      {
        'ani_list': newMangatoInsert['media']['id'],
        'my_anime_list': newMangatoInsert['media']['idMal']
      },
      newMangatoInsert['media']['title'],
      newMangatoInsert['format'],
      newMangatoInsert['status'],
      newMangatoInsert['score'],
      newMangatoInsert['progressVolumes'],
      newMangatoInsert['progress'],
      newMangatoInsert['media']['volumes'],
      newMangatoInsert['media']['chapters'],
      newMangatoInsert['media']['status'],
      newMangatoInsert['media']['description'],
      newMangatoInsert['media']['coverImage'],
      crypto.createHash('sha256').update(JSON.stringify(newMangatoInsert)).digest('hex')
  );
}

async function resolveOverwriteExistingManga(oldId, newMangatoInsert) {
  logger.info(`Inserting new book with id ${newMangatoInsert['media']['id']}`);
  await mongoMangaHandlerInstance.updateExistingManga(
      oldId,
      {
        'ani_list': newMangatoInsert['media']['id'],
        'my_anime_list': newMangatoInsert['media']['idMal']
      },
      newMangatoInsert['media']['title'],
      newMangatoInsert['format'],
      newMangatoInsert['status'],
      newMangatoInsert['score'],
      newMangatoInsert['progressVolumes'],
      newMangatoInsert['progress'],
      newMangatoInsert['media']['volumes'],
      newMangatoInsert['media']['chapters'],
      newMangatoInsert['media']['status'],
      newMangatoInsert['media']['description'],
      newMangatoInsert['media']['coverImage'],
      crypto.createHash('sha256').update(JSON.stringify(newMangatoInsert)).digest('hex')
  );
}

async function importAnimeAniListItemsIntoMongo() {
  let page = 1;
  let roller = await aniListHandlerInstance.getPageOfAniListAnimeResults(page);
  let mediaItems = roller['data']['Page']['mediaList'];
  while (mediaItems.length > 0) {
    mediaItems.forEach(async media => {
      const record = await mongoAnimeHandlerInstance
          .findAnimeByAniListId(media['media']['id']);
      if (record.length > 0) {
        if (record[0].last_hash !== crypto.createHash('sha256').update(JSON.stringify(media)).digest('hex')) {
          await resolveOverwriteExistingAnime(record[0]._id, media);
        }
      } else {
        await resolveInsertNewAnime(media);
      }
    });
    ++page;
    roller = await aniListHandlerInstance.getPageOfAniListAnimeResults(page);
    mediaItems = roller['data']['Page']['mediaList'];
  }
}

async function importMangaAniListItemsIntoMongo() {
  let page = 1;
  let roller = await aniListHandlerInstance.getPageOfAniListMangaResults(page);
  let mediaItems = roller['data']['Page']['mediaList'];
  while (mediaItems.length > 0) {
    mediaItems.forEach(async media => {
      const record = await mongoMangaHandlerInstance
          .findMangaByAniListId(media['media']['id']);
      if (record.length > 0) {
        if (record[0].last_hash !== crypto.createHash('sha256').update(JSON.stringify(media)).digest('hex')) {
          await resolveOverwriteExistingManga(record[0]._id, media);
        }
      } else {
        await resolveInsertNewManga(media);
      }
    });
    ++page;
    roller = await aniListHandlerInstance.getPageOfAniListMangaResults(page);
    mediaItems = roller['data']['Page']['mediaList'];
  }
}

module.exports = {
  importAnimeIntoMongo: importAnimeAniListItemsIntoMongo,
  importMangaIntoMongo: importMangaAniListItemsIntoMongo
};
