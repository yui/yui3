<?php

$modules["yui"] = array(
		"name" => "The YUI Global Object",
		"type" => "core",
        /*this description appears on the component's examples index page*/
		"description" => "YUI Global Object Examples", 
		"cheatsheet" => false 
);	


$examples["yui-core"] = array(
	name => "YUI Core",
	modules => array("yui"),
	description => "YUI Core",
	sequence => array(0),
	newWindow => "default",
	requires => array("node"),
	highlightSyntax => true
);

$examples["yui-simple"] = array(
	name => "Simple YUI Use",
	modules => array("yui"),
	description => "Simple YUI Use",
	sequence => array(1),
	newWindow => "default",
	requires => array('node'),
	highlightSyntax => true
);

$examples["yui-more"] = array(
	name => "Load All Modules",
	modules => array("yui"),
	description => "Load All Modules",
	sequence => array(2),
    newWindow => "require",
	requires => array('node', 'io', 'animation', 'dd-drag'),
	highlightSyntax => true
);

$examples["yui-multi"] = array(
	name => "Multiple Instances",
	modules => array("yui"),
	description => "Working with multiple YUI instances.",
	sequence => array(3),
	newWindow => "default",
	requires => array('animation'),
	highlightSyntax => true
);

$examples["yui-compat"] = array(
	name => "YUI 2.x and 3.x",
	modules => array("yui"),
	description => "Working with YUI 2.x and 3.x.",
	sequence => array(4),
	newWindow => "default",
	requires => array('dd'),
	highlightSyntax => true
);


?>
