Pjax Change History
===================

3.6.0
-----

* Fixed issue where pjax would try to navigate from clicks on elements which
  were not anchors or the anchor's `href` was a URL from a different origin than
  the current page. [Ticket #2531943]

* Extracted `Y.PjaxContent` from `Y.Pjax`. Pulling out the content-handling
  functionality allows it to be used by other components, like `Y.App`.
  [Ticket #2532487]

3.5.1
-----

* No changes.

3.5.0
-----

* Initial release.
