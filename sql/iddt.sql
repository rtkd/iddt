SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE TABLE IF NOT EXISTS `client` (
`id` int(10) unsigned NOT NULL,
  `uri` varchar(45) NOT NULL,
  `first` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `last` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `type` tinyint(1) unsigned NOT NULL,
  `hits` int(10) unsigned NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='Clients';

CREATE TABLE IF NOT EXISTS `service` (
`id` int(10) unsigned NOT NULL,
  `uri` varchar(16) NOT NULL,
  `first` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `last` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `type` tinyint(1) unsigned NOT NULL,
  `hits` int(10) unsigned NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='Hidden Services';

ALTER TABLE `client` ADD PRIMARY KEY (`id`);

ALTER TABLE `service` ADD PRIMARY KEY (`id`);

ALTER TABLE `client` MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;

ALTER TABLE `service` MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;
