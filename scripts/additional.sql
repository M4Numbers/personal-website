-- -----------------------------------
-- --- Created by M4Numbers 2016 ---
-- -----------------------------------

DROP TABLE IF EXISTS `polling_projects`;
DROP TABLE IF EXISTS `polling_options`;

CREATE TABLE `polling_projects`
(
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `project_name` VARCHAR(64) NOT NULL,
  `expires` INTEGER NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `polling_options`
(
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `project_id` INTEGER NOT NULL,
  `option_name` VARCHAR(128) NOT NULL,
  `votes` INTEGER DEFAULT 0 NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`project_id`) REFERENCES `polling_projects`(`id`)
);

