Promise Change History
======================

@VERSION@
------

* Split the module into promise-core and promise-extras
* then() no longer returns an instance of this.constructor
* Added combinators, factories and extra methods
* [!] Deprecated Y.batch() in favor of Y.Promise.every()
* The first function received as parameter of the Promise init function is now
  a reference to resolve() instead of fulfill()
* Changed the value of `this` inside callbacks to `undefined` to match the
  Promises A+ spec.

3.10.3
------

* No changes.

3.10.2
------

* No changes.

>>>>>>> upstream/dev-3.x

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
