Animation Utility
===============

Provides the ability to animate style property changes. Advanced easing
equations are provided for more interesting animated effects.

The following modules are available:

  * `anim`: Rollup of `anim-base`, `anim-color`, `anim-curve`,
    `anim-easing`, `anim-scroll`, and `anim-xy`.
  * `anim-base`: Adds animation functionality for number-based style properties.
  * `anim-color`: Adds the ability to animate colors.
  * `anim-curve`: Adds the ability to animate the position of an element using
     bezier control-points.
  * `anim-easing`: Contains easing equations for more advanced motion
     (e.g. "easeOut", "backIn", etc).
  * `anim-scroll`: Adds the ability to animate the scroll position of an
    element.

You may want to consider using the Transition module for number-based style
properties, as it leverages native CSS Transitions when possible. The Animation
Utility will move to using CSS Animation in a future release.
