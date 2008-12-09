<?php

/*Get Utility Module:*/
$modules["get"] = array(
    "name" => "Get", 
    "type" => "utility",
    "description" => "The Get Utility provides a convenient API for appending script nodes and CSS files to an existing DOM.  This can be useful when loading functionality on-demand; it's also useful when retrieving JSON data feeds across trusted but non-identical domains.",
    "cheatsheet" => true
);  

/*Get Utility Examples*/
$examples["get-script-basic"] = array(
    name => "Getting a Script Node with JSON Data",
    modules => array("get"),
    description => "This example illustrates the simple use case in which the Get Utility is used to retrieve JSON data from a web service.",
    sequence => array(1),
    logger => array("get", "event", "example"),
    loggerInclude => "require",
    newWindow => "default",
    requires => array("node", "dump"),
    highlightSyntax => true,
    bodyclass => false
);

/*

$examples["get-css-basic"] = array(
    name => "Getting CSS Style Sheets",
    modules => array("get", "button"),
    description => "Attach and remove stylesheets using the Get Utility.",
    sequence => array(2, 60),
    logger => array("get"),
    loggerInclude => "require",
    newWindow => "default",
    requires => array("button", "dom", "get"),
    highlightSyntax => true,
    bodyclass => false
);
*/

?>
