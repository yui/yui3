<?php

/* Test Module: */
$modules["dd"] = array(
		"name" => "Drag &amp; Drop Utility",
		"type" => "utility",
        /*this description appears on the component's examples index page*/
		"description" => "DD Description", 
		"cheatsheet" => false 
);	


$examples["simple-drag"] = array(
	name => "Simple Drag",
	modules => array("dd"),
	description => "Simple Drag Description",
	sequence => array(1),
	newWindow => "default",
	requires => array("yui", "dd-drop"),
	highlightSyntax => true
);

$examples["proxy-drag"] = array(
	name => "Proxy Drag",
	modules => array("dd"),
	description => "Proxy Drag Description",
	sequence => array(2),
	newWindow => "default",
	requires => array("yui", "dd-drop", 'dd-proxy'),
	highlightSyntax => true
);

$examples["constrained-drag"] = array(
	name => "Drag Constrained to a Region",
	modules => array("dd"),
	description => "Drag Constrained to a Region",
	sequence => array(3),
	newWindow => "default",
	requires => array("yui", "dd-drop", 'dd-proxy', 'dd-constrain'),
	highlightSyntax => true
);

?>
