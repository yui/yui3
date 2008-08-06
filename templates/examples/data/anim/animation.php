<?php

/*Animation Module:*/
$modules["anim"] = array(
        "name" => "Animation Utility",
        "type" => "utility",
        "description" => "The Animation Utility allows properties to animate the transition between values.",
        "cheatsheet" => false
);	
/*Animation Utility Examples*/
$examples["basic"] = array(
	name => "Basic Animation",
	modules => array("anim"),
	description => "Creating and using a simple animation.",
	sequence => array(1),
	logger => array("anim", "example"),
	loggerInclude => "suppress", 
	newWindow => "default",
	requires => array("anim-base"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["easing"] = array(
	name => "Animation Easing",
	modules => array("anim"),
	description => "The Animation Utility allows you to implement 'easing effects' &mdash; for example, when an animation gradually slows down as it nears completion, that's an easing effect known as 'ease-in'.  This example shows you how to use easing effects with your animations.",
	sequence => array(2),
	logger => array("anim", "example"),
	loggerInclude => "suppress", 
	newWindow => "default",
	requires => array("anim-base", "anim-easing"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["colors"] = array(
	name => "Animating Colors",
	modules => array("anim"),
	description => "Color animations can be effective indicators of state during the lifespan of a dynamic page.  This example shows you how to animate color attributes of an element.",
	sequence => array(3),
	logger => array("anim", "example"),
	loggerInclude => "suppress", 
	newWindow => "default",
	requires => array("anim-color"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["alt-iterations"] = array(
	name => "Alternating Iterations",
	modules => array("anim"),
	description => "The <code>direction</code> attribute can be used to reverse the animation on alternate iterations.",
	sequence => array(4),
	logger => array("anim", "example"),
	loggerInclude => "suppress", 
	newWindow => "default",
	requires => array("anim-color"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["anim-xy"] = array(
	name => "Animating XY Position",
	modules => array("anim"),
	description => "This example shows you how to animate the xy coordinates of an element.",
	sequence => array(5),
	logger => array("anim", "example"),
	loggerInclude => "suppress", 
	newWindow => "default",
	requires => array("anim-xy", "anim-easing"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["curve"] = array(
	name => "Animating Along a Curved Path",
	modules => array("anim"),
	description => "This example demonstrates animating an element along a curved path using bezier control points.",
	sequence => array(6),
	logger => array("anim", "example"),
	loggerInclude => "suppress", 
	newWindow => "default",
	requires => array("anim-curve", "anim-easing"),
	highlightSyntax => true,
	bodyclass => false
);


$examples["scroll"] = array(
	name => "Animated Scrolling",
	modules => array("anim"),
	description => "This example shows how to animate the scrolling of an element.",
	sequence => array(7),
	logger => array("anim", "example"),
	loggerInclude => "suppress", 
	newWindow => "default",
	requires => array("anim-scroll", "anim-easing"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["reverse"] = array(
	name => "Reversing an Animation",
	modules => array("anim"),
	description => "The <code>reverse</code> attribute allows you to change the run direction of an animation.",
	sequence => array(8),
	logger => array("anim", "example"),
	loggerInclude => "suppress", 
	newWindow => "default",
	requires => array("node-base", "anim-node-plugin", "anim-easing"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["end-event"] = array(
	name => "Using the End Event",
	modules => array("anim"),
	description => "This example demonstrates how to use the <code>end</code> event.",
	sequence => array(9),
	logger => array("anim", "example"),
	loggerInclude => "suppress", 
	newWindow => "default",
	requires => array("anim-base"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["anim-chaining"] = array(
	name => "Chaining Animations Using the <code>end</code> Event",
	modules => array("anim"),
	description => "Animations can be chained (set to fire sequentially) using Animation's <code>end</code> event.",
	sequence => array(10),
	logger => array("anim", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("anim-base", "anim-easing"),
	highlightSyntax => true,
	bodyclass => false
);

?>
