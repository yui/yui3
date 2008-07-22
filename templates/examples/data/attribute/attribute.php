<?php

/* Test Module: */
$modules["attribute"] = array(
		"name" => "Attribute Utility",
		"type" => "utility",
        /*this description appears on the component's examples index page*/
		"description" => "The YUI Attribute Utility adds managed attribute support to objects being augmented with it.", 
		"cheatsheet" => false 
);	

$examples["attribute-basic"] = array(
	name => "Basic attribute configuration",
	modules => array("attribute"),
	description => "Use the Attribute API to define, set and get attribute values.",
	sequence => array(1),
	newWindow => "default",
	requires => array("yui"),
	highlightSyntax => true
);

/*
$examples["attribute-events"] = array(
	name => "Attribute change events",
	modules => array("attribute"),
	description => "Listen for changes in attribute values.",
	sequence => array(1),
	newWindow => "default",
	requires => array("yui"),
	highlightSyntax => true
);

$examples["attribute-getset"] = array(
	name => "Custom getters, setters and validators for attribute values",
	modules => array("attribute"),
	description => "Add customized methods to get and set attribute values and add validation support.",
	sequence => array(1),
	newWindow => "default",
	requires => array("yui"),
	highlightSyntax => true
);

$examples["attribute-clone"] = array(
	name => "Explore the clone attribute configuration option",
	modules => array("attribute"),
	description => "",
	sequence => array(1),
	newWindow => "default",
	requires => array("yui"),
	highlightSyntax => true
);

$examples["attribute-rw"] = array(
	name => "Explore the readOnly and writeOnce attribute configuration options",
	modules => array("attribute"),
	description => "",
	sequence => array(1),
	newWindow => "default",
	requires => array("yui"),
	highlightSyntax => true
);
*/
?>
