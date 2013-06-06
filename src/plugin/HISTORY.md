Plugin Change History
=====================

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

* No changes

3.3.0
-----

* No changes

3.2.0
-----

* Fixed `onHostEvent()` to actually use on (was using after).

* Plugin.Base can now be mixed in as an extension.

3.1.1
-----

* No changes

3.1.0
-----

* Added separate host method and host event specific subscription methods, to
  resolve inconsistency when using doBefore/doAfter in cases where the host
  supported both an event and a method of the same name.

3.0.0
-----

* No changes

3.0.0 beta 1
------------

* Moved Y.Plugin to Y.Plugin.Base

* Host/Owner object now available through public "host" attribute, as opposed to
  protected `_owner` property (`this.get("host")`).

3.0.0PR2
--------

* Initial release.
