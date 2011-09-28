Console Change History
======================

3.4.1
-----

  * No changes.

3.4.0
-----

  * CSS classes generated from the `style` attribute changed from, e.g.,
    `yui3-inline-console` to `yui3-console-inline`.

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

  * CSS class references updated from `yui-*` to `yui3-*`.
  
  * Internal reorganization (API and functionality unaffected)

  * Fixed double escapement of `&` when used with ConsoleFilters and hiding and
    showing content with HTML entities.

  * Strings broken out into Intl. language resource bundles.
    English (en, default) and Spanish (es) supported.

3.0.0
-----

  * Added attribute `style` to allow `inline-block`, `block`, or `absolute`
    positioning.

  * Moved the hidden state CSS to the sam skin and increased rule specificity.

  * `printBuffer` no longer throws an error when called against an empty buffer.

  * Removed `label` property from normalized message object since it was just a
    copy of category.

  * Moved `collapsed` CSS class to the `boundingBox` and now `collapse()`
    resizes the `boundingBox` accordingly.

  * Added `useBrowserConsole` attribute as a pass through to the YUI config.
    Default to `false` so when a `Console` is instantiated, messages are
    redirected to `Console` rather than duplicated there.

  * `collapse()`, `expand()`, and `log()` are now chain-able.

3.0.0beta1
----------

  * `logSource` attribute added to configure listening for events from a
    specific target. Also useful for subscribing to all log events across
    multiple YUI instances.
  
  * Lowered `consoleLimit` default to 300.
  
  * `printLimit` attribute added to limit the number of entries from the buffer
    to output in a given `printBuffer()` call.

  * `printBuffer(max)` argument added to limit the number of entries to print in
    this cycle.

  * Changed from `setTimeout` to `setInterval` to chunk DOM output.

  * `logLevel` constants changed to strings and categories outside info, warn,
    and error are not treated as info.

  * CSS updates.

  * Support for `height` and `width` attribute configuration.

  * Changed `<input type="button">` to `<button type="button">`.

  * Added `collapse()`/`expand()`.

  * Entry addition and removal now occurs off DOM.

  * Entry removal checks that the target Node is present before removing it.

  * `Y.config.debug` explicitly set to false during print cycle to avoid
    infinite loops.

3.0.0pr2
--------

  * Initial release.
