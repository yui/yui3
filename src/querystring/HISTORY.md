QueryString Utility Change History
==================================

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

  * No changes.

3.3.0
-----

  * The stringify method in querystring-stringify and
    querystring-stringify-simple now accepts a configuration object in the
    second argument. All configuration properties are optional.

    For querystring-stringify-simple, the configuration object contains only
    one property: arrayKey.  The default value is false.

    For querystring-stringify, the configuration object can be defined with
    three properties (default values are in parenthesis): arrayKey (false),
    eq (=), and sep (&).

3.2.0
-----

  * Fixed malformed HTML entities in JSON response, when using
    `io-upload-iframe`. [Ticket #2528646]

  * Fixed configuration HTTP headers should override preset HTTP headers, when
    identical. [Ticket #2528893]

3.1.2
-----

  * No changes.

3.1.1
-----

  * No changes.

3.1.0
-----

  * Initial release.
