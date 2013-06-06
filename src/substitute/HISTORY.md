Substitute Utility Change History
=================================

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

* Officially Deprecating.

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

  * Now replaces everything if not undefined instead of only objects,
    strings and numbers (@satyam)
  * Added `{LBRACE}` and `{RBRACE}` as possible replacement strings so that
    braces can be included in the resulting string (@satyam)
  * Improved the restoration of undefined replacements (@satyam)

3.4.0
-----

  * No changes.

3.3.0
-----

  * No changes.

3.2.0
-----

  * No change to this utility, but `Y.Lang.sub()` was added to the YUI core.
    This is a lightweight version of the substitute utility that follows the
    same templating syntax, but lacks recursive replacements, object dumping,
    and string formatting. The advantage is that it is very small, and available
    in the YUI core -- perhaps the regular expression implementation will be
    faster than the string manipulation that happens in substitute in some
    situations.

3.1.1
-----

  * No changes.

3.1.0
-----

  * Substitute has a `recurse` option to support nested templates (the previous
    default behavior). Normal operation is now a single level substitution
    which is tolerant of brackets in the replacement string.

3.0.0
-----

  * No changes.

3.0.0beta1
----------

  * No changes.

3.0.0pr1
--------

  * Initial release.
