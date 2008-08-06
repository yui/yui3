<?php

$modules["queue"] = array(
	"name" => "Queue Utility",
	"type" => "utility",
	"description" => "The JSON Utility allows you to create a series of function callbacks executed via <code>setTimeout</code> that will execute in order.",
	"cheatsheet" => false
);	

$examples["queue_app"] = array(
	name => "Building a UI with Queue",
	modules => array("queue"),
	description => "Using the Queue Utility to construct an application interface",
	sequence => array(1),
	newWindow => "default",
	requires => array("yui","anim","queue"),
	highlightSyntax => true
);

?>
