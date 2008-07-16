<?php

/*Connection Manager Module:*/
$modules["connection"] = array(
							"name" => "Connection Manager",/*module/yui component name*/
							"type" => "utility",/*utility, widget or css*/
							"description" => "<p>The YUI Connection Manager provides support for XMLHttpRequest transactions using a convenient interface normalized across the A-Grade browsers.</p>", /*this description appears on the component's examples index page; USE COMPLETE MARKUP...THE FORMATTING SCRIPT WILL NOT WRAP THIS IN <P> TAGS, AS THERE MAY BE MORE THAN ONE PARAGRAPH.*/
						);	

/*Connection Manager Examples*/
$examples["get"] = array(
	name => "Connection Manager GET Transaction", /*title of example*/
	modules => array("connection"), /*all of the modules/yui components that this example should be listed with; this array is parallel to the sequence array*/
	description => "Uses Connection Manager to retrieve a file via a simple HTTP GET request.", /*use this as a tease; e.g., for a tooltip hover; it appears next to the example title on component example index pages.*/
	sequence => array(2), /*use this to prioritize your examples; examples will be sorted based on this number, then based on alphabet (lower numbers come first); this array is parallel to the modules array, so you can rank the priority differently for the different modules/components being exemplified*/
	logger => array("connection", "example"), /*use this array to designate what "sources" in the logger console should NOT be suppressed.*/
	loggerInclude => "default", /*if "require", the logger will always load for this example, regardless of querystring; if "suppress", it will never load; otherwise, default will be applied (logger optional); note that if the "newWindow" property is "require", no Logger will be displayed on the example page (you can display a logger in your source if you wish).*/
	newWindow => "default", /*if require, the example will only be viewable in a new window; otherwise, the example will display inline.  Examples that load in new windows need to exist as complete html documents in their _source.html files, including relative paths to YUI resources in /build; they are also responsible for their own logger displays if they need them.  Best to avoid this except in the case of the CSS examples.*/
	requires => array("event","connection"), /*List the YUI components that are necessary to make this example tick; Loader will be used to pull in the needed components.*/
	highlightSyntax => true /* Does this example require syntax highlighting?  If so, the approprate JS and CSS resources will be placed on the page. */
);

$examples["weather"] = array(
	name => "Retrieving a Yahoo! Weather RSS Feed",
	modules => array("connection"),
	description => "Demonstrates how to retrieve XML data from a web service via XMLHttpRequest and make use of that information within the page.",
	sequence => array(4),
	logger => array("connection", "example"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("event", "connection"),
	highlightSyntax => true
);


$examples["post"] = array(
	name => "Connection Manager POST Transaction",
	modules => array("connection"),
	description => "Explores the use of HTTP POST transactions to send data to the server and retrieve the server's response.",
	sequence => array(2),
	logger => array("connection", "example"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("connection","event"),
	highlightSyntax => true
);

$examples["abort"] = array(
	name => "Connection Manager Transaction Timeout",
	modules => array("connection"),
	description => "Connection Manager's built-in transaction timeout feature allows you to abort requests that are too slow in returning data.",
	sequence => array(2),
	logger => array("connection", "example"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("connection","event"),
	highlightSyntax => true
);

?>