<?php

$modules["cssfonts"] = array(
		"name" => "CSS Fonts",
		"type" => "css",
		"description" => "CSS Fonts provides typographical normalization and control",
		"cheatsheet" => false 
);	

$examples["cssfonts-basic"] = array(
    /* Example Name */
	name => "CSS Fonts Basic Example", 
	modules => array("cssfonts", "cssreset"),
	description => "CSS Fonts applied to HTML elements",
	sequence => array(1), 
	newWindow => "require", 
	requires => array("cssreset", "cssfonts"), 
	highlightSyntax => true,
    bodyclass => false,
);

$examples["cssfonts-context"] = array(
	name => "CSS Fonts Contextual Example",
	modules => array("cssfonts", "cssreset"),
	description => "Applying CSS Fonts to Specific Contexts",
	sequence => array(2),
	newWindow => "require",
	requires => array("cssreset-context", "cssfonts-context"),
	highlightSyntax => true,
    bodyclass => "yui-cssreset yui-cssfonts"
);

$examples["cssfonts-size"] = array(
	name => "CSS Fonts Sizing Example",
	modules => array("cssfonts", "cssreset"),
	description => "Defining Font Sizes using YUI CSS Fonts Prescribed Percentages",
	sequence => array(3),
	newWindow => "require",
	requires => array("cssreset", "cssfonts"),
	highlightSyntax => true,
    bodyclass => false
);

?>
