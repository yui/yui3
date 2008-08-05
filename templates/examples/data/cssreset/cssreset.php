<?php

/* Test Module: */
$modules["cssreset"] = array(
		"name" => "CSS Reset",
		"type" => "css",
		"description" => "Building Pages with YUI CSS Reset",
		"cheatsheet" => false 
);	

$examples["cssreset-basic"] = array(
	name => "Global (Page-Level) Example",
	modules => array("cssreset"),
	description => "CSS Reset applied to a full page of HTML elements",
	sequence => array(1),
	newWindow => "require",
	requires => array("cssreset"),
	highlightSyntax => true,
    bodyclass => false
);

$examples["cssreset-context"] = array(
	name => "Contextual Example",
	modules => array("cssreset"),
	description => "CSS Reset applied contextually to a portion of a page",
	sequence => array(2),
	newWindow => "require",
	requires => array("cssreset-context"),
	highlightSyntax => true,
    bodyclass => "yui-cssreset"
);

?>
