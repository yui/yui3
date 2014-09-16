Widget Std Mod Change History
=============================

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

* Fixed: `fillHeight` didn't work correctly when a section's content was set
  after rendering. [Jeroen Versteeg]

* Moved implementation code from the Constructor to the `initializer`
  to account for Base order of operation changes in this release.

  This is one of the older extensions which needed to be upgraded
  after `initializer` support was added for extensions.

  This has no end user impact.

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

  * Added `forceCreate` option to `getStdModNode()` method which, if true, will
    create the section node if it does not already exist. [Ticket #2531214]

3.4.1
-----

  * No changes.

3.4.0
-----

  * Move attribute event listeners to `_renderUIStdMod()` method so that
    `setStdModContent()` can be called on `renderUI()`.

3.3.0
-----

  * [!] Removed `_addNodeHTML()`, and renamed `_addNodeRef()` to
    `_addStdModContent()` (both private), since one method now handles both
    Strings and Node/NodeLists.

  * Changed instanceof to Y.instanceOf, to prevent leaks in IE7.

  * Moved to `node.insert()` for content management, since it now handles
    Strings, Nodes and NodeLists. This also fixes an issue where  resetting the
    content to the existing content (e.g. calling `syncUI()`), would blow away
    the content in IE.

3.2.0
-----

  * Setting content to `null` (or `undefined`, or `NaN`), will remove section
    from the std mod.

3.1.1
-----

  * No changes.

3.1.0
-----

  * Changed widget stdmod `renderUI()`/`syncUI()`/`bindUI()` to `Y.before`, so
    that they are called before the Widget implementation, and setup the
    `header`/`body`/`footer` Node references for the Widget impl to use.

  * Setting section content to `""` will now create the respective section.

  * Fixed `fillHeight`, to work with `contentBox` height, now that it fills
    `boundingBox`.

  * Fixed `setStdModContent("markupString", AFTER | BEFORE)` so that it uses
    `node.append()`, `node.prepend()` instead of `innerHTML` to maintain event
    listeners.

  * `fillHeight` is now invoked when `height` is changed. It was not being
    invoked because of a typo in the event name.

3.0.0
-----

  * Initial release.

  * Cleaned up the way `headerContent`, `bodyContent`, `footerContent` are
    configured, so that the actual stored value is always accurate, without the
    need for a getter which talks to the DOM directly.

  * Recreate sections from `TEMPLATE` string for each instance, instead of
    cloning a class level cached Node instance, so that `ownerDocument` can be
    set to match the `contentBox`.

  * Replaced use of `innerHTML` for progressive enhancement use case with a
    Document Fragment when parsing and then setting `headerContent`,
    `bodyContent`, `footerContent` in `HTML_PARSER` impl, to maintain event
    listeners etc.
