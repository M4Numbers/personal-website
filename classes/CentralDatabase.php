<?php

/**
 * Copyright 2014 Matthew Ball (CyniCode/M477h3w1012)
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

namespace m4numbers\Database;

use PDO;
use PDOStatement;
use PDOException;

/**
 * Class CentralDatabase The central class that controls all
 * the functions which interact with the database. This includes
 * statement preparation and statement execution.
 *
 * @author Cynical
 */
class CentralDatabase
{

    /**
     * @var PDO The database object that controls all the
     *  connections in every database we're operating here
     */
    private $pdo_base;

    /**
     * @var string The prefix of all current tables in this
     *  database
     */
    private $prefix;


    /**
     * @var string The installation directory for use in
     *  conjunction with all other variables
     */
    private $home_dir;


    /**
     * @var string The location of the config file
     */
    private $conf_dir;

    /**
     * @var string The location of the functions file
     */
    private $func_dir;

    /**
     * Connect to the chosen database with the selected
     * configuration options.
     *
     * @param string $base     The installation directory of the store
     * @param string $database The chosen database that we're going
     *                         to perform functions and statements on
     * @param string $prefix   The prefix of all tables in the chosen
     *                         database
     */
    protected function __construct($base, $database, $prefix)
    {

        //Let's create all the local variables...
        $this->home_dir = $base;

        //And some more
        $this->conf_dir = $base . '/functions/conf.php';
        $this->func_dir = $base . '/functions/function.php';

        //Now we actually do need to include
        // the configuration file for reasons
        if (!defined('DATABASE'))
        {
            require_once $this->conf_dir;
        }

        //Connect using the information we've been supplied
        // in the constructor
        $dsn = sprintf('mysql:dbname=%s;host=%s:%s;', $database, DATAHOST, DATAPORT);

        try
        {

            //Create the database and set the associative fetch
            // array as default
            $pdo_base = new PDO($dsn, DATAUSER, DATAPASS);
            $pdo_base->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            $pdo_base->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            //And set the last few things in the variables
            $this->pdo_base = $pdo_base;
            $this->prefix = $prefix;

        }
        catch (PDOException $ex)
        {

            //And, just in case it failed, we need to catch said
            // failure and output it to the error log.
            error_log('Could not connect to database: ' . $ex->getMessage());
            die;

        }

    }

    /**
     * Return the statement when we've given it the basic string template
     * to play with.
     *
     * @param String $string : The string that we're going to put into
     *                       a PDO statement and the thing we're going to return
     *
     * @return PDOStatement : Well... it was the $string
     * @throws PDOException : For when santa thinks we've been naughty
     */
    protected function makePreparedStatement($string)
    {

        try
        {

            //Replace all implementations of the special character with
            // the prefix of the tables that we've been provided with
            $string = sprintf(str_replace('@', '%1$s', $string), $this->prefix);
            return $this->pdo_base->prepare($string);

        }
        catch (PDOException $ex)
        {

            error_log('Failed to make prepared statement: ' . $ex->getMessage());
            throw $ex;

        }

    }

    /**
     * A function to bind all the values of a MySQLi statement to their actual
     * values as given... read into that what you will.
     *
     * @param PDOStatement $statement   : MySQL PDO statement
     * @param array        $arrayOfVars : An array, ordered, of all the values corresponding to the
     *                                  $statement from before
     *
     * @return PDOStatement : Return the statement that has been produced, thanks
     *  to our wonderful code... or false if it fails
     * @throws PDOException : If the SQL doesn't like to be bound to anyone
     */
    protected function assignStatement(PDOStatement $statement, array $arrayOfVars)
    {

        try
        {

            //We need to do each parameter for their own good.
            //Debug shit and bind the parameter as we need to.
            //NOTE: DEBUG FOUND HERE
            foreach ($arrayOfVars as $key => &$val)
            {
                //	error_log( sprintf("[KEY::%s]",$key) );
                //	error_log( sprintf("[VAL::%s]",$val) );
                if (is_array($val))
                {
                    $statement->bindParam($key, $val['value'], $val['type']);
                }
                else
                {
                    $statement->bindParam($key, $val);
                }
            }

            return $statement;

        }
        catch (PDOException $except)
        {

            error_log(
                'Error encountered during statement binding: '
                . $except->getMessage()
            );
            throw $except;

        }

    }

    /**
     * Execute a given status and return whatever happens to it
     *
     * @param PDOStatement $statement : The PDO statement that we're going to execute,
     *                                be it query, insertion, deletion, update, or fook knows
     *
     * @return PDOStatement : Return the rows that the statement gets
     *  that have been returned if it manages to find any... Might blow up
     * @throws PDOException : If SQL doth protest
     */
    protected function executeStatement(PDOStatement $statement)
    {

        try
        {

            $res = $statement->execute();

            return (!$res) ? FALSE : $statement;

        }
        catch (PDOException $ex)
        {

            error_log('Failed to execute statement: ' . $ex->getMessage());
            throw $ex;

        }

    }

    /**
     * Get, set and execute a statement in this one method instead of having
     * the same lines in a dozen other statements, all doing the same thing.
     *
     * @param PDOStatement $statement   : The statement that we're going to make
     *                                  into a star...
     * @param array        $arrayOfVars : The variables that are going to go into this
     *                                  statement at some point or another.
     *
     * @return PDOStatement : The result set that /should/ have been generated
     *  from the PDO execution
     * @throws PDOException : If PDO is a poor choice...
     */
    protected function executePreparedStatement(PDOStatement $statement, $arrayOfVars)
    {

        try
        {

            $stated = $this->assignStatement($statement, $arrayOfVars);

            return $this->executeStatement($stated);

        }
        catch (PDOException $ex)
        {

            throw $ex;

        }

    }

    /**
     * @return int The last insertion ID from a statement
     */
    protected function getLastInsertId()
    {
        return $this->pdo_base->lastInsertId();
    }

    /**
     * @return string The installation directory of the store
     */
    protected function getHomeDir()
    {
        return $this->home_dir;
    }

    /**
     * @return string The configuration file
     */
    protected function getConfDir()
    {
        return $this->conf_dir;
    }

    /**
     * @return string The file containing all the functions
     */
    protected function getFunctionDir()
    {
        return $this->func_dir;
    }

    /**
     * Destroy the PDO object
     */
    public function __destruct()
    {
        $this->pdo_base = NULL;
    }

}