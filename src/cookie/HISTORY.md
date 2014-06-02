Cookie Change History
=====================

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

* No changes.

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

* Pull Req: 248 - Make order of cookie loading with the same name configurable

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

  * No changes.


3.2.0
-----

  * Introduced a private method for setting the document to use in tests.
  * Updated tests to run without setting cookies to `document.cookie`.


3.1.1
-----

  * No changes.


3.1.0
-----

  * No changes.


3.0.0
-----

  * No changes.


3.0.0b1
-------

  * Synchronized with the 2.x version of cookie:
    * Changes formatting of date from `toGMTString()` to `toUTCString()` (trac#
      2527892).
    * Updated `remove()` so that it no longer modifies the options object that
      is passed in (trac# 2527838).
    * Changed behavior for Boolean cookies (those that don't contain an equals
      sign). Previously, calling `Cookie.get()` on a Boolean cookie would return
      the name of the cookie. Now, it returns an empty string. This is necessary
      because IE doesn't store an equals sign when the cookie value is empty
      ("info=" becomes just "info").
    * Added `Cookie.exists()` to allow for easier Boolean cookie detection.
    * Removed check for cookie value before parsing. Previously, parsing checked
      for `name=value`, now it parses anything that is passed in.
    * Removing the last subcookie with `removeSub()` now removes the cookie if the
      `removeIfEmpty` option is set to `true`. (trac# 2527954)
    * Added option to disable url encoding/decoding by passing `options.raw` to
      `set()` and `get()`. (trac# 2527953).
    * Changed `get()` to take an options object with `raw` and `converter`
      properties. If a function is passed instead of an object then it is used
      as the converter for backward compatibility (trac# 2527953).


3.0.0pr2
--------

  * Synchronized with latest 2.x version of cookie.


3.0.0pr1
--------

  * Initial release.
