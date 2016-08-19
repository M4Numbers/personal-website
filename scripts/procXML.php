<?php
/*
if (!isset($_FILES['xml']))
{
    die("No XML file found");
}

$p = pathinfo($_FILES['xml']['tml_name']);

if ($p['extension'] != 'xml')
{
    die("Not an XML file");
}
*/
//move_uploaded_file(
//    $_FILES['xml']['tmp_name'],
//    $home_dir . '/files/xml/' . $_FILES['xml']['name']
//);

$home_dir = '/home/numbers/www/';

require_once $home_dir . '/functions/funcs.php';
require_once $home_dir . '/functions/enums.php';
require_once $home_dir . '/functions/conf.php';
require_once $home_dir . '/classes/CentralDatabase.php';
require_once $home_dir . '/classes/DataBase.php';

use m4numbers\Database\DataBase;

$database = new DataBase($home_dir, DATABASE);

$location = 'http://myanimelist.net/malappinfo.php?u=%s&status=%s&type=%s';

//$xml = new SimpleXMLElement($_FILES['xml']['tmp_name'], 0, true);
$xml = simplexml_load_file(
    sprintf($location, 'm4numbers', 'all', 'anime'),
    'SimpleXMLElement', LIBXML_NOCDATA
);

$anime = $xml->anime[0];

foreach ($xml->anime as $anime)
{
    //var_dump($anime);

    $descPipes = array(
        0 => array('pipe', 'r'),
        1 => array('pipe', 'w'),
        2 => array('file', 'err.log', 'a')
    );

    $cwd = getcwd();
    $env = array();

    $proc = proc_open('python ' . $home_dir . '/scripts/py/mal_anime.py',
        $descPipes, $pipes, $cwd, $env);

    $got = '';

    if (is_resource($proc))
    {
        fwrite($pipes[0], str_replace(' ', '+', $anime->series_title) . ' ' .
                          $anime->series_animedb_id);
        fclose($pipes[0]);

        $got = stream_get_contents($pipes[1]);
        fclose($pipes[1]);

        $ret = proc_close($proc);
    }

    if ($got !== '')
    {
        $ret = simplexml_load_string($got);
        foreach ($ret->entry as $single)
        {
            //var_dump($single);

            if ((int)$single->id == (int)$anime->series_animedb_id)
            {
                if ($database->check_anime_exists_already(
                    $anime->series_animedb_id))
                {
                    if (!$database->check_freshness_of_anime(
                        (int) $anime->series_animedb_id,
                        (int) $anime->my_watched_episodes,
                        (string) $anime->my_status
                        ))
                    {
                        $database->update_anime(
                            (int) $anime->series_animedb_id,
                            (int) $anime->my_watched_episodes,
                            (string) $anime->my_status,
                            (int) $anime->my_score
                        );
                    }
                }
                else
                {
                    $database->add_new_anime(
                        (int) $anime->series_animedb_id,
                        (string) $anime->series_title,
                        (string) $single->synopsis,
                        (int) $anime->my_watched_episodes,
                        (int) $anime->my_score,
                        (string) $anime->my_status,
                        (string) $single->image
                    );
                }
            }
        }
    }
}

//$xml = new SimpleXMLElement($_FILES['xml']['tmp_name'], 0, true);
$xml = simplexml_load_file(
    //$home_dir.'/files/m4numbers_manga_mal.xml',
    sprintf($location, 'm4numbers', 'all', 'manga'),
    'SimpleXMLElement', LIBXML_NOCDATA
);

$anime = $xml->manga[0];

foreach ($xml->manga as $manga)
{
    //var_dump($anime);

    $descPipes = array(
        0 => array('pipe', 'r'),
        1 => array('pipe', 'w'),
        2 => array('file', 'err.log', 'a')
    );

    $cwd = getcwd();
    $env = array();

    $proc = proc_open('python ' . $home_dir . '/scripts/py/mal_manga.py',
        $descPipes, $pipes, $cwd, $env);

    $got = '';

    if (is_resource($proc))
    {
        fwrite($pipes[0], str_replace(' ', '+', $manga->manga_title) . ' ' .
                          $anime->series_animedb_id);
        fclose($pipes[0]);

        $got = stream_get_contents($pipes[1]);
        fclose($pipes[1]);

        $ret = proc_close($proc);
    }

    if ($got !== '')
    {
        $ret = simplexml_load_string($got);
        foreach ($ret->entry as $single)
        {
            //var_dump($single);

            if ((int)$single->id == (int)$manga->manga_mangadb_id)
            {
                if ($database->check_manga_exists_already(
                    $manga->manga_mangadb_id))
                {
                    if (!$database->check_freshness_of_manga(
                        (int) $manga->manga_mangadb_id,
                        (int) $manga->my_read_chapters,
                        (string) $manga->my_status
                    ))
                    {
                        $database->update_manga(
                            (int) $manga->manga_mangadb_id,
                            (int) $manga->my_read_volumes,
                            (int) $manga->my_read_chapters,
                            (string) $manga->my_status,
                            (int) $manga->my_score
                        );
                    }
                }
                else
                {
                    $database->add_new_manga(
                        (int) $manga->manga_mangadb_id,
                        (string) $manga->manga_title,
                        (string) $single->synopsis,
                        (int) $manga->my_read_volumes,
                        (int) $manga->my_read_chapters,
                        (int) $manga->my_score,
                        (string) $manga->my_status,
                        (string) $single->image
                    );
                }
            }
        }
    }
}