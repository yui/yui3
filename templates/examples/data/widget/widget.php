<?php

$modules["widget"] = array(
    "name" => "Widget",
    "type" => "infra",
    "description" => "A base class for all widgets, providing lifecycle methods, common attributes and plugin support.",
    "cheatsheet" => false
);

$examples["widget-extend"] = array(
    name => "Extending the base widget class",
    modules => array("widget"),
    description => "Shows how to extend the base widget class, to create your own Widgets.",
    sequence => array(0),
    newWindow => "default",
    requires => array("widget"),
    highlightSyntax => true
);

$examples["widget-build"] = array(
    name => "Creating custom widget classes",
    modules => array("widget"),
    description => "Shows how to use Base.build to create custom Widget classes.",
    sequence => array(1),
    newWindow => "default",
    requires => array("widget", "widget-position", "widget-stack"),
    highlightSyntax => true
);

$examples["widget-tooltip"] = array(
    name => "Creating a simple Tooltip widget",
    modules => array("widget"),
    description => "Shows how to extend the Widget class, and add WidgetPosition and WidgetStack to create a Tooltip widget class.",
    sequence => array(2),
    newWindow => "default",
    requires => array("widget", "widget-position", "widget-stack"),
    highlightSyntax => true
);
?>
