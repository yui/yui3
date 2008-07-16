#####################################################################################
This page contains formatting information for the metadata associated with modules
and examples.  Use this as a starting point for module metadata files (e.g.,
"event.php", in this directory.  Be sure to include your module medatdata file in
the examplesInfo.php file, also in this directory.
#####################################################################################

/*ColorPicker Module:*/
$modules["colorpicker"] = array(
							"name" => "Color Picker Control", 
							"type" => "widget",
							"description" => "The Color Picker Control allows you to implement a rich, powerful, visual color selection tool that returns color values in RGB, hex, and HSV formats.", /*this description appears on the component's examples index page*/
							"cheatsheet" => true
						);	

/*Color Picker Control Examples*/
$examples["colorpicker-fromscript"] = array(
	name => "Inline Color Picker Control from Script", /*title of example*/
	modules => array("colorpicker"), /*all of the modules/yui components that this example should be listed with; this array is parallel to the sequence array*/
	description => "This example demonstrates the use of an inline Color Picker instance built entirely with JavaScript.", /*use this as a tease; e.g., for a tooltip hover; it appears next to the example title on component example index pages.*/
	sequence => array(1), /*use this to prioritize your examples; examples will be sorted based on this number, then based on alphabet (lower numbers come first); this array is parallel to the modules array, so you can rank the priority differently for the different modules/components being exemplified*/
	logger => array("colorpicker"), /use this array to designate which modules should be pulled in -debug version when viewing the logger/debug page for this example.*/
	loggerInclude => "require", /*if "require", the logger will always load for this example, regardless of querystring; if "suppress", it will never load; otherwise, default will be applied (logger optional); note that if the "newWindow" property is "require", no Logger will be displayed on the example page (you can display a logger in your source if you wish).*/
	newWindow => "default", /*if require, the example will only be viewable in a new window; otherwise, the example will display inline.  Examples that require new windows need to exist as complete html documents in their _source.html files, including relative paths to YUI resources in /build; they are also responsible for their own logger displays if they need them.  Best to avoid this except in the case of the CSS examples.  All examples can load in new windows optionally if this value is default.  If the value is "suppress", no new window option is provided.*/
	requires => array("animation","colorpicker"), /*List the YUI components that are necessary to make this example tick; Loader will be used to pull in the needed components.*/
	highlightSyntax => true, /* Does this example require syntax highlighting?  If so, the approprate JS and CSS resources will be placed on the page. */
	bodyclass => false /*default should be false; use this to set a classname/s on the body element.  This field was added to support the need to skin panels that are rendered directly to the body element.*/
);