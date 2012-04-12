DataSource Change History
=========================

3.5.0
-----

  * No changes.


3.4.1
-----

  * No changes.


3.4.0
-----

### datasource-polling

  * `setInterval` fires first `sendRequest` in a 0ms `setTimout`, then
    subsequent calls after the configured timeout. [Ticket #2529182]

### datasource-function

  * success callbacks that throw an error no longer result in the `data` event
    being fired again. [Ticket #2529824]


3.3.0
-----

  * Un-anonymize `DataSource.IO` callback functions. [Ticket #2529466]


3.2.0
-----

  * Removed hardcoded `DataSource.IO` from `DataSourceJSONSchema`.

  * Added ability to cancel underlying IO and Get transactions.

  * Better `DataSource` error handling.

  * Added `ioConfig` Attribute to `DataSource.IO`.


3.1.1
-----

  * No changes.


3.1.0
-----

  * [!] `DataSource`'s `sendRequest()` argument signature has changed in a
    non-backward-compatible way. It now accepts a single object containing the
    properties `request`, `callback`, and `cfg`.

  * `DataSource.Get` bug fixed where it was trying to delete the proxy callback
    in the wrong location during cleanup.

  * Changed from array of proxy callbacks to object with guid keys to support
    services that don't properly handle array indexes in the callback parameter
    (Twitter).

  * Code reorganized (API and functionality unaffected).


3.0.0
-----

  * `DataSource.IO` now passes request value to IO.

  * `DataSource.Function` now catches exception and fires error event.


3.0.0beta1
------------

  * Initial release.
