__ __________________________________
_ __ Created by M4Numbers 2016 __
_ __________________________________

DROP TABLE IF EXISTS `lastUpdate`;
DROP TABLE IF EXISTS `animeComments`;
DROP TABLE IF EXISTS `animeList`;
DROP TABLE IF EXISTS `mangaComments`;
DROP TABLE IF EXISTS `mangaList`;
DROP TABLE IF EXISTS `artProjects`;
DROP TABLE IF EXISTS `youtubeVideos`;
DROP TABLE IF EXISTS `develProjects`;

CREATE TABLE `animeList` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `animeId` INTEGER NOT NULL,
  `title` VARCHAR(128) NOT NULL,
  `score` TINYINT NOT NULL,
  `status` INTEGER DEFAULT 201,
  `currentEp` INTEGER DEFAULT 0,
  `synopsis` TEXT,
  `cover` VARCHAR(255),
  PRIMARY KEY (`id`)
);

CREATE TABLE `animeComments` (
  `animeId` INTEGER NOT NULL,
  `comments` TEXT,
  FOREIGN KEY (`animeId`) REFERENCES `animeList`(`id`),
  UNIQUE KEY `uniqueAnime` (`animeId`)
);

CREATE TABLE `mangaList` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `mangaId` INTEGER NOT NULL,
  `title` VARCHAR(128) NOT NULL,
  `score` TINYINT NOT NULL,
  `status` INTEGER DEFAULT 201,
  `currentVol` INTEGER DEFAULT 0,
  `currentChap` INTEGER DEFAULT 0,
  `synopsis` TEXT,
  `cover` VARCHAR(255),
  PRIMARY KEY (`id`)
);

CREATE TABLE `mangaComments` (
  `mangaId` INTEGER NOT NULL,
  `comments` TEXT,
  FOREIGN KEY (`mangaId`) REFERENCES `mangaList`(`id`),
  UNIQUE KEY `uniqueManga` (`mangaId`)
);

CREATE TABLE `youtubeVideos` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `videoKey` VARCHAR(20) NOT NULL,
  `title` VARCHAR(128) NOT NULL,
  `uploader` VARCHAR(128) NOT NULL,
  `description` TEXT,
  `published` VARCHAR(64) NOT NULL,
  `thumb` VARCHAR(128) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `artProjects` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(128) NOT NULL,
  `desc` TEXT,
  `slug` VARCHAR(32) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `develProjects` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(128) NOT NULL,
  `synopsis` TEXT,
  `link` VARCHAR(128),
  `cover` VARCHAR(255),
  PRIMARY KEY (`id`)
);

CREATE TABLE `lastUpdate` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `updateType` TINYINT NOT NULL,
  `blogId` BIGINT(20) UNSIGNED NULL,
  `videoId` INTEGER NULL,
  `artId` INTEGER NULL,
  `develId` INTEGER NULL,
  `animeId` INTEGER NULL,
  `mangaId` INTEGER NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`blogId`) REFERENCES `wpPosts`(`ID`),
  FOREIGN KEY (`videoId`) REFERENCES `youtubeVideos`(`id`),
  FOREIGN KEY (`artId`) REFERENCES `artProjects`(`id`),
  FOREIGN KEY (`develId`) REFERENCES `develProjects`(`id`),
  FOREIGN KEY (`animeId`) REFERENCES `animeList`(`id`),
  FOREIGN KEY (`mangaId`) REFERENCES `mangaList`(`id`)
);