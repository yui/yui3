<?php

/* Test Module: */
$modules["sample"] = array(
        /* The name of the module, used in index listings, titles, headers */
		"name" => "Sample Core Utility",
        /* The type of the module.
           Currently used values for type are:
           "css", "core", "utility", "tool" */
		"type" => "core",
        /* This description appears on the component's examples index page*/
		"description" => "Sample Utility Description",
        /* Whether or not the component has a cheatsheet. PR1 will not snip with
           cheatsheets */ 
		"cheatsheet" => false 
);	

/* Sample Utility Examples */
$examples["sample-one"] = array(
    /* Example Name */
	name => "Sample Example One", 
    
    /* Modules that this example should be listed with; this array is parallel
    to the sequence array*/
	modules => array("sample"),
    
    /* Use this as a tease; e.g., for a tooltip hover; it appears next to the 
    example title on component example index pages.*/
	description => "Sample One Description",

    /* Use this to prioritize your examples; examples will be sorted based on 
    this number, then based on alphabet (lower numbers come first); this array
    is parallel to the modules array, so you can rank the priority differently
    for the different modules/components being exemplified*/
	sequence => array(1), 

    /* If require, the example will only be viewable in a new window; otherwise,
    the example will display inline.  Examples that require new windows need to
    exist as complete html documents in their _source.html files, including
    relative paths to YUI resources in /build; they are also responsible for
    their own logger displays if they need them.  Best to avoid this except in 
    the case of the CSS examples.  All examples can load in new windows
    optionally if this value is default. 
    If the value is "suppress", no new window option is provided.*/
	newWindow => "require", 

    /* List the YUI components that are necessary to make this example tick;
    Loader will be used to pull in the needed components.*/
	requires => array("yui", "attribute"), 
    
    /* Does this example require syntax highlighting?  If so, the approprate JS 
    and CSS resources will be placed on the page. */
	highlightSyntax => true

    // NOT SUPPORTED FOR PR1
    /* Use this array to designate what "sources" in the logger console
    should NOT be suppressed.*/
	// logger => array("event", "example"),

    // NOT SUPPORTED FOR PR1
    /* If "require", the logger will always load for this example, regardless 
    of querystring; if "suppress", it will never load; otherwise, default will
    be applied (logger optional); note that if the "newWindow" property is 
    "require", no Logger will be displayed on the example page (you can display
    a logger in your source if you wish).*/
	// loggerInclude => "suppress" 
);

$examples["sample-two"] = array(
	name => "Sample Example Two",
	modules => array("sample"),
	description => "Sample Two Description",
	sequence => array(2),
	newWindow => "default",
	requires => array("yui", "base"),
	highlightSyntax => true
);

?>
