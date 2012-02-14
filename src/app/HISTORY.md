App Framework Change History
============================

3.5.0
-----

### App

* Initial release.

### Model

* [!] The `validate()` method is now asynchronous, and is expected to call a
  callback function on success or failure. Old-style synchronous `validate()`
  methods will still work, but are deprecated. [Ticket #2531218]

* Model now supports ad-hoc attributes, which means it's no longer necessary to
  subclass `Y.Model` and declare attributes ahead of time. The following is now
  perfectly valid, and will result in a model instance with "foo" and "bar"
  attributes:

          var model = new Y.Model({foo: 'foo', bar: 'bar'});

* `load()` now fires a `load` event after the operation completes successfully,
  or an `error` event on failure. The `load()` callback (if provided) will still
  be called in both cases. [Ticket #2531207]

* `save()` now fires a `save` event after the operation completes successfully,
  or an `error` event on failure. The `save()` callback (if provided) will still
  be called in both cases. [Ticket #2531207]

* Options passed to `set()` and `setAttrs()` are now correctly merged into the
  event facade of the `change` event. [Ticket #2531492]

* Model's `destroy` event is now fully preventable (previously it was possible
  for the model to be deleted even if the `destroy` event was prevented by a
  subscriber in the `on` phase).

### ModelList

* ModelList's `model` property is now set to `Y.Model` by default. Since
  `Y.Model` now supports ad-hoc attributes, this makes it much easier to create
  and populate a ModelList without doing any subclassing:

          var list = new Y.ModelList();

          list.add([
              {foo: 'bar'},
              {baz: 'quux'}
          ]);

* Added a `filter()` method that returns a filtered array of models or,
  optionally, a new ModelList containing the filtered models. [Ticket #2531250]

* Added a `create` event that fires when a model is created/updated via the
  `create()` method, but before that model has actually been saved and added to
  the list (and before the `add` method has fired). [Ticket #2531400]

* Added a `load` event that fires when models are loaded. [Ticket #2531399]

* Models' `id` attributes (if set) are now used to enforce uniqueness. If you
  attempt to add a model to the list that has the same id as another model in
  the list, an `error` event will be fired and the model will not be added.
  [Ticket #2531409]

* The `add()`, `remove()` and `reset()` methods now accept other ModelList
  instances in addition to models and arrays of models. For example, passing a
  ModelList to `add()` will add all the models in that list to this list as
  well. [Ticket #2531408]

* ModelList now allows you to add models to the list even if they were
  instantiated in another window or another YUI sandbox. [Ticket #2531543]

* ModelList subclasses can now override the protected `_compare()` method to
  customize the low-level comparison logic used for sorting. This makes it easy
  to do things like descending sort, multi-field sorting, etc. See the API docs
  for details.

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

* `"*"` can now be used to create a wildcard route that will match any path
  (previously it was necessary to use a regex to do this). Additionally, paths
  which contain a `"*"` (e.g., `"/users/*"`) act as a wildcard matching
  everything after it.

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

* Added a workaround for a nasty iOS 5 bug that destroys stored references to
  `window.location` when the page is restored from the page cache. We already
  had a workaround in place since this issue is present in desktop Safari as
  well, but the old workaround no longer does the trick in iOS 5.
  [Ticket #2531608]

### View

* [!] The `container`, `model`, and `modelList` properties are now attributes.
  Code that refers to the old properties, like `myView.model` and
  `myView.model = model`, must be updated to use the attribute syntax instead:
  `myView.get('model')` and `myView.set('model', model)`.

* [!] The `container` attribute now treats string values as CSS selectors.
  Previously, it assumed string values represented raw HTML. To get the same
  functionality as the old behavior, pass your HTML string through
  `Y.Node.create()` before passing it to `container`.

* [!] Destroying a view no longer also destroys the view's container node by
  default. To destroy a view's container node when destroying the view, pass
  `{remove: true}` to the view's `destroy()` method. [Ticket #2531689]

* View now supports ad-hoc attributes, which means it's no longer necessary to
  subclass `Y.View` and declare attributes ahead of time. The following is now
  perfectly valid, and will result in a view instance with "foo" and "bar"
  attributes:

          var view = new Y.View({foo: 'foo', bar: 'bar'});

* Added a `containerTemplate` property that contains an HTML template used to
  create a container node when one isn't specified. Defaults to "<div/>".

* When no `container` node is specified at instantiation time, the container
  won't be created until it's needed. `create()` is now only used to create a
  default container; it's never called when a custom container node is
  specified.

* Added a View extension, `Y.View.NodeMap`, that can be mixed into a `View`
  subclass to provide a static `getByNode()` method that returns the nearest
  View instance associated with a given Node (similar to `Widget.getByNode()`).


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
