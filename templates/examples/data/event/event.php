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
	requires => array("node"),
	highlightSyntax => true
);

$examples["event-timing"] = array(
	name => "Using onAvailable, onContentReady, and event:ready",
	modules => array("event"),
	description => "Event Utility gives you control over when you execute your scripts.  In addition to the window's <code>load</code> event, Event Utility lets you know when an element is available, when its children are available, and when the page's full DOM is available.",
	sequence => array(3),
	logger => array("event", "example"),
	loggerInclude => "require", 
	newWindow => "suppress",
	requires => array("node"),
	highlightSyntax => true
);

$examples["event-ce"] = array(
	name => "Using Custom Events",
	modules => array("event"),
	description => "Use the Event Utility to create Custom Events that are bubbleable, preventable, cancelable and much more.",
	sequence => array(4),
	newWindow => "default",
	requires => array("node"),
	logger => array("event", "example"),
	highlightSyntax => true
);

?>
