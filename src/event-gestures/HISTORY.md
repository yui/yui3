Gestures Change History
=======================

3.5.0
-----

  * Chrome fixed ontouchstart in window bug. No need to caveat
    the touch test for Chrome 6+.

3.4.1
-----

 * Fixed preventDefault:true for flick

3.4.0
-----

 * For flick, reset start time on first move, to handle
   case where user mousesdown/touchstarts but then doesn't
   move their finger for 5s leading to inaccurate velocity.

3.3.0
-----

  * Use touches current target if already set, as opposed
    to over-riding it with touch current target

  * Flick "y" axis param now handled correctly.

3.2.0
-----

  * New beta component

