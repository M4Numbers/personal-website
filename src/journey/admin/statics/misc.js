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

const extractStatic = (req, res, next) => {
  res.locals.staticId = req.getPath().split('/')[ 3 ];
  req.log.debug(`Request for static ${res.locals.staticId} found`);
  next();
};

const cullListItems = (items) => Promise
  .resolve(items.filter((toValidate) => toValidate.page_name !== ''
    && toValidate.page_link !== ''));

const cullContactListItems = (items) => Promise
  .resolve(items.filter((toValidate) => toValidate.contact_method !== ''
    && toValidate.contact_link !== ''
    && toValidate.fa_style !== ''
    && toValidate.fa_icon !== ''));

module.exports = {
  cullListItems,
  cullContactListItems,
  extractStatic,
};
