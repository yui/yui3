/**
 * Adds focus and blur event listener support.  These events normally
 * do not bubble, so this adds support for that so these events
 * can be used in event delegation scenarios.
 * 
 * @module event
 * @submodule event-focus
 */
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


Y.Event._attachFocus = function (args, config) {

    var a = Y.Array(args, 0, true);
    if (Y.UA.ie) {
        a[0] = a[0].replace(/focus/, 'focusin');
    } else if (Y.UA.opera) {
        _captureHack(a[0], a[2]);
    }
    return Y.Event._attach(a, config);
	
};

Y.Event._attachBlur = function (args, config) {

    var a = Y.Array(args, 0, true);
    if (Y.UA.ie) {
        a[0] = a[0].replace(/blur/, 'focusout');
    } else if (Y.UA.opera) {
        _captureHack(a[0], a[2]);
    }
    return Y.Event._attach(a, config);
	
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
 * @param fn {function} the callback function to execute
 * @param o {string|HTMLElement|collection} the element(s) to bind
 * @param context optional context object
 * @param args 0..n additional arguments to provide to the listener.
 * @return {EventHandle} the detach handle
 */
adapt.focus = {
    on: function() {
		return Y.Event._attachFocus(arguments, CAPTURE_CONFIG);
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
 * @param fn {function} the callback function to execute
 * @param o {string|HTMLElement|collection} the element(s) to bind
 * @param context optional context object
 * @param args 0..n additional arguments to provide to the listener.
 * @return {EventHandle} the detach handle
 */
adapt.blur = {
    on: function() {
		return Y.Event._attachBlur(arguments, CAPTURE_CONFIG);
    }
};

})();
