Anim Change History
===================

3.4.1
-----
  * no change


3.4.0
-----
  * no change


3.3.0
-----

  * Bug fix: A glitch occurred when an reversing a previously reversed
    animation. [Ticket 2528581]


3.2.0
-----

  * Bug fix: Better cleanup on destroy. [Ticket 2528820]
  * Bug fix: Was not resuming properly from pause. [Ticket 2528938]


3.1.1
-----
  * no change


3.1.0
-----
  * Now firing the resume event.
  * Added a boolean arg for stop() to force it to skip to the last frame.


3.0.0
-----
  * Initial release.



App Framework Change History
============================

3.4.1
-----

* Controller: Added a workaround for an iOS 4 bug that causes the previous URL
  to be displayed in the location bar after calling `save()` or `replace()` with
  a new URL.

* Controller: Fixed a bug that caused the controller to get stuck in a
  "dispatching" state if `save()` was called with no routes defined.

* Model: The `validate()` method is now only called when `save()` is called,
  rather than on every attribute change. If validation fails, the save operation
  will be aborted.


3.4.0
-----

* Initial release.



ArraySort Change History
========================

3.4.1
-----

  * No changes.

3.4.0
-----

  * No changes.

3.3.0
-----

  * Initial release.



AsyncQueue Change History
=========================

3.4.1
-----

  * No changes.

3.4.0
-----

  * No changes.

3.3.0
-----

  * No changes.

3.2.0
-----

  * No changes.

3.1.1
-----

  * No changes.

3.1.0
-----

  * No changes.

3.0.0
-----

  * [!] `queue-base` is now part of `yui`.
  
  * [!] `queue-run` was renamed `async-queue` and both `async-queue` and
    `queue-promote` are now independent modules.
    
  * `AsyncQueue` defaults to asynchronous callback execution (again).

3.0.0beta1
------------

  * Overhaul. Broken into `queue-base`, `queue-promote`, and `queue-run`.

3.0.0pr2
---------

  * No changes.

3.0.0pr1
---------

  * Initial release.



Attribute Change History
========================

3.4.1
-----

  * No changes.

3.4.0
-----

  * Added params to constructor, to support call to addAttrs on construction
    with user values, when augmenting and invoking constructor manually.
  
    Also broke out addAttrs logic on construction (introduced for Node),
    into it's own _initAttrs method to facilitate customization.

3.3.0
-----

  * Changed instanceof to Y.instanceOf, to prevent leaks in IE7

3.2.0
-----

  * Added protected helper method (_getAttrCfg) to return the configuration
    for a given attribute. 

3.1.1
-----

  * Fixed ticket #2528753 : Sub attribute value crashed after setting another 
    sub attribute. 

3.1.0
-----

  * writeOnce can be set to "initOnly", which can be used 
    to prevent the user from setting the value outside of the initial
    configuration when using the addAttrs. 

    When used with Base, this means that the user can only define a 
    value for the Attribute during construction.

  * Attribute change events are now published with the defaultTargetOnly 
    property set to true.

  * newVal property of event object passed to change event listeners will 
    now be the value returned from the Attribute's getter (if defined)

  * setter, getter, validator and valueFn can now be specified as 
    strings, referring to the method names to be invoked on the Attribute
    instance.

3.0.0
-----

  * set/get can now be called for ad-hoc attributes (attributes which 
    have not been added/configured).

  * Fixed issue where custom getters were being called with undefined values,
    for the initial set.

  * Limited the case for which an attribute will not notify after listeners, 
    if the value is unchanged after a set, to primitive values (values for 
    which Lang.isObject(newVal) returns false).

    This allows after listeners to be invoked, when resetting the value to 
    the same object reference, which has properties updated, or arrays with
    elements modified. 

  * Attribute broken up into attribute-base and attribute-complex submodules.

    attribute-complex adds support for complex attributes ({x.y.z : 5}) to
    addAttrs. 

3.0.0 beta 1
------------

  * Removed Attribute.CLONE support in the interests of simplicity.
    Was not being used. Can re-evaluate support if real world demand 
    for it exists. 

  * Changed "set" and "get" configuration properties for setter and 
    getter methods to "setter" and "getter" respectively.

  * Added support for setter to return Attribute.INVALID_VALUE
    to prevent attribute state from being changed. 

    This allows developers to combine setter and validator 
    functionality into one method if performance optimization 
    is required.

  * "validator" is now invoked before "setter".

  * Renamed xxxAtt and xxxAtts methods to xxxAttr, xxxAttrs for
    consistency.

  * "after" listeners are only notified if attribute value really
    changes (preVal !== newVal).

  * Extending classes can now overwrite ATTRS configuration properties 
    from super classes, including writeOnce and readOnly attributes.

    The ATTRS configurations are merged across the class hierarchy,
    before they are used to initialize the attributes.

  * addAttr now prevents re-adding attributes which are already 
    configured in order to maintain consistent state.

  * Event prefix wrapper functions (on, after etc.) removed - 
    Event.Target now accepts an event prefix configuration value
  
  * Added additional log messages to assist with debugging.

  * Attribute change events are no longer fired for initial set.

  * Split up State add/get/remove into add/addAll, get/getAll, 
    remove/removeAll to avoid having to create object literals for 
    critical path [ add/get single key values ].

  * Attribute getter, setter, validator now also receive attribute name 
    as the 2nd arg (val, name).

  * If Attributes initialized through addAttrs have a user provided value 
    which is not valid, the initial attribute value will revert to the 
    default value in the attribute configuration, if it exists.

  * reset() no longer resets readOnly or writeOnce attributes. Only 
    publically settable values are reset.

  * Added modifyAttr method, to allow component developer to modify 
    configuration of an attribute which has already been added. The set of 
    attribute configuration properties which can be modified after it 
    has been added are limited to getter, readOnly, writeOnce and broadcast.

  * Added support for lazy attribute configuration. Base uses this feature 
    to lazily intialize all Attributes on the first call to get/set, for 
    performance optimization. 

    lazyAdd:true/false can be used to over-ride this behavior for a 
    particular attribute. 

3.0.0PR2
--------

  * Added valueFn support, to allowing static 
    attribute values configuration to set instance
    based values.
  
  * Added reset method.

  * Added private setter for use by class implementation
    code to set readOnly, writeOnce values.

3.0.0PR1 - Initial release
--------------------------


AutoComplete Change History
===========================

3.4.1
-----

  * The "combobox" ARIA role is no longer automatically added to an
    AutoCompleteList input node. After consulting with the Y! Accessibility
    team, we felt that the combobox role doesn't accurately represent the
    out-of-the-box interactions that AutoCompleteList provides. Implementers can
    still apply this role (or any other ARIA role) to the input node manually if
    desired.

  * Fixed a bug that prevented the autocomplete list from being hidden after
    right-clicking on the list and then clicking elsewhere in the document.
    [Ticket #2531009]


3.4.0
-----

  * Added the ability to use a `<select>` node as a result source.

  * Function sources may now be either asynchronous or synchronous. Returning
    an array of results from a function source will cause it to be treated as
    synchronous (same as in 3.3.0). For async operation, don't return anything,
    and pass an array of results to the provided callback function when the
    results become available. [Ticket #2529974]

  * Added a `sourceType` attribute to `AutoCompleteBase`, which may be used to
    force a specific source type, overriding the automatic source type
    detection. [Ticket #2529974]

  * The `scrollIntoView` config option is now much smarter. It will only scroll
    if the selected result isn't fully visible. If the result is already
    entirely within the visible area of the viewport, no scrolling will occur.

  * A pre-existing `listNode` may now be specified at initialization time.

  * Added `subWordMatch` filters and highlighters. [Contributed by Tobias
    Schultze]

  * The `this` object now refers to the current AutoComplete instance instead of
    the window in list locators, text locators, filters, formatters,
    highlighters, and requestTemplate functions.

  * Added an `originEvent` property to the event facade of `select` events. It
    contains an event facade of the DOM event that triggered the selection if
    the selection was triggered by a DOM event.

  * Small performance improvement for filters operating on empty query strings.
    [Ticket #2529949]

  * Result list alignment is now updated both when results change and when
    the window is resized instead of only when the list becomes visible. This
    makes right-aligned lists with dynamic widths less awkward.

  * Fixed a bug that prevented CSS-based z-index values from taking effect on
    the AutoComplete list and required the z-index to be set via JS. The
    `.yui3-aclist` class now provides a default z-index of 1, and this can be
    overridden with custom CSS. Specifying a `zIndex` attribute value via JS
    no longer has any effect.

  * Fixed a bug that caused the IE6 iframe shim under the AutoComplete list to
    be sized incorrectly the first time the list was displayed.

  * Fixed a bug in which the `requestTemplate` would sometimes be used as the
    query instead of being appended to the source URL. This affected XHR and
    JSONP sources that used both a `{query}` placeholder in the source string
    and a custom `requestTemplate` value. [Ticket #2529895]

  * Fixed a bug that caused the `requestTemplate` function to be called twice
    for an XHR request instead of just once.

  * Fixed a bug in which JSONP, XHR, and YQL requests were cached solely based
    on the query rather than on the complete request. This could result in
    cache collisions when two requests with the same query but different
    parameters (provided by a requestTemplate) were made. [Ticket #2530410]

  * Fixed a bug that caused the `&` character to be treated as an up arrow
    key in Firefox. [Ticket #2530455]

  * Removed the "beta" label. Hooray!


3.3.0
-----

  * Initial release.



Base Change History
===================

3.4.1
-----

  * No changes.

3.4.0
-----

  * Base now destroys plugins before destroying itself

  * Base.create/mix extensions can now define initializer and 
    destructor prototype functions, which will get invoked after
    the initializer for the host class into which they are mixed and
    before it's destructor.

  * Use a hash version of whitelist mix for improved performance.
    Also removed non-required hasOwnProperty check and delete.

3.3.0
-----

  * Fixed Base.mix when used on a class created using Base.create

  * toString no longer inadvertently stamps the object, however,
    we now stamp Base objects in the constructor, to support
    use cases where the "toString" stamping was implicitly being
    relied upon (e.g. in DD, as hashkeys).

3.2.0
-----

  * Fixed Base.create to properly isolate ATTRS on extensions

3.1.1
-----	

  * No changes 

3.1.0
-----

  * As the final step in the destroy phase, Base now does a detachAll() to avoid invoking listeners 
    which may be waiting to be in an async. step which occurs after destruction.

  * "init" and "destroy" events are now published with the defaultTargetOnly property set to true

  * Added support for MyClass.EVENT_PREFIX to allow developers
    to define their own event prefix

  * Made "init" and "destroy" events fireOnce:true (along with
    "render" in Widget), so that subscriptions made after the 
    events are fired, are notified immediately.

  * Dynamic and non-dynamically built classes now have their 
    extensions instantiated the same way - during _initHierarchy.

  * Updated ATTRS handling for Base.build, so that ATTRS are 
    also aggregated at the attribute configuration object level, 
    allowing extensions to add to, or overwrite, attribute 
    configuration properties on the host.

  * Added sugar Base.create and Base.mix methods on top of 
    Base.build, to simplify the 2 main use cases: 

    1) Creating a completely new class which uses extensions.
    2) Mixing in extensions to an existing class.

  * Documented non-attribute on, after, bubbleTargets and plugins 
    property support in the Base constructor config argument 

3.0.0
-----

  * Fixed hasImpl method on built classes, to look up the class
    hierarchy for applied extensions.

  * Plugin.Host removed from base-base module and delivered as it's 
    own module - "pluginhost"

  * base broken up into..

     base-base: Provides class hierarchy support for ATTRS and 
     initialization

     base-build: Provides Extension support in the form of 
     Base.build

     base-pluginhost: Augments Plugin.Host to Base, adding plugin
     support

3.0.0 beta 1
------------

  * Config argument for init event now merged into the event facade, 
    instead of being passed separately (available as e.cfg).
  
  * Removed Base.create. On review, considered to be overkill.
    Users can easily create new instances, using Base.build

  * Moved PluginHost down from Widget to Base, since utils and 
    Node will also support Plugins.

  * PluginHost.plug and unplug now accept the plugin class as 
    arguments [plug(pluginClass, cfg) and unplug(pluginClass)].

  * Split base module up into base-base and base-build.

  * Added lazy attribute initialization support, to improve performance.
  
    This also removes order dependency when processing ATTRS for a 
    particular class.

    If a get/set call is made for an uninitialized attribute A, in the 
    getter/setter/validator or valueFns of another attribute B, A will 
    be intiailized on the fly. 

  * Added ability to subscribe to on/after events through the 
    constructor config object, e.g.:

      new MyBaseObject({ 
         on: {
            init: handlerFn,
            myAttrChange: handlerFn
	     },
	     after: {
	       init: handlerFn,
	       myAttrChange: handlerFn
	     },
	     ...
      });

  * Developers can now override the default clone behavior we use to
    isolate default ATTRS config values, using cloneDefaultValue, e.g.:

    ATTRS = {
      myAttr : {
      	value: AnObjectOrArrayReference
	    cloneDefaultValue: true|false|"deep"|"shallow"
      }
    }

    If the cloneDefaultValue property is not defined, Base will clone
    any Arrays or Object literals which are used as default values when
    configuring attributes for an instance, so that updates to instance 
    values do not modify the default value.

    This behavior can be over-ridden using the cloneDefaultValue property:

    true, deep: 

      Use Y.clone to protect the default value.

    shallow:

      Use Y.merge, to protect the default value.

    false:

      Don't clone Arrays or Object literals. The value is intended
      to be used by reference, for example, when it points to
      a utility object.

  * Base.plug and Base.unplug used to add static Plugins (default plugins
    for a class). Replaces static PLUGINS array, allowing subclasses to 
    easily unplug static plugins added higher up in the hierarchy.

  * Base adds all attributes lazily. This means attributes don't get
    initialized until the first call to get/set, speeding up construction
    of Base based objects.

    Attributes which have setters which set some other state in the object, 
    can configure the attribute to disable lazy initialization, by setting
    lazyAdd:false as part of their attribute configuration, so that the setter
    gets invoked during construction.

3.0.0PR1 - Initial release
--------------------------




Cache Change History
====================

3.4.1
-----

  * No changes.

3.4.0
-----

  * Added support to flush a specific request from the cache. [Pat Cavit]

3.3.0
-----

  * Wrap access to `win.localStorage` in try/catch in case it has been disabled.
    [Ticket #2529572]

3.2.0
-----

  * Added `cache-offline` submodule. The `cache` submodule is renamed to
    `cache-base` and the `cache` module is now a rollup.

  * The `Cache` class no longer extends `Plugin.Base`. `Cache` now extends
    `Base`, and `CacheOffline` extends `Cache`. Implementers who wish to use
    `Cache` as a plugin should use `Plugin.Cache` in the `cache-plugin`
    submodule.

  * Added `expires` Attribute to `Cache`. Cached entries now include `expires`
    and `cached` values.

3.1.1
-----

  * No changes.

3.1.0
-----

  * No changes.

3.0.0
-----

  * Initial release.



Calendar Change History
=======================

3.4.1 - Bug Fix Release
-----------------------

   * Calendar now supports Japanese language internationalization
   * Multiple calendars can now be used on the same page [Ticket #2530925]
   * When individual dates are clicked in Firefox, they are not text-selected [Ticket #2530754]
   * Multiple date selection now works correctly when it spans the Daylight Savings Time change date [Ticket #2530979]
   * A few documentation issues have been fixed [Tickets #2530929 and #2530930]

3.4.0 - Initial release
-----------------------



Charts Change History
=====================

3.4.1
-----

  * #2530109 Fixed issue in which the NumericAxis roundingMethod was not always being respected when a number was specified.
  * #2531100 Fixed issue in which the NumericAxis was not correctly calculating its data range when a minimum or maximum was explicitly set.
  * #2530127 Added originEvent, pageX and pageY properties to the event facade for marker and planar events.
  * #2530591 Added ability to accept custom series classes.
  * #2530592 Fixed errors resulting from empty series.
  * #2530810 Removed hard-coded class prefixes.
  * #2530908 Fixed issue in which the NumericAxis was not respecting explicitly set minimum and maximum values in some cases.
  * #2530969 Ensure underlying dom nodes of markers have unique ids.
  * #2530984 Fixed issue in which PieChart was not resizing properly.
  * #2531024 Fixed issue in which PieChart did not draw from center when width and height were not equal.
  * #2530985 Fixed issue in which PieChart failed to always render in MSIE 8.
  * #2531020 Fixed issue in which gridlines could be hidden by other elements.
  * #2531040 Fixed issue in which missing data broke stacked histograms.
  * #2531071 Fixed issue in which charts would not render if one of the series was empty.

3.4.0
-----

  * Charts only requires datatype-number and datatype-date instead of the datatype rollup. 
  * #2530413 Position axis labels with transform instead of css styles.   
  * #2530533 Fixed issue in which stacked bar/column displayed inaccurated data on mouseover when zero values appeared in the series.  
  * #2530404 Fix issue in which markers were incorrectly omitted from graphs.   
  * #2530395 SplineSeries extends LineSeries instead of CartesianSeries. 
  * #2529841 Add axis title.  
  * #2530143 Refactor to use Graphics API
  * #2530223 Fixed bug in which negative value markers were not displayed in column/bar series.
  * #2529849 Fixed styles documentation bug
  * #2530115 Fixed bug preventing tooltip's node from being overwritten.
  * #2529972 Fixed issue in which zero/null values were falsely creating markers in stacked bar and column series.
  * #2529926 Fixed issue in which null values were being treated as zero.
  * #2529925 Fixed bug in which dashed line was not drawn in combo and line series.
  * #2529926 Fixed issue in which null values in data provider are treated as 0.
  * #2529927 Addressed issue in which primitive value strings were not being parsed correctly in the TimeAxis.
  * #2529971 Force range on a NumericAxis when all values are zero.
  * #2529842 Ensure Numeric axis has at least on negative and positive tick when minimum is less than zero and maximum is greater than zero.
  * #2529840 Changed stacked bar and column series to handle cases in which the item value is at or rounded to zero.

3.3.0
-----

  * Initial release.



ClassName Manager Change History
================================

3.4.1
-----

  * No changes.

3.4.0
-----

  * No changes.

3.3.0
-----

  * No changes.

3.2.0
-----

  * No changes.

3.1.1
-----

  * No changes.

3.1.0
-----

  * IMPORTANT: Changed default prefix to "yui3-" to avoid collisions with yui2 code,
    which uses "yui-". Bundled CSS has also been updated.

  * getClassName can now be invoked with a boolean skipPrefix argument set to true to
    avoid adding the default prefix when creating the class name.

  * Whitespace is no longer replaced in the generated class name.

3.0.0
-----

  * No changes.

3.0.0 beta 1
------------

  * Now uses Y.cached
  * All white space is stripped from incoming arguments

3.0.0 PR2
---------

* Initial 3.0 revision



Collection Change History
=========================

3.4.1
-----

  * Sparse arrays are now handled correctly in the non-native fallback
    implementation of `Y.Array.lastIndexOf()`. [Ticket #2530966]


3.4.0
-----

  * Sparse arrays are now handled correctly in the non-native implementations of
    `Array.every`, `Array.filter`, `Array.find`, `Array.map`, and
    `Array.reduce`. [Ticket #2530376]


3.3.0
-----

  * [!] The `sort` parameter of `Array.unique` has been deprecated. It still
    works, but you're encouraged not to use it as it will be removed from a
    future version of YUI.
  * `Array.lastIndexOf` now supports the `fromIndex` parameter as specified in
    ES5.
  * Improved the performance of `Array.filter`, `Array.map`, `Array.reduce`, and
    `Array.unique`, especially in browsers without native ES5 array extras.


3.2.0
-----

  * No changes.


3.1.1
-----

  * No changes.


3.1.0
------

  * `array-extras` is the base submodule for the package.
  * Added `ArrayList` for generic iterable objects.
  * `Array.forEach` is an alias for `Array.each`.
  * Added `Array.invoke` to execute a named method on an array of objects.


3.0.0
-----

  * `unique` with `sort` works.


3.0.0b1
-------

  * Fixed load time fork assumptions.


3.0.0pr1
--------

  * Initial release.



Console Change History
======================

3.4.1
-----

  * No changes.

3.4.0
-----

  * CSS classes generated from the `style` attribute changed from, e.g.,
    `yui3-inline-console` to `yui3-console-inline`.

3.3.0
-----

  * No changes.

3.2.0
-----

  * No changes.

3.1.1
-----

  * No changes.

3.1.0
-----

  * CSS class references updated from `yui-*` to `yui3-*`.
  
  * Internal reorganization (API and functionality unaffected)

  * Fixed double escapement of `&` when used with ConsoleFilters and hiding and
    showing content with HTML entities.

  * Strings broken out into Intl. language resource bundles.
    English (en, default) and Spanish (es) supported.

3.0.0
-----

  * Added attribute `style` to allow `inline-block`, `block`, or `absolute`
    positioning.

  * Moved the hidden state CSS to the sam skin and increased rule specificity.

  * `printBuffer` no longer throws an error when called against an empty buffer.

  * Removed `label` property from normalized message object since it was just a
    copy of category.

  * Moved `collapsed` CSS class to the `boundingBox` and now `collapse()`
    resizes the `boundingBox` accordingly.

  * Added `useBrowserConsole` attribute as a pass through to the YUI config.
    Default to `false` so when a `Console` is instantiated, messages are
    redirected to `Console` rather than duplicated there.

  * `collapse()`, `expand()`, and `log()` are now chain-able.

3.0.0beta1
----------

  * `logSource` attribute added to configure listening for events from a
    specific target. Also useful for subscribing to all log events across
    multiple YUI instances.
  
  * Lowered `consoleLimit` default to 300.
  
  * `printLimit` attribute added to limit the number of entries from the buffer
    to output in a given `printBuffer()` call.

  * `printBuffer(max)` argument added to limit the number of entries to print in
    this cycle.

  * Changed from `setTimeout` to `setInterval` to chunk DOM output.

  * `logLevel` constants changed to strings and categories outside info, warn,
    and error are not treated as info.

  * CSS updates.

  * Support for `height` and `width` attribute configuration.

  * Changed `<input type="button">` to `<button type="button">`.

  * Added `collapse()`/`expand()`.

  * Entry addition and removal now occurs off DOM.

  * Entry removal checks that the target Node is present before removing it.

  * `Y.config.debug` explicitly set to false during print cycle to avoid
    infinite loops.

3.0.0pr2
--------

  * Initial release.



ConsoleFilters Plugin Change History
====================================

3.4.1
-----

  * No changes.

3.4.0
-----

  * No changes.

3.3.0
-----
    
  * No changes.

3.2.0
-----

  * No changes.

3.1.1
-----

  * No changes.

3.1.0
-----

  * Internal reorganization (API and functionality unaffected).

3.0.0
-----

  * Adding attribute `cacheLimit` to limit memory overrun from holding onto all
    log messages.

3.0.0beta1
-----------
    
  * Initial release.



Cookie Change History
=====================

3.4.1
-----

  * No changes.

3.4.0
-----

  * No changes.


3.3.0
-----

  * No changes.


3.2.0
-----

  * Introduced a private method for setting the document to use in tests.
  * Updated tests to run without setting cookies to `document.cookie`.


3.1.1
-----

  * No changes.


3.1.0
-----

  * No changes.


3.0.0
-----

  * No changes.


3.0.0b1
-------

  * Synchronized with the 2.x version of cookie:
    * Changes formatting of date from `toGMTString()` to `toUTCString()` (trac#
      2527892). 
    * Updated `remove()` so that it no longer modifies the options object that
      is passed in (trac# 2527838).
    * Changed behavior for Boolean cookies (those that don't contain an equals
      sign). Previously, calling `Cookie.get()` on a Boolean cookie would return
      the name of the cookie. Now, it returns an empty string. This is necessary
      because IE doesn't store an equals sign when the cookie value is empty
      ("info=" becomes just "info").
    * Added `Cookie.exists()` to allow for easier Boolean cookie detection.
    * Removed check for cookie value before parsing. Previously, parsing checked
      for `name=value`, now it parses anything that is passed in.
    * Removing the last subcookie with `removeSub()` now removes the cookie if the
      `removeIfEmpty` option is set to `true`. (trac# 2527954)
    * Added option to disable url encoding/decoding by passing `options.raw` to
      `set()` and `get()`. (trac# 2527953).
    * Changed `get()` to take an options object with `raw` and `converter`
      properties. If a function is passed instead of an object then it is used
      as the converter for backward compatibility (trac# 2527953).  


3.0.0pr2
--------

  * Synchronized with latest 2.x version of cookie.


3.0.0pr1
--------

  * Initial release.



CSS Base Change History
=======================

3.4.1
-----

  * Bug fix: Nested mixed list types were incorrectly styled. [Ticket 2530302]


3.4.0
-----

  * No code changes.


3.3.0
-----

  * No code changes.


3.2.0
-----

  * No code changes.


3.1.1
-----

  * No code changes.


3.1.0
-----

  * No code changes.
  

3.0.0
-----

  * Initial release.



CSS Fonts Change History
========================

3.4.1
-----
  * No change.


3.4.0
-----
  * No change.


3.3.0
-----
  * No change.


3.2.0
-----
  * No change.


3.1.1
-----
  * No change.


3.1.0
-----
  * No change.
  
3.0.0
-----
  * Initial release.
3.0.0PR1 - Initial release

Module Name: "cssfonts"
Documentation: http://developer.yahoo.com/yui/3/cssfonts

The foundational CSS Fonts provides cross-browser 
typographical normalization and control while still 
allowing users to choose and adjust their font size. 
Both Standards and Quirks modes are supported in A-grade browsers.



CSS Grids Change History
========================

3.4.1
-----

  * No change.


3.4.0
-----

  * No change.

  
3.3.0
-----

  * No change.


3.2.0
-----

  * [!] The pre-3.2.0 CSS Grids Utility has been deprecated, and its
    module has been renamed to `cssgrids-deprecated`. It will be removed
    completely in a future release.

  * Initial release of the new CSS Grids Utility.


3.1.1
-----

  * No change.


3.1.0
-----

  * No change.


3.0.0
-----

  * Initial release.

**** version 3.0.0 ***	
  * deprecated for YUI 3
  
**** version 3.0.0 beta 1 ***	
  * deprecated for YUI 3
  
**** version 3.0.0 PR2 ***

    * Added self-clearing for templates (e.g. div.yui-t1) for 
      cases when they are not within #bd. Per ticket 2201115
    * Corrected ordering issue for "gb" per internal ticket 
      2251219 and Sourceforge ticket 2131681
    * Enabled nesting of gf within gc per internal ticket 
      1458071 and Sourceforget ticket 1786723

3.0.0PR1 - Initial release

Module Name: "cssgrids"
Documentation: http://developer.yahoo.com/yui/3/cssgrids

The foundational CSS Grids offers four preset page widths, 
six preset two-column source-order-independent content 
templates, and the ability to stack and nest subdivided 
regions of two, three, or four columns. The file provides 
over 1000 page layout combinations. Other features include:

    * Supports fluid 100-percent layouts, fluid- and 
      fixed-width layouts at 750px, 950px, and 974px 
      centered, and the ability to easily customize the 
      width.
    * Flexible in response to user initiated font-size 
      adjustments.
    * Template columns are source-order independent; put
      your most important content earlier in your markup
      for improved accessibility and SEO.
    * Self-clearing footer. No matter which column is
      longer, the footer stays below the longest.
    * Accommodates IAB's Ad Unit Guidelines for common 
      ad dimensions.

*** NOTE: This module is deprecated. This functionality will be provided in a future release. 




CSS Reset Change History
========================

3.4.1
-----
  * Moved list-type to list declaration.


3.4.0
-----
  * No change.


3.3.0
-----
  * No change.


3.2.0
-----
  * No change.


3.1.1
-----
  * No change.


3.1.0
-----
  * No change.

3.0.0
-----
  * Initial release.




DataSchema Change History
=========================

3.4.1
-----

  * No changes.


3.4.0
-----

### `dataschema-json`
   * Added support to accept the results array as input, leaving
     `schema.resultListLocator` as optional.
   * Field locators that contain . or [???] now fail over to look for that
     locator as a single property name rather than a nested value. For example,
     a locator `"not.nested"` would look for `inputRecord.not.nested` for a
     value, but if it doesn't find one, it will look for
     `inputRecord["not.nested"]`.  If it finds a value there, it will not look
     for a nested value for subsequent records.
   * `getPath` is far more tolerant of locator strings.  In particular, it
     considered utf-8 characters that didn't match the `\w` regex group to be
     invalid.  This is fixed.
   

3.3.0
-----

   * Bug 2528429: Added support for locator property to DataSchema.JSON
     resultFields.
   * Known Android issues (bugs 2529621, 2529758, 2529775): XML parsing is buggy
     on the Android WebKit browser.


3.2.0
-----

   * Set custom parser execution scope to be DataSchema instance.


3.1.1
-----

  * No changes.


3.1.0
-----

   * Added support for nested schemas.
   * Added support for XPath resultListLocator, instead of requiring the use
     of 'getElementsByTagName'.
   * Improved support for DOM elements in DataSchema.XML when IE
     xmldoc.selectNodes(String) fails.
   * Field list is now optional for DataSchema.JSON.  If omitted, all response
     data is returned.
   * Fixed a bug in field resolution where null might be discovered along the
     resolution path.  Now exits gracefully rather than throwing an error.


3.0.0
-----

   * Support for DOM elements in DataSchema.XML.


3.0.0 beta 1
------------

   * Initial release.



DataSource Change History
=========================

3.4.1
-----

  * No changes.


3.4.0
-----

### datasource-polling

  * `setInterval` fires first `sendRequest` in a 0ms `setTimout`, then
    subsequent calls after the configured timeout. [Ticket #2529182]

### datasource-function

  * success callbacks that throw an error no longer result in the `data` event
    being fired again. [Ticket #2529824]


3.3.0
-----

  * Un-anonymize `DataSource.IO` callback functions. [Ticket #2529466]


3.2.0
-----

  * Removed hardcoded `DataSource.IO` from `DataSourceJSONSchema`.
  
  * Added ability to cancel underlying IO and Get transactions.
  
  * Better `DataSource` error handling.
  
  * Added `ioConfig` Attribute to `DataSource.IO`.


3.1.1
-----

  * No changes.


3.1.0
-----

  * [!] `DataSource`'s `sendRequest()` argument signature has changed in a
    non-backward-compatible way. It now accepts a single object containing the
    properties `request`, `callback`, and `cfg`.
  
  * `DataSource.Get` bug fixed where it was trying to delete the proxy callback
    in the wrong location during cleanup.
    
  * Changed from array of proxy callbacks to object with guid keys to support
    services that don't properly handle array indexes in the callback parameter
    (Twitter).
  
  * Code reorganized (API and functionality unaffected).


3.0.0
-----

  * `DataSource.IO` now passes request value to IO.
  
  * `DataSource.Function` now catches exception and fires error event.


3.0.0beta1
------------

  * Initial release.



DataTable Change History
========================

3.4.1
-----

  * Removed the `td` property from the object passed to cell formatters by
    default.  Implementers should return innerHTML or modify the `tdTemplate`
    and set properties on the `o` object passed to the formatter for
    template substitution.  For implementers that *must* have a Node for the
    cell, a new prototype method `createCell(o)` may be called from formatters.
    The method creates a Node using the standard template substitution of
    `tdTemplate` + values stored in `o`.  It then adds the cell Node to the
    `td` property on `o` and returns the created Node.  That said, using strings
    will make the table faster (maybe not in this release, but in 3.5.0).
    [Ticket #2529920]

  * Added a column attribute `emptyCellValue` to populate cells without content
    values. In your column definition, specify a value you want to show in the
    rendered cell in the case of missing data.  The default `emptyCellValue` is
    the empty string, so no more "{value}" showing up in tables.
    [Ticket #2529921]

3.4.0
-----

  * Render cycle revamped to avoid calls through the Attribute API for each
    cell.  This should improve render performance somewhat.  More performance
    improvements to come in 3.5.0.  The object passed through the render loops'
    supporting methods now has additional properties and many properties are
    added earlier.  o.td still refers to the cell added by the previous
    loop iteration--a proper fix is coming in 3.5.0. Look in the Gallery for
    a patch module.

  * Now creates a new `RecordSet` for each instance rather than reusing the same
    one. [Ticket #2529980]
  
  * Captions are only added if a value is set for the `caption` attribute
    [Ticket #2529968]


3.3.0
-----

  * Initial release.
  
  * Known Android issue (Ticket #2529761): Scrolling is currently not supported
    on the Android WebKit browser.



DataType Change History
=======================

3.4.1
-----
  * No changes

3.4.0
-----

  * Languages are no longer fetch-able for the `datatype-date` module, only for
    the `datatype-date-format` module:

        var availLangs = Y.Intl.getAvailableLangs("datatype-date-format");
    
3.3.0
-----

  * No changes.

3.2.0
-----

  * No changes.

3.1.1
-----

  * No changes.

3.1.0
-----
    
  * Changed to use YUI language resource bundles rather than proprietary
    infrastructure.

3.0.0
-----

  * No changes.

3.0.0beta1
----------

  * Initial release.



Drag and Drop Change History
============================

### 3.4.1

* No changes.

### 3.4.0

* #2529889 Example for Delegate Drag and Drop has wrong parameters
* #2529905 Using DDNodeScroll with DDDelegate causes JS error in Safari
* #2530050 Incorrect documentation
* #2530451 DragDrop enhancement - ability to use dd with non-node objects.
* #2530576 change notest needed in history file


### 3.3.0

* #2529382 DD Delegate breaks when a draggable is nested and uses a handle
* #2529407 Add tickAlignX and tickAlignY events to Y.Plugin.DDConstrained
* #2529409 [Pull Request] - #2529407 Add tickAlignX and tickAlignY events to Y.Plugin.DDConstrained
* #2529463 Screen goes red in some YUI 3 D&D examples in IE=8 doc mode
* #2529469 Reset _lastTickYFired/_lastTickXFired on drag end
* #2529470 [Pull Request] - #2529469 Reset _lastTickYFired/_lastTickXFired on drag end
* #2529484 DD example not working when run from local directory or hosted on YUIbuild
* #2529577 Slider thumb frozen on mousedown+mousemove in IE9


### 3.2.0

**IMPORTANT** dd-plugin and dd-plugin-drop are no longer bundled with the dd module. They are
now official plugins and need to be "used" on their own.

Moved to new Gesture support. DD now works off both mouse events and touch events natively with
the "drag-gestures" plugin that is conditionally loaded when touch events are found on the page.

* #2528693 3.1.0PR1 DD Examples fail in Opera 10.5
* #2528765 DD uses window references
* #2528797 Drag and drop breaks input text select()
* #2528959 Mouseenter event bubbles up when using both modules dd-plugin and dd-constrain
* #2529070 Drop destroy is throwing errors when the node is removed with .remove(true) using dd delegate
* #2529094 DD hard codes CSS prefix


### 3.1.0

* #2527964 DD constrain2node cached position causes misalignment when that node is moved
* #2528229 Configuration to override region caching in Constrain plugin
* #2528395 Add a DD.Drag delegate class
* #2528457 Add invalid selector check to Delegate
* #2528488 Delegate errors without Drop plugin
* #2528509 Drag and drop slow on linux ff3.5.6 
* #2528539 drag:start should fire before drag:enter
* #2528540 DDConstrained using cacheRegion set to false throws js errors when drag starts
* #2528560 drag:over event is not firing when useShim is false
* #2528578 DDConstrained has no default constraining config
* #2528585 drag:dropmiss being fired on simple click
* #2528592 Add throttle support to DD mousemove
* #2528596 Support Node instances as handles in Drag 
* #2528607 Drop events not firing when attached to a Drag target
* #2528608 Default Drag throttleTime should be -1
* #2528613 dragNode XY not sync with the mouse if it has its dimensions changed on drag:start


### 3.0.0

* #2528096 Updated initialization routine so plugins load before DD attachs to the node.
* #2528119 Added SELECT selector to invalidHandles.
* #2528124 Fixed issue with creating more than one DD instance on a node.
* #2528149 Fixed _noShim use case


### 3.0.0 Beta1

Added a plugin to support Window and Node based scrolling

    var dd = new Y.DD.Drag({
        node: '#drag'
    }).plug(Y.plugin.DDWinScroll);

    var dd = new Y.DD.Drag({
        node: '#drag'
    }).plug(Y.plugin.DDNodeScroll, {
        node: '#some-parent-with-scroll'
    });

Proxy and Constrained were moved to the plugin modal, there are some syntax changes:

PR2 - Proxy:

    var dd = new Y.DD.Drag({
        node: '#drag',
        proxy: true,
        moveOnEnd: false
    });

Current - Proxy:

    var dd = new Y.DD.Drag({
        node: '#drag'
    }).plug(Y.plugin.DDProxy, {
        moveOnEnd: false
    });

PR2 - Constrained:

    var dd = new Y.DD.Drag({
        node: '#drag',
        constrain2node: '#wrap'
    });

Current - Constrained:

    var dd = new Y.DD.Drag({
        node: '#drag'
    }).plug(Y.plugin.DDConstrained, {
        constrain2node: '#wrap'
    });

Converted Everything to use setXY now that FF2 is not supported.
Performance tweaks to dragging over a target.

### 3.0.0 PR2

Added bubbles config option to help with extending later.
Updated _checkRegion to perform Bottom, Top, Left, Right validation instead of Top, Bottom, Left, Right

### 3.0.0 PR1

Known Issues:

* Firefox 2.x:
    Proxy Drags with handles inside an element with overflow: hidden will not target properly.

* All:
    Scrolling Module not available as of this release.




Dial Change History
===================

3.4.1
-----

  * Changed method name from _getNewValueFromMousedown to _handleMousedown

  * Improved mousedown on ring handling [Ticket #2530597]
 
  * Improved handling of dragging the handle past max/min and around multiple
    revolutions. [Ticket #2530766]
    
  * Fixed problem with Dial having incorrect center X and Y following a browser
    resize. [Ticket #2531111]                  

3.4.0
-----

  * Names of 3 configuration attributes have changed:
    stepsPerRev       ->   stepsPerRevolution
    handleDist        ->   handleDistance
    centerButtonDia   ->   centerButtonDiameter 
     
  * New configuration attributes:
    markerDiameter
    handleDiameter
	
  * Enhancement:
    In addition to setting the Dial by dragging the handle as it was in 3.3.0,
    Dial now supports setting the value by clicking on the Ring.
    This does not cross value "wrapping" boundries. 
    For example: If a Dial has 0 degrees = value 0, 
    and the Dial's current handle position is 10 degrees with a value = 10, 
    then a mousedown at 355 degrees will result in a value of 355 not -10.
    In this case all mousedown events will result in values between 0 and 355.
    This is within current value "wrapping" boundries.
    Moving across value wrapping boundaries, must be done by dragging the handle
    or using the keyboard.

  * Changed the name of class 
    marker-max-min
    - to - 
    yui3-dial-marker-max-min
	
  * Enhancement:
    In 3.3.0, when the user dragged the handle past the min or max, the Marker
    displayed as red to indicate min/max.
    When the cursor was released, the marker was no longer displayed.
    There remained no user feedback indicating max/min.
    When the keyboard was used to change the value, no min/max indication was
    displayed, except that the handle stopped moving.
    In this release, the Marker display state of red remains as long as the
    Dial is at min/max, regardless of mouse or keyboard use.
    If you don't want min/max feedback, CSS class yui3-dial-marker-max-min
    can be overridden.

  * When mousedown is used to set its value, Dial now has intuitive handling of
    different configurations of min, max where stepsPerRevolution is
    greater than or less than one revolution. [Ticket #2530306]

3.3.0
-----

  * New Beta Component
    Deprecated _setLabelString, _setTooltipString, _setResetString. 
    Instead, use DialObjName.set('strings',{'label':'My new label',
    'resetStr';'My New Reset'});   before DialObjName.render();
    One or more strings can be changed at a time.
    Removed _setXYResetString. Now done through CSS.
    Not called by Dial.js anymore.




DOM Change History
==================

3.4.1
-----

  * No changes.

3.4.0
-----

  * The ancestor/ancestors methods now accept an optional stopAt function.

3.3.0
-----

  * IE alpha filter for opacity no longer affects existing filters.
  * Fixes for IE9, Firefox 4, and Chrome creators.
  * setStyle(node, '') now clears inline styles.
  * adds ancestors method.

3.2.0
-----

  * CSS "transform" vendor prefix is now optional with set/getStyle.
  * Bug fix: IE6/IE7 were failing inDoc checks for cloned nodes. [Ticket 2529232]


3.1.1
-----

  * Bug fix: viewportRegion() was incorrectly documented. [Ticket 2528756]


3.1.0
-----

  * adds support for hypenated attributes.
  * Bug fix: iOS already includes scroll amount. [Ticket 2528390]

3.0.0
-----

  * initial release.




Dump Change History
===================

3.4.1
-----

  * No changes.

3.4.0
-----

  * No changes.

3.3.0
-----

  * No changes.

3.2.0
-----

  * No changes.

3.1.1
-----

  * No changes.

3.1.0
-----

  * No changes.

3.0.0
-----

  * Better handling of HTML elements.

3.0.0beta1
----------

  * Added `/regexp/` formatting.

3.0.0pr2
--------

  * No changes.

3.0.0pr1
--------

  * Initial release.



Rich Text Editor Change History
===============================

###3.4.1

No changes.

### 3.4.0

Third release of EditorBase. Considerable work was done on this component, but there are no
public tickets associated with the issues that were resolved. This version of EditorBase is the 
current version being used in the new Yahoo! Mail. It's production stable and ready to be used with
the proper skins and GUI.

### 3.3.0

Second release of EditorBase. Considerable work was done on this component, but there are no
public tickets associated with the issues that were resolved.

### 3.2.0

Initial Release

This release is a core utility release, the Editor instance that is created contains no GUI.
It's only the iframe rendering and event system.



Escape Change History
=====================

3.4.1
-----

  * No changes.


3.4.0
-----

  * Non-string arguments to `html()` and `regex()` are now coerced to strings.
    [Ticket #2530408]


3.3.0
-----

  * Initial release.



Event Infrastructure Change History
===================================

3.4.1
-----
  * Calling Y.on('syntheticEvent', callback) without a context/selector argument
    now defaults to `window` (or the global object) [Ticket #2530081]

  * event-resize, a.k.a. Y.on('windowresize', ...) migrated to synthetic event
    infrastructure. Now detachable, etc. Also properly throttles the resize
    event on newer Gecko engines. That browser sniff was old! [Ticket #2530805]

3.4.0
-----
  * `event-outside` added for "outside" events.

  * `Y.Event.define(name)` adds name to `DOM_EVENTS` whitelist. Accepts event
    name string or array of string names.
    
  * `event-hover` properly pulls in required module `event-mouseenter`.
    
  * DOM event subscriptions are now removed and objects cleaned up after last
    subscription is detached; same for synthetic events.
    
  * `key` synthetic event migrated to official synth infrastructure; and now
    supports delegation.
    
  * `key` event spec param now supports letters and named keys. E.g.:
    `'enter+ctrl' == '13+ctrl'`, `'up:a' == 'up:65'` and `'A' == '65+shift'`.
    
  * Added experimental config `YUI({ lazyEventFacade: true })` that triggers a
    mode for DOM EventFacades in IE8 to use getters to access event properties
    that involve any calculation, such as `e.target` and `e.currentTarget`; this
    should also improve performance.
    
  * `mouseenter` and `mouseleave` events now filter the native event rather than
    the generated `DOMEventFacades` for `mouseover`/`mouseout`. This results in
    fewer calls to `Y.one` (`e.target`, `currentTarget`, `relatedTarget`) as
    well, so should improve performance.
    
  * Added `onceAfter()` method to do a self-detaching `after()` subscription.
    [Ticket #2529464]
    
  * `Y.on(type, callback, HTMLElement[], COMPAT)` subscriptions to attach to
    multiple elements in one call now correctly use native DOM elements instead
    of Nodes for all subscriptions. [Ticket #2529807]
    
  * Plugged the leaked global `GLOBAL_ENV`. [Ticket #2530227]
    
  * Fixed synth architecture to properly resubscribe to synths that use
    `processArgs` if the target is not available at the time of subscription.
    [Ticket #2530293]

3.3.0
-----

  * Added support for `delegate({ click: fn, keyup: fn2 }, …)` and
    `delegate(['click', 'keyup'], fn, …)`.
    
  * Delegation containers are now potential matches for the filter.
    
  * Nested delegate matches will now have callback executed for all matching
    targets in bubbling order.
    
  * `e.stopPropagation()` in nested delegate matches now works as expected.
    
  * The raw DOM event is no longer double wrapped (i.e. was: `e._event._event`).
    
  * `event-focus` now uses XHTML-friendly feature test to fork for IE.
    
  * New `event-hover` module providing `node.on('hover', in, out)`.
    
  * `e.button`/`e.which` normalization.
    
  * `e.which` normalized for key operations as well.
    
  * Split out IE-specific code into `event-base-ie` conditional module.

3.2.0
-----

  * Added event and facade support for touch.
    
  * Synthetic event infrastructure rebuilt. Changes include:
    
    * Support for delegation.
        
    * Passing `DOMEventFacade` to `notifier.fire(e)` now recommended.
        
    * Fixed issue where firing the notifier from inside DOM event subs would
      result in duplicate synth sub execution if the same synth was subscribed
      multiple times on the same Node.
        
    * Synths can now be detached with `node.purge(t|f, 'synthName')`.
        
    * `Event.define(type, config, *force*)` third arg added to override existing
      events. Only use this if you really know what you're doing.
        
    * Changed `allowDups` to `preventDups`, `true` by default to mimic existing
      behavior elsewhere in the event system.
    
  * `delegate()` now defers to synthetic event def more intelligently.
    
  * Added support for passing filter function to delegate.
    
  * `delegate()` now executes callback for each filter match up the bubble path.
    
  * Added detach category support to `delegate()`.
    
  * Migrate `mouseenter`, `mouseleave`, `focus`, and `blur` to `Event.define`.
    
  * `focus` and `blur` now guarantee execution order of subs matches bubble
    order when multiple delegates are created from different levels.
    
  * `event-synthetic` added to 'event' rollup module.

3.1.1
-----
    
  * fired `fireOnce()` listeners are executed synchronously.

3.1.0
-----

  * Removed deprecated `delegate` custom event. As of 3.1.0 use the `delegate()`
    method on a `Node` instance or `Y` instance.
    
  * Updated the `event-focus` submodule so that the specialized `focus` and
    `blur` events that enable the `focus` and `blur` events to bubble do not
    apply when adding `focus` and `blur` events to the `window` object.
    
  * Synthetic event creation API added.
    
  * `delegate` enhancements.
    
  * `unload` event fix.
    
  * Compatibility with Firefox's untouchable anonymous `div`.

3.0.0
-----

  * Added `onreadystatechange` fork in `domready` to handle the event in IE when
    YUI is hosted in an `iframe`.
    
  * Added `mousewheel` support.
    
  * Added `Y.delegate()` function that is a bit easier to use than
    `Y.on('delegate', …)`.
    
  * Default scope of `mouseenter` and `mouseleave` events is the `Node` instance
    to which the listener is attached.
    
  * Default scope of delegated event listeners is the `Node` instance that
    matched the supplied CSS selector.
    
  * All special DOM event handlers (`focus`, `blur`, `mousewheel`, `resize`,
    `delegate`, etc.) are broken down into submodules. Core DOM event
    functionality is provided in event-base.js, and all of the functionality is
    rolled into event.js.
    
  * Additional Safari key remapping.
    
  * Special DOM events can now be routed through `delegate()`.
    
  * `Y.on()` can target `Node` and `NodeList` references correctly.
    
  * Fixed `onAvailable()` lazy DOM listener detach handles.
    
  * When configured to return a detach handle, a single object is always
    returned. Previously requests that resolved to multiple listeners returned
    an array.

3.0.0beta1
----------

  * DOM event, custom event, and simulate event moved to separate modules.
    
  * Added an event for DOM event delegation. It only fires if the target or its
    descendants match a supplied selector.
  
        Y.on('delegate', fn, el, 'click', 'selector', …)
    
    The event facade sets the following properties:
    
      * `target`: the target of the event.
      * `currentTarget`: the element that the selector matched.
      * `container`: the bound element (the delegation container).
    
  * Added `mouseenter`/`mouseleave` events:
  
    * `Y.on('mouseenter', fn, el, 'click', 'selector', …)`
    * `Y.on('mouseleave', fn, el, 'click', 'selector', …)`
    
  * Added `Y.on('windowresize', fn)`, which attempts to normalize when the event
    fires across all browsers (once at the end of the resize rather than
    continuously during the resize).
    
  * Fixed `unsubscribeAll()` return value.
    
  * Added ability to skip facade creation where performance is a concern.
    
  * Moved `DOMReady` core to `yui-base`.
    
  * Focus/blur abstraction works in Opera when the bound element is the target.
    
  * `purgeElement` only reads element guids, it does not create new ones for
    elements without one.
    
  * `Event.attach()` returns a single handle if the result from collection
    processing is a single item.

3.0.0pr2
--------

  * Fixed IE notification error when no arguments are supplied.
    
  * Added `event-simulate`.
    
  * `getListeners()` works when the element has no listeners defined.
    
  * `Event.addListener()` removed. Exists only in compat layer.
    
  * `addListerer()` triggers 2.x event behavior.
    
  * Removed extra undefined parameter passed to DOM event listeners.
    
  * Compat layer contains `Event.on()`.
    
  * Event adapter support added to `Y.on()`.
    
  * Added `focus` and `blur` event adaptors (support for propagation of these
    events.)
    
  * publish and subscribe support an object for the type, allowing for multiple
    events/subscriptions.
    
  * subscriber failures throw an error by default rather than log.
    
  * subscriber failures are not routed through `Y.fail` in order to improve the
    debug experience.
    
  * New facades created every `fire()`.
    
  * `before()` method re-added to `EventTarget`, which delegates to
    `Do.before()` or `subscribe()`.
    
  * `EventTarget.after()` will delegate to `Do.after()` if type is a function.
    
  * Added keylistener: `Y.on('key', fn, element, 'down:13,65+ctrl+shift')`.
    
  * `event:ready` event deprecated in favor of `domready`.

3.0.0pr1
--------

  * Initial Release.



Custom Event Infrastructure Change History
==========================================

3.4.1
-----

  * onceAfter (added in 3.4.0) now works for array and object signatures.
    [Ticket #2531121]

3.4.0
-----

  * Custom events published from `Y` no longer bubble by default.

3.3.0
-----

  * Undocumented and poorly named `each()` method on EventHandle changed to
    `batch()`.

  * After listeners for events fired in a `defaultFn` or listener are queued in
    the correct order.

  * Added `Y.Do.originalRetVal` and `Y.Do.currentRetVal` statics accessible by
    `Y.Do.after()` subscribers.

  * Exposed the previously private `EventTarget.parseType`.

3.2.0
-----

  * Fixed `defaultTargetOnly` publish configuration.

  * `detach()` now decrements `subCount`/`afterCount`.

  * Detaching via category no longer affects subscriptions on other objects.

3.1.1
-----

  * No changes.

3.1.0
-----

  * Wildcard prefix subscriptions supported: `target.on('*:click', …)` will be
    notified when `tree:click`, `tab:click`, etc are fired.

  * Added `EventTarget::once`, which is equivalent to `on()`, except the
    listener automatically detaches itself once executed.

  * Added event monitoring. When configured, an `EventTarget` will emit events
    for `publish()`, `attach()`, `fire()`, and `detach()` operations on the
    hosted events.

  * `EventTarget::on`'s `type` parameter is overloaded to accept arrays and
    objects for attaching multiple types at once.

  * `EventTarget::detach` returns the event target like the API docs already
    stated.

  * Events can now be configured to execute the `defaultFn` only on the targeted
    object, not on the bubble targets.

  * The event order has been reworked so that the after listeners for the entire
    event stack execute after all `defaultFn` across the entire bubble stack.

3.0.0
-----

  * Broken into core base and complex modules.

  * `broadcast` works for simple events.

  * If configured to return an `EventHandle`, the return value will always be a
    single object, regardless of how many listeners were attached. Previously,
    multiple listeners provided an array of detach handles.

3.0.0beta1
----------

  * [!] Exposed methods are `on()` for the before moment, `after()` for the
    after moment, and `detach()` for unsubscribe. `subscribe()`, `before()`,
    `unsubscribe()`, and corresponding methods are deprecated.
  
  * Implemented the `broadcast` flag:
  
    * `broadcast = 1`: local, accessible via `Y.on('prefix:event')`.
    * `broadcast = 2`: global, accessible via `Y.on()` or globally via
      `Y.Global.on('prefix:event')`.
  
    Broadcast listeners cannot effect the `defaultFn` or host subscribers (so
    are in effect, after listeners), although this is still possible by added
    either `Y` or `Y.Global` as `EventTarget`s.

  * Moved `event-custom` out of `event` package.

  * `EventTarget` accepts a `prefix` configuration. This is used in all exposed
    methods to handle shortcuts to event names, e.g., `'click'` and
    `'menu:click'` are the same if the prefix is `'menu'`.

  * Event type accepts a event category which can be used to detach events:
  
        Y.on('category|prefix:event', fn);
        Y.detach('category|prefix:event');
        Y.detach('category|*');

  * Added `chain` config to events that makes the return value the event target
    rather than a detach handle. Use with the detach category prefix.

  * The `type` parameter can be an object containing multiple events to attach:
  
        Y.on({ 'event1': fn1, 'event2': fn2 });

  * `Y.fire` payload for event facades can be another facade or a custom event.



Gestures Change History
=======================

3.4.1
-----

 * Fixed preventDefault:true for flick

3.4.0
-----

 * For flick, reset start time on first move, to handle
   case where user mousesdown/touchstarts but then doesn't
   move their finger for 5s leading to inaccurate velocity.

3.3.0
-----

  * Use touches current target if already set, as opposed
    to over-riding it with touch current target

  * Flick "y" axis param now handled correctly.

3.2.0
-----

  * New beta component




ValueChange Change History
==========================

3.4.1
-----

  * No changes.


3.4.0
-----

  * No changes.


3.3.0
-----

  * Focus is now used (in addition to keyboard and mouse events) as a sign that
    we should begin polling for value changes. [Ticket #2529294]

  * If the value changes while an element is not focused, that change will no
    longer be reported the next time polling is started (since it couldn't have
    been user input).


3.2.0
-----

  * Module renamed to `event-valuechange` and refactored to be a true synthetic
    event.

  * The `value` and `oldValue` event facade properties were renamed to `newVal`
    and `prevVal` respectively, for consistency with other change event facades
    throughout the library.

  * Performance improvements.


3.1.2
-----

  * No changes.


3.1.1
-----

  * No changes.


3.1.0
-----

  * Initial release as `value-change`.



Graphics Change History
=======================

3.4.1
-----

  * No changes.


3.4.0
-----

  * Initial release.



Highlight Change History
========================

3.4.1
-----

  * Now using ClassNameManager to get the CSS class name for the highlight
    element, so custom class prefixes other than "yui3" will be respected.
    [Ticket #2530811]


3.4.0
-----

  * Fixed a bug that resulted in invalid escaped HTML when running a highlighter
    with an empty needle. [Ticket #2529945]

  * Fixed an off-by-one bug in which an unhighlighted single char at the end of
    a highlighted string would be discarded when using `allFold()`. [Ticket
    #2530529]


3.3.0
-----

  * Initial release.



History Change History
======================

3.4.1
-----

  * No changes.


3.4.0
-----

  * [!] The `history-deprecated` module, which was deprecated in YUI 3.2.0, has
    been removed from the library.

  * HistoryHTML5 now uses the new `window.history.state` property (which
    showed up in Firefox 4 and the HTML5 spec after YUI 3.3.0 was released) to
    get the current HTML5 history state.

  * Removed the `enableSessionStorage` config option that was previously used to
    work around the lack of an HTML5 API for getting the current state.

  * Added a `force` config parameter to History constructors. If set to `true`,
    a `history:change` event will be fired whenever the URL changes, even if
    there is no associated state change.

  * Bug fix: On a page with a `<base>` element, replacing a hash-based history
    state resulted in a broken URL. [Contributed by Ben Joffe] [Ticket #2530305]

  * Bug fix: In IE6 and IE7, navigating to a page with a hash state could result
    in endlessly repeating `history:change` events. [Ticket #2529990]

  * Bug fix: In IE6 and IE7, replacing a history state would actually result in
    a new history entry being added. [Ticket #2530301]


3.3.0
-----


  * Bug fix: Setting an improperly encoded hash value outside of HistoryHash
    resulted in two history entries being created. [Ticket #2529399]

  * Bug fix: Changes to the URL hash (as opposed to the iframe hash) are now
    reflected in the history state in IE6 and IE7. [Ticket #2529400]


3.2.0
-----

  * [!] The pre-3.2.0 Browser History Utility has been deprecated, and its
    module has been renamed to `history-deprecated`. It will be removed
    completely in a future release.

  * Initial release of the new History Utility.



ImageLoader Change History
==========================

3.4.1
-----

  * No changes.

3.4.0
-----
  * Added classNameAction option for ImgGroup. Setting to "enhanced" means that
   when using className on an <img> element, the src attribute is replaced
   rather than simply removing the class name. [Ticket #2530087]

3.3.0
-----
  * No changes.

3.2.0
-----
  * No changes.

3.1.1
-----
  * No changes.

3.1.0
-----
  * PNG image fix for IE6 [Ticket #2528448]
  * Convert deprecated Y.get calls to Y.one

3.0.0
-----
  * No changes.

3.0.0 beta 1
------------
  * 3.0 conversion
  * New features:
    * Fold groups indicated by a distance from the fold, and images are
      loaded in cascading fashion as each reaches that distance
      Scroll and resize triggers are set automatically for these groups
    * Custom triggers can belong to the global Y instance or to any local event
      target
    * Bg, Src, and Png images are all registered with groups via the same
      "registerImage" method, and differentiated by attribute parameters




Intl Change History
===================

3.4.1
-----

  * No changes.

3.4.0
-----

  * No changes.

3.3.0
-----

  * No changes.

3.2.0
-----

  * No changes.

3.1.1
-----

  * No changes.

3.1.0
-----

* Initial Release.



IO Utility Change History
=========================

3.4.1
-----

  * HTTP 304 now treated as a success condition. [Ticket #2530931]

  * Fixed transport creation error when both io-xdr and io-upload-iframe
    modules are in use [Ticket #2530999]

  * Querystring stringify added to io-upload-iframe. [Ticket #2531037]

  * Fixed request abort error in IE. [Ticket #2531038]

  * Add try/catch to io-upload-iframe response to handle failure cases 
    where the document may be inaccessible. [Ticket #2531041]

  * Add IO support for XHR basic user authentication. [Ticket #2530023]

  * Revert Y.mix usage for synchronous requests. [Ticket #2531056]

  * Fixed io-upload-iframe transport destruction.  [Ticket #2531058]
    
3.4.0
-----

  * Added ability to get the configuration of a transaction. [Ticket #2528240]

  * Instantiable IO. [Ticket #2529314]

  * IO now uses `event-custom` and event facades. [Ticket #2529317]

  * Exposed more of the internals of IO for extensibility. [Ticket #2529447]

  * Fixed IO iframe upload to reset form attributes. [Ticket #2529553]

  * Add IO support for XHR basic user authentication. [Ticket #2530023]

  * IO will not send `data` for `GET`, `HEAD` and `DELETE` HTTP methods.
    [Ticket #2530091]

  * Fixed issue with IO doubling the URL query-params on a HTTP `GET` request
    when sending `data` together with form serialization. [Ticket #2530494]

3.3.0
-----

  * When using `io-xdr` to load `io.swf`, a date-time stamp will appended, as a
    query-string, to the transport source for IE. [Ticket #2528898]

  * Implemented default HTTP headers can be suppressed in the transaction's
    configuration object by setting the header with a value of `disable`.
    [Ticket #2529324]
  
    For example:

        var config = { headers: { "X-Requested-With": "disable" } };

  * Use Y.io without listening for the `io:xdrReady` event. [Ticket #2528710]

  * Fixed native XDR detection for IE8 in `io-xdr`. [Ticket #2529290]

3.2.0
-----

  * Fixed malformed HTML entities in JSON response, when using
    `io-upload-iframe`. [Ticket #2528646]

  * Fixed configuration HTTP headers should override preset HTTP headers, when
    identical. [Ticket #2528893]

3.1.2
-----

  * [!] Fixed security vulnerability in `io-xdr` when using the Flash transport.
    Removed: `Security.allowDomain("*")` setting from `io.as` (source) and
    `io.swf` (compiled). The implementation reverts back to the version in
3.0.0.
  
    This reversion prevents third-party sites from being able to load `io.swf`
    from a disparate domain, and make HTTP requests with the SWF's domain
    privileges, and passing the domain's credentials.  Only the domain serving
    `io.swf` will be permitted to load it, and call its fields.
  
    See the "Security Bulletin" for more details:
    http://yuilibrary.com/yui/docs/io/#security-bulletin

3.1.1
-----

  * Fixed broken synchronous IO requests in IE. [Ticket #2528739]

3.1.0
-----

  * YUI io now supports synchronous transactions for same-domain requests. To
    enable synchronous transactions, set the configuration property `sync` to
    `true`; the default behavior is `false`. During a synchronous request, all
    io events will fire, and response data are accessible through the events.
    Response data are also returned by io, as an alternative. [Ticket #2528181]
  
    For example:
    
        var request = Y.io(uri, { sync: true });
        
    `request` will contain the following fields, when the tx is complete:
    
      * `id`
      * `status`
      * `statusText`
      * `getResponseHeader()`
      * `getAllResponseHeaders()`
      * `responseText`
      * `responseXML`
      * `arguments`
  
    When making synchronous requests:
  
      * The transaction cannot be aborted,
      * The transaction's progress cannot be monitored.

  * `arguments` defined in the configuration object are now passed to io global
    event handlers, as well. [Ticket #2528393]

  * Only pass the value of the `arguments` property to listeners if defined.
    [Ticket #2528313]

3.0.0
-----

  * Native cross-domain transactions are now supported in `io-xdr`. To specify
    an XDR transaction, set the config object with the following properties:

    * `use`: Specify either `native` or `flash` as the desired XDR transport.
    
    * `credentials`: Set to `true` if cookies are to be sent with the request.
      Does not work with XDomainRequest (e.g., IE8) or the Flash transport.
    
    * `datatType`: Set to `xml` if the response is an XML document.

    For example:
  
        var configuration.xdr = {
            use         : 'flash',  // Required -- 'flash` or 'native'.
            credentials : true,     // Optional.
            dataType    : 'xml'     // Optional.
        };

    The `use` property is required. The others are optional or functionality-
    specific.

    When using the native transport, io will fallback to the Flash transport if
    the browser is not capable of supporting the native mode. Make sure the
    resource responds with the correct `Access-Control-Allow-Origin` header
    before attempting a native XDR request.

  * The sub-module `datatype-xml` is now a dependency for `io-xdr`, to support
    XML response data in XDR transactions.

  * XDR transport initialization is simplified to one required value -- the path
    to Flash transport. For example:
  
        Y.io.transport({ src:'io.swf' });

3.0.0beta1
----------

  * The `io-queue` sub-module now implements YUI `Queue`.  The io queue
    interface allows transaction callback handlers to be processed in the order
    the transactions were sent, regardless of actual server response order.
    For example:

    * io queue is used to make three requests.
    
    * The actual server response order happens to be: transaction 2, 1, 3.
    
    * However, using the queue interface, the transaction callbacks are
      processed in the order of: transaction 1, 2, 3.

  * All transaction event flows now resolves to `success` or `failure`; the
    abort event is removed. Transaction abort and timeout conditions resolve to
    `failure`, and is distinguishable in the response data. Specifically, the
    response object's `status` and `statusText` properties will be populated as:

    * `response.status` will be 0.
    
    * `response.statusText` will be set to `timeout` or `abort` to differentiate
      the two possible conditions.

  * A new `end` event is introduced in the transaction event flow; this is the
    terminal event for all transactions. Its event handler signature is the
    same as the `start` event, receiving the transaction id and user-defined
    arguments.

    * The global event name is `io:end`.
    
    * To subscribe to the transaction event, define the `end` property in the
      transaction's configuration object. `{on: {end: function(){…} } }`.

3.0.0 PR2
---------

  * YUI `io` is now comprised of several modules, allowing users to specify and
    implement only the needed modules. These modules are:

    * `io-base`: This is the IO base class, using `XMLHttpRequest` as the
      transport.
    
    * `io-xdr`: This sub-module extends IO to enable cross-domain transactions
      using Flash as the transport.
    
    * `io-form`: This sub-module extends IO to enable the serialization of an
      HTML form as transaction data.
    
    * `io-upload-iframe`: This sub-module extends IO, to allow file uploads with
      an HTML form, using an `iframe` transport.
    
    * `io-queue`: This sub-module extends IO to add transaction queuing
      capabilities.

  * If defined in the configuration object, user-specified, HTTP `Content-Type`
    headers will correctly override POST default headers, for HTTP POST
    transactions. [Ticket #SF2262707]

  * XML is not supported as a response datatype when using sub-modules `io-xdr`
    and `io-upload-iframe`.

3.0.0 PR1
---------

  * Initial Release.



JSON Utility Change History
===========================

3.4.1
-----

  * No changes.

3.4.0
-----

  * Remove indirect `eval()`. [Ticket #2530295]

3.3.0
-----

  * No changes.

3.2.0
-----

  * Convert parse input to a string before processing.

  * `eval()` now referenced indirectly to allow for better compression.

  * `dateToString` deprecated; use a `replacer`. A Date function extension is
    in the works.

3.1.1
-----

  * No changes.

3.1.0
-----

  * useNative___ disabled for browsers with *very* broken native APIs
    (FF3.1beta1-3).

  * Assumption of `window` removed to support browser-less environment.

3.0.0
-----

  * Leverages native `JSON.stringify` if available.

  * Added `Y.JSON.useNativeParse` and `useNativeStringify` properties that can
    be set to `false` to use the JavaScript implementations. Use these if your
    use case triggers an edge-case bug in one of the native implementations.
    Hopefully these will be unnecessary in a few minor versions of the A-grade
    browsers.

  * Added support for `toJSON()` methods on objects being stringified.

  * Moved Date stringification before replacer to be in accordance with ES5.

3.0.0beta1
----------

  * Leverages native `JSON.parse` if available.

  * Stringify API change. Third argument changed from depth control to indent
    (Per the ECMA 5 spec).

  * Stringify now throws an `Error` if the object has cyclical references
    (Per the ECMA 5 spec).

  * Restructured `stringify()` to leverage `Y.Lang.type`.

3.0.0pr2
--------

  * No changes.

3.0.0pr1
--------

  * Initial release.



JSONP Change History
====================

3.4.1
-----

  * No changes.

3.4.0
-----

  * Support added to specify charset or additional attributes to add to the
    script tag.
  * Success and failure callbacks are no longer executed if the request
    takes longer than the configured timeout

3.3.0
-----

  * allowCache config option added to use the same function proxy for
    generated requests.  Useful to benefit from YQL caching.

3.2.0
-----

Initial release



YUI Loader Change History
=========================

### 3.4.1

  * No changes.

### 3.4.0
    
   * Added Alias support and flattened the module structure.
   * Alias support: When asking for: "dd"
        Loader actually asks for: "dd-ddm-base,dd-ddm,dd-ddm-drop,dd-drag,dd-proxy,dd-constrain,dd-drop,dd-scroll,dd-drop-plugin"
   * Better RLS support

### 3.3.0

   * 'when' config for conditional modules (before, after, or instead).

### 3.2.0
   * Conditional module support based on user agent detection or test function.
   * Added gallery css support
   * performance optimizations, cached yui metadata, shared instances, etc

### 3.1.1
  * Fixed ticket #2528771 : Loader has incorrect default for "base" - uses Y.Env, instead of Y.Env.base
  * Fixed ticket #2528784 : Regression requesting language packs using Y.use("lang/datatype-date_xx", fn) in build yui3-2029

### 3.1.0
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

### 3.0.0
  * Extracted from the YUI seed.  Now fetched dynamically if
    there are missing dependencies if not included.
  * Reads metadata from on-page modules registered via Y.add if the module is not already known.
  * Many new modules, many modules reorganized, dependency information has been tuned.



Node Change History
===================

3.4.1
-----

  * Bug fix: Calling insert(null) was throwing an error. [Ticket 2529991]

  * Bug fix: The removeAttribute method was not chainable in IE < 9.
    [Ticket 2529230]

  * Bug fix: Calling Y.all() without arguments was failing to return an empty
    NodeList. [Ticket 2530164]

  * Added optional stopAt function/selector argument for ancestor/ancestors().


3.4.0
-----

  * [!] The empty() method now always does a recursive purge. [Ticket 2529829] 

  * Added the getDOMNode() and getDOMNodes() methods to Node and NodeList
    prototypes. 

  * The one() method now accepts IDs that begin with a number. [Ticket 2529376]

  * Bug fix: NodeList show()/hide() methods were broken with Transition.
    [Ticket 2529908]

  * Bug fix: Some NodeList array methods were returning incorrectly.
    [Ticket 2529942]


3.3.0
-----

  * Added wrap()/unwrap(), show()/hide(), empty(), and load() methods.

  * Added Array 1.5 methods to NodeList.

  * Added the destroy() method to NodeList. [Ticket 2529256]

  * Added the once() method to NodeList. [Ticket 2529369]

  * The appendChild() and insertBefore() methods now accept HTML.
    [Ticket 2529301]

  * Added the appendTo() method. [Ticket 2529299]

  * Added the ancestors() method. [Ticket 2528610]

  * The setStyle() method now ignores undefined values.
  
  * Bug fix: Enable querying cloned nodes in IE 6/7. [Ticket 2529487]


3.2.0
-----

  * Added the transition() method.

  * Bug fix: checked pseudo-class for IE input elements. [Ticket 2528895]
  
  * Bug fix: Fixed IE8 input element rendering. [Ticket 2529035]


3.1.1
-----

  * Bug fix: The setContent() method incorrectly handled falsey values.
    [Ticket 2528740]


3.1.0
-----

  * Added support for invalid IDs. [Ticket 2528195]

  * Fix duplicate IDs across YUI instances. [Ticket 2528199]

  * Allow empty setContent() call to remove content. [Ticket 2528269]

  * Bug fix: Arguments passed to next() were being incorrectly handled.
    [Ticket 2528295]


3.0.0
-----

  * Initial release.



Flick Node Plugin Change History
================================

3.4.1
-----

  * No changes.

3.4.0
-----

  * No changes.

3.3.0
-----

  * No changes.

3.2.0
-----

   * New beta component



Focus Manager Change History
============================

3.4.1
-----

  * No changes.


3.4.0
-----

  * No changes.


3.3.0
-----
 * Fixed an issue with next/previous behavior that could cause focus to get
   stuck at the beginning or end of a control set when the `circular`
   attribute was set to `false`. [Ticket #2529353]


3.2.0
-----

  * Fixed an issue that prevented arrow keys from working properly in form
    input fields and textareas inside a focused node. [Ticket #2529041]


3.1.2
-----

  * No changes.


3.1.1
-----

  * No changes.

3.1.0
-----

  * Updated the "refresh" method so that it will set up event listeners if they
    haven't yet been set up, enabling the Focus Manager to be plugged into an
    empty Node with the focusable descendants to be added later.


3.0.0
-----

  * Fixed an issue where mousing down on a child node of a descendant would
    result in the descendant losing focus.


3.0.0 beta 1
------------

  * Initial release.



MenuNav Change History
======================

3.4.1
-----

  * No changes.


3.4.0
-----

  * No changes.


3.3.0
-----

  * No changes.


3.2.0
-----

  * No changes.


3.1.2
-----

  * No changes.


3.1.1
-----

  * No changes.


3.1.0
-----

  * Fixed issue where moving the mouse from a submenu label directly out of the
    document to the browser chrome would trigger a JS error in IE.

  * Fixed issue where submenus would not appear if the user landed on a submenu
    label by moving the mouse diagonally from the parent menu.

3.0.0
-----

  * No changes.


3.0.0 beta 1
------------

  * Now lives on the `Plugin` namespace, as opposed to the `plugin` namespace.
  * Now requires the Focus Manager Node Plugin (`Y.Plugin.NodeFocusManager`).
  * Now extends `Y.Base`.


3.0.0pr2
--------

  * Initial release.



OOP Change History
==================

3.4.1
-----

  * No changes.


3.4.0
-----

  * Significant performance improvements for `augment()`.

  * Bug fix: `augment()` handled the `whitelist` parameter incorrectly when
    augmenting a function. [Ticket #2530036]


3.3.0
-----

  * `clone()` no longer fails on DOM objects in IE.


3.2.0
-----

  * No changes.


3.1.1
-----

  * `clone()` passes functions through.


3.1.0
-----

  * Added `Y.some()`.

  * Improved iterators over native objects and YUI list object.

  * Improved deep clone, particularly when dealing with self-referencing objects.

  * Fixed complex property merge when doing a deep aggregation.


3.0.0
-----

  * No functional changes.


3.0.0 beta1
----------

  * `bind()` now adds the arguments supplied to bind before the arguments
    supplied when the function is executed. Added `rbind()` to provide the old
    functionality (arguments supplied to bind are appended to the arguments
    collection supplied to the function when executed).

  * `bind()` supports a string representing a function on the context object in
    order to allow overriding methods on superclasses that are bound to a
    function displaced by AOP.

  * Fixed array handling in `clone()`.


3.0.0pr2
--------

  * No changes.


3.0.0pr1
--------

  * Initial release.



Overlay Change History
======================

3.4.1
-----

  * No changes, see Widget and extensions for changes to dependencies.

3.4.0
-----

  * No changes, see Widget and extensions for changes to dependencies.

3.3.0
-----

  * No changes, see Widget and extensions for changes to dependencies.

3.2.0
-----

  * No changes, see Widget and extensions for changes to dependencies.

3.1.1
-----

  * No changes.

3.1.0
-----

  * Added WidgetConstrain support to the packaged Overlay class.

  * Fixed centering when content is set in constructor.

3.0.0
-----

  * Initial release.

  * Modified progressive enhancement use case, to use Document Fragments instead
    of `innerHTML` to preserve event listeners.

  * Fixed use of `centered`, `x` and `y` in the constructor. These all needed
    `lazyAdd` configuration since they had setters which modified other
    attribute state.



Panel Change History
====================

3.4.1
-----

  * Panel's CSS related to WidgetButtons has been improved. The styling for
    Panel's header is now much more flexible, while maintaining the position of
    the close button across browsers and varying amounts of content.
    [Ticket #2530978]

  * Panel now has a working Night skin. [Ticket #2530937]

  * The sprite image assets for the "close" button on Panels have moved into the
    WidgetButtons extension's assets. [Ticket #2530952]

  * See also Widget and extensions for changes to dependencies.

3.4.0
-----

  * Initial release.



Plugin Change History
=====================

3.4.1
-----

  * No changes.

3.4.0
-----

  * No changes

3.3.0
-----

  * No changes

3.2.0
-----

  * Fixed onHostEvent to actually use on (was using after)
  * Plugin.Base can now be mixed in as an extension

3.1.1
-----

  * No changes

3.1.0
-----

  * Added separate host method and host event specific subscription methods,
    to resolve inconsistency when using doBefore/doAfter in cases where the 
    host supported both an event and a method of the same name. 

3.0.0
-----

  * No changes

3.0.0 beta 1
------------

  * Moved Y.Plugin to Y.Plugin.Base

  * Host/Owner object now available through public "host" attribute, 
    as opposed to protected _owner property (this.get("host"))

3.0.0PR2 - Initial release
--------------------------



Plugin Host Change History
==========================

3.4.1
-----

  * No changes.

3.4.0
-----

  * No changes.

3.3.0
-----

  * Broke pluginhost into pluginhost-base, pluginhost-config

    pluginhost-base provides the core plug/unplug methods.

    pluginhost-config provides support for constructor configuration
    and static configuration of plugins.

  * Added log statement if an invalid plugin is provided

3.2.0
-----

  * No changes

3.1.1
-----

  * No changes

3.1.0
-----

  * Plugins now destroyed correctly, when host is destroyed.

3.0.0
-----

  * Split out of "base" as a standalone module, for use by Node.



QueryString Utility Change History
==================================

3.4.1
-----

  * No changes.

3.4.0
-----

  * No changes.

3.3.0
-----

  * The stringify method in querystring-stringify and
    querystring-stringify-simple now accepts a configuration object in the
    second argument. All configuration properties are optional.
    
    For querystring-stringify-simple, the configuration object contains only
    one property: arrayKey.  The default value is false.
    
    For querystring-stringify, the configuration object can be defined with
    three properties (default values are in parenthesis): arrayKey (false),
    eq (=), and sep (&).
    
3.2.0
-----

  * Fixed malformed HTML entities in JSON response, when using
    `io-upload-iframe`. [Ticket #2528646]

  * Fixed configuration HTTP headers should override preset HTTP headers, when
    identical. [Ticket #2528893]

3.1.2
-----

  * No changes.

3.1.1
-----

  * No changes.

3.1.0
-----

  * Initial release.



Queue Promote Change History
============================

3.4.1
-----

  * No changes.

3.4.0
-----

  * Fixed bug in `promote()` method where the item moved to the head of the
    queue was wrapped in an array.

3.3.0
-----

  * No changes.

3.2.0
-----

  * No changes.

3.1.1
-----

  * No changes.

3.1.0
-----

  * No changes.

3.0.0
-----

  * `queue-base` is now part of `YUI`. `queue-run` was renamed `async-queue` and
    both it and `queue-promote` are now independent modules.

3.0.0beta1
----------

  * Overhaul: Broken into `queue-base`, `queue-promote`, and `queue-run`.

3.0.0pr2
--------

  * No changes.

3.0.0pr1

  * Initial release.



Recordset Change History
========================

3.4.1
-----

  * No changes.

3.4.0
-----

  * No Changes.

3.3.0
-----

  * Initial Release.



Resize Utility Change History
=============================

### 3.4.1

No changes.

### 3.4.0

   * #2529992 Allow Resizable nodes be used with DD.Delegate
   * #2530007 [Pull Request] - #2529992 Allow Resizable nodes be used with DD.Delegate

### 3.3.0

Initial release



ScrollView Change History
=========================

3.4.1
-----

  * Fixed incorrect scroll width/height calculations to account for
    translate (for real this time) on Chrome, and now Safari. 

    translateZ applied for h/w acceleration was resulting in the incorrect 
    scroll values.

  * Removed fallback to cb.scrollWidth/Height, when determining scroll dimensions.
    This was masking the real problem with translate impacting boundingBox scroll 
    width/height calcs mentioned above.

  * Fixed scrollbar racing ahead of scroll position on FF 5+ with native transition
    support enabled.

  * Added ability to disable scrollview completely, disable flick or disable drag
   
    // Stops SV from moving through flick/drag or the API.
    sv.set("disabled", true); 

    // Stops SV from reacting to flick. Can still drag/scroll through API
    sv.set("flick", false);
 
    // Stops SV from reacting to drag. Can still flick, scroll through API
    sv.set("drag", false);  

  * Resync UI on scrollview-list class application.

3.4.0
-----

  * Fixed _uiDimensionsChange code which was looking explicitly for 
    the "width" attribute. Just plain wrong.

  * Added vertical paging support.

  * Removed DOMSubtreeModified event listening which was only really kicking
    in for Webkit and was too heavy handed. User now needs to call syncUI() 
    manually on all browsers, if the content of the scrollview is changed, 
    and may potentially result in dimension changes.

  * Broke out use of transform3d into a seperate method, and added a protected
    flag, _forceHWTransforms, to allow for customization if required 
    (H/W acceleration related glitches or changing the set of browsers for 
    which we attempt to force it).

  * Created Scrollview-List plugin to provide out-of-the-box handling of
    List (LI) content inside horizontal and vertical ScrollViews. 

  * Fixed incorrect scroll width/height calculations on Chrome 9+, FF
    when syncUI() [ or _uiDimensionsChange() ] was called when the ScrollView
    was scrolled over.
 
  * Protected state flags are now reset if _uiDimensionsChange results in
    flipped orientation.

  * Use the larger of bb.scrollWidth/Height or cb.scrollWidth/Height, to calculate
    scroll dimensions to account for FF (which clips cb.scrollWidth) and 
    Chrome/MacOS (which clips bb.scrollWidth when translated even after 
    incorrect scroll calcs above).
  
3.3.0
-----

  * Fixed shared scrollbar node across multiple instances.

  * Changed async call to _uiDimensionsChange after render, to a sync call.

  * Corrected skin prefix to be yui3-skin-sam instead yui-skin-sam.

  * Refactored for kweight, and broke out scrollview-base-ie conditional module.

  * Don't prevent default on gesturemoveend, so that click listeners on 
    elements inside the scrollview respond reliably. Panning is still prevented 
    by preventing gesturemousemove.

  * Removed generic CSS in scrollview-base.css targeting UL/LI content. The 
    rules were added to support the common use case, but were too broad, and in 
    general, scrollview is content agnostic.

  * The same support can be achieved by adding cssreset to the page (to remove
    LI bullets, padding, margin), and adding inline block rules, when providing
    horizontal scrollview content as a list. These rules are provided below:

    /* To layout horizontal LIs */
    #my-horiz-scrollview-content li {
      display: inline-block;
       *display: inline;
       *zoom:1;
    }

    /* For IE - needs a non-transparent background to pick up events */
    #my-scrollview-content li {
      *zoom:1;
      background-color:#fff;
    }

  * Added prefix-less border radius scrollbar styles for IE9.

  * Made scrollbar-paginator skinnable:false. It has no CSS which is applied,
    out of the box currently. The paginator CSS shipped in 3.2.0, was not actively
    applied.

3.2.0
-----

  * New beta component



Simple YUI Change History
=========================

3.4.1
-----

  * No changes.

3.4.0
-----

  * No changes.

3.3.0
-----
  
  * No changes.

3.2.0
-----

  * Initial release.



Slider Change History
=====================

3.4.1
-----

  * No changes.

3.4.0
-----

  * No changes.

3.3.0
-----

  * Default `thumbUrl` no longer broken when using the seed file from the combo
    service.

3.2.0
-----

  * Leverages touch events when the UA supports them.

  * (un)Swapped skin files for `audio` and `audio-light` skins.

3.1.1
-----

  * No changes.

3.1.0
-----

  * [!] Major refactoring. Broken into `SliderBase`, `ClickableRail`, and
    `SliderValueRange` classes, and `Y.Slider` is the product of
    `Y.Base.build(…)` of these. `SliderBase` is responsible for rendering the UI
    and broadcasting `slideStart`, `slideEnd`, and `thumbMove` events.
    `ClickableRail` adds support for clicking on the `rail` to move the `thumb`.
    `SliderValueRange` adds support for `min`, `max`, and `value` attributes.
    Values are integers ranging from 0 to 100 by default. `Base.build()` in
    different value algorithms or extensions to specialize from `SliderBase`.

  * [!] `railSize` attribute renamed to `length`.

  * [!] `maxGutter` and `minGutter` attributes removed. Use CSS and/or apply
    manually via `slider._dd.con.set('gutter', …);`.

  * [!] `rail`, `thumb`, `thumbImg` `Node` attributes removed, as well as
    `HTML_PARSER` support. Progressive enhancement stems from a value source,
    not a markup source. Various progressive enhancement extensions will arrive
    in future versions.

  * Sam skin updated and 7 new skins added (`sam-dark`, `round`, `round-dark`,
    `capsule`, `capsule-dark`, `audio`, `audio-light`).

  * New markup and CSS structure including separate shadow image (set to same
    image as thumb, positioned via CSS ala sprite.

  * Thumb placement method changed from `setXY()` and `DD` positioning methods
    to simpler `setStyle('left', x)` or `top` for vertical Sliders. Allows
    rendering and modifying in hidden containers without the need to `syncUI()`
    when making visible. Still recommended to call `syncUI()` if rendered off
    DOM, but may not be necessary if using Sam skin. YMMV.

3.0.0
-----

  * Removed noop `_setValueFn()` and the setter config for the `value`
    attribute.

  * Renamed static protected `AXIS_KEYS` to `_AXIS_KEYS`.

  * Renamed `_defUpdateValueFromDD` to `_defThumbDragFn` per naming conventions.

  * Added `_convertOffsetToValue` to mirror `_convertValueToOffset`.

3.0.0beta1
----------

  * Renamed the `valueSet` custom event to `positionThumb` and rejiggered the
    logic of the default function and support methods.

  * renamed `_defSyncUI` to `_defSyncFn` for library nomenclature consistency.

  * Added protected `_convertValueToOffset` to help position the thumb.

  * Set `bubble: false` on the `DD.Drag` instance.

3.0.0pr2
--------

  * Initial release.



Sortable Utility Change History
===============================

### 3.4.1

No changes.

### 3.4.0

No changes.

### 3.3.0

   * #2529220 Sortable does not allow dragging from original container to a different container back to original i...

### 3.2.0

   * #2529063 Sortable: add getOrdering method
   * #2528754 Sortable with nested lists
   * #2528761 Request for Sortables to provide events from->to
   * #2528769 Scroll Sortables
   * #2528819 Sortable allows child div to move outside parent div
   * #2529061 Sortable.destroy removes node


### 3.1.1

No changes.

### 3.1.0

Initial Release



StyleSheet Change History
=========================

3.4.1
-----

  * No changes.

3.4.0
-----

  * No Changes.

3.3.0
-----

  * No changes.

3.2.0
-----

  * No changes.

3.1.1
-----

  * No changes.

3.1.0
-----

  * No changes.

3.0.0
-----

  * No changes.

3.0.0beta1
----------

  * Initial release.



Substitute Utility Change History
=================================

3.4.1
-----

  * Now replaces everything if not undefined instead of only objects,
    strings and numbers (@satyam)
  * Added `{LBRACE}` and `{RBRACE}` as possible replacement strings so that
    braces can be included in the resulting string (@satyam)
  * Improved the restoration of undefined replacements (@satyam)

3.4.0
-----

  * No changes.

3.3.0
-----

  * No changes.

3.2.0
-----

  * No change to this utility, but `Y.Lang.sub()` was added to the YUI core.
    This is a lightweight version of the substitute utility that follows the
    same templating syntax, but lacks recursive replacements, object dumping,
    and string formatting. The advantage is that it is very small, and available
    in the YUI core -- perhaps the regular expression implementation will be
    faster than the string manipulation that happens in substitute in some
    situations.

3.1.1
-----

  * No changes.

3.1.0
-----

  * Substitute has a `recurse` option to support nested templates (the previous
    default behavior). Normal operation is now a single level substitution
    which is tolerant of brackets in the replacement string.

3.0.0
-----
    
  * No changes.

3.0.0beta1
----------

  * No changes.

3.0.0pr1
--------

  * Initial release.



SWF Utility Change History
==========================

3.4.1
-----
  * No changes.

3.4.0
-----
  * No changes.

3.3.0
-----
  * Fixed an undefined variable bug
  * Fixes to documentation

3.2.0
-----
  * Added allowedDomain flashvar to pass the security settings to YUIBridge.

3.1.2
-----
  * No changes
	
3.1.1
-----
  * No changes
	
3.1.0
-----
  * Initial Release



SWFDetect Utility Change History
================================

3.4.1
-----

  * No changes.

3.4.0
-----

  * No changes.

3.3.0
-----
  * Added API documentation

3.2.0
-----
  *	Contribution by Ryan Cannon: #2529113 fixed logic in isFlashVersionAtLeast() to 
	account for omitted minor and revision versions of the Flash player.

3.1.2
-----
  * No changes
	
3.1.1
-----
   * No changes
	
3.1.0
-----
   * Initial Release


TabView Change History
======================

3.4.1
-----

  * No change.


3.4.0
-----

  * Now accepts a Node instance for the Tab `content` attribute. [Ticket 2529830]


3.3.0
-----

  * No change.


3.2.0
-----

  * Bug fix: No longer requesting non-existent tabview-plugin.css. [Ticket 2529830]


3.1.1
-----

  * Bug fix: Allow for nested TabView widgets. [Ticket 2528737]
  * Bug fix: Removed default styling from core CSS. [Ticket 2528782]


3.1.0
-----

  * Initial release



Text Change History
===================

3.4.1
-----

  * No changes.


3.4.0
-----

  * No changes.


3.3.0
-----

  * Initial release.



Transition Change History
=========================

3.4.1
-----
  * No change.

3.4.0
-----

  * The transition module now conditionally loads transition-timer as needed.

  * Native transitions are now used when possible for Firefox.


3.3.0
-----

  * Removed transition events in favor of config/callback.

  * Added workaround for webkit transition issue with "auto" values.
    [Ticket 2529354]

  * Bug fix: Added workaround for Native callbacks failing to fire when
    transitioning to current value. [Ticket 2529397]

  * Bug fix: Timer-based were throwing errors if the node is removed AND
    destroyed. [Ticket 2529519]

3.2.0
-----

  * Initial release.




Uploader Utility Change History
===============================

3.4.1
-----
  * No changes in source code
  * Minor example changes

3.4.0
-----
  * No changes

3.3.0
-----
  * Minor changes in documentation

3.2.0
-----
  * Initial release


Widget Change History
=====================

3.4.1
-----

  * No changes.

3.4.0
-----

  * Added workaround in destructor for single box widgets (contentBox === boundingBox)
    Also extracted DOM removal into separate method, which can be overridden
    if custom widgets don't want rendered DOM removed.

  * Fixed UI_EVENTS js exception when dealing with nested widgets rendered 
    by different Y instances.

  * Fixed UI_EVENTS invoking nested widget listeners more than once (also
    fixed regression to Parent-Child as a result of this change).

  * Added support for destroy(true) to Widget, which will remove and
    destroy all child nodes (not just the boundingBox and contentBox)
    contained within the Widget's boundingBox in order to help control
    Node cache size over long-running applications.

    destroy() will maintain its current behavior due to the potentially 
    high run-time cost of destroying all child nodes.

    Widget developers still need to continue with the best practice of 
    destroying explicit node references they create, in their destructors 
    to support the destroy() case.
	
3.3.0
-----

  * HTML_PARSER now return null instead of an empty node list, if no nodes
    are found, when using the [selector] syntax, so that the default value
    will be applied for the attribute.

  * UI_EVENTS support and skin util methods (only getSkinName currently) 
    broken out of widget-base into separate submodules, widget-uievents and 
    widget-skin. 
  
  * widget-base-ie broken out as conditional module.

  * Fixed widget-locale support. Needed lazyAdd:false, for strings attribute

  * Changed widget UI_EVENTS type parsing, to use EventTarget.parseType and 
    removed after() override, since everything ends up going through on() 
    eventually. 

3.2.0
-----

  * Minimized widget dependencies from the complete node, base rollups,
    to only the node and base submodules widget actually uses

  * Fixed issue in UI_EVENTS handling, where removing the last listener for
    a ui event, didn't clear out the _delegates hash even though the handler
    was detached (for example,  in tabview, if you remove all tabs, and then 
    add a new tab, clicking on the new tab didn't work.)

3.1.1
-----

  * Fixed ticket #2528758 : using widget's DOM event facade ends with error during destroy
  * Fixed ticket #2528760 : _applyParsedConfig merges arrays, instead of letting user config win
  * "init, render and destroy listeners now called synchronously, if event already fired (see Event README)"

3.1.0
-----

  * "render" event now published with the defaultTargetOnly set to true.

  * Added support for MyWidget.CSS_PREFIX static property 
    to let developers define their own CSS PREFIX instead of 
    yui-<MyWidget.NAME>. 

  * Changed default value for the tabIndex attribute to null, meaning by default 
    a Widget's bounding box will not be a focusable element.

  * Widget now has built-in support for Progressive Enhancement.  

    1. The document element (HTML) is now stamped with a class name 
       (yui-js-enabled) indicating that JS is enabled allowing for the 
       creation of JS-aware Widget CSS style rules for Progressive Enhancement.

    2. Widget has support for a class name representing the "loading" 
       state that can be used in combination with the "yui-js-enabled" class name 
       to create style rules for widgets that are in the process of loading.  
       There is support for use of both a generic Widget and type-specific 
       Widget class name by default (for example:  "yui-widget-loading" and 
       "yui-tabview-loading").

    3. Widget's renderer will remove the "loading" class names from the 
       bounding box allowing the fully rendered and functional widget to be 
       revealed.
  
    Developer Usage / Requirements
  
    Developers can take advantage of the system by following two steps:
  
    1. Simply stamping the bounding box of their widgets with the 
       corresponding "loading" state class name.  The idea being that the markup
       for this widget is already on the page, and the JS components required 
       to transform/bring the widget to life are in the process of loading.
      
    2. Providing the definition of the loading style for the widget(s).
  
  * Removed parentNode.inDoc() check from render, to allow implementations
    to render to parentNodes which are document fragments. If rendering to 
    a document fragment, the implementation is responsible for adding the 
    document fragment to the document during the render lifecycle phase.

  * Split widget module into the following sub-modules

    1. widget-base : Core lifecycle and API support. 
    2. widget-htmlparser : HTML parser support.

    The "widget" module, is a roll up of the widget-base and widget-htmlparser 
    submodules. 

    The widget-locale is a standalone module, which contains the deprecated
    Internationalization support and has been replaced by the Y.Intl language
    pack support, to allow strings to be defined separately from code.

  * Removed moveStyles support for 3.1. Can be re-added if required, but 
    currently does not seem to be in use. 

  * Made render event fireOnce (along with init and destroy in Base) 

  * Widget will now fire user-generated events like DOM elements do (e.g. 
    'click', 'mouseover').  Like all other Widget events, these events are 
    prefixed with the Widget name (e.g. 'menuitem:click') and the default 
    context of the event listener will be the Widget that fired the event.

    The goals/purpose of the Widget UI events are: 

    1. Provide developers with the ability to listen for UI events as though the 
       Widget is an atomic element, as opposed to DOM events that will bubble up 
       through all of the elements that compose a Widget's UI.

    2. These are events that many Widget instances are going to want to publish 
       and fire, so Widget does this by default to ensure that these events are
       fired in a performant, consistent way across Widget implementations.

    Additional info:

    1. Widget developers don't have to explicitly publish a given UI event in 
       order for Widget consumers to listen for them.  By default UI events are
       only published and fired if someone is listening for them.
       
    2. Widget developers can choose to publish a given UI event in order to 
       explicitly control some aspect of the event.  The most likely use case
       is the desire to provide the default implementation/handler for a given 
       event.  For example: a developer might want to publish a click event 
       for a Menu Widget with the goal of providing the default click 
       implementation/function (what gets canceled if a listener calls 
       the preventDefault() method.)

    3. The set of user-generated events published by widget is defined by the 
       UI_EVENTS prototype property.  Widget developers can use this property 
       to pair down or extend the number of events that are published and 
       fired automatically.
  
    4. For performance, these events are only created when someone is 
       listening, and the actual firing of these events is facilitated by a 
       single, delegated DOM event listener.  

  * content box now expands to fill bounding box. CSS is used for browsers
    which support box-sizing:border-box. Expansion is handled programmatically 
    for others (currently IE6 & IE7). Maybe some edge cases which need 
    resolution.

  * Added an "id" attribute.

  * Added support for auto-rendering of widgets at the end of construction, 
    using the "render" attribute.

  * Added support for single-box widgets (contentBox and boundingBox can 
    point to same node). 

    Widget developers can set CONTENT_TEMPLATE to null if they have a 
    widget which doesn't need dual-box support.

  * Added _bindAttrUI and _syncAttrUI sugar methods, to bind after listeners
    and sync methods, by attribute name.

  * The widget's bounding box is now removed from the DOM and destroyed
    when the widget it destroyed.

  * Added "srcNode" attribute, which acts as the root for HTML_PARSER.
 
    This allows widgets to support progressive enhancement, without having
    to put the burden on the user to create and point to bounding boxes,
    or content boxes.

  * Added protected _getSrcNode and _applyParsedConfig methods to allow for 
    HTML_PARSER customization, by allowing Widget developers to customize 
    the node passed into _parseNode on the input side, and the final merged
    configuration on the output side of the srcNode parsing process. 

    The default Widget _getSrcNode implementation uses "srcNode" if set, 
    otherwise falls back to "contentBox", for 3.0.0 compatibility.

    The default Widget _applyParsedConfig implementation aggregates the user
    configuration literal, with the configuration output from parsed node,
    with the user configuration taking precedence. 

    NOTE: All HTML_PARSER related changes are backward compatible. 

    Existing Widget implementations should still work. However HTML_PARSER 
    implementations based on contentBox being the root node should be
    modified to work off of srcNode before the 3.1.0 release.

3.0.0
-----

  * No Changes

3.0.0 beta 1
------------

  * PluginHost moved down to Base.

  * Render event args added to event facade instead of being passed
    across separately (e.parentNode).

  * "hasFocus" attribute renamed to "focused"

  * "focused" attribute is read only

  * "focused" attribute is set via:
    1. user interaction
    2. the "focus" and "blur" methods

  * Only one DOM focus event handler is used now (two for WebKit) and it is 
    bound to the widget's ownerDocument.  This allows modal widgets to maintain
    a reference to the element in the document that previously had focus and 
    to be able to restore that focus when the modal widget is hidden.

  * "tabIndex" attribute was updated
    1. accepts a number or null
    2. more documentation

3.0.0PR2 - Initial release
--------------------------




Widget Anim Change History
==========================

3.4.1
-----

  * No changes.

3.4.0
-----

  * No changes.

3.3.0
-----

  * No changes.

3.2.0
-----

  * No changes.

3.1.1
-----

  * No changes.

3.1.0
-----

  * Initial release.



Widget Autohide Change History
==============================

3.4.1
-----

  * No changes.

3.4.0
-----

  * Initial release.



Widget Buttons Change History
=============================

3.4.1
-----

  * Added support for `classNames` property for button configurations which will
    add the CSS class names to the button Node. The default "close" button uses
    this, adding a `yui3-button-close` CSS class to itself. [Ticket #2531091]

  * Fixed the default template for the "close" button to not contain malformed
    HTML by replacing the `<div>` element inside of a `<span>` with a `<span>`.
    The in-lined CSS in the style attribute on the button was moved into an
    external CSS file which provides the basic styling for the default "close"
    button for both the Sam and Night skins. The CSS class `yui3-widget-buttons`
    is now applied to the `boundingBox` of Widgets which use WidgetButtons.
    [Ticket #2530952]

  * Fixed a bug where instance-level properties were not being initialized
    causing references to bubble-up the chain to the prototype incorrectly.
    [Ticket #2530998]

3.4.0
-----

  * Initial release.



Widget Child Change History
===========================

3.4.1
-----

  * No changes.

3.4.0
-----

  * No changes

3.3.0
-----

  * Changed instanceof to Y.instanceOf, to prevent leaks in IE7

3.2.0
-----

  * No changes

3.1.1
-----

  * No changes

3.1.0
-----

  * Add new ROOT_TYPE property to constrain the behavior of the "root" attribute 
    to instances of a specified type
    
  * Fixes to remove method so that it always returns a reference to the 
    child removed



Widget Modality Change History
==============================

3.4.1
-----

  * Fixed focus-contention issues which caused infinite recursion when multiple
    modal Panels were visible on the page at the same time. [Ticket #2530953]

  * It is now possible to instantiate a Widget that uses the WidgetModality
    extension without needing to pass in a configuration Object.
    [Contributed by Jakub Kuźma] [Ticket #2531086]

  * Replaced references to `document` with `Y.config.doc`. [Ticket #2531220]

3.4.0
-----

  * Initial release.



Widget Parent Change History
============================

3.4.1
-----

  * Fixed issue with children not being destroyed, when
    parent.destroy() is called.

  * Added if (sibling.get("rendered")) check before trying to insert 
    children after/before siblings. This is not required for the out of
    the box Parent/Child implementation, but is useful for custom 
    implementations which customize children to render asynchronously.

    See #2529863

  * Fixed issue where previously rendered children, added to an empty parent,
    would not get rendered into the parent's child container node.

    Based on the pull request from andreas-karlsson, with the root fix *and* unit
    test (nicely done): https://github.com/yui/yui3/pull/25

3.4.0
-----

  * No changes

3.3.0
-----

  * Changed instanceof to Y.instanceOf, to prevent leaks in IE7
  * Renamed "type" in child configuration, to "childType", so that
    children can have a "type" attribute for it's own context
    (A FormElement widget for examplei, with a "type").

    "type" is still supported but deprecated for backward compatibility,
    so it's only used to define a child widget type if "childType" is not
    provided.
  * Fixed remove(), to actually remove child from DOM also.

3.2.0
-----

  * No changes

3.1.1
-----

  * No changes

3.1.0
-----

  *   "childAdded" event renamed to "addChild"
  *   "childRemoved" event renamed to "removeChild"
  *   Now augmented with Y.ArrayList
  *   "selection" attribute now returns an Y.ArrayList or Widget
  *   Removed "children" attribute since that functionality is provided 
      by Y.ArrayList
	  -  Can retrieve # of child via the size() method
	  -  Can iterate children via this.each()
	  -  Can retrieve a individual child via the item() method
  * add method will always return a Y.ArrayList instance for easy chaining
  * removeAll method will always return a Y.ArrayList instance for easy chaining
  * added selectAll() and deselectAll() methods
  * widget UI will render children added/inserted children after widget is rendered
  * widget UI will update when a child is removed



Widget Position Change History
==============================

3.4.1
-----

  * No changes.

3.4.0
-----

  * No changes.

3.3.0
-----

  * No changes.

3.2.0
-----

  * No changes.

3.1.1
-----

  * No changes.

3.1.0
-----

  * Relatively positioned bounding boxes, will default to page position instead
    of 0,0

3.0.0
-----

  * Initial release.

  * Fixed ability to set individual x, y values.



Widget Position Align Change History
====================================

3.4.1
-----

  * The widget's alignment is now re-synced to the DOM every time the widget's
    `visible` Attribute is changed to `true`. [Ticket #2530779]

  * Syncing the current alignment to the DOM is now supported in the public API
    by calling `align()` with no arguments. [Ticket #2529911]

3.4.0
-----

  * Added `alignOn` attribute which allows the implementer to specify when the
    Widget should be re-aligned.

3.3.0
-----

  * No changes.

3.2.0
-----

  * No changes.

3.1.1
-----

  * No changes.

3.1.0
-----

  * Renamed module from `widget-position-ext` to `widget-position-align`.

3.0.0
-----

  * Initial release.



Widget Position Constrain Change History
========================================

3.4.1
-----

  * No changes.

3.4.0
-----

  * No changes.

3.3.0
-----

  * No changes.

3.2.0
-----

  * No changes.

3.1.1
-----

  * No changes.

3.1.0
-----

  * Initial release.



Widget Stack Change History
===========================

3.4.1
-----

  * The shim element is now sizing correctly the first time a widget is shown
    after it was instantiated with the `visible` Attribute set to `false`. Note:
    The shim element is only used with IE 6 by default. [Ticket #2529127]

3.4.0
-----

  * No changes.

3.3.0
-----

  * No changes.

3.2.0
-----

  * No changes.

3.1.1
-----

  * No changes.

3.1.0
-----

  * No changes.

3.0.0
-----

  * Initial release.

  * Recreate iframe shim from `TEMPLATE` for each instance, instead of cloning a
    class level cached Node instance, so that `ownerDocument` can be set to
    match the `boundingBox`.



Widget Std Mod Change History
=============================

3.4.1
-----

  * No changes.

3.4.0
-----

  * Move attribute event listeners to `_renderUIStdMod()` method so that
    `setStdModContent()` can be called on `renderUI()`.

3.3.0
-----

  * [!] Removed `_addNodeHTML()`, and renamed `_addNodeRef()` to
    `_addStdModContent()` (both private), since one method now handles both
    Strings and Node/NodeLists.

  * Changed instanceof to Y.instanceOf, to prevent leaks in IE7.

  * Moved to `node.insert()` for content management, since it now handles
    Strings, Nodes and NodeLists. This also fixes an issue where  resetting the
    content to the existing content (e.g. calling `syncUI()`), would blow away
    the content in IE.

3.2.0
-----

  * Setting content to `null` (or `undefined`, or `NaN`), will remove section
    from the std mod.

3.1.1
-----

  * No changes.

3.1.0
-----

  * Changed widget stdmod `renderUI()`/`syncUI()`/`bindUI()` to `Y.before`, so
    that they are called before the Widget implementation, and setup the
    `header`/`body`/`footer` Node references for the Widget impl to use.

  * Setting section content to `""` will now create the respective section.

  * Fixed `fillHeight`, to work with `contentBox` height, now that it fills
    `boundingBox`.

  * Fixed `setStdModContent("markupString", AFTER | BEFORE)` so that it uses
    `node.append()`, `node.prepend()` instead of `innerHTML` to maintain event
    listeners.

  * `fillHeight` is now invoked when `height` is changed. It was not being
    invoked because of a typo in the event name.

3.0.0
-----

  * Initial release.

  * Cleaned up the way `headerContent`, `bodyContent`, `footerContent` are
    configured, so that the actual stored value is always accurate, without the
    need for a getter which talks to the DOM directly.

  * Recreate sections from `TEMPLATE` string for each instance, instead of
    cloning a class level cached Node instance, so that `ownerDocument` can be
    set to match the `contentBox`.

  * Replaced use of `innerHTML` for progressive enhancement use case with a
    Document Fragment when parsing and then setting `headerContent`,
    `bodyContent`, `footerContent` in `HTML_PARSER` impl, to maintain event
    listeners etc.



YQL Change History
==================

### 3.4.1

    No changes.

### 3.4.0
    
    #2530246 - Fixed bug in yql module where options ('opts') were not actually being used.  This prevented use YQL calls over SSL, which some tables require.

### 3.3.0

    #2529504 - Added support for JSONP allowCache setting to make YQL requests use the same callback

### 3.2.0

    Initial Release



YUI Core Change History
=======================

3.4.1
-----

* Sparse arrays are now handled correctly in the non-native fallback
  implementation of `Y.Array.indexOf()`. [Ticket #2530966]

* `Y.mix()` will no longer shadow prototype properties on the receiver unless
  the `overwrite` parameter is true. This was the pre-3.4.0 behavior, but was
  changed in 3.4.0. We're changing it back to preserve backwards compatibility.
  [Ticket #2530501]

* The non-native fallback implementation of `Y.Object.keys()` now contains a
  workaround for buggy browsers that treat function `prototype` properties as
  enumerable in violation of the ES5 spec.

* `Y.Object.size()` now returns `0` for non-objects. This was the pre-3.4.0
  behavior, but regressed in 3.4.0. [Ticket #2531069]


3.4.0
-----

* Added `Y.Array.dedupe()`, which provides an optimized solution for deduping
  arrays of strings. When you know an array contains only strings, use `dedupe`,
  since it's faster than `unique`.
* `Y.Lang.isArray()` now uses the native ES5 `Array.isArray()` method when
  possible.
* `Y.Object()` now uses the native ES5 `Object.create()` method when possible.
* `Y.Object.keys()` now uses the native ES5 `Object.keys()` method when
  possible.
* Sparse arrays are now handled correctly in the non-native fallback
  implementations of `Y.Array.each`, `Y.Array.hash`, and `Y.Array.some`.
  [Ticket #2530376]
* Added async:true support to Get, to dispatch scripts/link nodes in parallel.
  NOTE: Order of execution is not guaranteed (it's not required for the YUI
  Module use case, for which this feature was introduced - to improve performance).
  onSuccess is called once, after all files are loaded.
* Added onProgress callback support to Get, which is useful when dispatching
  multiple scripts using the [] syntax. onProgress is called when each script
  is done loading.


3.3.0
-----

* Added fast path for repeat calls to `use()` with the same arguments.
* Added a `Y.destroy()` method, which destroys the YUI instance.
* Added `Y.Lang.now()`, which returns the current time in milliseconds.
* Added `YUI.GlobalConfig` to allow three stages of configuration
  (`YUI.GlobalConfig` --> `YUI_Config` --> instance configs). This is helpful in
  non-browser environments for supplying a global config for the YUI container.


3.2.0
-----

* Added `Y.Lang.sub()`, which is a very lightweight version of `Y.substitute()`.
* `Y.Array.hash()` no longer skips falsy values.
* Script errors in module and `use()` callback functions are caught and routed
  through `Y.error`.
* `Y.error` invokations can be monitored with the `errorFn` configuration.
* Returning `true` from the `errorFn` will prevent the script error from halting
  further script execution.
* Added UA properties for mobile devices and ensured that UA is only evaluated
  once.
* The YUI global will overwrite itself when included again, while attempting to
  preserve the global environment of previous instances.
* Added a remote loader service submodule.
* Added a features submodule.  This is used by the capability-based loader
  when dispatching to a remote loader service.


3.1.1
-----

* Removed the limit on the number of config objects you can supply to the
  `YUI` constructor.


3.1.0
-----

* YUI will attempt to fetch newly discovered dependencies after a module is
  dynamically loaded.
* The `documentElement` (`<html>`) is now stamped with a `yui3-js-enabled`
  classname to indicate that JS is enabled. This allows for the creation of
  JS-aware CSS style rules that progressively enhance the page.
* Added the ability to define a global configuration object (`YUI_config`).
* Added `Y.Object.some()` and `Y.some()`, which are analogous to
  `Y.Array.some()`.
* UA refinements for Chrome, Android and other browsers/platforms.
* Inserted script nodes get `charset="utf-8"` by default.
* Added `last()` to `Queue` for LIFO support.
* Added throttle utility to buffer expensive functions that are called
  frequently.
* The `YUI.add()` callback now gets the module name as the second parameter for
  generic processing of similar modules.
* Added `intl-base` submodule to process the decision tree for selecting
  language packs when dynamically loading internationalized modules.
* `Y.guid()` generates identifiers that are safe to use as HTML attributes.
* Improved persistent messaging for missing modules/functionality.
* Bootstrapping improved to prevent simultaneous loading of resources when
  multiple instances are launched at the same moment.
* The YUI script source URL is read in order to try to dynamically determine the
  base path for loading resources on demand.
* The core loads without errors in non-browser environments.


3.0.0
-----

* Extracted the loader from the seed file. If loader is not available, but `get`
  is and dependencies are missing, the loader will be fetched before continuing.
* User agent detection is more granular. For example, Firefox 3.5 reports Gecko
  1.91 rather than 1.9.
* Fixed `Y.UA.os`.
* Added additional mobile device detection.
* Get utility cleans up attribues before purging nodes.
* `Y.cached` accepts a parameter to refresh a cached value.
* `yui-log` and `yui-later` are now optional modules that are included with
  `yui.js`.
* `queue-base` is no longer a submodule of `queue` -- it's now part of
  `yui-base`.
* All YUI submodules end up in the `yui` build directory.
* Dynamic loading can be disabled by setting the `bootstrap` config to `false`.


3.0.0 beta 1
-----

### Core

* `Y.fail` has been renamed to `Y.error` so that `Y.fail` can be used for the
  assertion engine.
* `Y.stamp` now accepts a `readOnly` parameter to be used when you are only
  interested in reading an existing guid rather than creating a new one.
* `Y.stamp` defends against stamping items that can't be stamped.
* Added to `Y.Object`: `values()`, `hasKey()`, `hasValue()`, `size()`,
  `getValue()`, `setValue()` (the latter two are for manipulating nested
  values).
* `Y.use` calls are queued during dynamic loading.
* Added `Y.cached` for function memoizing
* Added `numericSort` to `Y.Array`.
* The `yui:log` event broadcasts globally.

### Lang

* Added `Y.Lang.type` (`typeof` abstraction) and refactored some 'is' methods to
  use it.

### Get

* Accepts an attribute collection config to apply to inserted nodes.
* `id` attributes are globally unique
* Now accepts `purgethreshold` as a config option. This will set the number of
  transactions required before auto removing nodes from previous transactions
  (default is 20).

### Loader

* `yuitest` renamed to `test`, now requires `collection`.
* Lots of new module metadata.
* Added `onCSS`.
* Loader requests are queued globally.
* Accepts `jsAttributes` and `cssAttributes` configs for adding attributes to
  inserted nodes
* Added `force` config.

### UA

* Added `secure` property for SSL detection.
* Added `os` property for OS detection.
* Added Adobe Air and Google Caja detection.


3.0.0pr2
--------

### Core

* The initial dependency calculation should not allow automatic rollup.
* `Y.fail` will throw/rethrow errors by default (`throwFail` is now `true`).
* `Y.namespace` reverted to scrub `YAHOO` out if included as the first level of
  the namespace.
* `useConsole` config changed to `useBrowserConsole`.


### Array

* Added `Y.Array.some()`.


### Get

* Protects against trailing commas in the array of files to load.


### Loader

* `get` requires `yui-base`.
* `loader` requires `get`.
* Combo URL build process defends against undefined modules.
* Added combo handler support for CSS.
* Filters are correctly applied to combo and fullpath URLs.
* Added `compat`, `profiler`, `yuitest`, `widget`, `stylesheet`,
  `classnamemanager`, `overlay`, `plugin`, `slider`, and `console` modules.
* Added `io` submodules.
* `queue` requires `event`.
* Added submodule metadata logic.
* Added plugin metadata logic.
* Added skin metadata logic.


3.0.0pr1
--------

* Initial release.



YUI Throttle Change History
===========================

## 3.4.1

No changes.

## 3.4.0

Removed from yui-core and bumped to a stand alone module.



