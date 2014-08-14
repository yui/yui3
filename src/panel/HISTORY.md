Panel Change History
====================

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

* No changes.

3.15.0
------

* No changes.

3.14.1
------

* No changes.

3.14.0
------

* No changes.

3.13.0
------

* No changes.

3.12.0
------

* No changes.

3.11.0
------

* No changes.

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

  * No changes.

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

  * No changes.

3.5.0
-----

  * Panel now hosts the a default "close" button which can be included more
    easily then before. This button has advanced styling which will render the
    button with the text [Close] when it's in the footer, and with the icon [x]
    when it's in the header. [Ticket #2531680]

        // Panel with close button in header.
        var panel = new Y.Panel({
            buttons: ['close']
        });

        // Panel with close button in footer.
        var otherPanel = new Y.Panel({
            buttons: {
                footer: ['close']
            }
        });

  * Panel's skins now uses `.yui3-panel` instead of `.yui3-panel-content` for
    its CSS selectors where possible. [Ticket #2531623]

  * Moved mask-related styles/skins to `WidgetModality`.

  * See also WidgetButtons' change history.

  * See also WidgetModality's change history.

3.4.1
-----

  * Panel's CSS related to WidgetButtons has been improved. The styling for
    Panel's header is now much more flexible, while maintaining the position of
    the close button across browsers and varying amounts of content.
    [Ticket #2530978]

  * Panel now has a working Night skin. [Ticket #2530937]

  * The sprite image assets for the "close" button on Panels have moved into the
    WidgetButtons extension's assets. [Ticket #2530952]

  * See also Widget and extensions for changes to dependencies.

3.4.0
-----

  * Initial release.
