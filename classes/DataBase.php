<?php

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
class DataBase extends CentralDatabase
{

    public function __construct($home, $database)
    {
        parent::__construct($home, $database, "");
    }

    public function add_new_anime($anime_id, $anime_title, $anime_synopsis, $episodes_watched,
                                    $total_eps, $score, $status, $series_status, $image)
    {
        $aov = array(
            ':anid'=> $anime_id,
            ':antitle' => $anime_title,
            ':anscore' => $score,
            ':anstatus' => process_anime_state($status),
            ':serstatus' => process_anime_series_state($series_status),
            ':toteps' => $total_eps,
            ':aneps' => $episodes_watched,
            ':ansyn' => $anime_synopsis,
            ':animg' => $image,
        );

        $sql = 'INSERT INTO `anime_list`
                (`anime_id`, `title`, `score`, `status`, `anime_status`, `total_eps`, `current_ep`,
                 `synopsis`, `cover`) VALUES (:anid, :antitle, :anscore, :anstatus, :serstatus,
                  :toteps, :aneps, :ansyn, :animg)';
        
        try
        {
            parent::executePreparedStatement(parent::makePreparedStatement($sql), $aov);
            $this->registerUpdate(UPDATE_ANIME, parent::getLastInsertId());
        }
        catch (PDOException $e)
        {
            throw $e;
        }
    }

    public function update_anime($anime_id, $eps_watched, $state, $score)
    {
        $aov = array(
            ':anid' => array(
                'value' => $anime_id,
                'type' => PDO::PARAM_INT
            ),
            ':aneps'=> array(
                'value' => $eps_watched,
                'type' => PDO::PARAM_INT
            ),
            ':anstate' => array(
                'value' => process_anime_state($state),
                'type' => PDO::PARAM_INT
            ),
            ':anscore' => array(
                'value' => $score,
                'type' => PDO::PARAM_INT
            )
        );

        //var_dump($aov);

        $sql = 'UPDATE `anime_list` SET
                  `current_ep`=:aneps, `status`=:anstate, `score`=:anscore
                WHERE `anime_id`=:anid';

        try
        {
            parent::executePreparedStatement(parent::makePreparedStatement($sql), $aov);
            $this->registerUpdate(UPDATE_ANIME, $this->get_id_of_anime($anime_id));
        }
        catch (PDOException $e)
        {
            throw $e;
        }
    }

    public function get_all_anime($offset, $filters)
    {
        $aov = array(
            ':offset' => array(
                'value' => $offset * 12,
                'type' => PDO::PARAM_INT,
            )
        );

        $filter = implode( ', ', $filters);

        $sql = 'SELECT `anime_id`, `title`, `score`, `status`, `cover`
                FROM `anime_list`
                WHERE `status` IN ('.$filter.')
                ORDER BY `title` LIMIT :offset, 12';

        try
        {
            $res = parent::executePreparedStatement(
                parent::makePreparedStatement($sql), $aov
            );

            return $res->fetchAll();
        }
        catch (PDOException $e)
        {
            throw $e;
        }
    }

    public function get_all_anime_slugs()
    {
        $sql = 'SELECT `anime_id`, `title`
                FROM `anime_list`
                ORDER BY `title`';

        try
        {
            $res = parent::executeStatement(
                parent::makePreparedStatement($sql)
            );

            return $res->fetchAll();
        }
        catch (PDOException $e)
        {
            throw $e;
        }
    }

    public function add_comment_to_anime($anime_id, $comment)
    {
        $aov = array(
            ':animeId' => $this->get_id_of_anime($anime_id),
            ':comment' => $comment,
            ':updateComment' => $comment
        );
        
        $sql = "INSERT INTO `anime_comments` (`anime_id`, `comments`)
                VALUES (:animeId, :comment)
                ON DUPLICATE KEY UPDATE `comments`=:updateComment";

        try
        {
            parent::executePreparedStatement(
                parent::makePreparedStatement($sql), $aov
            );
        }
        catch (PDOException $e)
        {
            throw $e;
        }
    }
    
    public function get_id_of_anime($anime_id)
    {
        $aov = array(
            ':animeId' => $anime_id
        );

        $sql = "SELECT `id` FROM `anime_list`
                WHERE `anime_id`=:animeId";

        try
        {
            $res = parent::executePreparedStatement(
                parent::makePreparedStatement($sql), $aov
            );

            $row = $res->fetch();

            return $row['id'];
        }
        catch (PDOException $e)
        {
            throw $e;
        }
    }

    public function get_comments_for_anime($anime_id)
    {
        $aov = array(
            ":animeId" => $anime_id
        );

        $sql = 'SELECT `comments` FROM `anime_comments`
                WHERE `anime_id`=:animeId';

        try
        {
            $res = parent::executePreparedStatement(
                parent::makePreparedStatement($sql), $aov
            );

            if ($res->rowCount() > 0)
            {
                $row = $res->fetch();
                return $row['comments'];
            }
            return null;
        }
        catch (PDOException $e)
        {
            throw $e;
        }
    }

    public function get_anime($anime_id)
    {
        $aov = array(
            ':animeId' => $anime_id
        );

        $sql = 'SELECT * FROM `anime_list`
                WHERE `anime_id`=:animeId';

        try
        {
            $res = parent::executePreparedStatement(
                parent::makePreparedStatement($sql), $aov
            );

            return $res->fetch();
        }
        catch (PDOException $e)
        {
            throw $e;
        }
    }

    public function check_anime_exists_already($anime_id)
    {
        $ao = array(
            ':animeId' => $anime_id
        );

        $sql = 'SELECT COUNT(*) AS `total` FROM `anime_list`
                WHERE `anime_id`=:animeId';

        try
        {
            $ret = parent::executePreparedStatement(
                parent::makePreparedStatement($sql), $ao
            );
            $row = $ret->fetch();
            return $row['total'] > 0;
        }
        catch (PDOException $e)
        {
            throw $e;
        }
    }

    public function check_freshness_of_anime($anime_id, $episodes_watched, $status)
    {
        $aov = array(
            ':animeId' => $anime_id,
            ':eps' => $episodes_watched,
            ':state' => process_anime_state($status),
        );

        echo $aov[':state'];

        $rql = 'SELECT COUNT(*) AS `total` FROM `anime_list`
                WHERE `anime_id`=:animeId AND `current_ep`=:eps AND `status`=:state';

        try
        {
            $ret = parent::executePreparedStatement(
                parent::makePreparedStatement($rql), $aov
            );
            $row = $ret->fetch();
            return $row['total'] > 0;
        }
        catch (PDOException $e)
        {
            throw $e;
        }

    }

    public function refresh_general_anime_details($anime_id, $series_episodes, $series_image, $series_status)
    {
        $aov = array(
            ':animeId' => $anime_id,
            ':eps' => $series_episodes,
            ':img' => $series_image,
            ':state' => $series_status
        );

        $sql = 'UPDATE `anime_list` SET
                  `total_eps`=:eps,
                  `cover`=:img,
                  `anime_status`=:state
                WHERE `anime_id`=:animeId';

        try
        {
            parent::executePreparedStatement(
                parent::makePreparedStatement($sql), $aov
            );
        }
        catch (PDOException $e)
        {
            throw $e;
        }
    }

    public function add_new_manga($manga_id, $manga_title, $manga_synopsis, $total_volumes,
                                    $total_chapters, $volumes_read, $chapters_read, $score,
                                    $status, $series_status, $image, $type)
    {
        $aov = array(
            ':maid'=> $manga_id,
            ':matitle' => $manga_title,
            ':mascore' => $score,
            ':mastatus' => process_manga_state($status),
            ':serstatus' => process_manga_series_state($series_status),
            ':totvol' => $total_volumes,
            ':totchap' => $total_chapters,
            ':mavol' => $volumes_read,
            ':mach' => $chapters_read,
            ':masyn' => $manga_synopsis,
            ':maimg' => $image,
            ':matype' => process_manga_type($type)
        );

        $sql = 'INSERT INTO `manga_list`
                (`manga_id`, `title`, `score`, `status`, `manga_status`, `total_vols`, `total_chaps`, 
                `current_vol`, `current_chap`, `synopsis`, `cover`, `story_type`)
                 VALUES (:maid, :matitle, :mascore, :mastatus, :serstatus, :totvol, :totchap, :mavol,
                  :mach, :masyn, :maimg, :matype)';

        try
        {
            parent::executePreparedStatement(parent::makePreparedStatement($sql), $aov);
            $this->registerUpdate(UPDATE_ANIME, parent::getLastInsertId());
        }
        catch (PDOException $e)
        {
            throw $e;
        }
    }

    public function update_manga($manga_id, $volumes_read, $chapters_read, $state, $score)
    {
        $aov = array(
            ':maid' => array(
                'value' => $manga_id,
                'type' => PDO::PARAM_INT
            ),
            ':mavol' => array(
                'value' => $volumes_read,
                'type' => PDO::PARAM_INT
            ),
            ':mach' => array(
                'value' => $chapters_read,
                'type' => PDO::PARAM_INT
            ),
            ':mastate' => array(
                'value' => process_manga_state($state),
                'type' => PDO::PARAM_INT
            ),
            ':mascore' => array(
                'value' => $score,
                'type' => PDO::PARAM_INT
            )
        );

        //var_dump($aov);

        $sql = 'UPDATE `manga_list` SET
                  `current_vol`=:mavol,
                  `current_chap`=:mach,
                  `status`=:mastate,
                  `score`=:mascore
                WHERE `manga_id`=:maid';

        try
        {
            parent::executePreparedStatement(parent::makePreparedStatement($sql), $aov);
            $this->registerUpdate(UPDATE_MANGA, $this->get_id_of_manga($manga_id));
        }
        catch (PDOException $e)
        {
            throw $e;
        }
    }

    public function refresh_general_manga_details($manga_id, $series_volumes, $series_chapters, $series_image,
        $series_status, $series_type)
    {
        $aov = array(
            ':mangaId' => $manga_id,
            ':vols' => $series_volumes,
            ':chaps' => $series_chapters,
            ':img' => $series_image,
            ':state' => $series_status,
            ':type' => $series_type
        );

        $sql = 'UPDATE `manga_list` SET
                  `total_vols`=:vols,
                  `total_chaps`=:chaps,
                  `cover`=:img,
                  `manga_status`=:state,
                  `story_type`=:type
                WHERE `manga_id`=:mangaId';

        try
        {
            parent::executePreparedStatement(
                parent::makePreparedStatement($sql), $aov
            );
        }
        catch (PDOException $e)
        {
            throw $e;
        }
    }

    public function get_all_manga($offset, $filters)
    {
        $aov = array(
            ':offset' => array(
                'value' => $offset * 12,
                'type' => PDO::PARAM_INT,
            )
        );

        $filter = implode( ', ', $filters);

        $sql = 'SELECT `manga_id`, `title`, `score`, `status`, `cover`
                FROM `manga_list`
                WHERE `status` IN ('.$filter.')
                ORDER BY `title` LIMIT :offset, 12';

        try
        {
            $res = parent::executePreparedStatement(
                parent::makePreparedStatement($sql), $aov
            );

            return $res->fetchAll();
        }
        catch (PDOException $e)
        {
            throw $e;
        }
    }

    public function get_all_manga_slugs()
    {
        $sql = 'SELECT `manga_id`, `title`
                FROM `manga_list`
                ORDER BY `title`';

        try
        {
            $res = parent::executeStatement(
                parent::makePreparedStatement($sql)
            );

            return $res->fetchAll();
        }
        catch (PDOException $e)
        {
            throw $e;
        }
    }

    public function add_comment_to_manga($manga_id, $comment)
    {
        $aov = array(
            ':mangaId' => $this->get_id_of_manga($manga_id),
            ':comment' => $comment,
            ':updateComment' => $comment
        );

        $sql = "INSERT INTO `manga_comments` (`manga_id`, `comments`)
                VALUES (:mangaId, :comment)
                ON DUPLICATE KEY UPDATE `comments`=:updateComment";

        try
        {
            parent::executePreparedStatement(
                parent::makePreparedStatement($sql), $aov
            );
        }
        catch (PDOException $e)
        {
            throw $e;
        }
    }

    public function get_id_of_manga($manga_id)
    {
        $aov = array(
            ':mangaId' => $manga_id
        );

        $sql = "SELECT `id` FROM `manga_list`
                WHERE `manga_id`=:mangaId";

        try
        {
            $res = parent::executePreparedStatement(
                parent::makePreparedStatement($sql), $aov
            );

            $row = $res->fetch();

            return $row['id'];
        }
        catch (PDOException $e)
        {
            throw $e;
        }
    }

    public function get_comments_for_manga($manga_id)
    {
        $aov = array(
            ":mangaId" => $manga_id
        );

        $sql = 'SELECT `comments` FROM `manga_comments`
                WHERE `manga_id`=:mangaId';

        try
        {
            $res = parent::executePreparedStatement(
                parent::makePreparedStatement($sql), $aov
            );

            if ($res->rowCount() > 0)
            {
                $row = $res->fetch();
                return $row['comments'];
            }
            return null;
        }
        catch (PDOException $e)
        {
            throw $e;
        }
    }

    public function get_manga($manga_id)
    {
        $aov = array(
            ':mangaId' => $manga_id
        );

        $sql = 'SELECT * FROM `manga_list`
                WHERE `manga_id`=:mangaId';

        try
        {
            $res = parent::executePreparedStatement(
                parent::makePreparedStatement($sql), $aov
            );

            return $res->fetch();
        }
        catch (PDOException $e)
        {
            throw $e;
        }
    }

    public function check_manga_exists_already($manga_id)
    {
        $ao = array(
            ':mangaId' => $manga_id
        );

        $sql = 'SELECT COUNT(*) AS `total` FROM `manga_list`
                WHERE `manga_id`=:mangaId';

        try
        {
            $ret = parent::executePreparedStatement(
                parent::makePreparedStatement($sql), $ao
            );
            $row = $ret->fetch();
            return $row['total'] > 0;
        }
        catch (PDOException $e)
        {
            throw $e;
        }
    }

    public function check_freshness_of_manga($manga_id, $chapters_read, $status)
    {
        $aov = array(
            ':mangaId' => $manga_id,
            ':chapters' => $chapters_read,
            ':state' => process_manga_state($status),
        );

        echo $aov[':state'];

        $rql = 'SELECT COUNT(*) AS `total` FROM `manga_list`
                WHERE `manga_id`=:mangaId AND `current_chap`=:chapters AND `status`=:state';

        try
        {
            $ret = parent::executePreparedStatement(
                parent::makePreparedStatement($rql), $aov
            );
            $row = $ret->fetch();
            return $row['total'] > 0;
        }
        catch (PDOException $e)
        {
            throw $e;
        }

    }

    public function get_video($video_id)
    {
        $aov = array(
            ":videoKey" => $video_id
        );

        $sql = "SELECT * FROM `youtube_videos`
                WHERE `video_key` = :videoKey";

        try
        {
            $res = parent::executePreparedStatement(
                parent::makePreparedStatement($sql), $aov
            );
            return $res->fetch();
        }
        catch (PDOException $e)
        {
            throw $e;
        }
    }

    public function get_all_videos($offset)
    {
        $aov = array(
            ':offset' => array(
                'value' => $offset * 12,
                'type' => PDO::PARAM_INT,
            )
        );

        $sql = 'SELECT `video_key`, `title`, `uploader`, `published`, `thumb`
                FROM `youtube_videos`
                ORDER BY `published` DESC LIMIT :offset, 12';

        try
        {
            $res = parent::executePreparedStatement(
                parent::makePreparedStatement($sql), $aov
            );

            return $res->fetchAll();
        }
        catch (PDOException $e)
        {
            throw $e;
        }
    }

    public function add_new_video($video_key, $title, $uploader, $desc, $published, $thumbnail)
    {
        $aov = array(
            ':vidKey' => $video_key,
            ':vidTitle' => $title,
            ':vidUp' => $uploader,
            ':vidDesc' => $desc,
            ':vidPub' => $published,
            ':vidImg' => $thumbnail,
        );

        $sql = 'INSERT INTO `youtube_videos`
                (`video_key`,`title`,`uploader`, `description`, `published`, `thumb`) 
                VALUES (:vidKey, :vidTitle, :vidUp, :vidDesc, :vidPub, :vidImg)';

        try
        {
            parent::executePreparedStatement(parent::makePreparedStatement($sql), $aov);

            $this->registerUpdate(UPDATE_VIDEO, parent::getLastInsertId());
        }
        catch (PDOException $e)
        {
            throw $e;
        }
    }

    public function check_video_exists_already($video_id)
    {
        $aov = array(
            ':vidId' => $video_id,
        );

        $sql = 'SELECT COUNT(*) AS `total` FROM `youtube_videos`
                WHERE `video_key`=:vidId';

        try
        {
            $ret = parent::executePreparedStatement(
                parent::makePreparedStatement($sql), $aov
            );
            $row = $ret->fetch();
            return $row['total'] > 0;
        }
        catch (PDOException $e)
        {
            throw $e;
        }
    }

    public function get_all_poll_projects()
    {
        $sql = 'SELECT `project_name` FROM `polling_projects`';

        $all_items = array();

        try
        {
            $ret = parent::executeStatement(parent::makePreparedStatement($sql));
            while ($row = $ret->fetch())
            {
                array_push($all_items, $row['project_name']);
            }
        }
        catch (PDOException $e)
        {
            throw $e;
        }

        return $all_items;
    }

    public function get_all_poll_options($poll_name)
    {
        $aov = array(
            ':projectName' => $poll_name
        );

        $sql = 'SELECT `option_name`, `votes` FROM `polling_options` AS `po`
                INNER JOIN `polling_projects` AS `pp` ON `pp`.`id`=`po`.`project_id`
                WHERE `pp`.`project_name` = :projectName';

        $all_options = array();

        try {
            $res = parent::executePreparedStatement(
                parent::makePreparedStatement($sql), $aov
            );

            while ($row = $res->fetch())
            {
                array_push($all_options, array(
                    'name' => $row['option_name'],
                    'votes' => $row['votes']
                ));
            }
        }
        catch (PDOException $e)
        {
            throw $e;
        }

        return $all_options;
    }

    public function get_all_blogs()
    {
        $sql = "SELECT * FROM `blog_posts`";

        $all_posts = array();

        try
        {
            $res = parent::executeStatement(
                parent::makePreparedStatement($sql)
            );

            while ($row = $res->fetch())
            {
                $row['blog_contents'] = $this->get_comments_from_comment_id($row['blog_comments']);
                array_push($all_posts, $row);
            }
        }
        catch (PDOException $e)
        {
            throw $e;
        }

        return $all_posts;
    }

    public function get_blog_from_title($title)
    {
        $aov = array(
            ':title' => $title
        );

        $sql = "SELECT * FROM `blog_posts`
                WHERE `search` = :title";

        try
        {
            $res = parent::executePreparedStatement(
                parent::makePreparedStatement($sql), $aov
            );

            $row = $res->fetch();
            $row['blog_contents'] = $this->get_blog_contents_from_title($title);
            return array($row);
        }
        catch (PDOException $e)
        {
            throw $e;
        }
    }

    public function get_all_blog_slugs()
    {
        $sql = 'SELECT `id`, `title`, `comments_id`
                FROM `blog_posts`
                ORDER BY `title`';

        try
        {
            $res = parent::executeStatement(
                parent::makePreparedStatement($sql)
            );

            return $res->fetchAll();
        }
        catch (PDOException $e)
        {
            throw $e;
        }
    }

    public function get_blog_contents_from_title($title)
    {
        $aov = array(
            ':title' => $title
        );

        $sql = 'SELECT `cont`.`comments` FROM `general_comments` AS `cont`
                INNER JOIN `blog_posts` AS `blog` ON `blog`.`blog_comments`=`cont`.`id`
                WHERE `blog`.`blog_search`=:title';

        try
        {
            $res = parent::executePreparedStatement(
                parent::makePreparedStatement($sql), $aov
            );

            $row = $res->fetch();
            return $row['comments'];
        }
        catch (PDOException $e)
        {
            throw $e;
        }
    }

    public function get_comments_from_comment_id($id)
    {
        $aov = array(
            ':id' => $id
        );

        $sql = 'SELECT `comments` FROM `general_comments`
                WHERE `id`=:id';

        try
        {
            $res = parent::executePreparedStatement(
                parent::makePreparedStatement($sql), $aov
            );

            $row = $res->fetch();
            return $row['comments'];
        }
        catch (PDOException $e)
        {
            throw $e;
        }
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

    public function getMostRecent()
    {
        $sql = 'SELECT `id`, `update_type` FROM `last_update`
                ORDER BY `id` DESC LIMIT 3';

        $arr = array();

        try
        {
            $ret = parent::executeStatement(parent::makePreparedStatement($sql));

            while ($row = $ret->fetch())
            {
                $aov = array(
                    ':id' => $row['id'],
                );

                $rql = '';
                $pre = '';
                $post = '';

                switch ($row['update_type'])
                {
                    case UPDATE_ANIME:
                        $rql = 'SELECT `a`.`anime_id` AS `id`, `a`.`title`, `a`.`cover` AS `image`
                                FROM `last_update` AS `lu`
                                INNER JOIN `anime_list` AS `a` ON `lu`.`anime_id`=`a`.`id`
                                WHERE `lu`.`id`=:id';
                        $pre = './anime/';
                        break;
                    case UPDATE_MANGA:
                        $rql = 'SELECT `m`.`manga_id` AS `id`, `m`.`title`, `m`.`cover` AS `image`
                                FROM `last_update` AS `lu`
                                INNER JOIN `manga_list` AS `m` ON `lu`.`manga_id`=`m`.`id`
                                WHERE `lu`.`id`=:id';
                        $pre = './manga/';
                        break;
                    case UPDATE_BLOG:
                        $rql = 'SELECT `b`.`ID` AS `id`, `b`.`post_title`, "" AS `image`
                                FROM `last_update` AS `lu`
                                INNER JOIN `wp_posts` AS `b` ON `lu`.`blog_id`=`b`.`ID`
                                WHERE `lu`.`id`=:id';
                        $pre = 'https://m4numbers.co.uk/blog/?p=';
                        break;
                    case UPDATE_DEVEL:
                        $rql = 'SELECT `d`.`id` AS `id`, `d`.`title`, `d`.`cover` AS `image`
                                FROM `last_update` AS `lu`
                                INNER JOIN `devel_projects` AS `d` ON `lu`.`anime_id`=`d`.`id`
                                WHERE `lu`.`id`=:id';
                        $pre = './devel/';
                        break;
                    case UPDATE_VIDEO:
                        $rql = 'SELECT `v`.`video_key` AS `id`, `v`.`title`, `v`.`thumb` AS `image`
                                FROM `last_update` AS `lu`
                                INNER JOIN `youtube_videos` AS `v` ON `lu`.`video_id`=`v`.`id`
                                WHERE `lu`.`id`=:id';
                        $pre = './videos/';
                        break;
                }

                $secRet = parent::executePreparedStatement(parent::makePreparedStatement($rql), $aov);

                $result = $secRet->fetch();

                $arr[] = array(
                    'link' => $pre . $result['id'] . $post,
                    'title' => $result['title'],
                    'image' => $result['image'],
                );

            }

            return $arr;
        }
        catch (PDOException $e)
        {
            throw $e;
        }
    }
}