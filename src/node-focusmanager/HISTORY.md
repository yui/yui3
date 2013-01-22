Focus Manager Change History
============================

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

  * No changes.


3.3.0
-----
 * Fixed an issue with next/previous behavior that could cause focus to get
   stuck at the beginning or end of a control set when the `circular`
   attribute was set to `false`. [Ticket #2529353]


3.2.0
-----

  * Fixed an issue that prevented arrow keys from working properly in form
    input fields and textareas inside a focused node. [Ticket #2529041]


3.1.2
-----

  * No changes.


3.1.1
-----

  * No changes.

3.1.0
-----

  * Updated the "refresh" method so that it will set up event listeners if they
    haven't yet been set up, enabling the Focus Manager to be plugged into an
    empty Node with the focusable descendants to be added later.


3.0.0
-----

  * Fixed an issue where mousing down on a child node of a descendant would
    result in the descendant losing focus.


3.0.0 beta 1
------------

  * Initial release.
