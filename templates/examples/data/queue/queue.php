<?php

$modules["queue"] = array(
	"name" => "Queue",
	"type" => "utility",
	"description" => "Queue allows you to create a series of function callbacks executed via <code>setTimeout</code> that will execute in order.",
	"cheatsheet" => false
);	

$examples["queue_app"] = array(
	name => "Building a UI with Queue",
	modules => array("queue"),
	description => "Using Queue to incrementally construct an application interface",
	sequence => array(1),
	newWindow => "default",
	requires => array("anim","queue"),
	highlightSyntax => true
);

?>
