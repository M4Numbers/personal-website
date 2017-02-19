<?php

$home_dir = getcwd().'/';

//Boot in our required classes
require_once $home_dir . '/vendor/autoload.php';
require_once $home_dir . '/classes/TwigFile.php';
require_once $home_dir . '/functions/funcs.php';
require_once $home_dir . '/functions/enums.php';
require_once $home_dir . '/functions/conf.php';
require_once $home_dir . '/classes/CentralDatabase.php';
require_once $home_dir . '/classes/DataBase.php';

use m4numbers\Twig\TwigFile;
use m4numbers\Database\DataBase;

$t = timer();

//These are all the available pages we can serve to the user,
// excluding master.twig, which is a thing we don't want the user
// to ever see.
$avail = array_diff(
    scandir('twigs/'), 
    array(
        'master.twig', 'journals.twig', 'carousel.twig'
    )
);

//If that thing turned out to be false, then it means that we've
// got an issue in that there are no files there, or the directory
// is completely inaccessible (or something)
if ($avail === false)
{
    die('Sorry, something has gone terribly wrong...');
}

//This is more a check to see that the .htaccess is behaving itself,
// but if there is no 'mode' set at all, then it's not, and we must
// cry.
if (!isset($_GET['mode']))
{
    die('Sorry, something has gone terribly wrong...');
}

//Let's check to see whether we have the file that we want in our
// available twigs...
$fileNo = array_search( strtolower($_GET['mode']).'.twig', $avail);

$fnf = false;

//If the file actually has an index (i.e. it exists)...
if ($fileNo != false)
{
    //We can serve that file through twig
    $twig = new TwigFile($avail[$fileNo], $home_dir);
    $act = $_GET['mode'];
    $page_name = strtolower($_GET['mode']);
}
//If no file was set at all...
else if ($_GET['mode'] == '')
{
    //We can just serve them the index page and have done with it
    $twig = new TwigFile('index.twig', $home_dir);
    $act = 'index';
    $p = 'Index';
    $page_name = 'index';
}
//And if they tried to access a page which didn't exist at all...
else
{
    //We point them towards the nice 404 file and run away
    $twig = new TwigFile('404.twig', $home_dir);
    $act = '404';
    $p = '404 - File Not Found';
    $page_name = '404';
    $fnf = true;
}

//Now we get our title from our file name, which has either been set above
// if we're on the index page or a 404, but for anything else, we strip out
// any dashes (which we replace with spaces), and capitalise every word
if (!isset($p))
{
    $p = ucwords(strtolower(str_replace('-', ' ', $_GET['mode'])));
}

//Then we compile all our renderables (most of which aren't actually necessary
// at this point, but have been left in because this is mostly legacy code
$general = array(
    'title' => $p,
    'description' => 'The home of the internet nobody: M4Numbers. This site '
                    .'contains details about his exploits in the land of the '
                    .'internet.',
    'location' => 'https://m4numbers.co.uk/',
    'base_location' => 'https://m4numbers.co.uk/',
    'time' => round(timer($t), 3),
    'page' => $page_name
);

$twig->addRenderable('general', $general);

if ($fnf) {
    die($twig->getFinishedTemplate());
}

$db = new DataBase($home_dir, DATABASE);

$additional = array();

@include_once $home_dir . '/modes/' . $act . '.php';

foreach ($additional as $key => $val) {
    $twig->addRenderable($key, $val);
}

echo $twig->getFinishedTemplate();
