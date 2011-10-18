App Framework Change History
============================

3.5.0
-----

### ModelList

* Added a `filter()` method that returns a filtered array of models. [Ticket
  #2531250]

### Router (formerly Controller)

* [!] The `Controller` class and `controller` module have been renamed to
  `Router` and `router` respectively. The old names are deprecated, but have
  been retained as aliases for backwards compatibility. They will be removed
  in a future version of YUI.

* [!] The `html5`, `root`, and `routes` properties are now attributes, and
  `routes` may be set both during and after init. Code that refers to the old
  properties, like `myController.root` and `myController.root = '/foo'`, must be
  updated to use the attribute syntax instead: `myController.get('root')` and
  `myController.set('root', '/foo')`.

* [!] The signature for route handlers has changed. Route handlers now receive
  three arguments: `req`, `res`, and `next`. To preserve backcompat, `res` is a
  function that, when executed, calls `next()`. This behavior is deprecated and
  will be removed in a future version of YUI, so please update your route
  handlers to expect `next` as the third param.

* "*" can now be used to create a wildcard route that will match any path
  (previously it was necessary to use a regex to do this).

* The `hasRoute()` method now accepts full URLs as well as paths.

* When multiple Controller instances exist on a page, calling `save()` in one
  will now cause matching routes to be dispatched in all controllers, rather
  than only the controller that was the source of the change.

* Added `url` and `src` properties to the request object that's passed to route
  handlers.

* Made the `html5` config attribute writable. This allows you to force a
  controller to use (`true`) or not use (`false`) HTML5 history. Please don't
  set it to `false` unless you understand the consequences.


3.4.1
-----

### Controller

* Added a workaround for an iOS 4 bug that causes the previous URL to be
  displayed in the location bar after calling `save()` or `replace()` with a
  new URL.

* Fixed a bug that caused the controller to get stuck in a "dispatching" state
  if `save()` was called with no routes defined.

### Model

* The `validate()` method is now only called when `save()` is called, rather
  than on every attribute change. If validation fails, the save operation will
  be aborted.


3.4.0
-----

* Initial release.
