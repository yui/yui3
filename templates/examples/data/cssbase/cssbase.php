<?php

$modules["cssbase"] = array(
		"name" => "CSS Base",
		"type" => "css",
		"description" => "Building Pages with YUI CSS Base",
		"cheatsheet" => false 
);	

$examples["cssbase-basic"] = array(
	name => "CSS Base applied to a page",
	modules => array("cssbase"),
	description => "CSS Base Basic Example",
	sequence => array(1),
	newWindow => "require",
	requires => array("cssreset", "cssfonts", "cssbase"),
	highlightSyntax => true,
    bodyclass => false
);

$examples["cssbase-context"] = array(
	name => "CSS Base applied contextually",
	modules => array("cssbase"),
	description => "CSS Base Contextual Example",
	sequence => array(2),
	newWindow => "require",
	requires => array("cssreset", "cssfonts", "cssbase"),
	highlightSyntax => true,
    bodyclass => "yui-cssreset yui-cssfonts yui-cssbase"
);

?>
