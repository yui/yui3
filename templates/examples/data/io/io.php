<?php

/*Connection Manager Module:*/
$modules["io"] = array(
							"name" => "IO Utility",/*module/yui component name*/
							"type" => "utility",/*utility, widget or css*/
							"description" => "<p>The IO Utility provides support for HTTP transactions using a convenient interface normalized across the A-Grade browsers.  It also supports </p>", /*this description appears on the component's examples index page; USE COMPLETE MARKUP...THE FORMATTING SCRIPT WILL NOT WRAP THIS IN <P> TAGS, AS THERE MAY BE MORE THAN ONE PARAGRAPH.*/
							"cheatsheet" => false
						);


$examples["io-post"] = array(
	name => "POST Transaction",
	modules => array("io"),
	description => "Explores the use of HTTP POST to send data to the server and retrieve the server's response.",
	sequence => array(1),
	logger => array("io", "example"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("io"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["io-weather"] = array(
	name => "XML Transaction &mdash; Retrieving a Yahoo! Weather RSS (XML) Feed via a Server-Side Proxy",
	modules => array("io"),
	description => "Demonstrates how to retrieve XML data from a web service and make use of that information within the page.",
	sequence => array(4),
	logger => array("io", "example"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("io"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["io-xdr"] = array(
	name => "Cross-Domain JSON Transaction &mdash; Retrieving a News Feed from Yahoo! Pipes",
	modules => array("io"),
	description => "Fetch a cross-domain, JSON-formatted RSS news feed directly from <a href='http://pipes.yahoo.com'>Yahoo! Pipes</a>.",
	sequence => array(10),
	logger => array("io", "example"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("io", "substitute", "json-parse"),
	highlightSyntax => true,
	bodyclass => false
);

/*




$examples["abort"] = array(
	name => "Connection Manager Transaction Timeout",
	modules => array("connection"),
	description => "Connection Manager's built-in transaction timeout feature allows you to abort requests that are too slow in returning data.",
	sequence => array(3),
	logger => array("connection", "example"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("event", "connection"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["global_customevents"] = array(
	name => "Subscribing to Connection Manager Global Events",
	modules => array("connection"),
	description => "Subscribe to Custom Events for an aspect-oriented approach to managing transactions and response data.",
	sequence => array(5),
	logger => array("connection", "example"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("event", "connection"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["callback_customevents"] = array(
	name => "Subscribing to Connection Manager's Custom Events via the Callback Object",
	modules => array("connection"),
	description => "Target and handle Custom Events for specific transactions using the callback object.",
	sequence => array(6),
	logger => array("connection", "example"),
	loggerInclude => "default",
	newWindow => "default",
	requires => array("event", "connection"),
	highlightSyntax => true,
	bodyclass => false
);*/

?>