[App Framework][app]
====================

The app framework provides simple MVC-like building blocks (models, model lists,
views, view-controllers, and URL-based routing) for writing single-page
JavaScript applications.

These building blocks can be used together or separately to create functionality
ranging in complexity from simple non-interactive views to rich, multiple-view
apps with URL-based routing, data binding, and full client-server
synchronization.

If you've used DocumentCloud's excellent Backbone.js framework, many of the
classes and APIs provided by the app framework will look familiar to you. There
are important differences, though, and the YUI app framework takes full
advantage of YUI's powerful component and event infrastructure under the hood.


Modules
-------

* [`app`][app]: Rollup module that includes all of the following modules. Use
  this module when you plan to use the full app framework stack.

* [`app-base`][app-base]: Provides the `Y.App` class.

* [`model`][model]: Provides the `Y.Model` class.

* [`model-list`][model-list]: Provides the `Y.ModelList` class.

* [`router`][router]: Provides the `Y.Router` class.

* [`view`][view]: Provides the `Y.View` class.

[app]:        http://yuilibrary.com/yui/docs/app/
[app-base]:   http://yuilibrary.com/yui/docs/app/#app-component
[model]:      http://yuilibrary.com/yui/docs/model/
[model-list]: http://yuilibrary.com/yui/docs/model-list/
[router]:     http://yuilibrary.com/yui/docs/router/
[view]:       http://yuilibrary.com/yui/docs/view/
