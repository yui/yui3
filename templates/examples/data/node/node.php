<?php

$modules["node"] = array(
		"name" => "Node Utility",
		"type" => "utility",
        /*this description appears on the component's examples index page*/
		"description" => "Node Examples", 
		"cheatsheet" => false 
);	


$examples["basic-node"] = array(
	name => "Node Basics",
	modules => array("node"),
	description => "Using selectors and property accessors with Node.",
	sequence => array(1),
	newWindow => "default",
	requires => array("yui"),
	highlightSyntax => true
);

$examples["dom-node"] = array(
	name => "DOM Methods",
	modules => array("node"),
	description => "Using DOM methods.",
	sequence => array(2),
	newWindow => "default",
	requires => array("yui"),
	highlightSyntax => true
);

$examples["event-node"] = array(
	name => "Node Events",
	modules => array("node"),
	description => "Using events with Node instances.",
	sequence => array(3),
	newWindow => "default",
	requires => array("yui"),
	highlightSyntax => true
);

$examples["nodelist"] = array(
	name => "NodeList",
	modules => array("node"),
	description => "NodeList provides Node functionality for multiple nodes.",
	sequence => array(4),
	newWindow => "default",
	requires => array("yui"),
	highlightSyntax => true
);

?>
