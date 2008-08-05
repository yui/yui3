<?php

$modules["cssbase"] = array(
		"name" => "CSS Base",
		"type" => "css",
		"description" => "CSS Base applies a consistent style foundation for common HTML elements across A-grade browsers.",
		"cheatsheet" => false 
);	

$examples["cssbase-basic"] = array(
	name => "Global (Page-Level) Example",
	modules => array("cssbase"),
	description => "When CSS Base is included in a page it provides consistent and basic cross-browser styling for HTML elements.",
	sequence => array(1),
	newWindow => "require",
	requires => array("cssreset", "cssfonts", "cssbase"),
	highlightSyntax => true,
    bodyclass => false
);

$examples["cssbase-context"] = array(
	name => "Contextual Example",
	modules => array("cssbase"),
	description => "CSS Base applied to a portion of a page based on the location of a class value.",
	sequence => array(2),
	newWindow => "require",
	requires => array("cssreset", "cssfonts", "cssbase"),
	highlightSyntax => true,
    bodyclass => "yui-cssbase"
);

?>
