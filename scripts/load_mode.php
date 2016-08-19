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

$an_filters = array(ANIME_COMPLETED);
$ma_filters = array(MANGA_COMPLETED);

$return = array();

switch ($_GET['mode'])
{
    case LOAD_MODE_ANIME:
        $return = $database->get_all_anime($_GET['offset'], $an_filters);
        foreach ($return as &$a)
        {
            $a['status'] = toggle_anime_state((int)$a['status']);
        }
        break;

    case LOAD_MODE_MANGA:
        $return = $database->get_all_manga($_GET['offset'], $ma_filters);
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