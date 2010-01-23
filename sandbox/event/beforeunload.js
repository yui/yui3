/**
 * DOM0 beforeunload event listener support
 * @module event-beforeunload
 * @submodule event-beforeunload
 */

var EVENT_NAME = 'dom0beforeunload',
    supplantedHandler = window.onbeforeunload;

window.onbeforeunload = function(e) {
    if (supplantedHandler) {
        supplantedHandler(e);
    }
    var facade = new Y.DOMEventFacade(e), retVal;
    Y.fire(EVENT_NAME, facade);
    retVal = facade.returnValue;
    e.returnValue = retVal;
    return retVal;
};

/**
 * Executes the callback as soon as the specified element 
 * is detected in the DOM.
 * @event available
 * @return {EventHandle} the detach handle
 * @for YUI
 */

/**
 * The beforeunload event is not standard, yet it is useful enough that
 * most browsers support it to some degree.  But they are not consistent
 * about how it operates.  This module supplants any existing DOM0 
 * onbeforelistener because DOM2 style listeners won't work across
 * the A grade.
 * @event beforeunload
 * @for YUI
 * @param type {string} 'beforeunload'
 * @param fn {function} the callback function to execute.
 * @param context optional argument that specifies what 'this' refers to.
 * @param args* 0..n additional arguments to pass on to the callback function.
 * These arguments will be added after the event object.
 */
Y.Env.evt.plugins.beforeunload = {
    on: function(type, fn) {
        var a = Y.Array(arguments, 0, true);
        a[0] = EVENT_NAME;
        return Y.on.apply(Y, a);
    }
};
