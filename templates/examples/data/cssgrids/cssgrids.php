<?php

$modules["cssgrids"] = array(
		"name" => "CSS Grids",
		"type" => "css",
		"description" => "Building Pages with YUI CSS Grids",
		"cheatsheet" => false 
);	

$examples["cssgrids-width"] = array(
	name => "Page Width",
	modules => array("cssgrids"),
	description => "Choose a preset page width. Choose fluid or fixed widths.",
	sequence => array(1),
	newWindow => "require",
	requires => array("cssreset", "cssfonts", "cssgrids"),
	highlightSyntax => true,
    bodyclass => false
);

$examples["cssgrids-pagewidth"] = array(
	name => "Setting Page Widths with YUI CSS Grids",
	modules => array("cssgrids"),
	description => "Various page widths are available with CSS Grids. This example shows how to use the included page widths",
	sequence => array(2),
	newWindow => "require",
	requires => array("cssreset", "cssfonts", "cssgrids"),
	highlightSyntax => true,
    bodyclass => "yui-cssreset yui-cssfonts"
);

?>
