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

const path = require('path');
const nunjucks = require('nunjucks');
const nunjucksDate = require('nunjucks-date');
const markdown = require('markdown-it');
const config = require('config');
const metadata = require('../../../package');

let renderer;

const renderMarkdown = (input) => markdown.render(input || '');

const createRenderer = () => {
  const nunjucksEnv = new nunjucks.Environment([
    new nunjucks.FileSystemLoader(path.join(process.cwd(), '/src/views')),
  ], config.get('nunjucks.options'));
  nunjucksEnv.addGlobal('functionality', config.get('functionality'));
  nunjucksEnv.addGlobal('metadata', metadata);

  nunjucksEnv.addFilter('date', nunjucksDate);
  nunjucksEnv.addFilter('markdown', renderMarkdown);

  return nunjucksEnv;
};

module.exports = () => {
  if (renderer === undefined) {
    renderer = createRenderer();
  }
  return renderer;
};
