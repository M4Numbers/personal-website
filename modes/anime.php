<?php

$additional = array();

$additional['title'] = 'Regarding Animated Characters';

$additional['description'] = 'I have a lot of time on my hands and I therefore '
                            .'watch a lot (and I mean a lot) of anime when I '
                            .'have the time for it (read: all the time). These '
                            .'are some of my personal favourites.';

$additional['single'] = FALSE;

if ($_GET['key'] !== '')
{
    $additional['anime'] = $db->get_anime($_GET['key']);
    $additional['single'] = (bool) $additional['anime'];
    if ($additional['single'] == TRUE)
    {
        $additional['anime']['status'] = toggle_anime_state($additional['anime']['status']);
        $additional['anime']['comments'] = '';
        $comments = $db->get_comments_for_anime($additional['anime']['id']);
        if ($comments != '')
        {
            $additional['anime']['comments'] =
                \Michelf\Markdown::defaultTransform($comments);
        }
    }
}

if ($additional['single'] == FALSE)
{
    $filters = array(ANIME_COMPLETED);
    $additional['anime'] = $db->get_all_anime(0, $filters);

    foreach ($additional['anime'] as &$a)
    {
        $a['status'] = toggle_anime_state((int)$a['status']);
    }

}
