Widget Buttons Change History
=============================

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

* No changes.

3.8.1
-----

* No changes.

3.8.0
-----

  * No changes.

3.7.3
-----

  * Fixed bug with a widget's `defaultButton` changing by binding to the
    `defaultButtonChange` event in WidgetButtons' `initializer()`.

3.7.2
-----

  * No changes.

3.7.1
-----

  * No changes.

3.7.0
-----

  * No changes.

3.6.0
-----

  * No changes.

3.5.1
-----

  * Fixed issue with `addButton()` receiving an `index` argument which was too
    large or negative, both of which are okay because this value is passed to
    the Array `splice()` method. The `index` property on the `buttonsChange`
    event facade is now always the actual index at which the new button exists.
    [Ticket #253219]

  * Fixed issue with properly handling `Y.Node` instances from other YUI
    sandboxes. [Ticket #2532207]

3.5.0
-----

  * [!] WidgetButtons has been completely rewritten, back-compat for common
    usage has been maintained. The new version is _much more_ robust.
    [Tickets #2531366, #2531624, #2531043]

  * [!] The `buttons` attribute is handled in an _extremely_ flexible manner.
    It supports being a single Array, or an Object of Arrays keyed to a
    particular section.

    The `buttons` collection will be normalized into an Object which contains an
    Array of `Y.Node`s for every `WidgetStdMod` section (header, body, footer)
    which has one or more buttons. The structure will end up looking like this:

        {
            header: [...],
            footer: [...]
        }

    A button can be specified as a Y.Node, config Object, or String name for a
    predefined button on the `BUTTONS` prototype property. When a config Object
    is provided, it will be merged with any defaults provided by a button with
    the same `name` defined on the `BUTTONS` property. [Ticket #2531365]

  * [!] All button nodes have the `Y.Plugin.Button` plugin applied.

  * [!] The HTML structure for buttons has been optimized to:

        <span class="yui3-widget-butons>
            <button class="yui3-button">Foo</button>
        </span>

    The above structure will appear in each `WidgetStdMod` section
    (header/body/footer) which contains buttons. [Ticket #2531367]

  * Fixed issue with multiplying subscriptions to `buttonsChange` event. The
    event handler was itself subscripting _again_ to the event causing an
    ever-increasing number of subscriptions all doing the same work. Now
    WidgetButtons will always clean up its event subscriptions.
    [Ticket #2531449]

  * Added support for predefining `BUTTONS` on the prototype. `BUTTONS` is
    Collection of predefined buttons mapped by name -> config. These button
    configurations will serve as defaults for any button added to a widget's
    buttons which have the same `name`. [Ticket #2531680]

  * Added an `HTML_PARSER` implementation for the `buttons` attribute. This
    allows the initial value for a widget's `buttons` to be seeded from its DOM.

  * A widget's `buttons` now persist after header/body/footer content updates.
    Option 2 of the follow scenario has been implemented:
    http://jsfiddle.net/ericf/EXR52/

  * A button can be configured with a `context` object (which defaults to the
    widget instance), which will be used as the `this` object when calling a
    button's `action` or `events` handlers. [Ticket #2531166]

  * Buttons now support multiple `events` which can be specified in place of an
    `action`. The follow are equivalent:

        var buttonConfigWithEvents = {
            label: 'Foo',
            events: {
                click: function (e) {
                    this.hide();
                }
            }
        };

        var buttonConfigWithAction = {
            label : 'Foo',
            action: 'hide'
        };

    A button's `action` can now be specified as the String name of a function
    which is hosted on the `context` object. [Ticket #2531363]

  * Added the notion of a default button. A widget's `defaultButton` will have
    the "yui3-button-primary" CSS class added to it, and will be focused when
    the widget is shown.

  * Updated the `addButton()` method and added other accessor/mutator methods:
    `getButton()` and `removeButton()`.

  * Buttons can now be added to a widget's body, not just the header and footer.

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
