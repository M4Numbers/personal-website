<?php

$additional = array();

$additional['title'] = 'On Video Games';

$additional['description'] = 'In my spare time, I make videos for YouTube. '
                            .'These videos are my most-recent uploads to said '
                            .'site (you may notice a trend of Nuclear Throne)';

$additional['single'] = FALSE;

if ($_GET['key'] !== '')
{
    $additional['video'] = $db->get_video($_GET['key']);
    $additional['single'] = (bool) $additional['video'];
    if ($additional['single'] != FALSE)
    {
        $additional['video']['published'] = substr($additional['video']['published'], 0, 10);
    }
}

if ($additional['single'] == FALSE)
{
    $additional['video'] = $db->get_all_videos(0);
    foreach ($additional['video'] as &$v)
    {
        $v['published'] = substr($v['published'], 0, 10);
    }
}