[App Framework][app]
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


Modules
-------

* [`app`][app]: Rollup module that includes all of the following modules. Use
  this module when you plan to use the full app framework stack.

* [`controller`][controller]: Provides the `Y.Controller` class.

* [`model`][model]: Provides the `Y.Model` class.

* [`model-list`][model-list]: Provides the `Y.ModelList` class.

* [`view`][view]: Provides the `Y.View` class.

[app]: http://yuilibrary.com/yui/docs/app/
[controller]: http://yuilibrary.com/yui/docs/controller/index.html
[model]: http://yuilibrary.com/yui/docs/model/index.html
[model-list]: http://yuilibrary.com/yui/docs/model-list/
[view]: http://yuilibrary.com/yui/docs/view/
