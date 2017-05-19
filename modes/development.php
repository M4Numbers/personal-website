<?php

$additional = array();

$additional['title'] = 'Concerning the most Maddening of Hobbies';

$additional['description'] = 'This page details some of my favourite/notable '
                            .'exploits into the world of development. Some of '
                            .'these might be interesting to me and me alone, '
                            .'but hey.';

$devel = null;

if ($_GET['key'] != '')
{
    $devel = $db->get_development_project_from_id($_GET['key'])[0];
}

if ($devel == null)
{
    $devel = $db->get_all_development_projects();
}
else
{
    $additional['single'] = true;
    $devel['contents'] = \Michelf\Markdown::defaultTransform($devel['contents']);
}

$additional['devel'] = $devel;
