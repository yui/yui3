AsyncQueue Change History
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

* Fixed an issue where the 'complete' event is not always fired if the queue
  is stopped. [Maxime Réty]

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

* Fixed an issue that triggered an extra execution of a callback.
  [Ticket #2528602] [Ticket #2531758] [Ticket #2531844]

* Fixed a bug in which the until condition of a callback was evaluated
  prematurely when the previous callback paused the queue.

* Fixed a bug in which the 'complete' event would not be fired if stop was
  called from inside a callback.

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

  * No changes.

3.4.1
-----

  * No changes.

3.4.0
-----

  * No changes.

3.3.0
-----

  * No changes.

3.2.0
-----

  * No changes.

3.1.1
-----

  * No changes.

3.1.0
-----

  * No changes.

3.0.0
-----

  * [!] `queue-base` is now part of `yui`.

  * [!] `queue-run` was renamed `async-queue` and both `async-queue` and
    `queue-promote` are now independent modules.

  * `AsyncQueue` defaults to asynchronous callback execution (again).

3.0.0beta1
------------

  * Overhaul. Broken into `queue-base`, `queue-promote`, and `queue-run`.

3.0.0pr2
---------

  * No changes.

3.0.0pr1
---------

  * Initial release.
