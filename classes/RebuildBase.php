<?php
/**
 * Copyright 2017 Matthew D. Ball (m.d.ball2@ncl.ac.uk)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Created by PhpStorm.
 * User: M4Numbers
 * Date: 19/02/2017
 * Time: 05:15
 */

namespace m4numbers\Database;

use PDO;
use PDOException;

if (!isset($home_dir))
{
    $home_dir = getcwd().'/../';
}

if (!class_exists('CentralDatabase'))
{
    require_once $home_dir . '/classes/CentralDatabase.php';
}

if (!function_exists('process_manga_state'))
{
    require_once $home_dir . '/functions/funcs.php';
}

use m4numbers\Database\CentralDatabase;

/**
 * Created by PhpStorm.
 * User: M4Numbers
 * Date: 15/03/2016
 * Time: 07:38
 */
class RebuildBase extends CentralDatabase
{

    public function __construct($home, $database)
    {
        parent::__construct($home, $database, "");
    }

    private function executer($sql, $aov = null)
    {
        try
        {
            if ($aov == null)
            {
                return parent::executeStatement(
                    parent::makePreparedStatement($sql)
                );
            }
            else
            {
                return parent::executePreparedStatement(
                    parent::makePreparedStatement($sql), $aov
                );
            }
        }
        catch (PDOException $ignored)
        {
        }
        return null;
    }

    public function get_old_anime()
    {
        $sql = "SELECT * FROM `old_anime_list`";
        return $this->executer($sql)->fetchAll();
    }

    public function get_old_anime_comments_from_id($id)
    {
        $aov = array(':id'=>$id);
        $sql = "SELECT * FROM `old_anime_comments` WHERE `anime_id`=:id";
        return $this->executer($sql, $aov)->fetch();
    }

    public function get_old_manga()
    {
        $sql = "SELECT * FROM `old_manga_list`";
        return $this->executer($sql)->fetchAll();
    }

    public function get_old_manga_comments_from_id($id)
    {
        $aov = array(':id'=>$id);
        $sql = "SELECT * FROM `old_manga_comments` WHERE `manga_id`=:id";
        return $this->executer($sql, $aov)->fetch();
    }

    public function get_old_videos()
    {
        $sql = "SELECT * FROM `old_youtube_videos`";
        return $this->executer($sql)->fetchAll();
    }

    public function insert_new_comment($comment)
    {
        $aov = array(':comment'=>$comment);
        $sql = "INSERT INTO `general_comments` (`comments`) VALUE (:comment)";
        $this->executer($sql, $aov);
        return parent::getLastInsertId();
    }

    public function insert_new_anime($anime)
    {
        $aov = array(
            ':anime_id' => $anime['anime_id'],
            ':anime_status' => $anime['anime_status'],
            ':title' => $anime['title'],
            ':score' => $anime['score'],
            ':status' => $anime['status'],
            ':total_eps' => $anime['total_eps'],
            ':current_ep' => $anime['current_ep'],
            ':synopsis' => $anime['synopsis'],
            ':cover' => $anime['cover'],
            ':comments_id' => $anime['comments_id']
        );

        $sql = "INSERT INTO `anime_list` (`anime_id`, `anime_status`, `title`, `score`, `status`, `total_eps`,
                `current_ep`, `synopsis`, `cover`, `comments_id`) VALUE (:anime_id, :anime_status, :title, :score,
                :status, :total_eps, :current_ep, :synopsis, :cover, :comments_id)";

        $this->executer($sql, $aov);
        return parent::getLastInsertId();
    }

    public function insert_new_manga($manga)
    {
        $aov = array(
            ':manga_id' => $manga['manga_id'],
            ':manga_status' => $manga['manga_status'],
            ':story_type' => $manga['story_type'],
            ':title' => $manga['title'],
            ':score' => $manga['score'],
            ':status' => $manga['status'],
            ':total_vols' => $manga['total_vols'],
            ':total_chaps' => $manga['total_chaps'],
            ':current_vol' => $manga['current_vol'],
            ':current_chap' => $manga['current_chap'],
            ':synopsis' => $manga['synopsis'],
            ':cover' => $manga['cover'],
            ':comments_id' => $manga['comments_id']
        );

        $sql = "INSERT INTO `manga_list` (`manga_id`, `manga_status`, `story_type`, `title`, `score`, `status`,
                `total_vols`, `total_chaps`, `current_vol`, `current_chap`, `synopsis`, `cover`, `comments_id`)
                VALUE (:manga_id, :manga_status, :story_type, :title, :score, :status, :total_vols, :total_chaps,
                :current_vol, :current_chap, :synopsis, :cover, :comments_id)";

        $this->executer($sql, $aov);
        return parent::getLastInsertId();
    }

    public function insert_new_video($video)
    {
        $aov = array(
            ':video_key' => $video['video_key'],
            ':title' => $video['title'],
            ':uploader' => $video['uploader'],
            ':description' => $video['description'],
            ':published' => $video['published'],
            ':thumb' => $video['thumb']
        );

        $sql = "INSERT INTO `youtube_videos` (`video_key`, `title`, `uploader`, `description`, `published`, `thumb`)
                VALUE (:video_key, :title, :uploader, :description, :published, :thumb)";

        $this->executer($sql, $aov);
        return parent::getLastInsertId();
    }

    public function registerUpdate($update_type, $id)
    {
        $dov = array(
            ':key' => $id
        );

        $aov = array(
            ':upType' => $update_type,
            ':key' => $id
        );

        switch ($update_type)
        {
            case UPDATE_ART:
                $dql = 'DELETE FROM `last_update` WHERE `art_id`=:key';
                $sql = 'INSERT INTO `last_update` (`update_type`, `anime_id`)
                        VALUES (:upType, :key)';
                break;
            case UPDATE_ANIME:
                $dql = 'DELETE FROM `last_update` WHERE `anime_id`=:key';
                $sql = 'INSERT INTO `last_update` (`update_type`, `anime_id`)
                        VALUES (:upType, :key)';
                break;
            case UPDATE_MANGA:
                $dql = 'DELETE FROM `last_update` WHERE `manga_id`=:key';
                $sql = 'INSERT INTO `last_update` (`update_type`, `manga_id`)
                        VALUES (:upType, :key)';
                break;
            case UPDATE_BLOG:
                $dql = 'DELETE FROM `last_update` WHERE `blog_id`=:key';
                $sql = 'INSERT INTO `last_update` (`update_type`, `blog_id`)
                        VALUES (:upType, :key)';
                break;
            case UPDATE_DEVEL:
                $dql = 'DELETE FROM `last_update` WHERE `devel_id`=:key';
                $sql = 'INSERT INTO `last_update` (`update_type`, `devel_id`)
                        VALUES (:upType, :key)';
                break;
            case UPDATE_VIDEO:
                $dql = 'DELETE FROM `last_update` WHERE `video_id`=:key';
                $sql = 'INSERT INTO `last_update` (`update_type`, `video_id`)
                        VALUES (:upType, :key)';
                break;
            default:
                $dql = '';
                $sql = '';
        }

        try
        {
            if ($sql !== '')
            {
                parent::executePreparedStatement(
                    parent::makePreparedStatement($dql), $dov
                );
                parent::executePreparedStatement(
                    parent::makePreparedStatement($sql), $aov
                );
            }
        }
        catch (PDOException $e)
        {
            throw $e;
        }
    }

}