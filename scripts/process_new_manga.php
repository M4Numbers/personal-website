<?php

$home_dir = '/home/numbers/www/';

require_once $home_dir . '/functions/funcs.php';
require_once $home_dir . '/functions/enums.php';
require_once $home_dir . '/functions/conf.php';
require_once $home_dir . '/classes/CentralDatabase.php';
require_once $home_dir . '/classes/DataBase.php';

use m4numbers\Database\DataBase;

$database = new DataBase($home_dir, DATABASE);

$location = 'https://myanimelist.net/malappinfo.php?u=%s&status=%s&type=%s';

$xml = simplexml_load_file(
    sprintf($location, 'm4numbers', 'all', 'manga'),
    'SimpleXMLElement', LIBXML_NOCDATA
);

$manga = $xml->manga[0];

$total_count =  $xml->count();

printf("%d entries found for Manga\n", $total_count);

$i = 0;

foreach ($xml->manga as $manga)
{
    process_manga($database, $manga, $home_dir);

    ++$i;
    printf("%d/%d entries processed\n", $i, $total_count);
}

printf("%d total entries processed for Manga\n", $i);