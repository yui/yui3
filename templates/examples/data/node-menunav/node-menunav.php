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
	modules => array("node-menunav"),
	description => "Creating left navigation using the MenuNav Node Plugin",
	sequence => array(1),
	newWindow => "require",
	requires => array("node-menunav"),
	highlightSyntax => true
);

$examples["node-menunav-2"] = array(
	name => "Basic Top Nav",
	modules => array("node-menunav"),
	description => "Creating top navigation using the MenuNav Node Plugin",
	sequence => array(2),
	newWindow => "require",
	requires => array("node-menunav"),
	highlightSyntax => true
);

$examples["node-menunav-3"] = array(
	name => "Menu Button Top Nav",
	modules => array("node-menunav"),
	description => "Creating menu button navigation using the MenuNav Node Plugin",
	sequence => array(3),
	newWindow => "require",
	requires => array("node-menunav"),
	highlightSyntax => true
);

$examples["node-menunav-4"] = array(
	name => "Split Button Top Nav",
	modules => array("node-menunav"),
	description => "Creating split button navigation using the MenuNav Node Plugin",
	sequence => array(4),
	newWindow => "require",
	requires => array("node-menunav"),
	highlightSyntax => true
);

$examples["node-menunav-5"] = array(
	name => "Left Nav With Submenus With Shadows",
	modules => array("node-menunav"),
	description => "Adding shadows to submenus of a left nav using the MenuNav Node Plugin",
	sequence => array(5),
	newWindow => "require",
	requires => array("node-menunav"),
	highlightSyntax => true
);

$examples["node-menunav-6"] = array(
	name => "Left Nav With Submenus With Rounded Corners",
	modules => array("node-menunav"),
	description => "Adding rounded corners to submenus of a left nav using the MenuNav Node Plugin",
	sequence => array(6),
	newWindow => "require",
	requires => array("node-menunav"),
	highlightSyntax => true
);

$examples["node-menunav-7"] = array(
	name => "Skinning Menus Created Using the MenuNav Node Plugin",
	modules => array("node-menunav"),
	description => "Skining a menu built using the MenuNav Node Plugin to look like the menus on Flickr",
	sequence => array(7),
	newWindow => "require",
	requires => array("node-menunav"),
	highlightSyntax => true
);

?>