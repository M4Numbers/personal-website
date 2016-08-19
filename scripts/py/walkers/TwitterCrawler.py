"""
    Copyright 2015 Matthew D. Ball (M4Numbers)

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
"""

__author__ = 'Matthew Ball'

import tweepy


class TwitterCrawler:

    api = 0

    def __init__(self, con_key, con_secret, acc_key, acc_secret):
        auth = tweepy.OAuthHandler(con_key, con_secret)
        auth.set_access_token(acc_key, acc_secret)
        self.api = tweepy.API(auth)

    def get_my_timeline(self):
        return self.api.home_timeline()

    def get_my_tweets(self):
        return self.api.user_timeline()

    def get_my_last_tweet(self):
        return self.api.user_timeline({'count':1})

    def get_me(self):
        return self.api.verify_credentials()
