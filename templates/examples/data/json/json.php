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
	requires => array("yui","io","json-parse"),
	highlightSyntax => true
);

?>
