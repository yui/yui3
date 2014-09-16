Slider Change History
=====================

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

  * `new Y.Slider({ disabled: true })` now locks thumb [#2532100]

3.5.1
-----

  * No Changes.

3.5.1
-----

  * No changes.

3.5.0
-----

  * Added ARIA roles and states [#2528788]
  * Added keyboard support. Arrows, pageUp/Down, home/end [#2528788]
  * Fixed a bug where set('value', x) could be ignored if the max - min was
    less than the configured length. [#2531498]
  * Added click on thumb or clickable rail gives the thumb focus, allowing
    keyboard access. [#2531569]

3.4.1
-----

  * No changes.

3.4.0
-----

  * No changes.

3.3.0
-----

  * Default `thumbUrl` no longer broken when using the seed file from the combo
    service.

3.2.0
-----

  * Leverages touch events when the UA supports them.

  * (un)Swapped skin files for `audio` and `audio-light` skins.

3.1.1
-----

  * No changes.

3.1.0
-----

  * [!] Major refactoring. Broken into `SliderBase`, `ClickableRail`, and
    `SliderValueRange` classes, and `Y.Slider` is the product of
    `Y.Base.build(…)` of these. `SliderBase` is responsible for rendering the UI
    and broadcasting `slideStart`, `slideEnd`, and `thumbMove` events.
    `ClickableRail` adds support for clicking on the `rail` to move the `thumb`.
    `SliderValueRange` adds support for `min`, `max`, and `value` attributes.
    Values are integers ranging from 0 to 100 by default. `Base.build()` in
    different value algorithms or extensions to specialize from `SliderBase`.

  * [!] `railSize` attribute renamed to `length`.

  * [!] `maxGutter` and `minGutter` attributes removed. Use CSS and/or apply
    manually via `slider._dd.con.set('gutter', …);`.

  * [!] `rail`, `thumb`, `thumbImg` `Node` attributes removed, as well as
    `HTML_PARSER` support. Progressive enhancement stems from a value source,
    not a markup source. Various progressive enhancement extensions will arrive
    in future versions.

  * Sam skin updated and 7 new skins added (`sam-dark`, `round`, `round-dark`,
    `capsule`, `capsule-dark`, `audio`, `audio-light`).

  * New markup and CSS structure including separate shadow image (set to same
    image as thumb, positioned via CSS ala sprite.

  * Thumb placement method changed from `setXY()` and `DD` positioning methods
    to simpler `setStyle('left', x)` or `top` for vertical Sliders. Allows
    rendering and modifying in hidden containers without the need to `syncUI()`
    when making visible. Still recommended to call `syncUI()` if rendered off
    DOM, but may not be necessary if using Sam skin. YMMV.

3.0.0
-----

  * Removed noop `_setValueFn()` and the setter config for the `value`
    attribute.

  * Renamed static protected `AXIS_KEYS` to `_AXIS_KEYS`.

  * Renamed `_defUpdateValueFromDD` to `_defThumbDragFn` per naming conventions.

  * Added `_convertOffsetToValue` to mirror `_convertValueToOffset`.

3.0.0beta1
----------

  * Renamed the `valueSet` custom event to `positionThumb` and rejiggered the
    logic of the default function and support methods.

  * renamed `_defSyncUI` to `_defSyncFn` for library nomenclature consistency.

  * Added protected `_convertValueToOffset` to help position the thumb.

  * Set `bubble: false` on the `DD.Drag` instance.

3.0.0pr2
--------

  * Initial release.
