ImageLoader Change History
==========================

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
  * Added classNameAction option for ImgGroup. Setting to "enhanced" means that
   when using className on an <img> element, the src attribute is replaced
   rather than simply removing the class name. [Ticket #2530087]

3.3.0
-----
  * No changes.

3.2.0
-----
  * No changes.

3.1.1
-----
  * No changes.

3.1.0
-----
  * PNG image fix for IE6 [Ticket #2528448]
  * Convert deprecated Y.get calls to Y.one

3.0.0
-----
  * No changes.

3.0.0 beta 1
------------
  * 3.0 conversion
  * New features:
    * Fold groups indicated by a distance from the fold, and images are
      loaded in cascading fashion as each reaches that distance
      Scroll and resize triggers are set automatically for these groups
    * Custom triggers can belong to the global Y instance or to any local event
      target
    * Bg, Src, and Png images are all registered with groups via the same
      "registerImage" method, and differentiated by attribute parameters

