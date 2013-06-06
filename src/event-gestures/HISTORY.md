Gestures Change History
=======================

3.10.3
------

* No changes.

3.10.2
------

* No changes.

3.10.1
------

* No changes.

3.10.0
------

* No changes.

3.9.1
-----

* No changes.

3.9.0
-----

* No changes.

3.8.1
-----

* No changes.

3.8.0
-----

* No changes.

3.7.3
-----

  * `event-move` supports the -ms-touch-action property in IE10.
  Nodes subscribing to events defined in event-move will have their
  styles updated to `-ms-touch-action:none`. It will be reset when
  listeners are detached.

  http://msdn.microsoft.com/en-us/library/windows/apps/hh767313.aspx

3.7.2
-----

* No changes.

3.7.1
-----

* No changes.

3.7.0
-----

* 'event-gestures' supports MSPointer events (IE10 on Windows 8).

3.6.0
-----

* No changes.

3.5.1
-----

* No changes.

3.5.0
-----

* Chrome fixed ontouchstart in window bug. No need to caveat the touch test for
  Chrome 6+.

3.4.1
-----

* Fixed preventDefault:true for flick

3.4.0
-----

* For flick, reset start time on first move, to handle case where user
  mousesdown/touchstarts but then doesn't move their finger for 5s leading to
  inaccurate velocity.

3.3.0
-----

* Use touches current target if already set, as opposed to over-riding it with
  touch current target

* Flick "y" axis param now handled correctly.

3.2.0
-----

* Initial release.
