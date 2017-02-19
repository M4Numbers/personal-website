<?php
/**
 * Copyright 2017 Matthew D. Ball (m.d.ball2@ncl.ac.uk)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Class Google
 *
 * A class for manipulating Google's API
 *
 * @author CyniCode
 * @LastModified 25th May 2014
 */
class Google {

    /**
     * @var Google_Client $client
     */
    private $client;

    /**
     * @var Google_Service_Youtube $youtube
     */
    private $youtube;

    /**
     * @var String $home
     */
    private $home;

    public function __construct($home_dir) {
        $this->home = $home_dir;

        if (!class_exists('Google_Client'))
        {
            require_once $home_dir . '/../vendor/autoload.php';
        }

        $google = new Google_Client();
        $google->setApplicationName(GOOGAPPNAME);
        $google->setDeveloperKey(GOOGSECRET);

        $this->client = $google;
    }

    public function bootYoutube() {
        $this->youtube = new Google_Service_YouTube($this->client);
    }

    /**
     * @return Google_Service_YouTube_ActivityListResponse
     */
    public function getMyChannelData() {
        if ($this->youtube == null)
            $this->bootYoutube();

        return $this->youtube->activities->listActivities(
                'snippet,contentDetails',
                array('channelId'=>GOOGCHANID, 'maxResults'=>50)
        );
    }

}