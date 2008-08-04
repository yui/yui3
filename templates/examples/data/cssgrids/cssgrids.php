<?php

/* Test Module: */
$modules["cssgrids"] = array(
        /* The name of the module, used in index listings, titles, headers */
		"name" => "CSS Grids",
        /* The type of the module.
           Currently used values for type are:
           "css", "core", "utility", "tool" */
		"type" => "css",
        /* This description appears on the component's examples index page*/
		"description" => "Building Pages with YUI CSS Grids",
        /* Whether or not the component has a cheatsheet. PR1 will not snip with
           cheatsheets */ 
		"cheatsheet" => false 
);	

/* Sample Utility Examples */

$examples["cssgrids-basic"] = array(
	name => "Build a simple layout with YUI CSS Griods",
	modules => array("cssgrids"),
	description => "CSS Grids Basic Example",
	sequence => array(1),
	newWindow => "require",
	requires => array("cssreset", "cssfonts", "cssgrids"),
	highlightSyntax => true,
    bodyclass => false
);

$examples["cssgrids-nested"] = array(
	name => "CSS Grids applied contextually",
	modules => array("cssbase"),
	description => "CSS Base Contextual Example",
	sequence => array(2),
	newWindow => "require",
	requires => array("cssreset", "cssfonts", "cssbase"),
	highlightSyntax => true,
    bodyclass => "yui-cssreset yui-cssfonts"
);

?>
