Promise Change History
======================

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

* Errors thrown inside the promise initialization function reject the promise.

3.15.0
------

* Deprecated `resolver.then` in favor of `resolver._addCallbacks`.
* Added new methods following the new emerging ES6 standard for promises.
  This includes `promise.catch`, `Promise.all`, `Promise.race`,
  `Promise.resolve` and `Promise.reject`.

3.14.0
------

* Marked `getStatus` as deprecated.

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
