<?php

/*Profiler Module:*/
$modules["profiler"] = array(
  "name" => "Profiler",
  "type" => "tool",
  "description" => "The YUI Profiler is a simple JavaScript code profiler suitable for reviewing the performance of most JavaScript applications..",
  "cheatsheet" => false
);	

/*Profiler Examples*/
$examples["profiler-simple-example"] = array(
  name => "Simple Profiling Example",
  modules => array("profiler"),
  description => "Demonstrates basic usage of the Profiler for profiling functions.",
  sequence => array(1),
  logger => array("profiler", "example"),
  loggerInclude => "require",
  newWindow => "suppress",
  requires => array("event", "profiler"),
  highlightSyntax => true
);


$examples["profiler-object-example"] = array(
  name => "Object Profiling Example",
  modules => array("profiler"),
  description => "Demonstrates usage of the Profiler for profiling objects.",
  sequence => array(2),
  logger => array("profiler", "example"),
  loggerInclude => "require",
  newWindow => "suppress",
  requires => array("node", "profiler"),
  highlightSyntax => true
);

?>
