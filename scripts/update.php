<?php

$home_dir = getcwd()."/../";

require_once $home_dir . "/../vendor/autoload.php";
require_once $home_dir . "/classes/Google.php";
require_once $home_dir . "/functions/enums.php";
require_once $home_dir . "/functions/conf.php";
require_once $home_dir . "/classes/CentralDatabase.php";
require_once $home_dir . "/classes/DataBase.php";

$database = new DataBase($home_dir, DATABASE);

//$xml = new SimpleXMLElement($_FILES['xml']['tmp_name'], 0, true);
//$rss = simplexml_load_file("http://myanimelist.net/rss.php?type=rw&u=M4Numbers");
$xml = simplexml_load_file("../files/m4numbers_mal.xml");

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

    $proc = proc_open('python py/mal.py', $descPipes, $pipes, $cwd, $env);

    $got = '';

    if (is_resource($proc))
    {
        fwrite($pipes[0], str_replace(' ', '+', $anime->series_title) . ' ' . $anime->series_animedb_id);
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
                if ($database->check_anime_exists_already($anime->series_animedb_id))
                {
                    if (!$database->check_freshness_of_anime($anime->series_animedb_id, $anime->my_watched_episodes))
                    {
                        $database->update_anime(
                            $anime->series_animedb_id, $anime->my_watched_episodes,
                            $anime->my_status, $anime->my_score
                        );
                    }
                }
                else
                {
                    $database->add_new_anime(
                        $anime->series_animedb_id, $anime->series_title, $single->synopsis,
                        $anime->my_watched_episodes, $anime->my_score, $anime->my_status, $single->image
                    );
                }
            }
        }
    }
}



$google = new Google($home_dir);
$videos = $google->getMyChannelData();

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