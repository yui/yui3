<?php

$modules["plugin"] = array(
		"name" => "Plugin Utility",
		"type" => "utility",
        /*this description appears on the component's examples index page*/
		"description" => "Plugin Examples", 
		"cheatsheet" => false 
);	


$examples["node-plugin"] = array(
	name => "Basic Node Plugin",
	modules => array("plugin"),
	description => "How to build a basic node plugin",
	sequence => array(0),
	newWindow => "default",
	requires => array("node"),
	highlightSyntax => true
);
?>
