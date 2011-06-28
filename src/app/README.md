App Framework
=============

The app framework provides simple MVC-like building blocks (models, model lists,
views, and controllers) for writing single-page JavaScript applications.

These building blocks can be used together or separately to create functionality
ranging in complexity from simple non-interactive views to rich, multiple-view
apps with URL-based routing, data binding, and full client-server
synchronization.

If you've used DocumentCloud's excellent Backbone.js framework, many of the
classes and APIs provided by the app framework will look familiar to you. There
are important differences, though, and the YUI app framework takes full
advantage of YUI's powerful component and event infrastructure under the hood.


Building Blocks
---------------

The app framework provides the following classes, which can be mixed and matched
in virtually any combination to meet your needs. For simple apps, you may find
that you only need a `View`, or perhaps a `View` and a `Model`. For complex
apps, you may want to use the full stack. It's entirely up to you.

The `Controller` class provides URL-based routing using HTML5 `pushState()` or
the location hash, making it easy to wire up route handlers for different
application states while providing full back/forward navigation support and
bookmarkable, shareable URLs.

The `Model` class provides a lightweight `Y.Attribute`-based data model with
APIs for getting, setting, validating, and syncing attribute values to a
persistence layer or server, as well as events for being notified of model
changes.

The `ModelList` class can contain an ordered list of `Model` instances (for
example, todo items in a todo list). It provides a convenient API for working
with a list of models and for adding to, removing from, and sorting the list.

Finally, the `View` class represents a logical piece of an application's user
interface, and is responsible for rendering content. A view instance can be
associated with a particular model instance to allow for refreshing whenever
the model changes. Views may also be nested if desired, or even used as
standalone components with no model associations.


Modules
-------

* `app`: Rollup module that includes all of the following modules. Use this
  module when you plan to use the full app framework stack.

* `controller`: Provides the `Y.Controller` class.

* `model`: Provides the `Y.Model` class.

* `model-list`: Provides the `Y.ModelList` class.

* `view`: Provides the `Y.View` class.


Examples
--------

See `tests/manual/todo.html` and the corresponding `todo.js` file for an
unskinned but functional example of a simple todo list app built using `Model`,
`ModelList`, and `View`.

Enhanced examples and full documentation will be provided in future preview
releases of YUI 3.4.0.
