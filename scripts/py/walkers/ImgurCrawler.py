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

import imgurpython


class ImgurCrawler:

    __client = 0

    def __init__(self, client, secret, pin):
        conn = imgurpython.ImgurClient(client, secret)
        auth_url = conn.get_auth_url('pin')

        creds = conn.authorize(pin, 'pin')
        conn.set_user_auth(creds['access_token'], creds['refresh_token'])

        self.__client = conn

    def request_profile(self, name):
        ret = self.__client.get_account(name)
        return ret
