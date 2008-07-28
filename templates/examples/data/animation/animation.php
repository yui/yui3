<?php

/*Animation Module:*/
$modules["animation"] = array(
        "name" => "Animation Utility",
        "type" => "utility",
        "description" => "The Animation Utility allows properties to animate the transition between values.",
        "cheatsheet" => false
);	
/*Animation Utility Examples*/
$examples["basic"] = array(
	name => "Basic Animation",
	modules => array("animation"),
	description => "Creating and using a simple animation.",
	sequence => array(1),
	logger => array("animation", "example"),
	loggerInclude => "suppress", 
	newWindow => "default",
	requires => array("yui", "animation"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["easing"] = array(
	name => "Animation Easing",
	modules => array("animation"),
	description => "The Animation Utility allows you to implement 'easing effects' &mdash; for example, when an animation gradually slows down as it nears completion, that's an easing effect known as 'ease-in'.  This example shows you how to use easing effects with your animations.",
	sequence => array(2),
	logger => array("animation", "example"),
	loggerInclude => "suppress", 
	newWindow => "default",
	requires => array("event", "dom", "animation"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["alt-iterations"] = array(
	name => "Alternating Iterations",
	modules => array("animation"),
	description => "The <code>direction</code> attribute can be used to reverse the animation on alternate iterations.",
	sequence => array(3),
	logger => array("animation", "example"),
	loggerInclude => "suppress", 
	newWindow => "default",
	requires => array("event", "dom", "animation"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["colors"] = array(
	name => "Animating Colors",
	modules => array("animation"),
	description => "Color animations can be effective indicators of state during the lifespan of a dynamic page.  This example shows you how to animate color attributes of an HTMLElement.",
	sequence => array(4),
	logger => array("animation", "example"),
	loggerInclude => "suppress", 
	newWindow => "default",
	requires => array("event", "dom", "animation"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["anim-xy"] = array(
	name => "Animating XY Position",
	modules => array("animation"),
	description => "This example shows you how to animate the motion path of an HTMLElement.",
	sequence => array(5),
	logger => array("animation", "example"),
	loggerInclude => "suppress", 
	newWindow => "default",
	requires => array("event", "dom", "animation"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["curve"] = array(
	name => "Animating Along a Curved Path",
	modules => array("animation"),
	description => "This example explores motion animation by moving an HTMLElement along a curved path using control points.",
	sequence => array(6),
	logger => array("animation", "example"),
	loggerInclude => "suppress", 
	newWindow => "default",
	requires => array("event", "dom", "animation"),
	highlightSyntax => true,
	bodyclass => false
);


$examples["scroll"] = array(
	name => "Animated Scrolling",
	modules => array("animation"),
	description => "This example shows how to animate the scrolling of an HTMLElement.",
	sequence => array(7),
	logger => array("animation", "example"),
	loggerInclude => "suppress", 
	newWindow => "default",
	requires => array("event", "dom", "animation"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["reverse"] = array(
	name => "Reversing an Animation",
	modules => array("animation"),
	description => "The <code>reverse</code> attribute allows you to change the run direction of an animation.",
	sequence => array(8),
	logger => array("animation", "example"),
	loggerInclude => "suppress", 
	newWindow => "default",
	requires => array("event", "dom", "animation"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["end-event"] = array(
	name => "Using the End Event",
	modules => array("animation"),
	description => "This example demonstrates how to use the <code>end</code> event.",
	sequence => array(9),
	logger => array("animation", "example"),
	loggerInclude => "suppress", 
	newWindow => "default",
	requires => array("event", "dom", "animation"),
	highlightSyntax => true,
	bodyclass => false
);

$examples["anim-chaining"] = array(
	name => "Chaining Animations Using the <code>end</code> Event",
	modules => array("animation"),
	description => "Animations can be chained (set to fire sequentially) using Animation's <code>end</code> event.",
	sequence => array(10),
	logger => array("animation", "example"),
	loggerInclude => "default", 
	newWindow => "default",
	requires => array("event", "dom", "animation"),
	highlightSyntax => true,
	bodyclass => false
);

?>
