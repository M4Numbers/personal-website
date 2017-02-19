<?php

$additional = array();

$additional['title'] = 'Proposing Weird Thoughts';

$additional['description'] = 'Bleh';

$additional['single'] = FALSE;

if ($_GET['key'] !== '')
{
    $blog = $db->get_blog_from_title($_GET['key']);
    if ($blog[0]['contents'] == null)
    {
        $blog = $db->get_all_blogs();
    }
}
else
{
    $blog = $db->get_all_blogs();
}

foreach ($blog as &$b)
{
    $b['contents'] = \Michelf\MarkdownExtra::defaultTransform($b['contents']);
    $b['posted'] = date("h:iA, jS F Y", $b['posted']);
}

if ($additional['single'] == FALSE)
{
    $additional['blogs'] = $blog;
}
