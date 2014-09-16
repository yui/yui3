Transition Change History
=========================

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

* Fixed issue where `toggleView` did not correctly work when passed only an effect name. ([#1258][] @ezequiel)

[#1258]: https://github.com/yui/yui3/issues/1258

3.13.0
------

* Added optional flag to NodeList.transition which, if true, fires the callback only once at the end of the NodeList transitions. ([#880][] @Perturbatio)

[#880]: https://github.com/yui/yui3/issues/880

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

* Fixed `transitionend` event issues in Android 4.1 which claims it supports
  non-prefixed transition properties, when it doesn't.

* `transform` prefix is now handled separately from `transition` prefix.

3.8.1
-----

* PR #398 Fix show, hide and toggleView methods in transition module [prajwalit]

3.8.0
-----

  * No changes.

3.7.3
-----

  * Add support for non-vendor-prefixed syle and CSS properties. `Y.Transition`
    now supports IE10 and Opera.

  * Transition durations are now normalized from seconds to milliseconds before
    updating the node's style. **Note:** This does _not_ affect the public API
    which still uses second-based duration times.


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

  * No changes.


3.4.1
-----

  * No changes.


3.4.0
-----

  * The transition module now conditionally loads transition-timer as needed.

  * Native transitions are now used when possible for Firefox.


3.3.0
-----

  * Removed transition events in favor of config/callback.

  * Added workaround for webkit transition issue with "auto" values.
    [Ticket 2529354]

  * Bug fix: Added workaround for Native callbacks failing to fire when
    transitioning to current value. [Ticket 2529397]

  * Bug fix: Timer-based were throwing errors if the node is removed AND
    destroyed. [Ticket 2529519]


3.2.0
-----

  * Initial release.
