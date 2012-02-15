ValueChange Change History
==========================

3.5.0
-----

* Changed the name of the synthetic event to "valuechange" (all lowercase) for
  greater consistency with DOM event names. The older "valueChange" name will
  continue to be supported indefinitely, but for consistency I recommend
  switching to "valuechange".

* Slight performance improvements.


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
