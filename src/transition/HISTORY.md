Transition Change History
=========================

3.5.0
-----
  * No change.


3.4.1
-----
  * No change.

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

