<?php

$additional = array();

$additional['title'] = 'Apropos of Drawn Characters';

$additional['description'] = 'When I\'m not watching things or coding things '
                            .'or snarking at things or the usual stuff like '
                            .'that, I occasionally read things too. Not as '
                            .'much as I watch stuff, admittedly, but there\'s'
                            .' still not an insignificant amount here to see.';

$additional['single'] = FALSE;

$filters = array(
    MANGA_COMPLETED, MANGA_PLANNED, MANGA_DROPPED,
    MANGA_HOLDING, MANGA_READING
);
$load = LOAD_MODE_MANGA_ALL;

if ($_GET['key'] !== '')
{
    if (is_numeric($_GET['key']))
    {
        $additional['manga'] = $db->get_manga($_GET['key']);
        $additional['single'] = (bool) $additional['manga'];
        if ($additional['single'] == TRUE)
        {
            $additional['manga']['status'] = toggle_manga_state(
                $additional['manga']['status']
            );
            $additional['manga']['comments'] = '';
            $comments = $db->get_comments_for_manga($additional['manga']['id']);
            if ($comments != '')
            {
                $additional['manga']['comments'] =
                    \Michelf\Markdown::defaultTransform($comments);
            }
        }
    }
    else
    {
        switch ($_GET['key'])
        {
            case 'complete':
                $filters = array(MANGA_COMPLETED);
                $load = LOAD_MODE_MANGA_COMPLETE;
                break;
            case 'reading':
                $filters = array(MANGA_READING);
                $load = LOAD_MODE_MANGA_READING;
                break;
            case 'dropped':
                $filters = array(MANGA_DROPPED);
                $load = LOAD_MODE_MANGA_DROPPED;
                break;
            case 'held':
                $filters = array(MANGA_HOLDING);
                $load = LOAD_MODE_MANGA_HOLDING;
                break;
            case 'planned':
                $filters = array(MANGA_PLANNED);
                $load = LOAD_MODE_MANGA_PLANNED;
                break;
            case 'read':
                $filters = array(
                    MANGA_COMPLETED, MANGA_READING,
                    MANGA_DROPPED, MANGA_HOLDING
                );
                $load = LOAD_MODE_MANGA_READ;
                break;
            case 'all':
            default:
                $filters = array(
                    MANGA_COMPLETED, MANGA_PLANNED, MANGA_DROPPED,
                    MANGA_HOLDING, MANGA_READING
                );
                $load = LOAD_MODE_MANGA_ALL;
        }
    }
}

if ($additional['single'] == FALSE)
{
    $additional['manga'] = $db->get_all_manga(0, $filters);
    $additional['srch'] = $load;

    foreach ($additional['manga'] as &$m)
    {
        $m['status'] = toggle_manga_state((int)$m['status']);
    }

}