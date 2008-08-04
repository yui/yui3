<?php

/* Test Module: */
$modules["cssbase"] = array(
        /* The name of the module, used in index listings, titles, headers */
		"name" => "CSS Fonts",
        /* The type of the module.
           Currently used values for type are:
           "css", "core", "utility", "tool" */
		"type" => "css",
        /* This description appears on the component's examples index page*/
		"description" => "Building Pages with YUI CSS Base",
        /* Whether or not the component has a cheatsheet. PR1 will not snip with
           cheatsheets */ 
		"cheatsheet" => false 
);	

/* Sample Utility Examples */

$examples["cssbase-basic"] = array(
	name => "CSS Base applied to HTML element",
	modules => array("cssbase"),
	description => "CSS Base Basic Example",
	sequence => array(1),
	newWindow => "require",
	requires => array("cssreset", "cssfonts", "cssbase"),
	highlightSyntax => true,
    bodyclass => false
);

$examples["sample-two"] = array(
	name => "CSS Base applied contextually",
	modules => array("cssbase"),
	description => "CSS Base Contextual Example",
	sequence => array(2),
	newWindow => "require",
	requires => array("cssreset", "cssfonts", "cssbase"),
	highlightSyntax => true,
    bodyclass => "yui-cssreset yui-cssfonts"
);

?>
