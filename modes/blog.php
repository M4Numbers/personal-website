<?php

$additional = array();

$additional['title'] = 'Proposing Weird Thoughts';

$additional['description'] = 'Bleh';

$additional['single'] = FALSE;

if ($_GET['key'] !== '')
{
    if (is_numeric($_GET['key']))
    {
        $blog = $db->get_blog_from_id($_GET['key']);
    }
    else if ($_GET['key'] == 'page')
    {
        $blog = $db->get_limited_blogs(5, $_GET['page']);
    }
    else
    {
        $blog = $db->get_blog_from_title($_GET['key']);
    }

    if ($blog[0]['contents'] == null)
    {
        $blog = $db->get_limited_blogs(5, 1);
    }
}
else
{
    $blog = $db->get_limited_blogs(5, 1);
}

$pagecount = array(
    'page' => ($_GET['page'] != '') ? $_GET['page'] : 1,
    'total' => $db->get_blog_pages(5)
);

foreach ($blog as &$b)
{
    $b['contents'] = \Michelf\MarkdownExtra::defaultTransform($b['contents']);
    $b['posted'] = date("h:iA, jS F Y", $b['posted']);
}

$additional['blogs'] = $blog;
$additional['pagecount'] = $pagecount;
