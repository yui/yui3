Single-page App Framework
=========================

The single-page app framework provides simple MVC-like building blocks (models,
model lists, views, and controllers) for writing single-page JavaScript
applications.


Building Blocks
---------------

The app framework provides the following classes, which can be mixed and matched
in virtually any combination to meet your needs. For simple apps, you may find
that you only need a `View`, or a `View` and a `Model`. For complex apps, you
may want to use the full stack. It's entirely up to you.

The `Controller` class provides URL-based (using HTML5 `pushState()` or the URL
hash) routing, making it easy to wire up route handlers for different
application states.

The `Model` class provides an attribute-based data layer that makes it easy to
bind to change events when one or more data attributes change and provides
APIs for getting, setting, and validating attribute values.

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

* `app`: Alias module that includes all of the following modules. Use this
  module when you plan to use the full app framework stack.

* `controller`: Provides the `Y.Controller` class.

* `model`: Provides the `Y.Model` class.

* `model-list`: Provides the `Y.ModelList` class.

* `view`: Provides the `Y.View` class.


Change History
--------------

### 3.4.0

* Initial release.
