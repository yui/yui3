Custom Event Infrastructure Change History
==========================================

3.10.3
------

* No changes.

3.10.2
------

* Fixed issue with facade carrying stale data for the "no subscriber" case.

* Fixed regression where `once()` and `onceAfter()` subscriptions using the
  `*` prefix threw a TypeError [#676]. `target.once('*:fooChange', callback)`

* Fixed exception with fire(type, null) with emitFacade:true.

3.10.1
------

* No changes.

3.10.0
------

* Significant performance improvements in common CustomEvent operations.

  There are improvements across the board, but the work was largely aimed at events
  with no listeners (to facilate speeding up `new Base()` which publishes/fires 2
  events [init, initializedChange], which usually don't have listeners).

  For example, on Chrome:

      `fire() with 0 listeners` is 6 times faster
      `fire() with 2 listeners` is 2-3 times faster (w, w/o payload)
      `publish()` is 2 times faster
      `publish() compared to _publish()` is 5 times faster (see below)
      `EventTarget construction + publish + fire with 0 listeners` is 3 times faster

  Major performance related changes are listed below.

  Commit messages have detailed descriptions of incremental changes, and the
  benefits introduced.

* Moved more properties to the `CustomEvent` prototype, to improve publish costs

* Instantiate `_subscribers`, `_afters` arrays lazily to reduce publish costs for the
  no listener case. Same thing was also done for less commonly used features, like the
  `targets` map.

* Reduce `new EventTarget` costs, by removing default properties which just match the
  `CustomEvent` defaults. It reduces the number of properties we need to iterate each time
  we mix values while publishing.

* Removed unrequired `Y.stamp` on _yuievt. It wasn't being used in the library code base

* Changed `Y.stamp` calls to `Y.guid` where it was being used to set up `id` properties.
  There didn't seem to be a need to add the `_yuid` property and it added overhead.

* Provide a fast-track for `fire` with no potential subscribers (no local subscribers, no
  bubble targets, and no broadcast), by jumping to the default function directly (if
  configured) or just doing nothing, if no default function.

* Made `*` support close to zero cost for folks who aren't using it, by only trying to look
  for siblings if someone had subscribed using `*`.

* Reduced `isObject` checks, by combining facade creation and argument manipulation
  into `_getFacade()`.

* Improved `fireComplex` times, by creating lesser used queues lazily (`es.queue`, `es.afterQueue`).

* Avoid `slice` and related arguments iteration costs for common `fire` signatures,
  (`fire("foo")`, `fire("foo", {})`) by working with arguments directly for these cases.

  Since `fire` is open-ended in terms of it's number of args, anything besides the above
  signatures still use `slice`.

* `fire(...)` now delegates to `_fire(array)` to avoid repeated conversion of `arguments` to
   arrays, across the calling stack from `eventTarget.fire()` to `customEvent.fire()`.

* Avoid `_monitor()` hops, but checking for whether or not monitoring is enabled outside
  of the function.

* Removed `Y.cached` wrapper around `_getType()`. This was an interesting one. The work
  we do to generate the key for the cache, turned out to be more than what `_getType()` costs
  if we just re-run it.

* Added a fast-path *currently private* `_publish()` for low-level, critical path
  implementations, such as Attribute and Base.

  `_publish()` doesn't provide any API sugar (e.g. type to fulltype conversation), and
  leaves the `CustomEvent` configuration to the caller to avoid iteration and mixing costs.

  The assumption is that low-level callers know about the event system architecture, and
  know what they're doing. That's why its private for now, but its 5x faster than `publish()`
  for a comparable event configuration. `publish()` leverages `_publish()`, also ends up being
  faster after this change, but not by such a big factor.

* Revert EventTarget back to lazily creating `targets`.

3.9.1
-----

* No changes.

3.9.0
-----

* No changes.

3.8.1
-----

* No changes.

3.8.0
-----

  * No changes.

3.7.3
-----

* No changes.

3.7.2
-----

* No changes.

3.7.1
-----

* No changes.

3.7.0
-----

 * CustomEvent run-time performance optimizations.

   a. [!] The `subscribers` and `afters` CustomEvent instance properties have
      been deprecated, and replaced with private arrays (instead of hashes).

      If you're referring to the `subscribers` or `afters` properties directly,
      you can set the `Y.CustomEvent.keepDeprecatedSubs` to true, to restore
      them, but you will incur a performance hit in doing so.

      The rest of the CustomEvent API is driven by the new private arrays, and
      does not require the `subscribers` and `afters` properties, so you should
      only enable `keepDeprecatedSubs` if your code is referring to the properties
      directly.

      If you are using the above properties directly, please file an enhancement
      request and we'll provide a public way to achieve the same results, without
      the performance hit before we remove the properties permanently.

   b. Avoid new EventTarget when stoppedFn is not used.

   c. Optimized mixing during the creation of a custom event object.

   d. Optimized mixing done on the facade, during a fire with payload.

   Performance results on Chrome 19/MacOS below, for the use case where we're
   iring with a payload:

   ## Custom Event Lifecycle Numbers (Fix a, b, c)

   BEFORE (3.6.0):
   EventTarget with attribute style publish, fire, with on/after listeners x 7,623 ops/sec

   CURRENT (With fixes a, b, c):
   EventTarget with attribute style publish, fire, with on/after listeners x 23,642 ops/sec

   ## Payload Numbers (Fix d)

   BEFORE (3.6.0):
   Fire With Payload - 10 listeners x 27,918 ops/sec ±1.32% (54 runs sampled)

   CURRENT (With fix d):
   Fire With Payload - 10 listeners x 63,362 ops/sec ±0.37% (58 runs sampled)

   The benchmark tests can be found in src/event-custom/tests/benchmark

   Log messages for the follow commits have more details:

   e7415e71decf3d921161e8883270e16b433aa150 - subscribers/afters fix.
   29f63996f8b69a7bb6d2e27f4d350c320998c0b2 - optimized payload mix fix.

 * CustomEvent memory optimizations.

   * Fixed `_facade` and `firedWith` which were holding onto a reference
     to the last fired event facade. Now `_facade` is reset to null after
     the fire sequence, and `firedWith` is only maintained for `fireOnce`
     CustomEvents. i

     This allows the facade from the last fired event to be GC'd whereas
     prior to this change it wasn't.

3.6.0
-----

 * Fixed memory consumption issue where Y.Do's internal touched object cache,
   Y.Do.objs, would never release object references.

   The Y.Do.objs property has been deprecated as of 3.6.0, and will be null.

   The cached state previously stored in Y.Do.objs has been moved onto the
   AOP'd object itself, in the *private* `_yuiaop` property.

   The only reason `_yuiaop` is mentioned here, is to provide a temporary
   migration path for users who may have been using Y.Do.objs. If you are using
   this property, please file a ticket with the use case, and we'll look at
   addressing the use case formally, while not impacting GC.

3.5.1
-----

  * No changes.

3.5.0
-----

  * Multiple calls to target.publish({ ... }) now work [Ticket #2531671]

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
