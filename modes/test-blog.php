<?php

$additional = array();

$additional['title'] = 'Proposing Weird Thoughts';

$additional['description'] = 'Bleh';

$additional['single'] = FALSE;

if ($_GET['key'] !== '')
{
    $blog = $db->get_blog_from_title($_GET['key']);
    if (sizeof($blog) == 0)
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
    $b['blog_contents'] = \Michelf\MarkdownExtra::defaultTransform($b['blog_contents']);
    $b['blog_posted'] = date("h:iA, jS F Y", $b['blog_posted']);
}

if ($additional['single'] == FALSE)
{
    $additional['blogs'] = $blog;
}
