ValueChange Change History
==========================

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

* Updated ValueChange to support `<select>` and `[contenteditable="true"]`
  elements as well. ([#1184][])

[#1184]: https://github.com/yui/yui3/issues/1184

3.12.0
------

* No changes.

3.11.0
------

* Added support for `stopPropagation()` and `stopImmediatePropagation()` on the
  `valuechange` event facade. [Wei Wang]

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

* Changed the name of the synthetic event to "valuechange" (all lowercase) for
  greater consistency with DOM event names. The older "valueChange" name will
  continue to be supported indefinitely, but for consistency I recommend
  switching to "valuechange".

* Added support for delegated valuechange events. You can now use `delegate()`
  to attach a valuechange event to a container node and be notified of changes
  to any descendant that matches the specified delegation filter.

* The valuechange event facade now includes `currentTarget` and `target`
  properties like a good little synthetic event.


3.4.1
-----

* No changes.


3.4.0
-----

* No changes.


3.3.0
-----

* Focus is now used (in addition to keyboard and mouse events) as a sign that
  we should begin polling for value changes. [Ticket #2529294]

* If the value changes while an element is not focused, that change will no
  longer be reported the next time polling is started (since it couldn't have
  been user input).


3.2.0
-----

* Module renamed to `event-valuechange` and refactored to be a true synthetic
  event.

* The `value` and `oldValue` event facade properties were renamed to `newVal`
  and `prevVal` respectively, for consistency with other change event facades
  throughout the library.

* Performance improvements.


3.1.2
-----

* No changes.


3.1.1
-----

* No changes.


3.1.0
-----

* Initial release as `value-change`.
