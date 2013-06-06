Widget Stack Change History
===========================

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

  * [!] Default `zIndex` was reverted back to `0` now that parsing works
    correctly.

  * `zIndex` is now correctly parsed from a widget's `srcNode` using an updated
    `HTML_PARSER` implementaiton. [Ticket 2530186] [PR #68] [Hat tip Pat Cavit]

3.4.1
-----

  * The shim element is now sizing correctly the first time a widget is shown
    after it was instantiated with the `visible` Attribute set to `false`. Note:
    The shim element is only used with IE 6 by default. [Ticket #2529127]

3.4.0
-----

  * No changes.

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

  * No changes.

3.0.0
-----

  * Initial release.

  * Recreate iframe shim from `TEMPLATE` for each instance, instead of cloning a
    class level cached Node instance, so that `ownerDocument` can be set to
    match the `boundingBox`.
