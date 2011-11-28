Get Utility Change History
==========================

3.5.0
-----

* The source for the `get` module has moved from `src/yui` to `src/get`. This
  allows it to be built separately from the core YUI modules.


3.4.1
-----

* No changes.


3.4.0
-----

* Added an `async` option to `script()`. When set to `true`, the specified
  scripts will be loaded asynchronously (i.e. in parallel), and order of
  execution is not guaranteed. The `onSuccess` callback will be called once,
  after all scripts have finished loading.

* Added an `onProgress` callback, which is useful when loading multiple scripts
  either in series or in parallel by passing an array of URLs to `script()`.
  The `onProgress` callback is called each time a script finishes loading,
  whereas `onSuccess` is only called once after all scripts have finished
  loading.


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

* Inserted script nodes get `charset="utf-8"` by default.


3.0.0
-----

* Initial release.
