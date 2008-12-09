<?php

$modules["node-menunav"] = array(
		"name" => "MenuNav Node Plugin",
		"type" => "nodeplugin",
        /*this description appears on the component's examples index page*/
		"description" => "MenuNav Node Plugin Examples", 
		"cheatsheet" => false 
);	

$examples["node-menunav-1"] = array(
	name => "Basic Left Nav",
	modules => array("node-menunav", "cssgrids"),
	description => "Creating left navigation using the MenuNav Node Plugin",
	sequence => array(1, 50),
	newWindow => "require",
	requires => array("node-menunav"),
	highlightSyntax => true
);

$examples["node-menunav-2"] = array(
	name => "Basic Top Nav",
	modules => array("node-menunav", "cssgrids"),
	description => "Creating top navigation using the MenuNav Node Plugin",
	sequence => array(2, 50),
	newWindow => "require",
	requires => array("node-menunav"),
	highlightSyntax => true
);

$examples["node-menunav-3"] = array(
	name => "Menu Button Top Nav",
	modules => array("node-menunav", "cssgrids"),
	description => "Creating menu button navigation using the MenuNav Node Plugin",
	sequence => array(3, 50),
	newWindow => "require",
	requires => array("node-menunav"),
	highlightSyntax => true
);

$examples["node-menunav-4"] = array(
	name => "Split Button Top Nav",
	modules => array("node-menunav", "cssgrids"),
	description => "Creating split button navigation using the MenuNav Node Plugin",
	sequence => array(4, 50),
	newWindow => "require",
	requires => array("node-menunav"),
	highlightSyntax => true
);

$examples["node-menunav-5"] = array(
	name => "Left Nav With Submenus With Shadows",
	modules => array("node-menunav", "cssgrids"),
	description => "Adding shadows to submenus of a left nav using the MenuNav Node Plugin",
	sequence => array(5, 50),
	newWindow => "require",
	requires => array("node-menunav"),
	highlightSyntax => true
);

$examples["node-menunav-6"] = array(
	name => "Left Nav With Submenus With Rounded Corners",
	modules => array("node-menunav", "cssgrids"),
	description => "Adding rounded corners to submenus of a left nav using the MenuNav Node Plugin",
	sequence => array(6, 50),
	newWindow => "require",
	requires => array("node-menunav"),
	highlightSyntax => true
);

$examples["node-menunav-7"] = array(
	name => "Skinning Menus Created Using the MenuNav Node Plugin",
	modules => array("node-menunav", "cssgrids"),
	description => "Skining a menu built using the MenuNav Node Plugin to look like the menus on Flickr",
	sequence => array(7, 50),
	newWindow => "require",
	requires => array("node-menunav"),
	highlightSyntax => true
);

$examples["node-menunav-8"] = array(
	name => "Adding Submenus On The Fly",
	modules => array("node-menunav", "cssgrids", "io"),
	description => "Building Submenus On The Fly Using the MenuNav Node Plugin with the IO Utility",
	sequence => array(8, 50, 50),
	newWindow => "require",
	requires => array("node-menunav", "io"),
	highlightSyntax => true
);

?>