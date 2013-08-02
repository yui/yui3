Button Change History
====================

@VERSION@
------

* `ButtonGroup.disable()` will disable each child button (or input, see `getButtons()`)
* Added type ATTR to ButtonCore to enable Button nodes to be rendered with "type" attribute
  The default `type` for `<button>`s `submit`, which is not always desired, especially for ToggleButton.
  * `Button` now supports `submit` (backwards-compatible default), `button` and `reset`
  * `ToggleButton` is always rendered with `type="button"`

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

 * Fixed issue where disabled button widgets are still clickable (#2532775)

3.8.1
-----

* Documentation updates.
* Linting cleanup.

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
  * #2532458 - ButtonGroup properly handles nested labels.

3.5.1
-----

  * No changes.

3.5.0
-----

  * Initial Release
