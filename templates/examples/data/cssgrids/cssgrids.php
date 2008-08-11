<?php

$modules["cssgrids"] = array(
		"name" => "CSS Grids",
		"type" => "css",
		"description" => "Building Pages with YUI CSS Grids",
		"cheatsheet" => false 
);	

$examples["cssgrids-width"] = array(
	name => "Available Page Widths",
	modules => array("cssgrids"),
	description => "Choose a preset page width. Choose fluid or fixed widths.",
	sequence => array(1),
	newWindow => "require",
	requires => array("cssreset", "cssfonts", "cssgrids"),
	highlightSyntax => true,
    bodyclass => false
);

$examples["cssgrids-width-custom"] = array(
	name => "Customize the Page Width",
	modules => array("cssgrids"),
	description => "Customization is easy when you need a specific page width.",
	sequence => array(2),
	newWindow => "require",
	requires => array("cssreset", "cssfonts", "cssgrids"),
	highlightSyntax => true,
    bodyclass => false
);

	$examples["cssgrids-presets"] = array(
		name => "Available Preset Templates",
		modules => array("cssgrids"),
		description => "Two-column page layouts",
		sequence => array(3),
		newWindow => "require",
		requires => array("cssreset", "cssfonts", "cssgrids"),
		highlightSyntax => true,
	    bodyclass => false
	);


$examples["cssgrids-nesting-grids"] = array(
	name => "Nesting Grids",
	modules => array("cssgrids"),
	description => "Use nesting grids to define sub-regions",
	sequence => array(4),
	newWindow => "require",
	requires => array("cssreset", "cssfonts", "cssgrids"),
	highlightSyntax => true,
    bodyclass => false
);



?>
