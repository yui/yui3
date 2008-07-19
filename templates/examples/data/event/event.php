<?php

/* Test Module: */
$modules["event"] = array(
		"name" => "Event Utility",
		"type" => "utility",
        /*this description appears on the component's examples index page*/
		"description" => "The YUI Event Utility supports DOM events and Custom Events.", 
		"cheatsheet" => false 
);	


$examples["event-simple"] = array(
	name => "Simple DOM Events",
	modules => array("event"),
	description => "Use the Event Utility to attach simple DOM event handlers.",
	sequence => array(1),
	newWindow => "default",
	requires => array("yui"),
	highlightSyntax => true
);


?>
