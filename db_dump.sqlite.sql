--- Script for initialize the DB ---

-- delete table if already exists --
-- DROP TABLE IF EXISTS USERS_GRAPHS;

-----------------------------------------------------------------
-- `USERS_GRAPHS` table:                                       --
--                                                             --
-- username	:                                                  --
-- fgname 	: forwarding-graph name                            --
-- fgid 	: forwarding-graph id                              --
-- fg    	: file json of the forwarding-graph                --
-- fgpos 	: file json positioning of the forwarding-graph	   --
--															   --
-----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `users_graphs` (
  `username` varchar(32) NOT NULL,
  `fgname` varchar(32) NOT NULL,
  `fgid` varchar(32) NOT NULL,
  `fg` text NOT NULL,
  `fgpos` text,
  PRIMARY KEY (`username`,`fgname`)
);

-- insert the default graph --
INSERT INTO `USERS_GRAPHS`(`username`, `fgname`, `fgid`, `fg`, `fgpos`) VALUES (
"father","default","00000000",'{"forwarding-graph":{"id":"00000000","name":"Forwarding graph","VNFs":[],"end-points":[],"big-switch":{"flow-rules":[]}}}',NULL);

