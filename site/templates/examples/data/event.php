<?php

/*Event Module:*/
$modules["event"] = array(
							"name" => "Event Utility",
							"type" => "utility",
							"description" => "", /*this description appears on the component's examples index page*/
						);	

/*Event Utility Examples*/
$examples["eventsimple"] = array(
	name => "Simple Event Handling and Processing", /*title of example*/
	modules => array("event"), /*all of the modules/yui components that this example should be listed with; this array is parallel to the sequence array*/
	description => "Demonstrates simple event attachment and use of Event Utility to provide browser-neutral methods for acting on event objects.", /*use this as a tease; e.g., for a tooltip hover; it appears next to the example title on component example index pages.*/
	sequence => array(1), /*use this to prioritize your examples; examples will be sorted based on this number, then based on alphabet (lower numbers come first); this array is parallel to the modules array, so you can rank the priority differently for the different modules/components being exemplified*/
	logger => array("event", "example"), /*use this array to designate what "sources" in the logger console should NOT be suppressed.*/
	loggerInclude => "default", /*if "require", the logger will always load for this example, regardless of querystring; if "suppress", it will never load; otherwise, default will be applied (logger optional); note that if the "newWindow" property is "require", no Logger will be displayed on the example page (you can display a logger in your source if you wish).*/
	newWindow => "default", /*if require, the example will only be viewable in a new window; otherwise, the example will display inline.  Examples that require new windows need to exist as complete html documents in their _source.html files, including relative paths to YUI resources in /build; they are also responsible for their own logger displays if they need them.  Best to avoid this except in the case of the CSS examples.  All examples can load in new windows optionally if this value is default.  If the value is "suppress", no new window option is provided.*/
	requires => array("event", "dom"), /*List the YUI components that are necessary to make this example tick; Loader will be used to pull in the needed components.*/
	highlightSyntax => true /* Does this example require syntax highlighting?  If so, the approprate JS and CSS resources will be placed on the page. */
);


$examples["custom-event"] = array(
	name => "Using Custom Events",
	modules => array("event"),
	description => "Custom Events are an excellent way to publish and subscribe to interesting moments in your own scripts.",
	sequence => array(2),
	logger => array("event", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("event", "dom"),
	highlightSyntax => true
);

$examples["event-delegation"] = array(
	name => "Using Event Utility and Event Delegation to Improve Performance",
	modules => array("event"),
	description => "Assigning events to parent elements allows you to listen for those same events on descendant elements, reducing the number of event listeners you need in your application.",
	sequence => array(2),
	logger => array("event", "example"),
	loggerInclude => "require", 
	newWindow => "suppress",
	requires => array("event", "dom"),
	highlightSyntax => true
);
?>