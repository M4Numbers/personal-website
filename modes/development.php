<?php

$additional = array();

$additional['title'] = 'Concerning the most Maddening of Hobbies';

$additional['description'] = 'This page details some of my favourite/notable '
                            .'exploits into the world of development. Some of '
                            .'these might be interesting to me and me alone, '
                            .'but hey.';

if ($_GET['key'] != '')
{
    $devel = $db->get_development_project_from_id($_GET['key']);
}
else
{
    $devel = $db->get_all_development_projects();
}

$additional['devel'] = $devel;