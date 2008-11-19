<?php

$modules["overlay"] = array(
    "name" => "Overlay Widget",
    "type" => "widget",
    "description" => "A basic Overlay Widget, which can be positioned based on Page XY co-ordinates and is stackable (z-index support). It also provides alignment and centering support and uses a standard module format for it's content, with header, body and footer section support.",
    "cheatsheet" => false 
);

$examples["overlay-xy"] = array(
    name => "Basic XY Positioning",
    modules => array("overlay"),
    description => "Shows how to use the Overlay's basic XY positioning support.",
    sequence => array(0),
    newWindow => "default",
    requires => array("overlay"),
    highlightSyntax => true
);

$examples["overlay-align"] = array(
    name => "Entended XY Positioning",
    modules => array("overlay"),
    description => "Shows how to use the Overlay's extended XY positioning support, to align the Overlay relative to another element, or the viewport.",
    sequence => array(1),
    newWindow => "default",
    requires => array("overlay"),
    highlightSyntax => true
);

$examples["overlay-stack"] = array(
    name => "Stack Support",
    modules => array("overlay"),
    description => "Shows how to use the Overlay's zindex and shim support when positioning Overlays above other elements on the page.",
    sequence => array(2),
    newWindow => "default",
    requires => array("overlay"),
    highlightSyntax => true
);

$examples["overlay-stdmod"] = array(
    name => "Standard Module Support",
    modules => array("overlay"),
    description => "Shows how to modify content in the Overlay's header, body and footer sections.",
    sequence => array(3),
    newWindow => "default",
    requires => array("overlay"),
    highlightSyntax => true
);

$examples["overlay-anim-plugin"] = array(
    name => "Animation Plugin",
    modules => array("overlay"),
    description => "Shows how to create a simple plugin to animate the Overlay's movement and visibility.",
    sequence => array(4),
    newWindow => "default",
    requires => array("overlay", "anim", "plugin"),
    highlightSyntax => true
);

$examples["overlay-io-plugin"] = array(
    name => "IO Plugin",
    modules => array("overlay", "io"),
    description => "Shows how to create a simple plugin to retrieve content for the Overlay using the io utility.",
    sequence => array(5, 50),
    newWindow => "default",
    requires => array("overlay", "substitute", "io", "json", "plugin"),
    highlightSyntax => true
);
?>
