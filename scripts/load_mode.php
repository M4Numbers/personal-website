<?php
/**
 * Copyright 2016 M. D. Ball (m.d.ball2@ncl.ac.uk)
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
 * Created by PhpStorm.
 * User: M4Numbers
 * Date: 21/03/2016
 * Time: 17:36
 */

$home_dir = '/home/numbers/www/';

require_once $home_dir . '/functions/funcs.php';
require_once $home_dir . '/functions/enums.php';
require_once $home_dir . '/functions/conf.php';
require_once $home_dir . '/classes/CentralDatabase.php';
require_once $home_dir . '/classes/DataBase.php';

use m4numbers\Database\DataBase;

$database = new DataBase($home_dir, DATABASE);

$filters = array();
$t_mode = $_GET['mode'];

$return = array();

switch ($_GET['mode'])
{
    case LOAD_MODE_ANIME_COMPLETE:
        $filters = array(ANIME_COMPLETED);
        $t_mode = LOAD_MODE_ANIME;
        break;

    case LOAD_MODE_ANIME_WATCHING:
        $filters = array(ANIME_WATCHING);
        $t_mode = LOAD_MODE_ANIME;
        break;

    case LOAD_MODE_ANIME_DROPPED:
        $filters = array(ANIME_DROPPED);
        $t_mode = LOAD_MODE_ANIME;
        break;

    case LOAD_MODE_ANIME_HOLDING:
        $filters = array(ANIME_HOLDING);
        $t_mode = LOAD_MODE_ANIME;
        break;

    case LOAD_MODE_ANIME_PLANNED:
        $filters = array(ANIME_PLANNED);
        $t_mode = LOAD_MODE_ANIME;
        break;

    case LOAD_MODE_ANIME_SEEN:
        $filters = array(
            ANIME_COMPLETED, ANIME_WATCHING,
            ANIME_DROPPED, ANIME_HOLDING
        );
        $t_mode = LOAD_MODE_ANIME;
        break;

    case LOAD_MODE_ANIME_ALL:
        $filters = array(
            ANIME_COMPLETED, ANIME_PLANNED, ANIME_DROPPED,
            ANIME_HOLDING, ANIME_WATCHING
        );
        $t_mode = LOAD_MODE_ANIME;
        break;

    case LOAD_MODE_MANGA_COMPLETE:
        $filters = array(MANGA_COMPLETED);
        $t_mode = LOAD_MODE_MANGA;
        break;

    case LOAD_MODE_MANGA_READING:
        $filters = array(MANGA_READING);
        $t_mode = LOAD_MODE_MANGA;
        break;

    case LOAD_MODE_MANGA_DROPPED:
        $filters = array(MANGA_DROPPED);
        $t_mode = LOAD_MODE_MANGA;
        break;

    case LOAD_MODE_MANGA_HOLDING:
        $filters = array(MANGA_HOLDING);
        $t_mode = LOAD_MODE_MANGA;
        break;

    case LOAD_MODE_MANGA_PLANNED:
        $filters = array(MANGA_PLANNED);
        $t_mode = LOAD_MODE_MANGA;
        break;

    case LOAD_MODE_MANGA_READ:
        $filters = array(
            MANGA_COMPLETED, MANGA_READING,
            MANGA_DROPPED, MANGA_HOLDING
        );
        $t_mode = LOAD_MODE_MANGA;
        break;

    case LOAD_MODE_MANGA_ALL:
        $filters = array(
            MANGA_COMPLETED, MANGA_PLANNED, MANGA_DROPPED,
            MANGA_HOLDING, MANGA_READING
        );
        $t_mode = LOAD_MODE_MANGA;
        break;

    default:
        break;
}

switch ($t_mode)
{
    case LOAD_MODE_ANIME:
        $return = $database->get_all_anime($_GET['offset'], $filters);
        foreach ($return as &$a)
        {
            $a['status'] = toggle_anime_state((int)$a['status']);
        }
        break;

    case LOAD_MODE_MANGA:
        $return = $database->get_all_manga($_GET['offset'], $filters);
        foreach ($return as &$m)
        {
            $m['status'] = toggle_manga_state((int)$m['status']);
        }
        break;

    case LOAD_MODE_VIDEOS:
        $return = $database->get_all_videos($_GET['offset']);
        foreach ($return as &$v)
        {
            $v['published'] = substr($v['published'], 0, 10);
        }
        break;
}

echo json_encode($return);