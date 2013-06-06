OOP Change History
==================

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

* Updated `Y.clone()` to always quit early and not try to clone DOM nodes.
  Common host objects like DOM nodes cannot be "subclassed" in Firefox and old
  versions of IE. Trying to use `Object.create()` or `Y.extend()` on a DOM node
  will throw an error in these browsers.

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

* No changes.


3.7.2
-----

* No changes.


3.7.1
-----

* No changes.


3.7.0
-----

* No changes.


3.6.0
-----

* No changes.


3.5.1
-----

* No changes.


3.5.0
-----

* No changes.


3.4.1
-----

* No changes.


3.4.0
-----

* Significant performance improvements for `augment()`.

* Bug fix: `augment()` handled the `whitelist` parameter incorrectly when
  augmenting a function. [Ticket #2530036]


3.3.0
-----

* `clone()` no longer fails on DOM objects in IE.


3.2.0
-----

* No changes.


3.1.1
-----

* `clone()` passes functions through.


3.1.0
-----

* Added `Y.some()`.

* Improved iterators over native objects and YUI list object.

* Improved deep clone, particularly when dealing with self-referencing objects.

* Fixed complex property merge when doing a deep aggregation.


3.0.0
-----

* No functional changes.


3.0.0 beta1
----------

* `bind()` now adds the arguments supplied to bind before the arguments supplied
  when the function is executed. Added `rbind()` to provide the old
  functionality (arguments supplied to bind are appended to the arguments
  collection supplied to the function when executed).

* `bind()` supports a string representing a function on the context object in
  order to allow overriding methods on superclasses that are bound to a function
  displaced by AOP.

* Fixed array handling in `clone()`.


3.0.0pr2
--------

* No changes.


3.0.0pr1
--------

* Initial release.
