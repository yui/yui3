DOM Change History
==================

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

