<?php
/**
 * Copyright 2014 Matthew D. Ball (@M4Numbers)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

namespace m4numbers\Twig;

use Twig_Environment;
use Twig_Autoloader;
use Twig_Loader_String;

if (!isset($home_dir)) {
    $home_dir = getcwd().'/../';
}

require_once $home_dir.'/classes/Twig.php';

use m4numbers\Twig\Twig;

/**
 * Class TwigRaw This is an extension for the Twig loader implemented by
 * @M4Numbers. It allows for a twig string to be loaded in and rendered
 * without having to make a file to do all of that. This is more rare, but
 * it's quite useful if small things are needed for debugging
 *
 * @author Matthew D. Ball (@M4Numbers)
 */

class TwigRaw extends Twig {

    /**
     * A constructor that allows us to boot up our Twig parent with a string
     * that will eventually be rendered via twig. Again, generally only for
     * small things or for some extreme cases.
     *
     * @param String $twig_string The string that we're going to be rendering
     *  in Twig
     * @param String $home_dir The pointer to where our home is relative to us
     */
    public function __construct($twig_string, $home_dir) {
        Twig_Autoloader::register();
        $loader = new Twig_Loader_String();
        $twig = new Twig_Environment($loader);
        $template = $twig->loadTemplate($twig_string);
        parent::__construct($template, $twig);
    }
} 