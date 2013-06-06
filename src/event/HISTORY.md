Event Infrastructure Change History
===================================

3.10.3
------

* No changes.

3.10.2
------

* Fixed `nodelist.on()` for rare custom module use cases.

  In certain rare custom module loading circumstances [#2533242,
  https://github.com/yui/yui3/pull/689] dom-core is attached after
  event-base, which resulted in the `YDOM = Y.DOM` module level reference
  being undefined [1].

  This would break things like `nodelist.on()` which used the reference
  under the hood.

  [1] Added in 3.7.3, as part of the Win8 `isWindow()` fix.

* Fixed DOM event facade, when Y instance was set to emitFacade:true.

  With the Y instance's emitFacade set to true, DOM event subscriptions
  would receive a Y.EventFacade instance instead of a Y.DOMEventFacade
  instance, and as a result target and currentTarget would be set to
  the Y instance, instead of a Y.Node instance.

3.10.1
------

* No changes.

3.10.0
------

* No changes.

3.9.1
-----

* No changes.

3.9.0
-----

* `delegate()` now silences events originating from disabled form controls in
  IE, like it does natively in other browsers. [#2532677]

3.8.1
-----

* No changes.

3.8.0
-----

* No changes.

3.7.3
-----

* Changed onbeforeactivate feature test to account for Win 8 packaged Apps, which
  don't allow inline JS code in innerHTML.

  http://msdn.microsoft.com/en-us/library/windows/apps/hh465388.aspx

3.7.2
-----

* No changes.

3.7.1
-----

* No changes.

3.7.0
-----

* Changed event-synthetic, to support CustomEvent performance optimizations.

  Mainly the deprecation of CustomEvent subscribers and afters instance properties,
  which event-synthetic was referring to directly. The direct reference was replaced
  by a public API method call.

  See src/event-custom/HISTORY.md for more details about the deprecated properties.

* `event-tap` was migrated from Gallery and it supports "fast-click" on touch
  devices.

* Added try/catch around the internal window unload listener event-base adds,
  so that YUI works in Chrome Packaged Apps. They don't support unload,
  but still have a window.onunload, so no real way to feature test without
  a try/catch anyway.

3.6.0
-----

* No changes.

3.5.1
-----

  * No changes.

3.5.0
-----
  * `event-simulate` references to `window` replaced with `Y.config.win`
    [#2531223]
  * `event-resize` no longer throws an exception in IE [#2531310]
  * "avilable" and "contentready" handlers that throw exceptions no longer
    result in infinite polling [#2531375]
  * Added `event-touch`, `event-flick`, `event-move`, and `event-valuechange` to
    the `event` virtual rollup in accordance with the docs.
  * 'key' event does a better job parsing character filters. Uses `e.which`
    instead of `e.keyCode` or `e.charCode`.
  * `node.delegate('focus', fn, '.not-focusable')` now works.  Properly supports
    delegation where the filter matches non-focusable parent nodes of the
    focused target. Same for blur. [#2531334] (`event-focus`)
  * `node.delegate('focus', fn, filterThatMatchesNode); node.focus();` now
    works. [#2531734]

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
