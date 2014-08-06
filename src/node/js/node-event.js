/**
 * @module node
 * @submodule node-base
 */

var Y_Node = Y.Node;
var Y_NodeList = Y.NodeList;
/**
 * List of events that route to DOM events
 * @static
 * @property DOM_EVENTS
 * @for Node
 */

Y_Node.DOM_EVENTS = {
    abort: 1,
    beforeunload: 1,
    blur: 1,
    change: 1,
    click: 1,
    close: 1,
    command: 1,
    contextmenu: 1,
    copy: 1,
    cut: 1,
    dblclick: 1,
    DOMMouseScroll: 1,
    drag: 1,
    dragstart: 1,
    dragenter: 1,
    dragover: 1,
    dragleave: 1,
    dragend: 1,
    drop: 1,
    error: 1,
    focus: 1,
    key: 1,
    keydown: 1,
    keypress: 1,
    keyup: 1,
    load: 1,
    message: 1,
    mousedown: 1,
    mouseenter: 1,
    mouseleave: 1,
    mousemove: 1,
    mousemultiwheel: 1,
    mouseout: 1,
    mouseover: 1,
    mouseup: 1,
    mousewheel: 1,
    orientationchange: 1,
    paste: 1,
    reset: 1,
    resize: 1,
    select: 1,
    selectstart: 1,
    submit: 1,
    scroll: 1,
    textInput: 1,
    unload: 1,
    invalid: 1
};

// Add custom event adaptors to this list.  This will make it so
// that delegate, key, available, contentready, etc all will
// be available through Node.on
Y.mix(Y_Node.DOM_EVENTS, Y.Env.evt.plugins);

Y.augment(Y_Node, Y.EventTarget);

Y.mix(Y_Node.prototype, {
    /**
     * Removes event listeners from the node and (optionally) its subtree
     * @method purge
     * @param {Boolean} recurse (optional) Whether or not to remove listeners from the
     * node's subtree
     * @param {String} type (optional) Only remove listeners of the specified type
     * @chainable
     *
     */
    purge: function(recurse, type) {
        Y.Event.purgeElement(this._node, recurse, type);
        return this;
    }

});

Y.mix(Y.NodeList.prototype, {
    _prepEvtArgs: function(type, fn, context) {
        // map to Y.on/after signature (type, fn, nodes, context, arg1, arg2, etc)
        var args = Y.Array(arguments, 0, true);

        if (args.length < 2) { // type only (event hash) just add nodes
            args[2] = this._nodes;
        } else {
            args.splice(2, 0, this._nodes);
        }

        args[3] = context || this; // default to NodeList instance as context

        return args;
    },

    /**
    Subscribe a callback function for each `Node` in the collection to execute
    in response to a DOM event.

    NOTE: Generally, the `on()` method should be avoided on `NodeLists`, in
    favor of using event delegation from a parent Node.  See the Event user
    guide for details.

    Most DOM events are associated with a preventable default behavior, such as
    link clicks navigating to a new page.  Callbacks are passed a
    `DOMEventFacade` object as their first argument (usually called `e`) that
    can be used to prevent this default behavior with `e.preventDefault()`. See
    the `DOMEventFacade` API for all available properties and methods on the
    object.

    By default, the `this` object will be the `NodeList` that the subscription
    came from, <em>not the `Node` that received the event</em>.  Use
    `e.currentTarget` to refer to the `Node`.

    Returning `false` from a callback is supported as an alternative to calling
    `e.preventDefault(); e.stopPropagation();`.  However, it is recommended to
    use the event methods.

    @example

        Y.all(".sku").on("keydown", function (e) {
            if (e.keyCode === 13) {
                e.preventDefault();

                // Use e.currentTarget to refer to the individual Node
                var item = Y.MyApp.searchInventory( e.currentTarget.get('value') );
                // etc ...
            }
        });

    @method on
    @param {String} type The name of the event
    @param {Function} fn The callback to execute in response to the event
    @param {Object} [context] Override `this` object in callback
    @param {Any} [arg*] 0..n additional arguments to supply to the subscriber
    @return {EventHandle} A subscription handle capable of detaching that
                          subscription
    @for NodeList
    **/
    on: function(type, fn, context) {
        return Y.on.apply(Y, this._prepEvtArgs.apply(this, arguments));
    },

    /**
     * Applies an one-time event listener to each Node bound to the NodeList.
     * @method once
     * @param {String} type The event being listened for
     * @param {Function} fn The handler to call when the event fires
     * @param {Object} context The context to call the handler with.
     * Default is the NodeList instance.
     * @return {EventHandle} A subscription handle capable of detaching that
     *                    subscription
     * @for NodeList
     */
    once: function(type, fn, context) {
        return Y.once.apply(Y, this._prepEvtArgs.apply(this, arguments));
    },

    /**
     * Applies an event listener to each Node bound to the NodeList.
     * The handler is called only after all on() handlers are called
     * and the event is not prevented.
     * @method after
     * @param {String} type The event being listened for
     * @param {Function} fn The handler to call when the event fires
     * @param {Object} context The context to call the handler with.
     * Default is the NodeList instance.
     * @return {EventHandle} A subscription handle capable of detaching that
     *                    subscription
     * @for NodeList
     */
    after: function(type, fn, context) {
        return Y.after.apply(Y, this._prepEvtArgs.apply(this, arguments));
    },

    /**
     * Applies an one-time event listener to each Node bound to the NodeList
     * that will be called only after all on() handlers are called and the
     * event is not prevented.
     *
     * @method onceAfter
     * @param {String} type The event being listened for
     * @param {Function} fn The handler to call when the event fires
     * @param {Object} context The context to call the handler with.
     * Default is the NodeList instance.
     * @return {EventHandle} A subscription handle capable of detaching that
     *                    subscription
     * @for NodeList
     */
    onceAfter: function(type, fn, context) {
        return Y.onceAfter.apply(Y, this._prepEvtArgs.apply(this, arguments));
    }
});

Y_NodeList.importMethod(Y.Node.prototype, [
    /**
      * Called on each Node instance
      * @method detach
      * @see Node.detach
      * @for NodeList
      */
    'detach',

    /** Called on each Node instance
      * @method detachAll
      * @see Node.detachAll
      * @for NodeList
      */
    'detachAll'
]);

/**
Subscribe a callback function to execute in response to a DOM event or custom
event.

Most DOM events are associated with a preventable default behavior such as
link clicks navigating to a new page.  Callbacks are passed a `DOMEventFacade`
object as their first argument (usually called `e`) that can be used to
prevent this default behavior with `e.preventDefault()`. See the
`DOMEventFacade` API for all available properties and methods on the object.

If the event name passed as the first parameter is not a whitelisted DOM event,
it will be treated as a custom event subscriptions, allowing
`node.fire('customEventName')` later in the code.  Refer to the Event user guide
for the full DOM event whitelist.

By default, the `this` object in the callback will refer to the subscribed
`Node`.

Returning `false` from a callback is supported as an alternative to calling
`e.preventDefault(); e.stopPropagation();`.  However, it is recommended to use
the event methods.

@example

    Y.one("#my-form").on("submit", function (e) {
        e.preventDefault();

        // proceed with ajax form submission instead...
    });

@method on
@param {String} type The name of the event
@param {Function} fn The callback to execute in response to the event
@param {Object} [context] Override `this` object in callback
@param {Any} [arg*] 0..n additional arguments to supply to the subscriber
@return {EventHandle} A subscription handle capable of detaching that
                      subscription
@for Node
**/

