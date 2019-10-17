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

const testFriendLoggedIn = require('../../../journey/misc/test_friend_logged_in');
const over18Check = require('../../../journey/hobbies/me/over_18_check');

const generateOver18Page = require('../../../journey/hobbies/me/generate_over_18_page');
const evaluateOver18 = require('../../../journey/hobbies/me/over_18_allow');

const getAllKinks = require('../../../journey/hobbies/me/get_all_kinks');
const getSingleKink = require('../../../journey/hobbies/me/get_single_kink');

module.exports = (server) => {
  server.get('/hobbies/me/over-18', testFriendLoggedIn, generateOver18Page);
  server.post('/hobbies/me/over-18', testFriendLoggedIn, evaluateOver18);
  server.get('/hobbies/me/fetishes', testFriendLoggedIn, over18Check, getAllKinks);
  server.get('/hobbies/me/fetishes/:kinkId', testFriendLoggedIn, over18Check, getSingleKink);
};
