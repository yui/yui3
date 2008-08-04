<?php

/* Test Module: */
$modules["cssreset"] = array(
		"name" => "CSS Reset",
		"type" => "css",
		"description" => "Building Pages with YUI CSS Reset",
		"cheatsheet" => false 
);	

$examples["cssreset-basic"] = array(
	name => "CSS Reset applied to HTML element",
	modules => array("cssreset"),
	description => "CSS Reset Basic Example",
	sequence => array(1),
	newWindow => "require",
	requires => array("cssreset"),
	highlightSyntax => true,
    bodyclass => false
);

$examples["cssreset-context"] = array(
	name => "CSS Reset applied contextually",
	modules => array("cssreset"),
	description => "CSS Reset Contextual Example",
	sequence => array(2),
	newWindow => "require",
	requires => array("cssreset-context"),
	highlightSyntax => true,
    bodyclass => "yui-cssreset"
);

?>
