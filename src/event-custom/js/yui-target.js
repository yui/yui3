// Create shared global event target for cross-instance messaging
// @TODO implement a global namespace function on Y.Global?
if (!YUI.Env.globalEvents) {
    YUI.Env.globalEvents = new EventTarget({
        //prefix: 'global',
        bubbles: false
    });
}

/**
 * Hosts YUI page level events.  This is where events bubble to
 * when the broadcast config is set to 2.  This property is
 * only available if the custom event module is loaded.
 * @property Global
 * @type EventTarget
 * @for YUI
 */
Y.Global = YUI.Env.globalEvents;


proto = EventTarget.prototype;
eventTargetOn = proto.on;
eventTargetDetach = proto.detach;

// make Y an event target
Y.mix(Y, proto, true);
EventTarget.call(Y, {
    // this caused some tests in the test suite to fail, but I'm not sure if
    // they actually should be failing, given the test suite code.
    //prefix: 'y',
    bubbles: false
});

/**
 * <code>YUI</code>'s <code>on</code> method is a unified interface for subscribing to
 * most events exposed by YUI.  This includes custom events, DOM events, and
 * function events.  <code>detach</code> is also provided to remove listeners
 * serviced by this function.
 *
 * The signature that <code>on</code> accepts varies depending on the type
 * of event being consumed.  Refer to the specific methods that will
 * service a specific request for additional information about subscribing
 * to that type of event.
 *
 * <ul>
 * <li>Custom events.  These events are defined by various
 * modules in the library.  This type of event is delegated to
 * <code>EventTarget</code>'s <code>on</code> method.
 *   <ul>
 *     <li>The type of the event</li>
 *     <li>The callback to execute</li>
 *     <li>An optional context object</li>
 *     <li>0..n additional arguments to supply the callback.</li>
 *   </ul>
 *   Example:
 *   <code>Y.on('drag:drophit', function() { // start work });</code>
 * </li>
 * <li>DOM events.  These are moments reported by the browser related
 * to browser functionality and user interaction.
 * This type of event is delegated to <code>Event</code>'s
 * <code>attach</code> method.
 *   <ul>
 *     <li>The type of the event</li>
 *     <li>The callback to execute</li>
 *     <li>The specification for the Node(s) to attach the listener
 *     to.  This can be a selector, collections, or Node/Element
 *     refereces.</li>
 *     <li>An optional context object</li>
 *     <li>0..n additional arguments to supply the callback.</li>
 *   </ul>
 *   Example:
 *   <code>Y.on('click', function(e) { // something was clicked }, '#someelement');</code>
 * </li>
 * <li>Function events.  These events can be used to react before or after a
 * function is executed.  This type of event is delegated to <code>Event.Do</code>'s
 * <code>before</code> method.
 *   <ul>
 *     <li>The callback to execute</li>
 *     <li>The object that has the function that will be listened for.</li>
 *     <li>The name of the function to listen for.</li>
 *     <li>An optional context object</li>
 *     <li>0..n additional arguments to supply the callback.</li>
 *   </ul>
 *   Example <code>Y.on(function(arg1, arg2, etc) { // obj.methodname was executed }, obj 'methodname');</code>
 * </li>
 * </ul>
 *
 * <code>on</code> corresponds to the moment before any default behavior of
 * the event.  <code>after</code> works the same way, but these listeners
 * execute after the event's default behavior.  <code>before</code> is an
 * alias for <code>on</code>.
 *
 * @method on
 * @param type event type (this parameter does not apply for function events)
 * @param fn the callback
 * @param context optionally change the value of 'this' in the callback
 * @param args* 0..n additional arguments to pass to the callback.
 * @return {EventHandle} a detach handle for the subscription
 * @for YUI
 */
Y.on = function (type, fn, context) {
    var parts = this.parseType(type),
        Node  = Y.Node,
        name, domEvent, args, category, handle;

    name = parts[3];
    domEvent = synths[name] || (Node && Node.DOM_EVENTS[name]);

    // Y.on() should explicitly handle only synthetic and DOM events.
    // Custom events can be handled by EventTarget's prototype method.
    // Also, object, array, and function signatures can be routed through
    // EventTarget's prototype method to loop back here for individual
    // subscriptions.
    if (!isString(name) || !domEvent) {
        return eventTargetOn.apply(this, arguments);
    }

    // full name, args, detachcategory, after
    this._monitor('attach', parts[1], {
        args: arguments,
        category: parts[0],
        after: parts[2]
    });

    args = toArray(arguments, 0, true);
    category = parts[0];

    if (Node && isObject(context)) {
        if (Y.instanceOf(context, Y.NodeList)) {
            args[2] = Y.NodeList.getDOMNodes(context);
        } else if (Y.instanceOf(context, Node)) {
            args[2] = Node.getDOMNode(context);
        }
    }

    handle = (domEvent.on) ?
        domEvent.on.apply(Y, args) : // synthetic event subscription
        Y.Event._attach(args);       // DOM event subscription

    category && this._registerSub(category, handle);

    return handle;
};

/**
 * Listen for an event one time.  Equivalent to <code>on</code>, except that
 * the listener is immediately detached when executed.
 * @see on
 * @method once
 * @param type event type (this parameter does not apply for function events)
 * @param fn the callback
 * @param context optionally change the value of 'this' in the callback
 * @param args* 0..n additional arguments to pass to the callback.
 * @return {EventHandle} a detach handle for the subscription
 * @for YUI
 */

/**
 * after() is a unified interface for subscribing to
 * most events exposed by YUI.  This includes custom events,
 * DOM events, and AOP events.  This works the same way as
 * the on() function, only it operates after any default
 * behavior for the event has executed. @see <code>on</code> for more
 * information.
 * @method after
 * @param type event type (this parameter does not apply for function events)
 * @param fn the callback
 * @param context optionally change the value of 'this' in the callback
 * @param args* 0..n additional arguments to pass to the callback.
 * @return {EventHandle} a detach handle for the subscription
 * @for YUI
 */

/**
 * Listen for an event one time.  Equivalent to <code>after</code>, except that
 * the listener is immediately detached when executed.
 * @see after
 * @method onceAfter
 * @param type event type (this parameter does not apply for function events)
 * @param fn the callback
 * @param context optionally change the value of 'this' in the callback
 * @param args* 0..n additional arguments to pass to the callback.
 * @return {EventHandle} a detach handle for the subscription
 * @for YUI
 */

/**
 * Detaches an event subscription.
 * @method detach
 * @param type {string|Object}   Either the handle to the subscriber or the
 *                        type of event.  If the type
 *                        is not specified, it will attempt to remove
 *                        the listener from all hosted events.
 * @param fn   {Function} The subscribed function to unsubscribe, if not
 *                          supplied, all subscribers will be removed.
 * @param context  {Object}   The custom object passed to subscribe.  This is
 *                        optional, but if supplied will be used to
 *                        disambiguate multiple listeners that are the same
 *                        (e.g., you subscribe many object using a function
 *                        that lives on the prototype)
 * @return {YUI} the YUI instance
 * @for YUI
 */
Y.detach = function (type) {
    if (!type) {
        return this;
    }

    var parts    = this.parseType(type),
        Node     = Y.Node,
        category = parts[0],
        name     = !category && parts[3], // abort if detachcategory
        domEvent = name && (synths[name] || (Node && Node.DOM_EVENTS[name])),
        args;

    if (domEvent) {
        args = toArray(arguments, 0, true);
        args[0] = name;

        if (domEvent.detach) {
            domEvent.detach.apply(Y, args);
        } else {
            Y.Event.detach.apply(Y.Event, args);
        }
    } else {
        eventTargetDetach.apply(this, arguments);
    }

    return this;
};
