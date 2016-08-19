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
use Twig_Loader_Filesystem;

if (!isset($home_dir)) {
    $home_dir = getcwd().'/../';
}

require_once $home_dir.'/classes/Twig.php';

use m4numbers\Twig\Twig;

/**
 * Class TwigFile This is an extension for the Twig loader implemented by
 * @M4Numbers. It allows for a twig file to be loaded in without having to
 * worry about launching all of the environment requirements that Twig
 * asks you to do.
 *
 * @author Matthew D. Ball (@M4Numbers)
 */

class TwigFile extends Twig {

    /**
     * Construct a Twig class using the file that we've been provided with
     *
     * @param String $file The name of the file that we're searching for to
     *  load into twig
     * @param String $home_dir The root directory that we're working from
     */
    public function __construct($file, $home_dir) {
        Twig_Autoloader::register();
        $loader = new Twig_Loader_Filesystem($home_dir . '/twigs/');
        $twig = new Twig_Environment($loader);
        $template = $twig->loadTemplate($file);
        parent::__construct($template, $twig);
    }

}