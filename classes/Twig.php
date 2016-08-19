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
use Twig_TemplateInterface;
use Exception;

/**
 * Class Twig This is a class for the direct manipulation of .twig data.
 * This class has a protected constructor for the reason that templates
 * can come in two forms: files, or raw text. We accept both through
 * our children.
 *
 * @author Matthew D. Ball (@M4Numbers)
 */
class Twig {

    /**
     * This is the environment that we're working in. We only really need
     * one of these, so I could work on sharing it about a bit more
     *
     * @var Twig_Environment
     */
    private $loader;

    /**
     * This is the interface that we utilise through the common parent Twig
     * from our children that allows for both file and raw input to be treated
     * more-or-less the same in the eyes of the developer.
     *
     * @var Twig_TemplateInterface
     */
    private $template;

    /**
     * This is the working array of all the renderables that we accrue - that is to
     * say, these are all the variables that we're going to be throwing at our twig
     * files in order to load all of their dynamic text.
     *
     * @var array
     */
    private $renderables;

    /**
     * Constructed in a protected manner from our children, this constructor makes
     * the twig template and mostly initialises all of our variables so that we're
     * ready to lock and load.
     *
     * @param Twig_TemplateInterface $template
     * @param Twig_Environment $loader
     * @throws Exception
     */
    protected function __construct($template, $loader) {
        try {
            $this->template = $template;
            $this->loader = $loader;
            $this->renderables = array();
        } catch (Exception $ex) {
            //Don't know this would happen, but it's here if it does.
            throw $ex;
        }
    }

    /**
     * Add a new variable to the list of them that we're going to render into the
     * template eventually in a key-value pair situation, where the twig input looks
     * like this: {{ key.value }}
     *
     * @param String $key
     * @param array $value
     * @param boolean $d Debug variable.
     */
    public function addRenderable($key, $value, $d=false) {
        //If the user wants to see exactly what we're rendering, throw this $d value
        // in and they'll get all the info they want.
        if ($d) {
            echo $key;
            var_dump($value);
            echo '<br /><br />';
        }
        $this->renderables[$key] = $value;
    }

    /**
     * Making the template is going to be the final step more-or-less, and all it is
     * is just a rendering of our template with all the variables for rendering that
     * we've been given so far.
     *
     * @return string This function returns the rendered template as a string that we
     *  can just echo directly to the user
     */
    private function makeTemplate() {
        return $this->template->render($this->renderables);
    }

    /**
     * This is a nice pretty method for getting the finished template back. Originally,
     * there was going to be another method in this class which would die on return,
     * saving the user from echoing a statement. As it is, this is no more than a bigger
     * call stack at the moment.
     *
     * @return string Return the rendered template so that the caller can echo it out to
     *  the user at some point
     */
    public function getFinishedTemplate() {
        return $this->makeTemplate();
    }

    /**
     * Get the template from us for some reason or another
     *
     * @return Twig_TemplateInterface
     */
    public function getTemplate() {
        return $this->template;
    }

    /**
     * Destroy this thing.
     */
    public function closeTemplate() {
        $this->template = null;
        $this->loader = null;
        $this->renderables = null;
    }

    /**
     * When everything has finished, we destroy this thing.
     */
    public function __destruct() {
        $this->closeTemplate();
    }

}