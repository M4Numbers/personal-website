/*
 * MIT License
 *
 * Copyright (c) 2019 Jayne Doe
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

const fs = require('fs');

const ArtHandler = require('../../../lib/ArtHandler');
const artHandlerInstance = ArtHandler.getHandler();

const postNewArtPiece = async (req, res, next) => {
  try {
    req.log.info(`Reading in new image from ${req.files['art-image'].path}`);
    let imageAsBase64 = fs.readFileSync(req.files['art-image'].path, 'base64');
    const savedArt = await artHandlerInstance.addNewArtItem(
        req.body['art-title'], req.body['art-completed-date'],
        imageAsBase64, req.body['art-tags'].split(/, ?/),
        req.body['art-notes']
    );
    res.redirect(303, `/admin/art/${savedArt._id}`, next);
  } catch (e) {
    req.log.warn({error: e});
    res.redirect(303, '/admin/art/new', next);
  }
};

module.exports = postNewArtPiece;
