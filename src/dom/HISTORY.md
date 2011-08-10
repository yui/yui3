DOM Utility
===============

The DOM Utility is the underlying API used by Node. These are broken out so that
they can be used independant of Node, however typical usage should be via Node.

The following modules are available:

  * `dom`: Rollup of `dom-base`, `dom-screen`, `dom-style`, `selector-native`,
    and `selector-css2`.
  * `dom-base`: Provides basic support for working with DOM nodes.
  * `dom-screen`: Provides methods for positioning elements, measuring the
    document and viewport, and working with regions. 
  * `dom-style`: Adds setStyle()/getStyle() and getComputedStyle() methods
    for working with style properties.
  * `selector-native`: A light wrapper around native querySelector().
  * `selector`: Fallback support for Selector queries. 
  * `selector-css2`: Fallback support for CSS2 Selector queries. 
  * `selector-css3`: Fallback support for CSS3 Selector queries. 
