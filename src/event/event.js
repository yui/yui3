/**
 * The YUI event system
 * @module event
 */
YUI.add("event", function(Y) {

    var FOCUS = Y.UA.ie ? "focusin" : "focus",
        BLUR = Y.UA.ie ? "focusout" : "blur",
        CAPTURE = "capture_";

    Y.Env.eventAdaptors = {

        focus: {

            on: function() {

                var a = Y.Array(arguments, 0, true);
                a[0] = CAPTURE + FOCUS;

                return Y.Event.attach.apply(Y.Event, a);

            },

            detach: function() {

                var a = Y.Array(arguments, 0, true);
                a[0] = CAPTURE + FOCUS;

                return Y.Event.detach.apply(Y.Event, a);

            }
        },

        available: {

            on: function(type, fn, id, o) {

                var a = Y.Array(arguments, 0, true), m = fn;

                a.splice(2, 1);
                a.unshift(id);

                if (o) {
                    var a2 = a.slice(1);
                    m = Y.bind.apply(Y, a2);
                }

                return Y.Event.onAvailable.apply(Y.Event, a);

            },

            detach: function() {

            }
        },

        contentready: {

            on: function(type, fn, id, o) {

                var a = Y.Array(arguments, 0, true), m = fn;

                a.splice(2, 1);
                a.unshift(id);

                if (o) {
                    var a2 = a.slice(1);
                    m = Y.bind.apply(Y, a2);
                }

                return Y.Event.onContentReady.apply(Y.Event, a);
            },

            detach: function() {

            }
        }

    };

    /*
     * Subscribes to the yui:load event, which fires when a Y.use operation
     * is complete.
     * @method ready
     * @param f {Function} the function to execute
     * @param c Optional execution context
     * @param args* 0..n Additional arguments to append 
     * to the signature provided when the event fires.
     * @return {YUI} the YUI instance
     */
    // Y.ready = function(f, c) {
    //     var a = arguments, m = (a.length > 1) ? Y.bind.apply(Y, a) : f;
    //     Y.on("yui:load", m);
    //     return this;
    // };

    /**
     * Attach an event listener, either to a DOM object
     * or to an Event.Target.
     * @param type {string} the event type
     * @param f {Function} the function to execute
     * @param o the Event.Target or element to attach to
     * @param context Optional execution context
     * @param args* 0..n additional arguments to append
     * to the signature provided when the event fires.
     * @method on
     * @for YUI
     * @return {Event.Handle} a handle object for 
     * unsubscribing to this event.
     */
    Y.on = function(type, f, o) {
        
        var adapt = Y.Env.eventAdaptors[type];

        if (adapt) {

            return adapt.on.apply(Y, arguments);

        } else {

            if (type.indexOf(':') > -1) {
                var cat = type.split(':');
                switch (cat[0]) {
                    default:
                        return Y.subscribe.apply(Y, arguments);
                }
            } else {
                return Y.Event.attach.apply(Y.Event, arguments);
            }
        }

    };

    /**
     * Detach an event listener (either a custom event or a
     * DOM event
     * @method detach
     * @param type the type of event, or a Event.Handle to
     * for the subscription.  If the Event.Handle is passed
     * in, the other parameters are not used.
     * @param f {Function} the subscribed function
     * @param o the object or element the listener is subscribed
     * to.
     * @method detach
     * @return {YUI} the YUI instance
     */
    Y.detach = function(type, f, o) {

        var adapt = Y.Env.eventAdaptors[type];

        if (Y.Lang.isObject(type) && type.detach) {
            return type.detach();
        } else {
            if (adapt) {
                adapt.detach.apply(Y, arguments);
            } else if (type.indexOf(':') > -1) {
                var cat = type.split(':');
                switch (cat[0]) {
                    default:
                        return Y.unsubscribe.apply(Y, arguments);
                }
            } else {
                return Y.Event.detach.apply(Y.Event, arguments);
            }
        }
    };

    /**
     * Executes the callback before a DOM event, custom event
     * or method.  If the first argument is a function, it
     * is assumed the target is a method.
     *
     * For DOM and custom events:
     * type, callback, context, 1-n arguments
     *  
     * For methods:
     * callback, object (method host), methodName, context, 1-n arguments
     *
     * @method before
     * @return unsubscribe handle
     */
    Y.before = function(type, f, o) { 
        // method override
        // callback, object, sMethod
        if (Y.Lang.isFunction(type)) {
            return Y.Do.before.apply(Y.Do, arguments);
        }

        return Y;
    };

    /**
     * Executes the callback after a DOM event, custom event
     * or method.  If the first argument is a function, it
     * is assumed the target is a method.
     *
     * @TODO add event
     *
     * For DOM and custom events:
     * type, callback, context, 1-n arguments
     *  
     * For methods:
     * callback, object (method host), methodName, context, 1-n arguments
     *
     * @method after
     * @return {Event.Handle} unsubscribe handle
     */
    Y.after = function(type, f, o) {
        if (Y.Lang.isFunction(type)) {
            return Y.Do.after.apply(Y.Do, arguments);
        }

        return Y;
    };



}, "3.0.0", {
    use: [
          "aop", 
          "event-custom", 
          "event-target", 
          "event-ready",
          "event-dom", 
          "event-facade",
          "event-simulate"
          ]
});
