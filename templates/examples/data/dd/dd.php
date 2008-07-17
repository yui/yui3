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

?>
