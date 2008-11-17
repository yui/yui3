/**
 * The YUI event system
 * @module event
 */
YUI.add("event", function(Y) {

    var FOCUS = Y.UA.ie ? "focusin" : "focus",
        BLUR = Y.UA.ie ? "focusout" : "blur",
        CAPTURE = "capture_";

    Y.Env.eventAdaptors = {

        /**
         * Adds a DOM focus listener.  Uses the focusin event in IE,
         * and the capture phase otherwise so that
         * the event propagates properly.
         * @for YUI
         * @event focus
         */
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

        /**
         * Adds a DOM focus listener.  Uses the focusout event in IE,
         * and the capture phase otherwise so that
         * the event propagates properly.
         * @for YUI
         * @event blur
         */
        blur: {

            on: function() {

                var a = Y.Array(arguments, 0, true);
                a[0] = CAPTURE + BLUR;

                return Y.Event.attach.apply(Y.Event, a);

            },

            detach: function() {

                var a = Y.Array(arguments, 0, true);
                a[0] = CAPTURE + BLUR;

                return Y.Event.detach.apply(Y.Event, a);

            }
        },

        /**
         * Executes the callback as soon as the specified element 
         * is detected in the DOM.
         * @for YUI
         * @event available
         */
        available: {

            on: function(type, fn, id, o) {
            // onAvailable: function(id, fn, p_obj, p_override, checkContent, compat) {

                var a = arguments.length > 4 ?  Y.Array(arguments, 4, true) : [];
                return Y.Event.onAvailable.call(Y.Event, id, fn, o, a);

                /*

                var a = Y.Array(arguments, 1, true), m = fn;

                a.splice(1, 1);
                a.unshift(id);

                Y.log(a);

                if (o) {
                    var a2 = a.slice(1);
                    // Y.log(a2);
                    m = Y.bind.apply(Y, a2);
                }


                return Y.Event.onAvailable.apply(Y.Event, a);
                */

            },

            detach: function() {

            }
        },

        /**
         * Executes the callback as soon as the specified element 
         * is detected in the DOM with a nextSibling property
         * (indicating that the element's children are available)
         * @for YUI
         * @event contentready
         */
        contentready: {

            on: function(type, fn, id, o) {
                
                var a = arguments.length > 4 ?  Y.Array(arguments, 4, true) : [];
                return Y.Event.onContentReady.call(Y.Event, id, fn, o, a);

                /*
                var a = Y.Array(arguments, 1, true), m = fn;

                a.splice(1, 1);
                a.unshift(id);

                if (o) {
                    var a2 = a.slice(1);
                    m = Y.bind.apply(Y, a2);
                }

                return Y.Event.onContentReady.apply(Y.Event, a);
                */
            },

            detach: function() {

            }
        }

    };

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
            Y.log('Using adaptor for ' + type, 'info', 'event');
            return adapt.on.apply(Y, arguments);
        } else {
            if (type.indexOf(':') > -1) {
                return Y.subscribe.apply(Y, arguments);
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
                return Y.unsubscribe.apply(Y, arguments);
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
        if (Y.Lang.isFunction(type)) {
            return Y.Do.before.apply(Y.Do, arguments);
        } else {
            return Y.on.apply(Y, arguments);
        }
    };

    var after = Y.after;

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
        } else {
            return after.apply(Y, arguments);
        }
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
