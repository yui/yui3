YUI Loader Change History
=========================

3.17.2
------

* Fix a bug in 3.17.1 where there comboBase was no longer inherited from the default group. ([#1837][]: @andrewnicols)

3.17.1
------

* Fix a bug in 3.17 which caused certain YUI modules to be loaded with a group
  `comboBase`.

3.17.0
------

* Add support for optional dependencies. These dependencies are conditionally
  loaded but each dependency is responsible for determining the result of the
  test, the opposite of `condition`. Example:

```js
  YUI({
    modules: {
      foo: {
        test: function (Y) {
          return true;
        }
      },
      bar: {
        optionalRequires: ['foo']
      }
    }
  }).use('bar', ...);
```

3.16.0
------

* regresion: expanding trigger with aliases. ([#1768][]: @caridy)

[#1768]: https://github.com/yui/yui3/pull/1581

* Optimization of the Loader's constructor by removing _populateCache() in  in favor of an on-demand process to create internal module info based on the raw meta when the module is needed and called thru `getModuleInfo()`. ([#1581][]: @caridy)

[#1581]: https://github.com/yui/yui3/pull/1581

* Removal of  `onCSS` documentation, as it was never implemented. ([#1743][]: @ezequiel)

* Fixed an issue where a module's `lang` packs were not being included before the module itself. ([#1743][]: @ezequiel)

* Fixed an issue where conditionally loading a module using `before` did not work. ([#1743][]: @ezequiel)

* Fixed an issue where a `CSS` module could not require a `js` module. ([#1743][]: @ezequiel)

[#1743]: https://github.com/yui/yui3/pull/1743

3.15.0
------

* Optimization of the `calculate` method, which now utilizes a topological sort (a variation of a depth first search) to generate a valid dependency order. ([#1606][]: @ezequiel)

[#1606]: https://github.com/yui/yui3/pull/1606

3.14.1
------

* No changes.

3.14.0
------

* No changes.

3.13.0
------

* No changes.

3.12.0
------

* No changes.

3.11.0
------

* No changes.

3.10.3
------

* No changes.

3.10.2
------

* No changes.

3.10.1
------

* No changes.

3.10.0
------

* Removed the default `build` directories from Loader generated combo URL's

3.9.1
-----

* No changes.

3.9.0
-----

* Fixed gallery update method for override group configs
* Fixed #2533138, added a missing `hasOwnProperty` check in `Loader.resolve` to help harden the config processing

3.8.1
-----

* No changes.

3.8.0
-----

* No changes

3.7.3
-----

* No changes

3.7.2
-----

* 2532764 - fetchCSS in yui loader not working.
* 2532773 - Duplicate CSS modules are being loaded

3.7.1
-----

* Rebuild with shifter for meta-data encoding issues

3.7.0
-----

* Loader changes for pr2 create infinite loop on server-side builds
* Y.Intl.get('module') is not requesting local resource files.

3.6.0
-----

* 2531640 Configuring the loader for modules that ship with only the root bundle.
* 2532070 Loader may calculate incorrect css file paths for different skins
* 2532076 Combo Loader broken in 3.5.0pr4
* 2532089 Allow for cascading module requirements
* 2532168 YUI config does not properly override skins
* 2532173 loader docs specify incorrect maxlengthurl
* 2532236 Performance problems on YUI().use  on FF3.6 and IE8
* 2532370 Loader loads language files for custom modules from YUI CDN
* 2532385 loader.calculate({ignoreRegistered:true}) still pulls in dependencies from a previous run of loader....
* 2532423 Skin override loads 2 stylesheets: sam and the custom one
* 2532498 Loader does not always use of configFn
* 2532268 Intl.get doesn't load language modules for non-yui modules defined in a group with configFn


3.5.1
-----

  * No changes.

3.5.0
-----

The biggest change made was the use of the `async` flag on `Y.Get` requests. Loader will now use the
`Y.Loader.resolve()` method under the hood to calculate all the dependencies that it is aware of, then
build the URL's to complete this request. It will then batch those into one `Y.Get` transation and fetch
all of them asynchronously, then return to loader for post processing of the injected dependencies.

   * 2529521 Consider making the presence of YUI CSS detectable by the loader
   * 2530135 Add support for loading YUI modules in parallel in all browsers, since execution order is unimportan...
   * 2530177 [Pull Request] - Bug #2530111  If the condition block is defined w/o a test fn or UA check, assume i...
   * 2530343 Loader.sorted does not contain conditional modules
   * 2530565 Slider one-off skins not being loaded
   * 2530958 Loader.resolve not properly handling CSS modules
   * 2531319 The aliased modules are reported as missing
   * 2531324 Support regular expressions in the patterns configuration
   * 2531281 specify ID when injecting CSS via loader
   * 2530077 'force' ignored for on-page modules unless 'allowRollup' is true
   * 2531150 Update Dynamic Loader example
   * 2531433 Improve the syntax for setting a skin in the YUI.use() statement
   * 2531451 Loading of lang modules doesn't go through configFn in loader
   * 2531590 addModule does not update the global cache so dynamically added skins modules can get lost
   * 2531626 maxURLlength configuration on a per group basis
   * 2531637 Configurable 'comboSep' for groups
   * 2531646 "undefined" error
   * 2531697 Loading a CSS module without specifying 'type=css' will throw a syntax error
   * 2531587 Loader will not load custom modules if combine: true

3.4.1
-----

  * No changes.

3.4.0
-----

   * Added Alias support and flattened the module structure.
   * Alias support: When asking for: "dd"
        Loader actually asks for: "dd-ddm-base,dd-ddm,dd-ddm-drop,dd-drag,dd-proxy,dd-constrain,dd-drop,dd-scroll,dd-drop-plugin"
   * Better RLS support

3.3.0
-----

   * 'when' config for conditional modules (before, after, or instead).

3.2.0
-----

   * Conditional module support based on user agent detection or test function.
   * Added gallery css support
   * performance optimizations, cached yui metadata, shared instances, etc

3.1.1
-----

  * Fixed ticket #2528771 : Loader has incorrect default for "base" - uses Y.Env, instead of Y.Env.base
  * Fixed ticket #2528784 : Regression requesting language packs using Y.use("lang/datatype-date_xx", fn) in build yui3-2029

3.1.0
-----

  * Added a 'patterns' property.  Modules that are not predefined will be created with the
    default values if it matches one of the patterns defined for the instance.
  * Added module groups.  This allows for specifying the base path and the combo properties
    for a group of modules.  The combo support now allows for multiple combo domains.
  * Handles simultaneous bootstrapping and loading better.
  * Added support for dynamically loading language packs along with modules that have them.
  * Intrinsic support for loading yui3-gallery modules.
  * Intrinsic support for loading yui2 modules via the 2in3 project.
  * Submodule breakdown to allow use of loader without all of the YUI3 metadata.
  * Metadata is managed per component instead of centrally.
  * Extremely long combo urls are split into multiple requests.
  * Loader defends itself against metadata that creates circular dependencies.

3.0.0
-----

  * Extracted from the YUI seed.  Now fetched dynamically if
    there are missing dependencies if not included.
  * Reads metadata from on-page modules registered via Y.add if the module is not already known.
  * Many new modules, many modules reorganized, dependency information has been tuned.
