Pjax Change History
===================

3.7.0
-----

* Added `Y.Pjax.defaultRoute`, a static stack of middleware which forms the
  default Pjax route. This is useful when overriding Pjax's default `"*"` route
  by adding adding more specific route paths, or performing some operation after
  the default behavior.

* Added the `loadContent()` method which is route middleware which loads content
  from a server. This can be used with custom Pjax implementations which need to
  have more control over how content is updated in the DOM.

* Extracted `Y.PjaxContent` from `Y.Pjax`. Pulling out the content-handling
  functionality allows it to be used by other components, like `Y.App`.
  [Ticket #2532487]


3.6.0
-----

* Fixed issue where pjax would try to navigate from clicks on elements which
  were not anchors or the anchor's `href` was a URL from a different origin than
  the current page. [Ticket #2531943]


3.5.1
-----

* No changes.


3.5.0
-----

* Initial release.
