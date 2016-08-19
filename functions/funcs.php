<?php

//require_once $home_dir . "/functions/enums.php";

function timer($t = 0) {
    if ($t == 0)
        return microtime(true);
    else
        return microtime(true) - $t;
}

function toggle_anime_state($state)
{
    if (is_numeric($state))
    {
        switch ($state) {
            case ANIME_COMPLETED:
                return 'Completed';
                break;
            case ANIME_DROPPED:
                return 'Dropped';
                break;
            case ANIME_HOLDING:
                return 'On-Hold';
                break;
            case ANIME_PLANNED:
                return 'Plan to Watch';
                break;
            case ANIME_WATCHING:
                return 'Watching';
                break;
        }
    }
    switch ($state)
    {
        case 'Completed':
            return ANIME_COMPLETED;
            break;
        case 'Dropped':
            return ANIME_DROPPED;
            break;
        case 'Watching':
            return ANIME_WATCHING;
            break;
        case 'Plan to Watch':
            return ANIME_PLANNED;
            break;
        case 'On-Hold':
            return ANIME_HOLDING;
            break;
    }

    return -1;
}

function toggle_manga_state($state)
{
    if (is_numeric($state))
    {
        switch ($state) {
            case MANGA_COMPLETED:
                return 'Completed';
                break;
            case MANGA_DROPPED:
                return 'Dropped';
                break;
            case MANGA_HOLDING:
                return 'On-Hold';
                break;
            case MANGA_PLANNED:
                return 'Plan to Read';
                break;
            case MANGA_READING:
                return 'Reading';
                break;
        }
    }
    switch ($state)
    {
        case 'Completed':
            return MANGA_COMPLETED;
            break;
        case 'Dropped':
            return MANGA_DROPPED;
            break;
        case 'Reading':
            return MANGA_READING;
            break;
        case 'Plan to Read':
            return MANGA_PLANNED;
            break;
        case 'On-Hold':
            return MANGA_HOLDING;
            break;
    }

    return -1;
}