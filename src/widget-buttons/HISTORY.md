Widget Buttons Change History
=============================

3.5.0
-----

  * Fixed issue with multiplying subscriptions to `buttonsChange` event. The
    event handler was itself subscripting _again_ to the event causing an
    ever-increasing number of subscriptions all doing the same work.
    [Ticket #2531449]

  * Configurations of named button types, e.g. "close", are now merged with the
    user-provided configuration allowing overriding of the default options for
    the named button.

3.4.1
-----

  * Added support for `classNames` property for button configurations which will
    add the CSS class names to the button Node. The default "close" button uses
    this, adding a `yui3-button-close` CSS class to itself. [Ticket #2531091]

  * Fixed the default template for the "close" button to not contain malformed
    HTML by replacing the `<div>` element inside of a `<span>` with a `<span>`.
    The in-lined CSS in the style attribute on the button was moved into an
    external CSS file which provides the basic styling for the default "close"
    button for both the Sam and Night skins. The CSS class `yui3-widget-buttons`
    is now applied to the `boundingBox` of Widgets which use WidgetButtons.
    [Ticket #2530952]

  * Fixed a bug where instance-level properties were not being initialized
    causing references to bubble-up the chain to the prototype incorrectly.
    [Ticket #2530998]

3.4.0
-----

  * Initial release.
