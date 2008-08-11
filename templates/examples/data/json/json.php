<?php

$modules["json"] = array(
	"name" => "JSON Utility",
	"type" => "utility",
	"description" => "The JSON Utility provides methods for transforming data between native JavaScript objects and their JSON string equivalent.",
	"cheatsheet" => false
);	

$examples["json_connect"] = array(
	name => "JSON with Y.io",
	modules => array("json"),
	description => "Use the JSON Utility to parse data received from Y.io calls",
	sequence => array(1),
	newWindow => "default",
	requires => array("node","io","dump","json-parse"),
	highlightSyntax => true
);
$examples["json_freeze_thaw"] = array(
	name => "Rebuilding class instances from JSON data",
	modules => array("json"),
	description => "Using the replacer and reviver parameters to reconstitute object instances",
	sequence => array(1),
	newWindow => "default",
	requires => array("node","json"),
	highlightSyntax => true
);

?>
