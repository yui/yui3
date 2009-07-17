(function() {

var adapt = Y.Env.evt.plugins,
    CAPTURE_CONFIG = { capture: true },
    NOOP  = function(){},

    // Opera implents capture phase events per spec rather than
    // the more useful way it is implemented in other browsers:
    // The event doesn't fire on a target unless there is a
    // listener on an element in the target's ancestry.  If a
    // capture phase listener is added only to the element that 
    // will be the target of the event, the listener won't fire.  
    // To get around this, we register a NOOP listener on the
    // element's parent.
    _captureHack = function(type, o) {
        var el = (Y.Lang.isString(o)) ? Y.Selector.query(o, null, true) : o,
            p  = el && el.parentNode;

        if (p) {
            Y.Event._attach([type, NOOP, p], CAPTURE_CONFIG);
        }
    };


/**
 * Adds a DOM focus listener.  Uses the focusin event in IE,
 * and the capture phase otherwise so that
 * the event propagates in a way that enables event delegation.
 *
 * Note: if you are registering this event on the intended target
 * rather than an ancestor, the element must be in the DOM in
 * order for it to work in Opera.
 *
 * @for YUI
 * @event focus
 * @param type {string} 'focus'
 * @param fn {string} the function to execute
 * @param o {string} the element(s) to bind
 * @param context optional context object
 * @param args 0..n additional arguments that should be provided 
 * to the listener.
 * @return {Event.Handle} the detach handle
 */
adapt.focus = {
    on: function(type, fn, o) {
        var a = Y.Array(arguments, 0, true);
        if (Y.UA.opera) {
            _captureHack(type, o);
        }
        return Y.Event._attach(a, CAPTURE_CONFIG);
    }
};

/**
 * Adds a DOM blur listener.  Uses the focusout event in IE,
 * and the capture phase otherwise so that
 * the event propagates in a way that enables event delegation.
 *
 * Note: if you are registering this event on the intended target
 * rather than an ancestor, the element must be in the DOM 
 * at the time of registration in order for it to work in Opera.
 *
 * @for YUI
 * @event blur
 * @param type {string} 'focus'
 * @param fn {string} the function to execute
 * @param o {string} the element(s) to bind
 * @param context optional context object
 * @param args 0..n additional arguments that should be provided 
 * to the listener.
 * @return {Event.Handle} the detach handle
 */
adapt.blur = {
    on: function(type, fn, o) {
        var a = Y.Array(arguments, 0, true);
        if (Y.UA.opera) {
            _captureHack(type, o);
        }
        return Y.Event._attach(a, CAPTURE_CONFIG);
    }
};

})();
