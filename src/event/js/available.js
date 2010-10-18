
/**
 * DOM event listener abstraction layer
 * @module event
 * @submodule event-base
 */

/**
 * Executes the callback as soon as the specified element
 * is detected in the DOM.  This function expects a selector
 * string for the element(s) to detect.  If you already have
 * an element reference, you don't need this event.
 * @event available
 * @param type {string} 'available'
 * @param fn {function} the callback function to execute.
 * @param el {string} an selector for the element(s) to attach
 * @param context optional argument that specifies what 'this' refers to.
 * @param args* 0..n additional arguments to pass on to the callback function.
 * These arguments will be added after the event object.
 * @return {EventHandle} the detach handle
 * @for YUI
 */
Y.Env.evt.plugins.available = {
    on: function(type, fn, id, o) {
        var a = arguments.length > 4 ?  Y.Array(arguments, 4, true) : null;
        return Y.Event.onAvailable.call(Y.Event, id, fn, o, a);
    }
};

/**
 * Executes the callback as soon as the specified element
 * is detected in the DOM with a nextSibling property
 * (indicating that the element's children are available).
 * This function expects a selector
 * string for the element(s) to detect.  If you already have
 * an element reference, you don't need this event.
 * @event contentready
 * @param type {string} 'contentready'
 * @param fn {function} the callback function to execute.
 * @param el {string} an selector for the element(s) to attach.
 * @param context optional argument that specifies what 'this' refers to.
 * @param args* 0..n additional arguments to pass on to the callback function.
 * These arguments will be added after the event object.
 * @return {EventHandle} the detach handle
 * @for YUI
 */
Y.Env.evt.plugins.contentready = {
    on: function(type, fn, id, o) {
        var a = arguments.length > 4 ? Y.Array(arguments, 4, true) : null;
        return Y.Event.onContentReady.call(Y.Event, id, fn, o, a);
    }
};
