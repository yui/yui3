The Console tool
    The Console tool creates a cross browser display to read log messages
    emitted by the YUI logging subsystem.

3.4.0
    * CSS classes generated from the 'style' attribute changed from, e.g.,
      yui3-inline-console to yui3-console-inline

3.3.0
    * No changes

3.2.0
    * No change.

3.1.1
    * No change

3.1.0
    * Class references to yui-* updated to yui3-*
    * Internal reorganization (API and functionality unaffected)
    * Fixed double escapement of & when used with ConsoleFilters and hiding and
      showing content with html entities
    * Strings broken out into Intl language resource bundles.  English (en, default) and
      Spanish (es) supported

3.0.0
    * Added attribute 'style' to allow inline-block, block, or absolute positioning
    * Moved the hidden state css to the sam skin and increased rule specificity
    * printBuffer no longer throws an error when called against an empty buffer
    * Removed 'label' property from normalized message object since it was just
      a copy of category
    * Moved collapsed class to the boundingBox and now collapse resizes the
      boundingBox accordingly
    * Added useBrowserConsole attribute as a pass through to the YUI config.
      Default to false so when a Console is instantiated messages are
      redirected to Console rather than duplicated there.
    * collapse(), expand(), and log(..) are now chainable

3.0.0 beta 1
    * logSource attribute added to configure listening for events from a
      specific target.  Also useful for subscribing to all log events across
      multiple YUI instances.
    * Lowered consoleLimit default to 300
    * printLimit attribute added to limit the number of entries from the buffer
      to output in a given printBuffer call
    * printBuffer(max) argument added to limit the number of entries to print
      in this cycle
    * Changed from setTimeout to setInterval to chunk DOM output
    * logLevel constants changed to strings and categories outside info, warn,
      and error are not treated as info
    * CSS updates
    * Support for height and width attribute configuration
    * Changed <input type="button"> to <button type="button">
    * Added Collapse/Expand
    * Entry addition and removal now occurs off DOM
    * Entry removal checks that the target node is present before removing it
    * Y.config.debug explicitly set to false during print cycle to avoid
      infinite loops

3.0.0 PR2
    Initial release
