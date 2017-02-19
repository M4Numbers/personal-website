-- ---------------------------------
-- --- Created by M4Numbers 2016 ---
-- ---------------------------------

DROP TABLE IF EXISTS `last_update`;
DROP TABLE IF EXISTS `anime_list`;
DROP TABLE IF EXISTS `manga_list`;
DROP TABLE IF EXISTS `art_projects`;
DROP TABLE IF EXISTS `youtube_videos`;
DROP TABLE IF EXISTS `devel_projects`;
DROP TABLE IF EXISTS `blog_posts`;
DROP TABLE IF EXISTS `file_storage`;
DROP TABLE IF EXISTS `file_types`;
DROP TABLE IF EXISTS `general_comments`;

CREATE TABLE `general_comments` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `comments` TEXT,
  PRIMARY KEY (`id`)
);

CREATE TABLE `file_types` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `type_slug` VARCHAR(16) NOT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `file_types` (`type_slug`) VALUES ('PDF'), ('PNG'), ('ZIP'), ('GZ'), ('TAR.GZ'),
  ('TAR'), ('JPG'), ('JPEG');

CREATE TABLE `file_storage` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `file_slug` VARCHAR(64) NOT NULL,
  `file_type` INTEGER NOT NULL, /* Enum value */
  `file_url` VARCHAR(128),
  `file_hash` VARCHAR(32), /* MD5 Hash */
  `file_sig` VARCHAR(64),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`file_type`) REFERENCES `file_types`(`id`)
);

CREATE TABLE `blog_posts` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `blog_title` VARCHAR(128) NOT NULL,
  `blog_posted` INTEGER NOT NULL,
  `blog_comments` INTEGER,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`blog_comments`) REFERENCES `general_comments`(`id`)
);

CREATE TABLE `anime_list` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `anime_id` INTEGER NOT NULL,
  `anime_status` INTEGER NOT NULL,
  `title` VARCHAR(128) NOT NULL,
  `score` TINYINT NOT NULL,
  `status` INTEGER DEFAULT 201,
  `total_eps` INTEGER NOT NULL,
  `current_ep` INTEGER DEFAULT 0,
  `synopsis` TEXT,
  `cover` VARCHAR(255),
  `comments_id` INTEGER,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`comments_id`) REFERENCES `general_comments`(`id`)
);

CREATE TABLE `manga_list` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `manga_id` INTEGER NOT NULL,
  `title` VARCHAR(128) NOT NULL,
  `score` TINYINT NOT NULL,
  `status` INTEGER DEFAULT 201,
  `total_vols` INTEGER NOT NULL,
  `total_chaps` INTEGER NOT NULL,
  `current_vol` INTEGER DEFAULT 0,
  `current_chap` INTEGER DEFAULT 0,
  `synopsis` TEXT,
  `cover` VARCHAR(255),
  `comments_id` INTEGER,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`comments_id`) REFERENCES `general_comments`(`id`)
);

CREATE TABLE `youtube_videos` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `video_key` VARCHAR(20) NOT NULL,
  `title` VARCHAR(128) NOT NULL,
  `uploader` VARCHAR(128) NOT NULL,
  `description` TEXT,
  `published` VARCHAR(64) NOT NULL,
  `thumb` VARCHAR(128) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `art_projects` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(128) NOT NULL,
  `released_on` INTEGER NOT NULL,
  `desc` TEXT,
  `slug` VARCHAR(32) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `devel_projects` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(128) NOT NULL,
  `cover` VARCHAR(255),
  `comments_id` INTEGER,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`comments_id`) REFERENCES `general_comments`(`id`)
);

CREATE TABLE `last_update` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `update_type` TINYINT NOT NULL,
  `blog_id` BIGINT(20) UNSIGNED NULL,
  `video_id` INTEGER NULL,
  `art_id` INTEGER NULL,
  `devel_id` INTEGER NULL,
  `anime_id` INTEGER NULL,
  `manga_id` INTEGER NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`blog_id`) REFERENCES `blog_posts`(`id`),
  FOREIGN KEY (`video_id`) REFERENCES `youtube_videos`(`id`),
  FOREIGN KEY (`art_id`) REFERENCES `art_projects`(`id`),
  FOREIGN KEY (`devel_id`) REFERENCES `devel_projects`(`id`),
  FOREIGN KEY (`anime_id`) REFERENCES `anime_list`(`id`),
  FOREIGN KEY (`manga_id`) REFERENCES `manga_list`(`id`)
);