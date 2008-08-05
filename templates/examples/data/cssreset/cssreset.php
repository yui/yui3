<?php

$modules["cssreset"] = array(
		"name" => "CSS Reset",
		"type" => "css",
		"description" => "CSS Reset removes the inconsistent styling of HTML elements provided by browsers.",
		"cheatsheet" => false 
);	

$examples["cssreset-basic"] = array(
	name => "Global (Page-Level) Example",
	modules => array("cssreset"),
	description => "When CSS Reset is included in a page, it removes the browser-provided styling for HTML elements.",
	sequence => array(1),
	newWindow => "require",
	requires => array("cssreset"),
	highlightSyntax => true,
    bodyclass => false
);

$examples["cssreset-context"] = array(
	name => "Contextual Example",
	modules => array("cssreset"),
	description => "CSS Reset applied to a portion of a page based on the location of a class value.",
	sequence => array(2),
	newWindow => "require",
	requires => array("cssreset-context"),
	highlightSyntax => true,
    bodyclass => "yui-cssreset"
);

?>
