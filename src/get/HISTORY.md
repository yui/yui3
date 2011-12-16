Get Utility Change History
==========================

3.5.0
-----

* [!] The `Y.Get.abort()` method is now deprecated and will be removed in a
  future version of YUI. Use the transaction-level `abort()` method instead.

* [!] The `charset` option is now deprecated and will be removed in a future
  version of YUI. Specify an `attributes` object with a `charset` property
  instead.

* [!] The `win` option, which allowed you to specify the window into which
  nodes should be inserted, is now deprecated and will be removed in a future
  version of YUI. Use the `doc` option instead, which allows you to specify a
  document, as opposed to a window (which makes more sense).

* [!] The `win` property of transaction objects is now deprecated and will be
  removed in a future version of YUI. Since any given request in a transaction
  may now have its node inserted into any document, the best way to get this
  info is to find the request you're interested in inside the transaction's
  `requests` property, then look at that request's `doc` property to figure out
  what document it's associated with.

* [!] The `tId` property of transaction objects is now deprecated and will be
  removed in a future version of YUI. Use the `id` property instead.

* The Get Utility has been completely rewritten to improve performance and add
  much-needed functionality. Backwards compatibility has been maintained, but
  some methods and APIs have been deprecated and will be removed in a future
  version of YUI.

* Multiple scripts within a transaction are now loaded in parallel whenever
  possible in browsers that are capable of preserving execution order regardless
  of load order. This improves performance in those browsers when loading
  multiple scripts.

* Multiple CSS resources within a transaction are now always loaded
  asynchronously, since CSS rules are applied based on the order of link nodes
  in the document, not the order in which resources finish loading. This
  improves performance in all browsers when loading multiple CSS files.

* Script and CSS resources that fail to load due to HTTP or network errors are
  now correctly treated as failures in all browsers that support `error` events
  on script or link nodes. Most browsers support this on script nodes, but only
  Firefox 9+ currently supports this on link nodes.

* CSS load completion is now detected reliably in WebKit browsers and in older
  versions of Firefox, which don't support the `load` event on link nodes.
  Unfortunately, while our workaround makes it possible to detect when loading
  is complete, we still can't detect whether it completed successfully or
  with an error, so in these browsers CSS resources are always assumed to have
  loaded successfully.

* Added a `Y.Get.load()` method, which allows you to load both CSS and JS
  resources in a single transaction.

* Added a `Y.Get.js()` method, which is now the preferred way to load JavaScript
  resources. `Y.Get.script()` is now an alias for `js()`.

* Added a new `Y.Get.options` property containing global options that should be
  used as the default for all requests, along with similar `cssOptions` and
  `jsOptions` properties containing default options that apply only to CSS or
  JS requests, respectively, and that take precedence over the global defaults.

* Added a new `pollInterval` option, which allows you to customize the polling
  interval (in milliseconds) used to check for CSS load completion in WebKit and
  Firefox <=8.

* The `css()`, `js()`, `load()`, and `script()` methods now return an instance
  of `Y.Get.Transaction`, which encompasses one or more requests and contains
  useful properties and methods for getting information about and manipulating
  those requests (and related HTML nodes) as a unit.

* The `css()`, `js()`, `load()`, and `script()` methods now accept an optional
  Node.js-style callback function as either the second or third parameter. This
  function will be called after the transaction finishes. The first argument
  is an array of errors, or `null` on success. The second argument is the
  transaction object.

* The `css()`, `js()`, `load()`, and `script()` methods now accept URL strings,
  objects of the form `{url: '...', [... options ...]}`, or arrays of URL
  strings and/or objects. This allows you to specify per-URL options if desired,
  such as node attributes, parent documents, `insertBefore` nodes, etc.

* The logic used to determine where a node should be inserted when no custom
  `insertBefore` node has been specified has changed slightly. By default,
  script and link nodes will now be inserted before the first `<base>` element
  if there is one, or failing that, before the last child of the `<head>`
  element, or if there's no `<head>` element, before the first `<script>`
  element on the page.

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
