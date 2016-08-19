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
__base__ = "https://www.reddit.com/api/v1/access_token"
__auth__ = "https://oauth.reddit.com/"

import requests
import requests.auth


class RedditCrawler:
    """ A crawler class for the Reddit API """

    __headers = ""

    def __init__(self, username, password, client, secret):
        client_auth = requests.auth.HTTPBasicAuth(client, secret)
        post_data = {"grant_type": "password", "username": username, "password": password}
        headers = {"User-Agent": "other:walkers:v0.0.1 (by /u/M477h3w1012)"}

        res = requests.post(__base__, auth=client_auth, data=post_data, headers=headers)

        if not res.status_code == 200:
            raise PermissionError

        headers['Authorization'] = "bearer {0}".format(res.json()['access_token'])

        self.__headers = headers

    def request_profile(self):
        res = requests.get(__auth__ + "/api/v1/me", headers=self.__headers)
        return res.json()

    def request_comments(self, user):
        res = requests.get(__auth__ + "/user/{0}/comments".format(user), headers=self.__headers)
        return res.json()

    def request_my_subreddits(self):
        res = requests.get(__auth__ + "/subreddits/mine/subscriber", headers=self.__headers)
        return res.json()

    def request_subreddit_info(self, subred):
        res = requests.get(__auth__ + "/r/{0}/about".format(subred), headers=self.__headers)
        return res.json()

    def request_hot_topics(self, subred):
        res = requests.get(__auth__ + "/r/{0}/hot".format(subred), headers=self.__headers)
        return res.json()
