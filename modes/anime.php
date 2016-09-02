<?php

$additional = array();

$additional['title'] = 'Regarding Animated Characters';

$additional['description'] = 'I have a lot of time on my hands and I therefore '
                            .'watch a lot (and I mean a lot) of anime when I '
                            .'have the time for it (read: all the time). These '
                            .'are some of my personal favourites.';

$additional['single'] = FALSE;

$filters = array(ANIME_COMPLETED, ANIME_PLANNED, ANIME_DROPPED,
                 ANIME_HOLDING, ANIME_WATCHING);
$load = LOAD_MODE_ANIME_ALL;

if ($_GET['key'] !== '')
{
    if (is_numeric($_GET['key']))
    {
        $additional['anime'] = $db->get_anime($_GET['key']);
        $additional['single'] = (bool) $additional['anime'];
        if ($additional['single'] == TRUE)
        {
            $additional['anime']['status'] = toggle_anime_state(
                $additional['anime']['status']
            );
            $additional['anime']['comments'] = '';
            $comments = $db->get_comments_for_anime($additional['anime']['id']);
            if ($comments != '')
            {
                $additional['anime']['comments'] =
                    \Michelf\Markdown::defaultTransform($comments);
            }
        }
    }
    else
    {
        switch ($_GET['key'])
        {
            case 'completed':
                $filters = array(ANIME_COMPLETED);
                $load = LOAD_MODE_ANIME_COMPLETE;
                break;
            case 'watching':
                $filters = array(ANIME_WATCHING);
                $load = LOAD_MODE_ANIME_WATCHING;
                break;
            case 'dropped':
                $filters = array(ANIME_DROPPED);
                $load = LOAD_MODE_ANIME_DROPPED;
                break;
            case 'held':
                $filters = array(ANIME_HOLDING);
                $load = LOAD_MODE_ANIME_HOLDING;
                break;
            case 'planned':
                $filters = array(ANIME_PLANNED);
                $load = LOAD_MODE_ANIME_PLANNED;
                break;
            case 'seen':
                $filters = array(
                    ANIME_COMPLETED, ANIME_WATCHING,
                    ANIME_DROPPED, ANIME_HOLDING
                );
                $load = LOAD_MODE_ANIME_SEEN;
                break;
            case 'all':
            default:
                $filters = array(
                    ANIME_COMPLETED, ANIME_PLANNED, ANIME_DROPPED,
                    ANIME_HOLDING, ANIME_WATCHING
                );
                $load = LOAD_MODE_ANIME_ALL;
        }
    }
}

if ($additional['single'] == FALSE)
{
    $additional['anime'] = $db->get_all_anime(0, $filters);
    $additional['srch'] = $load;

    foreach ($additional['anime'] as &$a)
    {
        $a['status'] = toggle_anime_state((int)$a['status']);
    }

}
