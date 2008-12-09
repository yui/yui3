<?php

$modules["slider"] = array(
	"name" => "Slider",
	"type" => "widget",
	"description" => "The Slider widget is a UI control that enables the user to adjust values in a finite range along a horizontal or vertical axis.",
	"cheatsheet" => false
);	

$examples["slider_basic"] = array(
	name => "Basic Sliders",
	modules => array("slider"),
	description => "The basics of setting up a horizontal and vertical Slider",
	sequence => array(1),
	newWindow => "default",
	requires => array("slider"),
	highlightSyntax => true
);

$examples["slider_from_markup"] = array(
	name => "Creating a Slider from existing markup",
	modules => array("slider"),
	description => "Creating a horizontal Slider from existing markup",
	sequence => array(2),
	newWindow => "default",
	requires => array("slider"),
	highlightSyntax => true
);

?>
