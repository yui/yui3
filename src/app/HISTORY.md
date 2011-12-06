App Framework Change History
============================

3.5.0
-----

### Model

* [!] The `validate()` method is now asynchronous, and is expected to call a
  callback function on success or failure. Old-style synchronous `validate()`
  methods will still work, but are deprecated. [Ticket #2531218]

* `load()` now fires a `load` event after the operation completes successfully,
  or an `error` event on failure. The `load()` callback (if provided) will still
  be called in both cases. [Ticket #2531207]

* `save()` now fires a `save` event after the operation completes successfully,
  or an `error` event on failure. The `save()` callback (if provided) will still
  be called in both cases. [Ticket #2531207]

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
  updated to use the attribute syntax instead: `myRouter.get('root')` and
  `myRouter.set('root', '/foo')`.

* [!] The signature for route handlers has changed. Route handlers now receive
  three arguments: `req`, `res`, and `next`. To preserve backcompat, `res` is a
  function that, when executed, calls `next()`. This behavior is deprecated and
  will be removed in a future version of YUI, so please update your route
  handlers to expect `next` as the third param.

* "*" can now be used to create a wildcard route that will match any path
  (previously it was necessary to use a regex to do this).

* The `hasRoute()` method now accepts full URLs as well as paths.

* The hashes used when `html5` is `false` are now root-less; the router's `root`
  is removed from the hash before it is set on the URL.

* When multiple Router instances exist on a page, calling `save()` in one will
  now cause matching routes to be dispatched in all routers, rather than only
  the router that was the source of the change.

* Added `url` and `src` properties to the request object that's passed to route
  handlers.

* Made the `html5` config attribute writable. This allows you to force a router
  to use (`true`) or not use (`false`) HTML5 history. Please don't set it to
  `false` unless you understand the consequences.

### View

* [!] The `container`, `model`, and `modelList` properties are now attributes.
  Code that refers to the old properties, like `myView.model` and
  `myView.model = model`, must be updated to use the attribute syntax instead:
  `myView.get('model')` and `myView.set('model', model)`.

* [!] The `container` attribute now treats string values as CSS selectors.
  Previously, it assumed string values represented raw HTML. To get the same
  functionality as the old behavior, pass your HTML string through
  `Y.Node.create()` before passing it to `container`.


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
