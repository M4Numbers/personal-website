<?php

$additional = array();

$additional['title'] = 'Polling';

$additional['description'] = 'A place for discerning public opinion on a certain topic over a period of time';

if (isset($_GET['key']) || $_GET['key'] != '')
{
    $additional['poll'] = $db->get_all_poll_options($_GET['key']);
    $additional['poll_title'] = $_GET['key'];
    $additional['single'] = (bool) $additional['poll'];
}

if ($additional['single'] == FALSE)
{
    $additional['all_polls'] = $db->get_all_poll_projects();
}
