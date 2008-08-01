<?php

$modules["dd"] = array(
		"name" => "Drag &amp; Drop Utility",
		"type" => "utility",
        /*this description appears on the component's examples index page*/
		"description" => "Drag &amp; Drop Examples", 
		"cheatsheet" => false 
);	


$examples["simple-drag"] = array(
	name => "Simple Drag",
	modules => array("dd"),
	description => "Simple Drag Description",
	sequence => array(1),
	newWindow => "default",
	requires => array("yui", "dd-drag"),
	highlightSyntax => true
);

$examples["drag-plugin"] = array(
	name => "Drag Node Plugin",
	modules => array("dd"),
	description => "Using the Node Drag Plugin",
	sequence => array(2),
	newWindow => "default",
	requires => array("yui", 'dd-drop', 'dd-plugin'),
	highlightSyntax => true
);

$examples["proxy-drag"] = array(
	name => "Proxy Drag",
	modules => array("dd"),
	description => "Proxy Drag Description",
	sequence => array(3),
	newWindow => "default",
	requires => array("yui", "dd-drag", 'dd-proxy'),
	highlightSyntax => true
);

$examples["constrained-drag"] = array(
	name => "Drag Constrained to a Region",
	modules => array("dd"),
	description => "Drag Constrained to a Region",
	sequence => array(4),
	newWindow => "default",
	requires => array("yui", "dd-drag", 'dd-proxy', 'dd-constrain'),
	highlightSyntax => true
);

$examples["groups-drag"] = array(
	name => "Interaction Groups",
	modules => array("dd"),
	description => "Interaction Groups",
	sequence => array(5),
	newWindow => "default",
	requires => array("yui", 'dd-proxy', "dd-drop"),
	highlightSyntax => true
);

$examples["shim-drag"] = array(
	name => "Using the Drag Shim",
	modules => array("dd"),
	description => "Using the drag shim.",
	sequence => array(6),
	newWindow => "default",
	requires => array("yui", 'dd-ddm', 'dd-proxy'),
	highlightSyntax => true
);

$examples["list-drag"] = array(
	name => "List reorder w/Bubbling",
	modules => array("dd"),
	description => "Reorder a list with Drag & Drop using Event Bubbling",
	sequence => array(7),
	newWindow => "default",
	requires => array("yui", 'dd-drop', 'dd-constrain', 'dd-proxy'),
	highlightSyntax => true
);

$examples["portal-drag"] = array(
	name => "Portal Style Example",
	modules => array("dd", 'animation'),
	description => "Portal style example using Drag & Drop Event Bubbling and Animation.",
	sequence => array(8, 50),
	newWindow => "require",
	requires => array("yui", 'dd-drop', 'dd-constrain', 'dd-proxy', 'anim'),
	highlightSyntax => true
);

$examples["anim-drop"] = array(
	name => "Animated Drop Targets",
	modules => array("dd", 'animation'),
	description => "Animated Drop Targets",
	sequence => array(9, 51),
	newWindow => "require",
	requires => array("yui", 'dd-drop', 'anim'),
	highlightSyntax => true
);

$examples["drop-code"] = array(
	name => "Drop Based Coding",
	modules => array("dd"),
	description => "Drop based coding example.",
	sequence => array(10),
	newWindow => "default",
	requires => array("yui", 'dd-drop'),
	highlightSyntax => true
);

?>
