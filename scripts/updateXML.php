<?php

/**
 * Copyright 2014 Matthew Ball (CyniCode/M477h3w1012)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

$home_dir = "/home/numbers/www/";

require_once $home_dir . "/../vendor/autoload.php";
require_once $home_dir . "/classes/Google.php";
require_once $home_dir . "/functions/conf.php";
require_once $home_dir . "/functions/enums.php";
require_once $home_dir . "/classes/CentralDatabase.php";
require_once $home_dir . "/classes/DataBase.php";

use m4numbers\Database\DataBase;

$google = new Google($home_dir);
$videos = $google->getMyChannelData();

$database = new DataBase($home_dir, DATABASE);

/**
 * @var Google_Service_YouTube_Activity $video
 */
foreach ($videos as $video) {

    /**
     * @var Google_Service_YouTube_ActivitySnippet $data
     */
    $data = $video->getSnippet();
    if ($data->getType() == "upload") {
        if (!$database->check_video_exists_already($video->getContentDetails()['upload']['videoId']))
        {
            $database->add_new_video($video->getContentDetails()['upload']['videoId'],
                $data->getTitle(), $data->getChannelTitle(), $data->getDescription(),
                $data->getPublishedAt(), $data->getThumbnails()['high']['url']);
        }
    }

}
