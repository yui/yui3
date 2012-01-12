Collection Change History
=========================

3.5.0
-----

* YUI now detects non-native ES5 shims added to native objects by other
  libraries and falls back to its own internal shims rather than relying on the
  potentially broken code from the other library.


3.4.1
-----

* Sparse arrays are now handled correctly in the non-native fallback
  implementation of `Y.Array.lastIndexOf()`. [Ticket #2530966]


3.4.0
-----

* Sparse arrays are now handled correctly in the non-native implementations of
  `Array.every`, `Array.filter`, `Array.find`, `Array.map`, and
  `Array.reduce`. [Ticket #2530376]


3.3.0
-----

* [!] The `sort` parameter of `Array.unique` has been deprecated. It still
  works, but you're encouraged not to use it as it will be removed from a
  future version of YUI.
* `Array.lastIndexOf` now supports the `fromIndex` parameter as specified in
  ES5.
* Improved the performance of `Array.filter`, `Array.map`, `Array.reduce`, and
  `Array.unique`, especially in browsers without native ES5 array extras.


3.2.0
-----

* No changes.


3.1.1
-----

* No changes.


3.1.0
------

* `array-extras` is the base submodule for the package.
* Added `ArrayList` for generic iterable objects.
* `Array.forEach` is an alias for `Array.each`.
* Added `Array.invoke` to execute a named method on an array of objects.


3.0.0
-----

* `unique` with `sort` works.


3.0.0b1
-------

* Fixed load time fork assumptions.


3.0.0pr1
--------

* Initial release.
