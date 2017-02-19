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
 * Date: 28/03/2016
 * Time: 05:40
 */

if (!isset($_POST['inputDevelTitle']) || !isset($_POST['inputDevelComments']) ||
    !isset($_FILES['inputDevelCover']))
{
    die();
}

$home_dir = '/home/numbers/www/';

require_once $home_dir . '/functions/funcs.php';
require_once $home_dir . '/functions/enums.php';
require_once $home_dir . '/functions/conf.php';
require_once $home_dir . '/classes/CentralDatabase.php';
require_once $home_dir . '/classes/DataBase.php';

use m4numbers\Database\DataBase;

$database = new DataBase($home_dir, DATABASE);

if ($_FILES['inputDevelCover']['name'] == "")
{
    $cover_hash = "https://m4numbers.co.uk/assets/images/devel/blank.png";
}
else
{
    $parts = explode(".", $_FILES['inputDevelCover']['name']);
    $ext = $parts[sizeof($parts) - 1];
    $hash = md5_file($_FILES['inputDevelCover']['tmp_name']) . '.' . $ext;
    move_uploaded_file($_FILES['inputDevelCover']['tmp_name'], $home_dir.'/assets/images/devel/'.$hash);
    $cover_hash = "https://m4numbers.co.uk/assets/images/devel/" . $hash;
}

$true_id = $database->add_new_development_project(
    $_POST['inputDevelTitle'], $cover_hash, $_POST['inputDevelComments']);

$database->registerUpdate(UPDATE_DEVEL, $true_id);

header('location: /admin/');
