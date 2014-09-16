DOM Change History
==================

3.17.2
------

* No changes.

3.17.1
------

* No changes.

3.17.0
------

* [#1709][]: Move out of color-base module (@okuryu)

[#1709]: https://github.com/yui/yui3/pull/1709

3.16.0
------

* Optimize dom-style.js. Remove unnecessary anonymous function, unused variables. Use "Number()" instead of "new Number()". [Ryuichi Okumura]

3.15.0
------

* [#1603][]: Set a node value to an empty string setting to null. [Ryuichi Okumura]
* [#1469][]: Fix a bug with setStyle() cannot set an opacity to 1. [Ryuichi Okumura]

[#1603]: https://github.com/yui/yui3/issues/1603
[#1469]: https://github.com/yui/yui3/issues/1469

3.14.1
------

* No changes.

3.14.0
------

* No changes.

3.13.0
------

* No changes.

3.12.0
------

* No changes.

3.11.0
------

* Fixed: `Y.Selector` could return an incorrect number of elements in browsers
  that don't support support `getElementsByTagName()` or `querySelectorAll()` on
  document fragments. [Ezequiel Rodriguez]

* Fixed: In Opera, `Y.Selector` failed to include selected `<option>` elements
  when the `:checked` pseudo-selector was used. [Jeroen Versteeg]

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

* [!] Removed `dom-deprecated` module. [Ryuichi Okumura]

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

* Added `transformOrigin` and `msTransform` to `dom-style`.

3.6.0
-----

  * No changes.

3.5.1
-----
  * Bug fix: Fix multiple grouped queries for IE. [Ticket 2532155]


3.5.0
-----
  * Bug fix: Comments are now filtered from IE child queries. [Ticket 2530101]
  * Bug fix: Root node border correctly accounted for in IE. [Ticket 2531246]
  * Added Y.DOM.getScrollbarWidth() to return the width of a scrollbar in the current user agent


3.4.1
-----

  * No changes.

3.4.0
-----

  * The ancestor/ancestors methods now accept an optional stopAt function.

3.3.0
-----

  * IE alpha filter for opacity no longer affects existing filters.
  * Fixes for IE9, Firefox 4, and Chrome creators.
  * setStyle(node, '') now clears inline styles.
  * adds ancestors method.

3.2.0
-----

  * CSS "transform" vendor prefix is now optional with set/getStyle.
  * Bug fix: IE6/IE7 were failing inDoc checks for cloned nodes. [Ticket 2529232]


3.1.1
-----

  * Bug fix: viewportRegion() was incorrectly documented. [Ticket 2528756]


3.1.0
-----

  * adds support for hypenated attributes.
  * Bug fix: iOS already includes scroll amount. [Ticket 2528390]

3.0.0
-----

  * initial release.

