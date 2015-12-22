-- delete table if already exists --
-- DROP TABLE IF EXISTS USERS_GRAPHS;


--
-- Struttura della tabella `USERS_GRAPHS`
--

CREATE TABLE IF NOT EXISTS `users_graphs` (
  `username` varchar(32) NOT NULL,
  `fgname` varchar(32) NOT NULL,
  `fgid` varchar(32) NOT NULL,
  `fg` text NOT NULL,
  `fgpos` text,
  PRIMARY KEY (`username`,`fgname`)
);

INSERT INTO `USERS_GRAPHS`(`username`, `fgname`, `fgid`, `fg`, `fgpos`) VALUES (
"father","default","00000000",'{"forwarding-graph":{"id":"00000000","name":"Forwarding graph","VNFs":[],"end-points":[],"big-switch":{"flow-rules":[]}}}',NULL);
