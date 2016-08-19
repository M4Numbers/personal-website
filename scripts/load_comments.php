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

$home_dir = '/home/numbers/www/';

require_once $home_dir . '/functions/funcs.php';
require_once $home_dir . '/functions/enums.php';
require_once $home_dir . '/functions/conf.php';
require_once $home_dir . '/classes/CentralDatabase.php';
require_once $home_dir . '/classes/DataBase.php';

use m4numbers\Database\DataBase;

$database = new DataBase($home_dir, DATABASE);

$return = array();

if ($_GET['mode'] == true)
{
    //Anime
    $true_id = $database->get_id_of_anime($_GET['item_id']);
    $return['comments'] = $database->get_comments_for_anime($true_id);
}
else
{
    //Manga
    $true_id = $database->get_id_of_manga($_GET['item_id']);
    $return['comments'] = $database->get_comments_for_manga($true_id);
}

echo json_encode($return);