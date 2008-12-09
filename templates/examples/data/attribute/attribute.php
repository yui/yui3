<?php

$modules["attribute"] = array(
		"name" => "Attribute",
		"type" => "infra",
		"description" => "The YUI Attribute Utility adds managed attribute support to classes which get augmented with it.", 
		"cheatsheet" => false 
);	

$examples["attribute-basic"] = array(
	name => "Basic Configuration",
	modules => array("attribute"),
	description => "Use the Attribute API to define, set and get attribute values.",
	sequence => array(0),
	newWindow => "default",
	requires => array("node", "attribute"),
	highlightSyntax => true
);

$examples["attribute-event"] = array(
	name => "Change Events",
	modules => array("attribute", "event"),
	description => "How to listen for changes in attribute values.",
	sequence => array(1, 50),
	newWindow => "default",
	requires => array("node", "attribute"),
	highlightSyntax => true
);

$examples["attribute-getset"] = array(
	name => "Custom Getters, Setters and Validators",
	modules => array("attribute", "node", "event"),
	description => "Add custom methods to get and set attribute values and provide validation support.",
	sequence => array(2, 50, 50),
	newWindow => "default",
	requires => array("node", "attribute"),
	highlightSyntax => true
);

$examples["attribute-clone"] = array(
	name => "Value Clone Configuration",
	modules => array("attribute"),
	description => "Specify how attributes should be cloned, when returning values through get.",
	sequence => array(3),
	newWindow => "default",
	requires => array("node", "dump", "attribute"),
	highlightSyntax => true
);

$examples["attribute-rw"] = array(
	name => "readOnly and writeOnce Configuration",
	modules => array("attribute"),
	description => "Configure attributes to be readOnly or writeOnce.",
	sequence => array(4),
	newWindow => "default",
	requires => array("node", "attribute"),
	highlightSyntax => true
);

?>
