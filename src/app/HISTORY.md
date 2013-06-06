App Framework Change History
============================

3.10.3
------

* No changes.

3.10.2
------

### Router

* Router now properly dispatches when using hash-based URLs and calling
  `replace()` without arguments; before it would throw an error. [#739]


3.10.1
------

* No changes.


3.10.0
------

### Model

* Fixed: The `options` object passed to Model's `setAttrs()` method was being
  modified. Now a shallow copy of this object is now created so that the
  `_transaction` property is added to the copy and not the passed-in object.
  [#598]


3.9.1
-----

### LazyModelList

* Fixed: Changing an attribute on a revived model did not update the
  corresponding property on the original object. [#528] [Ryan Grove]

* Fixed: Revived models didn't have the same `clientId` as the original object.
  [#530] [Ryan Grove]

### Router

* Added a more helpful error when a named route callback function doesn't exist.
  [#513] [Ryan Grove]


3.9.0
-----

### App

* Applied the same changes from CSS Grids to App Transitions to support changes
  in how Chrome 25 renders `word-spacing`.


3.8.1
-----

* No changes.


3.8.0
-----

### Router

* Decode URL-encoded path matches for Router's `req.params`. [Ticket #2532941]


3.7.3
-----

### App

* Add support for App Transitions in browsers which support native CSS3
  transitions without using vendor prefixes. This change means IE10 and Opera
  get view transitions.


3.7.2
-----

* No changes.


3.7.1
-----

* No changes.


3.7.0
-----

### App

* Added App.Content, an App extension that provides pjax-style content fetching
  and handling, making it seamless to use a mixture of server and client
  rendered views.

### Model

* Added custom response parsing to ModelSync.REST to make it easy for developers
  to gain access to the full `Y.io()` response object. Developers using
  ModelSync.REST can either assign the `parseIOResponse` property to `false` to
  gain access to the full `Y.io()` response object in their `parse()` method,
  or provide a custom implementation of the `parseIOResponse()` method.

* ModelSync.REST's `serialize()` method now receives the `action` which the
  `sync()` method was invoked with. [Ticket #2532625]

### ModelList

* You may now add models to a ModelList at instantiation time by providing an
  Object, array of Objects, Model instance, array of Model instances, or another
  ModelList instance in the `items` property of the config object passed to
  ModelList's constructor. This change also applies to LazyModelList.

### Router

* Added support for route-based middleware to Router. The `route()` method now
  accepts an arbitrary number of callbacks enabling more reuse of routing code.
  For people familiar with Express.js' route middleware, this behaves the same.
  [Ticket #2532620]

### View

* Log a warning when a handler function is not present when a view's `events`
  are being attached. [Ticket #2532326] [Jay Shirley, Jeff Pihach]


3.6.0
-----

### App

* Added static property: `Y.App.serverRouting`, which serves as the default
  value for the `serverRouting` attribute of all apps. [Ticket #2532319]

* Fixed issue with non-collapsing white space between views while transitioning.
  White space is now fully collapsed and prevents views from jumping after a
  cross-fade transition. [Ticket #2532298]

* Organized all CSS classes `Y.App` uses under a static `CLASS_NAMES` property.

* Moved `transitioning` CSS classname under `Y.App.CLASS_NAMES`.

### Model

* Added ModelSync.REST, an extension which provides a RESTful XHR `sync()`
  implementation that can be mixed into a Model or ModelList subclass.

### ModelList

* Added LazyModelList, a subclass of ModelList that manages a list of plain
  objects rather than a list of Model instances. This can be more efficient when
  working with large numbers of items. [Ryan Grove]

* The `add()` method now accepts an `index` option, which can be used to insert
  the specified model(s) at a specific index in the list. [Greg Hinch]

* The `each()` and `some()` methods now iterate over a copy of the list, so it's
  safe to remove a model during iteration. [Ticket #2531910]

* The `remove()` method now optionally accepts the index of a model to remove
  (or an array of indices). You no longer need to specify the actual model
  instance(s), although that's still supported as well.

* The `filter()` method now returns an instance of the subclass rather than
  ModelList itself when called with `options.asList` set to `true` on a subclass
  of ModelList. [Ryan Grove]

* Fixed an issue where a list that received bubbled events from a model would
  assume the model was in the list if its `id` changed, even if the model
  actually wasn't in the list and was merely bubbling events to the list.
  [Ticket #2532240]

### Router

* [!] Changed how hash-based paths interact with the URL's real path. The
  path-like hash fragments are now treated as a continuation of the URL's path
  when the router has been configured with a `root`. [Ticket #2532318]

* Fixed issue when multiple routers are on the page and one router is destroyed
  the remaining routers would stop dispatching. [Ticket #2532317]

* Fixed a multi-router issue where creating a router instance after a previous
  router's `save()`/`replace()` method was called would cause in infinite
  History replace loop. [Ticket #2532340]

* The `req` object passed to routes now has a `pendingRoutes` property that
  indicates the number of matching routes after the current route in the
  dispatch chain. [Steven Olmsted]

* Added a static `Y.Router.dispatch()` method which provides a mechanism to
  cause all active router instances to dispatch to their route handlers without
  needing to change the URL or fire the `history:change` or `hashchange` event.


3.5.1
-----

### App

* Added `render` and `update` options to the `showView()` method.
  [PR #100 Pat Cavit]

### Router

* Added a `removeQuery()` function that accepts a URL and returns it without a
  query string (if it had one). [Pat Cavit]

* Fixed `hasRoute()` failing to match routes with query params. [Pat Cavit]

* Fixed bad route regex generation if a placeholder was the last thing in the
  route. [Pat Cavit]

* Fixed generated route regexes matching hash/query params when they shouldn't
  have. [Pat Cavit]


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

* The `reset()` method now allows the caller-provided options object to override
  the `src` property that's passed on the event facade of the `reset` event.
  [Ticket #2531888]

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
