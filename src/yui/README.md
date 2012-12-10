YUI Core
========

Provides core YUI functionality, including module registration and usage,
language/array/object utilities, browser detection, and dynamic loading of
script and css files.

The `yui` module is a rollup of `yui-base` (the core module registration and
sandbox system, plus utilities), and the following optional submodules:

  * `yui-base`: The Modules required to make YUI run
  * `loader`: Provides dynamic module loading.

`yui-base` contains:

  * `yui-core`: The Modules required to make YUI run
  * The module registration system (`YUI.add()` and `YUI().use()`).
  * Core YUI utilities such as `cached()`, `merge()` and `mix()`.
  * `Lang`: Language utilities, type checking, etc.
  * `Object`: Object manipulation and iteration utilities.
  * `Array`: Array manipulation and iteration utilities.
  * `get`: Provides dynamic loading of JavaScript and CSS
  * `yui-log`: Adds support for `Y.log()` and friends.
  * `yui-later`: An abstraction around `setTimeout` and `setInterval`.
  * `intl-base`: Provides dynamic loading of language packs.

`yui-core` contains:

  * The module registration system (`YUI.add()` and `YUI().use()`).
  * Core YUI utilities such as `cached()`, `merge()` and `mix()`.
  * `Lang`: Language utilities, type checking, etc.
  * `Object`: Object manipulation and iteration utilities.
  * `Array`: Array manipulation and iteration utilities.

**NOTE** As of 3.4.0PR2 yui-throttle is not in the core yui package, it's a standalone module.
