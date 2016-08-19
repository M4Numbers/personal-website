<?php

$additional = array();

$additional['title'] = 'Apropos of Drawn Characters';

$additional['description'] = 'When I\'m not watching things or coding things '
                            .'or snarking at things or the usual stuff like '
                            .'that, I occasionally read things too. Not as '
                            .'much as I watch stuff, admittedly, but there\'s'
                            .' still not an insignificant amount here to see.';

$additional['single'] = FALSE;

if ($_GET['key'] !== '')
{
    $additional['manga'] = $db->get_manga($_GET['key']);
    $additional['single'] = (bool) $additional['manga'];
    if ($additional['single'] == TRUE)
    {
        $additional['manga']['status'] = toggle_manga_state(
            $additional['manga']['status']);
        $additional['manga']['comments'] = $db->get_comments_for_manga(
            $additional['manga']['id']);
    }
}

if ($additional['single'] == FALSE)
{
    $filters = array(MANGA_COMPLETED);
    $additional['manga'] = $db->get_all_manga(0, $filters);

    foreach ($additional['manga'] as &$m)
    {
        $m['status'] = toggle_manga_state((int)$m['status']);
    }

}