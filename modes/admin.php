<?php

$additional = array();

session_start();

if (!isset($_SESSION['logged_in']))
{

    if (isset($_POST['attempted']))
    {

        if (md5($_POST['inputPassword']) == PASSWORD)
        {
            $_SESSION['logged_in'] = true;
        }
        else
        {
            $redirect = true;
        }
        
    }

}

if (isset($_SESSION['logged_in']))
{
    $additional['title'] = 'Administration Panel';
    $additional['description'] = 'Admin panel.';
    $additional['logged_in'] = true;

    $additional['anime'] = $db->get_all_anime_slugs();
    $additional['manga'] = $db->get_all_manga_slugs();
}
else
{
    $additional['title'] = 'Administration Log In';
    $additional['description'] = 'Admin Log In page.';
}