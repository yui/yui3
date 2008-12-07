<?php

/*YUI Cookie Module:*/
$modules["cookie"] = array(
  "name" => "Cookie Utility",
  "type" => "utility",
  "description" => "<p>A utility for reading and writing cookies via JavaScript.  The Cookie Utility includes a facility for rolling up data into subcookies, effectively increasing the total number of cookies that it's possible to store on a single client.</p>",
  "cheatsheet" => false
);	

/*YUI Cookie Examples*/
$examples["cookie-simple-example"] = array(
  name => "Simple Cookie Example",
  modules => array("cookie"),
  description => "Demonstrates basic usage of the Cookie utility for reading and writing cookies.",
  sequence => array(1),
  logger => array(),
  loggerInclude => "require",
  newWindow => "suppress",
  requires => array("cookie"),
  highlightSyntax => true
);

$examples["cookie-advanced-example"] = array(
  name => "Advanced Cookie Example",
  modules => array("cookie"),
  description => "Demonstrates using the Cookie utility to get, set and remove cookies.",
  sequence => array(2),
  logger => array(),
  loggerInclude => "require",
  newWindow => "suppress",
  requires => array("node", "cookie"),
  highlightSyntax => true
);

$examples["cookie-subcookie-example"] = array(
  name => "Subcookie Example",
  modules => array("cookie"),
  description => "Demonstrates using the Cookie utility to get and set subcookies.",
  sequence => array(3),
  logger => array(),
  loggerInclude => "require",
  newWindow => "suppress",
  requires => array("node", "cookie"),
  highlightSyntax => true
);

?>
