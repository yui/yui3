/**
 * The YUI event system
 * @module event
 */
YUI.add("event", function(Y) {

    var FOCUS = Y.UA.ie ? "focusin" : "focus",
        BLUR = Y.UA.ie ? "focusout" : "blur",
        CAPTURE = "capture_",
        Lang = Y.Lang;

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
                arguments[0] = CAPTURE + FOCUS;
                return Y.Event.attach.apply(Y.Event, arguments);
            },

            detach: function() {
                arguments[0] = CAPTURE + FOCUS;
                return Y.Event.detach.apply(Y.Event, arguments);

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
                arguments[0] = CAPTURE + BLUR;
                return Y.Event.attach.apply(Y.Event, arguments);
            },

            detach: function() {
                arguments[0] = CAPTURE + BLUR;
                return Y.Event.detach.apply(Y.Event, arguments);
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
                var a = arguments.length > 4 ?  Y.Array(arguments, 4, true) : [];
                return Y.Event.onAvailable.call(Y.Event, id, fn, o, a);
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
            }
        },

        /**
         * Add a key listener.  The listener will only be notified if the
         * keystroke detected meets the supplied specification.  The
         * spec consists of the key event type, followed by a colon,
         * followed by zero or more comma separated key codes, followed
         * by zero or more modifiers delimited by a plus sign.  Ex:
         * press:12,65+shift+ctrl
         * @event key
         * @param fn {string} the function to execute
         * @param id {string} the element(s) to bind
         * @param spec {string} the keyCode and modifier specification
         * @param o optional context object
         * @param args 0..n additional arguments that should be provided 
         * to the listener.
         */
        key: {

            on: function(type, fn, id, spec, o) {

                if (!spec || spec.indexOf(':') == -1) {
Y.log('Illegal key spec, creating a regular keypress listener instead.', 'info', 'event');
                    arguments[0] = 'keypress';
                    return Y.on.apply(Y, arguments);
                }

                // parse spec ([key event type]:[criteria])
                var parsed = spec.split(':'),

                    // key event type: 'down', 'up', or 'press'
                    etype = parsed[0],

                    // list of key codes optionally followed by modifiers
                    criteria = (parsed[1]) ? parsed[1].split(/,|\+/) : null,

                    // the name of the custom event that will be created for the spec
                    ename = (Lang.isString(id) ? id : Y.stamp(id)) + spec,

                    a = Y.Array(arguments, 0, true);



                // subscribe spec validator to the DOM event
                Y.on(type + etype, function(e) {

                    // Y.log('keylistener: ' + e.keyCode);
                    
                    var passed = false, failed = false;

                    for (var i=0; i<criteria.length; i=i+1) {
                        var crit = criteria[i], critInt = parseInt(crit, 10);

                        // pass this section if any supplied keyCode 
                        // is found
                        if (Lang.isNumber(critInt)) {

                            if (e.charCode === critInt) {
                                // Y.log('passed: ' + crit);
                                passed = true;
                            } else {
                                failed = true;
                                // Y.log('failed: ' + crit);
                            }

                        // only check modifier if no keyCode was specified
                        // or the keyCode check was successful.  pass only 
                        // if every modifier passes
                        } else if (passed || !failed) {
                            passed = (e[crit + 'Key']);
                            failed = !passed;
                            // Y.log(crit + ": " + passed);
                        }                    
                    }

                    // fire spec custom event if spec if met
                    if (passed) {
                        Y.fire(ename, e);
                    }

                }, id);

                // subscribe supplied listener to custom event for spec validator
                // remove element and spec.
                a.splice(2, 2);
                a[0] = ename;

                return Y.on.apply(Y, a);
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
        
        if (adapt && adapt.on) {
            Y.log('Using adaptor for ' + type, 'info', 'event');
            return adapt.on.apply(Y, arguments);
        } else {
            if (adapt || type.indexOf(':') > -1) {
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

        if (Lang.isObject(type) && type.detach) {
            return type.detach();
        } else {
            if (adapt && adapt.detach) {
                return adapt.detach.apply(Y, arguments);
            } else if (adapt || type.indexOf(':') > -1) {
                return Y.unsubscribe.apply(Y, arguments);
            } else {
                return Y.Event.detach.apply(Y.Event, arguments);
            }
        }
    };

    /**
     * Executes the callback before a DOM event, custom event
     * or method.  If the first argument is a function, it
     * is assumed the target is a method.  For DOM and custom
     * events, this is an alias for Y.on.
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
        if (Lang.isFunction(type)) {
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
        if (Lang.isFunction(type)) {
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
