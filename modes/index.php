<?php

//$additional is an array of [key, value] pairs
$additional = array();

$additional['title'] = 'Home to that Strange Guy';

$additional['description'] = 'The homepage for M4Numbers: that strange internet '
                            .'guy. Here are a few things that are on this site '
                            .'that you might find interesting';

$additional['carousel'] = $db->getMostRecent();