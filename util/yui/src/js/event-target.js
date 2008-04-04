
YUI.add("event-target", function(Y) {

    /**
     * Event.Target is designed to be used with Y.augment to wrap 
     * Event.Custom in an interface that allows events to be subscribed to 
     * and fired by name.  This makes it possible for implementing code to
     * subscribe to an event that either has not been created yet, or will
     * not be created at all.
     *
     * @Class Event.Target
     */
    Y.Event.Target = function() { };

    Y.Event.Target.prototype = {

        /**
         * Private storage of custom events
         * @property __yui_events
         * @type Object[]
         * @private
         */
        __yui_events: null,

        /**
         * Private storage of custom event subscribers
         * @property __yui_subscribers
         * @type Object[]
         * @private
         */
        __yui_subscribers: null,
        
        /**
         * Subscribe to a Event.Custom by event type
         *
         * @method subscribe
         * @param p_type     {string}   the type, or name of the event
         * @param p_fn       {function} the function to exectute when the event fires
         * @param p_obj      {Object}   An object to be passed along when the event 
         *                              fires
         * @param p_override {boolean}  If true, the obj passed in becomes the 
         *                              execution context of the listener
         */
        subscribe: function(p_type, p_fn, p_obj, p_override) {

            this.__yui_events = this.__yui_events || {};
            var ce = this.__yui_events[p_type];

            if (ce) {
                ce.subscribe(p_fn, p_obj, p_override);
            } else {
                this.__yui_subscribers = this.__yui_subscribers || {};
                var subs = this.__yui_subscribers;
                if (!subs[p_type]) {
                    subs[p_type] = [];
                }
                subs[p_type].push(
                    { fn: p_fn, obj: p_obj, override: p_override } );
            }
        },

        /**
         * Unsubscribes one or more listeners the from the specified event
         * @method unsubscribe
         * @param p_type {string}   The type, or name of the event.  If the type
         *                          is not specified, it will attempt to remove
         *                          the listener from all hosted events.
         * @param p_fn   {Function} The subscribed function to unsubscribe, if not
         *                          supplied, all subscribers will be removed.
         * @param p_obj  {Object}   The custom object passed to subscribe.  This is
         *                        optional, but if supplied will be used to
         *                        disambiguate multiple listeners that are the same
         *                        (e.g., you subscribe many object using a function
         *                        that lives on the prototype)
         * @return {boolean} true if the subscriber was found and detached.
         */
        unsubscribe: function(p_type, p_fn, p_obj) {
            this.__yui_events = this.__yui_events || {};
            var evts = this.__yui_events;
            if (p_type) {
                var ce = evts[p_type];
                if (ce) {
                    return ce.unsubscribe(p_fn, p_obj);
                }
            } else {
                var ret = true;
                for (var i in evts) {
                    if (Y.object.owns(evts, i)) {
                        ret = ret && evts[i].unsubscribe(p_fn, p_obj);
                    }
                }
                return ret;
            }

            return false;
        },
        
        /**
         * Removes all listeners from the specified event.  If the event type
         * is not specified, all listeners from all hosted custom events will
         * be removed.
         * @method unsubscribeAll
         * @param p_type {string}   The type, or name of the event
         */
        unsubscribeAll: function(p_type) {
            return this.unsubscribe(p_type);
        },

        /**
         * Creates a new custom event of the specified type.  If a custom event
         * by that name already exists, it will not be re-created.  In either
         * case the custom event is returned. 
         *
         * @method publish
         *
         * @param p_type {string} the type, or name of the event
         * @param p_config {object} optional config params.  Valid properties are:
         *
         *  <ul>
         *    <li>
         *      context: defines the default execution context.  If not defined
         *      the default context will be this instance.
         *    </li>
         *    <li>
         *      silent: if true, the custom event will not generate log messages.
         *      This is false by default.
         *    </li>
         *    <li>
         *      onSubscribeCallback: specifies a callback to execute when the
         *      event has a new subscriber.  This will fire immediately for
         *      each queued subscriber if any exist prior to the creation of
         *      the event.
         *    </li>
         *  </ul>
         *
         *  @return {Event.Custom} the custom event
         *
         */
        publish: function(p_type, p_config) {

            this.__yui_events = this.__yui_events || {};
            var opts = p_config || {};
            var events = this.__yui_events;

            if (events[p_type]) {
Y.log("Event.Target publish skipped: '"+p_type+"' already exists");
            } else {

                var context  = opts.context  || this;
                var silent = (opts.silent);

                var ce = new Y.CustomEvent(p_type, context, silent,
                        Y.Event.Custom.FLAT);
                events[p_type] = ce;

                if (opts.onSubscribeCallback) {
                    ce.subscribeEvent.subscribe(opts.onSubscribeCallback);
                }

                this.__yui_subscribers = this.__yui_subscribers || {};
                var qs = this.__yui_subscribers[p_type];

                if (qs) {
                    for (var i=0; i<qs.length; ++i) {
                        ce.subscribe(qs[i].fn, qs[i].obj, qs[i].override);
                    }
                }
            }

            return events[p_type];
        },


       /**
         * Fire a custom event by name.  The callback functions will be executed
         * from the context specified when the event was created, and with the 
         * following parameters:
         *   <ul>
         *   <li>The first argument fire() was executed with</li>
         *   <li>The custom object (if any) that was passed into the subscribe() 
         *       method</li>
         *   </ul>
         * If the custom event has not been explicitly created, it will be
         * created now with the default config, context to the host object
         * @method fireEvent
         * @param p_type    {string}  the type, or name of the event
         * @param arguments {Object*} an arbitrary set of parameters to pass to 
         *                            the handler.
         * @return {boolean} the return value from Event.Custom.fire
         *                   
         */
        fire: function(p_type, arg1, arg2, etc) {

            this.__yui_events = this.__yui_events || {};
            var ce = this.__yui_events[p_type];

            if (!ce) {
// Y.log(p_type + "event fired before it was created.");
                // return null;
                ce = this.publish(p_type);
            }

            var args = [];
            for (var i=1; i<arguments.length; ++i) {
                args.push(arguments[i]);
            }
            return ce.fire.apply(ce, args);
        },

        /**
         * Returns true if the custom event of the provided type has been created
         * with publish.
         * @method hasEvent
         * @param type {string} the type, or name of the event
         */
        hasEvent: function(type) {
            if (this.__yui_events) {
                if (this.__yui_events[type]) {
                    return true;
                }
            }
            return false;
        },

        /**
         * Executes the callback before the given event or
         * method hosted on this object.
         *
         * The signature differs based upon the type of
         * item that is being wrapped.
         *
         * Custom Event: type, callback, context, 1-n additional arguments
         * to append to the callback's argument list.
         *
         * Method: callback, object, methodName, context, 1-n additional 
         * arguments to append to the callback's argument list.
         *
         * @method before
         * @return the detach handle
         */
        before: function() {

            var a = Y.array(arguments, 0, true);

            // insert this object as method target
            a.splice(1, 0, this);

            // Y.log('ET:before- ' + Y.lang.dump(a));

            return Y.before.apply(Y, a);
        },

        /**
         * Executes the callback after the given event or
         * method hosted on this object.
         *
         * The signature differs based upon the type of
         * item that is being wrapped.
         *
         * Custom Event: type, callback, context, 1-n additional arguments
         * to append to the callback's argument list.
         *
         * Method: callback, object, methodName, context, 1-n additional 
         * arguments to append to the callback's argument list.
         *
         * @method after
         * @return the detach handle
         */
        after: function() {
            var a = Y.array(arguments, 0, true);
            a.splice(1, 0, this);
            return Y.after.apply(Y, a);
        }

    };

    Y.mix(Y, Y.Event.Target.prototype);

}, "3.0.0");
