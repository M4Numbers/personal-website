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
__base__ = "http://myanimelist.net/api/"
__auth__ = "account/verify_credentials.xml"
__a_search__ = "anime/search.xml"
__m_search__ = "manga/search.xml"

import requests
import requests.auth


class MyAnimeList:
    """ A crawler class for the MyAnimeList API """

    __headers = ""
    __uname = ""
    __pass = ""

    def __init__(self, username, password):
        headers = {"User-Agent": "other:walkers:v0.0.1 (by /u/M477h3w1012)"}
        mal_auth = requests.auth.HTTPBasicAuth(username, password)

        res = requests.post(__base__ + __auth__, auth=mal_auth, headers=headers)

        if not res.status_code == 200:
            raise PermissionError

        self.__headers = headers
        self.__uname = username
        self.__pass = password

    def request_anime(self, anime_name):
        authd = requests.auth.HTTPBasicAuth(self.__uname, self.__pass)
        res = requests.get(__base__ + __a_search__ + '?q={0}'.format(anime_name),
                            auth=authd, headers=self.__headers)
        return res.content

    def request_manga(self, manga_name):
        authd = requests.auth.HTTPBasicAuth(self.__uname, self.__pass)
        res = requests.get(__base__ + __m_search__ + '?q={0}'.format(manga_name),
                            auth=authd, headers=self.__headers)
        return res.content

