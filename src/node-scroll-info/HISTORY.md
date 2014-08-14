ScrollInfo Node Plugin Change History
=====================================

3.17.2
------

* No changes.

3.17.1
------

* No changes.

3.17.0
------

* No changes.

3.16.0
------

* No changes.

3.15.0
------

* No changes.

3.14.1
------

* Fixed inaccurate scroll metrics in Chrome for Android. ([#1483][]: @rgrove)

[#1483]: https://github.com/yui/yui3/issues/1483

3.14.0
------

* No changes.

3.13.0
---------

* Fixed `getOffscreenNodes()` and `getOnscreenNodes()` even harder (they could
  still return incorrect information in certain cases). [Ryan Grove]

3.12.0
------

 * No changes.

3.11.0
------

* Added an `isNodeOnscreen()` method that returns `true` if the given node is
  within the visible bounds of the viewport, `false` otherwise. [Ryan Grove]

* Improved the performance of `getOffscreenNodes()` and `getOnscreenNodes()`.
  [Ryan Grove]

* Fixed a bug that caused `getOffscreenNodes()` and `getOnscreenNodes()` to
  return incorrect information when used on a scrollable node rather than the
  body. [Ryan Grove]

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

* No changes.

3.7.2
-----

* No changes.

3.7.1
-----

* No changes.

3.7.0
-----

* Initial release.
