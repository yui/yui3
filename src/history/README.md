History Utility
===============

Provides browser history management functionality using a simple
add/get/replace paradigm. This can be used to ensure that the browser's back
and forward buttons work as the user expects and to provide bookmarkable
URLs that return the user to the current application state, even in an Ajax
application that doesn't perform full-page refreshes.

The following modules are available:

  * `history`: Rollup of `history-base`, `history-hash`, `history-hash-ie`, and
    `history-html5`.
  * `history-base`: Generic history management API (but no storage layer).
  * `history-hash`: History management using `window.location.hash`.
  * `history-hash-ie`: Adds IE6/7 back/forward support using an iframe hack.
  * `history-html5`: History management using the HTML5 history API.

When using the `history` rollup module, or when the `history-hash` and
`history-html5` modules are both loaded, `Y.History` will be an alias to the
best adapter supported by the current browser, which may be either
`Y.HistoryHash` or `Y.HistoryHTML5`. Preference is given to `Y.HistoryHTML5` if
the browser supports the HTML5 history API.
