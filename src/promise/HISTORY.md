Promise Change History
======================

3.11.0
------

* Split the module into promise-core and promise-extras
* then() no longer returns an instance of this.constructor
* Added combinators, factories and extra methods
* The first function received as parameter of the Promise init function is now
  a reference to resolve() instead of accept()
* Changing the use of fulfill() to accept() to follow the naming of DOMFuture

3.10.0
------

* No changes.

3.9.1
-----

* No changes.

3.9.0
-----

* Initial release. [Juan Dopazo and Luke Smith]
