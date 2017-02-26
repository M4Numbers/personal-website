<?php

$additional = array();

session_start();

if (!isset($_SESSION['blogged_in']))
{

    if (isset($_POST['attempted']))
    {

        if (hash('sha512', $_POST['inputPassword'], false) == BLOG_PASSWORD)
        {
            $_SESSION['blogged_in'] = true;
        }
        else
        {
            $redirect = true;
        }

    }

}

if (isset($_SESSION['blogged_in']))
{
    $additional['title'] = 'Proposing Weird Thoughts';

    $additional['description'] = 'This is all my views about whatever. A lot of them are self-destructive and '
        .'wrong, but I\'m sure some of them will at least offer some partial entertainment for a little while...';
    $additional['logged_in'] = true;

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

}
else
{
    $additional['title'] = 'Blog Log In';
    $additional['description'] = 'Blog Log In page.';
}

