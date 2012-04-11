YUI Core Change History
=======================

3.5.0
-----

* YUI now runs natively on Node.js without a shim. See README.nodejs.md for
  details.

* YUI now detects non-native ES5 shims added to native objects by other
  libraries and falls back to its own internal shims rather than relying on the
  potentially broken code from the other library.

* Added static YUI.applyConfig to apply config settings to YUI.GlobalConfig in
  parts instead of in whole. [Ticket #2530970]

* Added `Y.getLocation()` which returns the `location` object from the
  window/frame in which a YUI instance operates. [Ticket #2531608]

* Added a `useNativeES5` YUI config option, which is `true` by default. If
  `false`, certain YUI features that check for native ES5 functionality will
  always fall back to non-native implementations even in ES5 browsers (useful
  for testing).

* `Y.Array.indexOf()` now supports a `fromIndex` argument for full ES5
  compatibility. [Based on a patch from Ryuichi Okumura]

* `Y.Object.isEmpty()` now casts the given value to an object if it isn't one
  already, which prevents exceptions when it's given a non-object.

* Fixed issue #2531247: Namespace function behaves wrong with multiple
  arguments.

* Fixed issue #2531512: 'debug' parameter missing from the YUI Config object
  documentation.

* 2530970 Should we provide a YUI.applyConfig(), to avoid clobbering of YUI_config in 'mashup' use cases
* 2531164 Natively use YUI Gallery Modules form does not submit on [enter]
* 2531247 namespace function behaves wrong with multiple arguments
* 2531512 'debug' parameter missing from the YUI Config object documentation; the Config object documentation ...
* 2531550 Prepare npm package for 3.5.0
* 2531551 Add support for Silk in Y.UA
* 2531612 Wrong module name in YUI Global Object documentation


3.4.1
-----

* Sparse arrays are now handled correctly in the non-native fallback
  implementation of `Y.Array.indexOf()`. [Ticket #2530966]

* `Y.mix()` will no longer shadow prototype properties on the receiver unless
  the `overwrite` parameter is true. This was the pre-3.4.0 behavior, but was
  changed in 3.4.0. We're changing it back to preserve backwards compatibility.
  [Ticket #2530501]

* The non-native fallback implementation of `Y.Object.keys()` now contains a
  workaround for buggy browsers that treat function `prototype` properties as
  enumerable in violation of the ES5 spec.

* `Y.Object.size()` now returns `0` for non-objects. This was the pre-3.4.0
  behavior, but regressed in 3.4.0. [Ticket #2531069]


3.4.0
-----

* Added `Y.Array.dedupe()`, which provides an optimized solution for deduping
  arrays of strings. When you know an array contains only strings, use `dedupe`,
  since it's faster than `unique`.

* `Y.Lang.isArray()` now uses the native ES5 `Array.isArray()` method when
  possible.

* `Y.Object()` now uses the native ES5 `Object.create()` method when possible.

* `Y.Object.keys()` now uses the native ES5 `Object.keys()` method when
  possible.

* Sparse arrays are now handled correctly in the non-native fallback
  implementations of `Y.Array.each`, `Y.Array.hash`, and `Y.Array.some`.
  [Ticket #2530376]


3.3.0
-----

* Added fast path for repeat calls to `use()` with the same arguments.

* Added a `Y.destroy()` method, which destroys the YUI instance.

* Added `Y.Lang.now()`, which returns the current time in milliseconds.

* Added `YUI.GlobalConfig` to allow three stages of configuration
  (`YUI.GlobalConfig` --> `YUI_Config` --> instance configs). This is helpful in
  non-browser environments for supplying a global config for the YUI container.


3.2.0
-----

* Added `Y.Lang.sub()`, which is a very lightweight version of `Y.substitute()`.

* `Y.Array.hash()` no longer skips falsy values.

* Script errors in module and `use()` callback functions are caught and routed
  through `Y.error`.

* `Y.error` invokations can be monitored with the `errorFn` configuration.

* Returning `true` from the `errorFn` will prevent the script error from halting
  further script execution.

* Added UA properties for mobile devices and ensured that UA is only evaluated
  once.

* The YUI global will overwrite itself when included again, while attempting to
  preserve the global environment of previous instances.

* Added a remote loader service submodule.

* Added a features submodule.  This is used by the capability-based loader
  when dispatching to a remote loader service.


3.1.1
-----

* Removed the limit on the number of config objects you can supply to the
  `YUI` constructor.


3.1.0
-----

* YUI will attempt to fetch newly discovered dependencies after a module is
  dynamically loaded.

* The `documentElement` (`<html>`) is now stamped with a `yui3-js-enabled`
  classname to indicate that JS is enabled. This allows for the creation of
  JS-aware CSS style rules that progressively enhance the page.

* Added the ability to define a global configuration object (`YUI_config`).

* Added `Y.Object.some()` and `Y.some()`, which are analogous to
  `Y.Array.some()`.

* UA refinements for Chrome, Android and other browsers/platforms.

* Added `last()` to `Queue` for LIFO support.

* Added throttle utility to buffer expensive functions that are called
  frequently.

* The `YUI.add()` callback now gets the module name as the second parameter for
  generic processing of similar modules.

* Added `intl-base` submodule to process the decision tree for selecting
  language packs when dynamically loading internationalized modules.

* `Y.guid()` generates identifiers that are safe to use as HTML attributes.

* Improved persistent messaging for missing modules/functionality.

* Bootstrapping improved to prevent simultaneous loading of resources when
  multiple instances are launched at the same moment.

* The YUI script source URL is read in order to try to dynamically determine the
  base path for loading resources on demand.

* The core loads without errors in non-browser environments.


3.0.0
-----

* Extracted the loader from the seed file. If loader is not available, but `get`
  is and dependencies are missing, the loader will be fetched before continuing.

* User agent detection is more granular. For example, Firefox 3.5 reports Gecko
  1.91 rather than 1.9.

* Fixed `Y.UA.os`.

* Added additional mobile device detection.

* Get utility cleans up attribues before purging nodes.

* `Y.cached` accepts a parameter to refresh a cached value.

* `yui-log` and `yui-later` are now optional modules that are included with
  `yui.js`.

* `queue-base` is no longer a submodule of `queue` -- it's now part of
  `yui-base`.

* All YUI submodules end up in the `yui` build directory.

* Dynamic loading can be disabled by setting the `bootstrap` config to `false`.


3.0.0 beta 1
-----

### Core

* `Y.fail` has been renamed to `Y.error` so that `Y.fail` can be used for the
  assertion engine.

* `Y.stamp` now accepts a `readOnly` parameter to be used when you are only
  interested in reading an existing guid rather than creating a new one.

* `Y.stamp` defends against stamping items that can't be stamped.

* Added to `Y.Object`: `values()`, `hasKey()`, `hasValue()`, `size()`,
  `getValue()`, `setValue()` (the latter two are for manipulating nested
  values).

* `Y.use` calls are queued during dynamic loading.

* Added `Y.cached` for function memoizing

* Added `numericSort` to `Y.Array`.

* The `yui:log` event broadcasts globally.

### Lang

* Added `Y.Lang.type` (`typeof` abstraction) and refactored some 'is' methods to
  use it.

### Get

* Accepts an attribute collection config to apply to inserted nodes.

* `id` attributes are globally unique

* Now accepts `purgethreshold` as a config option. This will set the number of
  transactions required before auto removing nodes from previous transactions
  (default is 20).

### Loader

* `yuitest` renamed to `test`, now requires `collection`.

* Lots of new module metadata.

* Added `onCSS`.

* Loader requests are queued globally.

* Accepts `jsAttributes` and `cssAttributes` configs for adding attributes to
  inserted nodes

* Added `force` config.

### UA

* Added `secure` property for SSL detection.

* Added `os` property for OS detection.

* Added Adobe Air and Google Caja detection.


3.0.0pr2
--------

### Core

* The initial dependency calculation should not allow automatic rollup.

* `Y.fail` will throw/rethrow errors by default (`throwFail` is now `true`).

* `Y.namespace` reverted to scrub `YAHOO` out if included as the first level of
  the namespace.

* `useConsole` config changed to `useBrowserConsole`.


### Array

* Added `Y.Array.some()`.


### Get

* Protects against trailing commas in the array of files to load.


### Loader

* `get` requires `yui-base`.

* `loader` requires `get`.

* Combo URL build process defends against undefined modules.

* Added combo handler support for CSS.

* Filters are correctly applied to combo and fullpath URLs.

* Added `compat`, `profiler`, `yuitest`, `widget`, `stylesheet`,
  `classnamemanager`, `overlay`, `plugin`, `slider`, and `console` modules.

* Added `io` submodules.

* `queue` requires `event`.

* Added submodule metadata logic.

* Added plugin metadata logic.

* Added skin metadata logic.


3.0.0pr1
--------

* Initial release.
