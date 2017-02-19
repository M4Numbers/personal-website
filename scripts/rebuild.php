<?php
/**
 * Copyright 2017 M. D. Ball (m.d.ball2@ncl.ac.uk)
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
 * Date: 19/02/2017
 * Time: 05:14
 */

$home_dir = '/home/numbers/www/';

require_once $home_dir . '/functions/funcs.php';
require_once $home_dir . '/functions/enums.php';
require_once $home_dir . '/functions/conf.php';
require_once $home_dir . '/classes/CentralDatabase.php';
require_once $home_dir . '/classes/RebuildBase.php';

use m4numbers\Database\RebuildBase;

$db = new RebuildBase($home_dir, DATABASE);

$anime = $db->get_old_anime();
foreach ($anime as &$a)
{
    $comm = $db->get_old_anime_comments_from_id($a['id']);
    if ($comm == null)
    {
        $a['comments_id'] = null;
    }
    else
    {
        //var_dump($comm);
        $a['comments_id'] = $db->insert_new_comment($comm['comments']);
    }
    $id = $db->insert_new_anime($a);
    $db->registerUpdate(UPDATE_ANIME, $id);
    $a = null;
}
$anime = null;

$manga = $db->get_old_manga();
foreach ($manga as &$m)
{
    $comm = $db->get_old_manga_comments_from_id($m['id']);
    if ($comm == NULL)
    {
        $m['comments_id'] = NULL;
    }
    else
    {
        $m['comments_id'] = $db->insert_new_comment($comm['comments']);
    }
    $id = $db->insert_new_manga($m);
    $db->registerUpdate(UPDATE_MANGA, $id);
    $m = null;
}
$manga = null;

$videos = $db->get_old_videos();
foreach ($videos as &$v)
{
    $id = $db->insert_new_video($v);
    $db->registerUpdate(UPDATE_VIDEO, $v);
    $v = null;
}
$videos = null;