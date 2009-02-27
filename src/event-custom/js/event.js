(function() {
/**
 * Custom event engine
 * @module event-custom
 */

var Lang    = Y.Lang,
    after   = Y.after;

Y.Env.eventAdaptors = {};

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

})();
