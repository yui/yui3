DataSchema Change History
=========================

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

* No changes.

3.7.3
-----

* Implemented a partial fix for allowing XPath access to XML elements in IE10
  Desktop, Metro, and WinJS environments. A known issue of IE10 WebView not
  allowing XPath addressing is still standing. [Ticket #2532796]

3.7.2
-----

* No Changes.

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

### `dataschema-json`
   * Added support to accept the results array as input, leaving
     `schema.resultListLocator` as optional.
   * Field locators that contain . or [???] now fail over to look for that
     locator as a single property name rather than a nested value. For example,
     a locator `"not.nested"` would look for `inputRecord.not.nested` for a
     value, but if it doesn't find one, it will look for
     `inputRecord["not.nested"]`.  If it finds a value there, it will not look
     for a nested value for subsequent records.
   * `getPath` is far more tolerant of locator strings.  In particular, it
     considered utf-8 characters that didn't match the `\w` regex group to be
     invalid.  This is fixed.


3.3.0
-----

   * Bug 2528429: Added support for locator property to DataSchema.JSON
     resultFields.
   * Known Android issues (bugs 2529621, 2529758, 2529775): XML parsing is buggy
     on the Android WebKit browser.


3.2.0
-----

   * Set custom parser execution scope to be DataSchema instance.


3.1.1
-----

  * No changes.


3.1.0
-----

   * Added support for nested schemas.
   * Added support for XPath resultListLocator, instead of requiring the use
     of 'getElementsByTagName'.
   * Improved support for DOM elements in DataSchema.XML when IE
     xmldoc.selectNodes(String) fails.
   * Field list is now optional for DataSchema.JSON.  If omitted, all response
     data is returned.
   * Fixed a bug in field resolution where null might be discovered along the
     resolution path.  Now exits gracefully rather than throwing an error.


3.0.0
-----

   * Support for DOM elements in DataSchema.XML.


3.0.0 beta 1
------------

   * Initial release.
