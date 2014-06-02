Widget Modality Change History
==============================

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

* Fixed the positioning of the modal mask for stacked modals.
  ([#1684][]: @moiraine)

[#1684]: https://github.com/yui/yui3/pull/1684

* Fixed an issue where Widget-Modality did not function correctly when a modal widget
  and its mask were subsequently cloned by something else. ([#1175][]: @jinty)

[#1175]: https://github.com/yui/yui3/pull/1175

3.15.0
------

* Fixed a bug where the widget would focus before it was actually rendered,
  leading to a jump in the window position. ([#1636][]: @andrewnicols)

[#1636]: https://github.com/yui/yui3/pull/1636

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

  * Removed hard-coded "yui3-" CSS classname where the mask node was being
    retrieved via the ".yui3-widget-mask" CSS selector. [Ticket #2532363]

3.5.1
-----

  * Fixed regression where browsers which actually support `position: fixed`
    were also getting the fallback implementation to emulate fixed position,
    causing the mask node to be repositioned incorrectly. [Ticket #2532136]

3.5.0
-----

  * Initialization logic will now always run, even when a widget is constructed
    with `{modal: false}`; previously the initialization logic did not run in
    this case. [Ticket #2531401]

  * Fixed destruction lifecycle bug. The mask is now removed when no modal
    widgets are visible on the page. This also fixed an issue with multiple
    modal widget and their `visible` attribute.
    [Ticket #2531484, #2531821, #2531812]

  * Moved mask-related styles/skins out of Panel and into WidgetModality.

3.4.1
-----

  * Fixed focus-contention issues which caused infinite recursion when multiple
    modal Panels were visible on the page at the same time. [Ticket #2530953]

  * It is now possible to instantiate a Widget that uses the WidgetModality
    extension without needing to pass in a configuration Object.
    [Contributed by Jakub Kuźma] [Ticket #2531086]

  * Replaced references to `document` with `Y.config.doc`. [Ticket #2531220]

3.4.0
-----

  * Initial release.
