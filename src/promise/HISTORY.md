Promise Change History
======================

@VERSION@
------

* Remove `Promise.resolve` and rename `Promise.cast` to `Promise.resolve` as per
  the last TC39 decision.

3.14.1
------

* Deprecated `resolver.then` in favor of `resolver._addCallbacks`.

3.14.0
------

* Marked `getStatus` as deprecated.
* Added new methods following the new emerging ES6 standard for promises.
  This includes `promise.catch`, `Promise.all`, `Promise.race`, `Promise.cast`,
  `Promise.resolve` and `Promise.reject`.

3.13.0
------

* No changes.

3.12.0
------

* No changes.

3.11.0
------

* Changed the value of `this` inside callbacks to `undefined` to match the
  Promises A+ spec.

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

* Initial release. [Juan Dopazo and Luke Smith]
