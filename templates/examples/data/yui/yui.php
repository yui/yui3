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
    logger => array("example"),
	requires => array("node"),
	highlightSyntax => true
);

/*
// became redundant
$examples["yui-simple"] = array(
	name => "Simple YUI Use",
	modules => array("yui"),
	description => "Simple YUI Use",
	sequence => array(1),
	newWindow => "default",
    logger => array("example")
	requires => array('node'),
	highlightSyntax => true
);
*/

$examples["yui-more"] = array(
	name => "Load All Modules",
	modules => array("yui"),
	description => "Load All Modules",
	sequence => array(2),
    newWindow => "default",
    loggerInclude => "require",
    logger => array("example"),
	requires => array('node', 'io', 'anim', 'dd-drag'),
	highlightSyntax => true
);

$examples["yui-multi"] = array(
	name => "Multiple Instances",
	modules => array("yui"),
	description => "Working with multiple YUI instances.",
	sequence => array(3),
	newWindow => "default",
	requires => array('anim'),
    loggerInclude => "require",
    logger => array("event", "example"),
	highlightSyntax => true
);

$examples["yui-compat"] = array(
	name => "YUI 2.x and 3.x",
	modules => array("yui"),
	description => "Working with YUI 2.x and 3.x.",
	sequence => array(4),
	newWindow => "default",
	requires => array('dd'),
    loggerInclude => "require",
    logger => array("example"),
	highlightSyntax => true
);


$examples["yui-loader-ext"] = array(
	name => "YUI Loader - Dynamically Adding YUI and External Modules",
	modules => array("yui"),
	description => "On-demand loading of YUI and non-YUI assets",
	sequence => array(5),
	newWindow => "default",
	requires => array('node'),
    loggerInclude => "require",
    logger => array("example"),
	highlightSyntax => true
);

$examples["yui-extend"] = array(
	name => "Create Class Hierarchies with <code>extend</code>",
	modules => array("yui"),
	description => "Create class hierarchies with <code>extend</code>",
	sequence => array(6),
	newWindow => "default",
	requires => array('node'),
    loggerInclude => "require",
    logger => array("example"),
	highlightSyntax => true
);

$examples["yui-augment"] = array(
	name => "Compose Classes of Objects with <code>augment</code>",
	modules => array("yui"),
	description => "Creating a composition-based class structure using <code>augment</code>",
	sequence => array(7),
	newWindow => "default",
	requires => array('node'),
    loggerInclude => "require",
    logger => array("example"),
	highlightSyntax => true
);

$examples["yui-mix"] = array(
	name => "Add Behaviors to Objects with <code>mix</code>",
	modules => array("yui"),
	description => "Add behaviors to objects or static classes with <code>mix</code>",
	sequence => array(8),
	newWindow => "default",
	requires => array('node'),
    loggerInclude => "require",
    logger => array("example"),
	highlightSyntax => true
);

$examples["yui-merge"] = array(
	name => "Combine Data Sets with <code>merge</code>",
	modules => array("yui"),
	description => "Combine data sets and create shallow copies of objects with <code>merge</code>",
	sequence => array(9),
	newWindow => "default",
	requires => array('node', 'dump'),
    loggerInclude => "require",
    logger => array("example"),
	highlightSyntax => true
);

$examples["yui-isa"] = array(
	name => "Check Data Types with <code>Lang</code>",
	modules => array("yui"),
	description => "Check data types with the <code>Lang Utilities</code>",
	sequence => array(10),
	newWindow => "default",
	requires => array('node'),
    loggerInclude => "require",
    logger => array("example"),
	highlightSyntax => true
);

$examples["yui-ua"] = array(
	name => "Browser Detection with <code>UA</code>",
	modules => array("yui"),
	description => "Get information about the current user agent with <code>UA</code>",
	sequence => array(11),
	newWindow => "default",
	requires => array('node'),
    loggerInclude => "require",
    logger => array("example"),
	highlightSyntax => true
);

?>
