History Change History
======================

3.5.0
-----

* Added a workaround for a nasty iOS 5 bug that destroys stored references to
  `window.location` when the page is restored from the page cache. We already
  had a workaround in place since this issue is present in desktop Safari as
  well, but the old workaround no longer does the trick in iOS 5.
  [Ticket #2531608]

* Bug fix: HTML5 history is no longer used by default in Android <2.4, even if
  feature detection shows it's available. It's just too broken.
  [Ticket #2531670]


3.4.1
-----

* No changes.


3.4.0
-----

* [!] The `history-deprecated` module, which was deprecated in YUI 3.2.0, has
  been removed from the library.

* HistoryHTML5 now uses the new `window.history.state` property (which
  showed up in Firefox 4 and the HTML5 spec after YUI 3.3.0 was released) to
  get the current HTML5 history state.

* Removed the `enableSessionStorage` config option that was previously used to
  work around the lack of an HTML5 API for getting the current state.

* Added a `force` config parameter to History constructors. If set to `true`,
  a `history:change` event will be fired whenever the URL changes, even if
  there is no associated state change.

* Bug fix: On a page with a `<base>` element, replacing a hash-based history
  state resulted in a broken URL. [Contributed by Ben Joffe] [Ticket #2530305]

* Bug fix: In IE6 and IE7, navigating to a page with a hash state could result
  in endlessly repeating `history:change` events. [Ticket #2529990]

* Bug fix: In IE6 and IE7, replacing a history state would actually result in
  a new history entry being added. [Ticket #2530301]


3.3.0
-----


* Bug fix: Setting an improperly encoded hash value outside of HistoryHash
  resulted in two history entries being created. [Ticket #2529399]

* Bug fix: Changes to the URL hash (as opposed to the iframe hash) are now
  reflected in the history state in IE6 and IE7. [Ticket #2529400]


3.2.0
-----

* [!] The pre-3.2.0 Browser History Utility has been deprecated, and its
  module has been renamed to `history-deprecated`. It will be removed
  completely in a future release.

* Initial release of the new History Utility.
