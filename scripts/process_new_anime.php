<?php

$home_dir = '/home/numbers/www/';

require_once $home_dir . '/functions/funcs.php';
require_once $home_dir . '/functions/enums.php';
require_once $home_dir . '/functions/conf.php';
require_once $home_dir . '/classes/CentralDatabase.php';
require_once $home_dir . '/classes/DataBase.php';

use m4numbers\Database\DataBase;

$database = new DataBase($home_dir, DATABASE);

$location = 'http://myanimelist.net/malappinfo.php?u=%s&status=%s&type=%s';

$xml = simplexml_load_file(
    sprintf($location, 'm4numbers', 'all', 'anime'),
    'SimpleXMLElement', LIBXML_NOCDATA
);

$anime = $xml->anime[0];

$total_count =  $xml->count();

printf("%d entries found for Anime\n", $total_count);

$i = 0;

foreach ($xml->anime as $anime)
{
    $got = run_mal_python(
        $home_dir, true, $anime->series_title, $anime->series_animedb_id
    );

    if ($got !== '')
    {
        $ret = simplexml_load_string($got);
        foreach ($ret->entry as $single)
        {
            //var_dump($single);
            process_anime($database, $anime, $single);
        }
    }

    ++$i;
    printf("%d/%d entries processed\n", $i, $total_count);
}

printf("%d total entries processed for Anime\n", $i);