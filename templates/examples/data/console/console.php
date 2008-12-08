<?php

$modules["console"] = array(
	"name" => "Console",
	"type" => "tool",
	"description" => "The Console control is a window for viewing messages logged within a YUI instance.",
	"cheatsheet" => false
);	

$examples["console_basic"] = array(
	name => "Creating a Console for debugging",
	modules => array("console"),
	description => "The basics of setting up a Console",
	sequence => array(1),
	newWindow => "default",
	requires => array("console"),
	highlightSyntax => true
);

$examples["console_filter"] = array(
	name => "Filtering log messages",
	modules => array("console"),
	description => "Using your YUI instance configuration to filter which messages are reported in the Console",
	sequence => array(2),
	newWindow => "default",
	requires => array("console"),
	highlightSyntax => true
);

?>
