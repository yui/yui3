<?php

$modules["cssfonts"] = array(
		"name" => "CSS Fonts",
		"type" => "css",
		"description" => "CSS Fonts provides typographical normalization and control",
		"cheatsheet" => false 
);	

$examples["cssfonts-basic"] = array(
	name => "Global (Page-Level) Example", 
	modules => array("cssfonts"),
	description => "When CSS Fonts is included in a page, it applies a baseline font treatment to all HTML elements. This baseline is Arial at the equivalent of 13px size and 16px line-height.",
	sequence => array(1), 
	newWindow => "require", 
	requires => array("cssreset", "cssfonts"), 
	highlightSyntax => true,
    bodyclass => false,
);

$examples["cssfonts-context"] = array(
	name => "Contextual Example",
	modules => array("cssfonts"),
	description => "Use the alternate contextual version of YUI Fonts to have precise control over which regions of the page are targeted.",
	sequence => array(2),
	newWindow => "require",
	requires => array("cssreset-context", "cssfonts-context"),
	highlightSyntax => true,
    bodyclass => "yui-cssreset yui-cssfonts"
);

$examples["cssfonts-size"] = array(
	name => "Setting Font Size",
	modules => array("cssfonts"),
	description => "Define all non-baseline sizes in percentages when using YUI Fonts.",
	sequence => array(3),
	newWindow => "require",
	requires => array("cssreset", "cssfonts"),
	highlightSyntax => true,
    bodyclass => false
);

$examples["cssfonts-family"] = array(
	name => "Setting Font Family",
	modules => array("cssfonts"),
	description => "When using YUI Fonts, set font-family as you would normally.",
	sequence => array(4),
	newWindow => "require",
	requires => array("cssreset", "cssfonts"),
	highlightSyntax => true,
    bodyclass => false
);

?>
