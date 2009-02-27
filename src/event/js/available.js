(function() {

var adapt = Y.Env.eventAdaptors;

    /**
     * Executes the callback as soon as the specified element 
     * is detected in the DOM.
     * @for YUI
     * @event available
     */
adapt.available = {
    on: function(type, fn, id, o) {
        var a = arguments.length > 4 ?  Y.Array(arguments, 4, true) : [];
        return Y.Event.onAvailable.call(Y.Event, id, fn, o, a);
    }
};

/**
 * Executes the callback as soon as the specified element 
 * is detected in the DOM with a nextSibling property
 * (indicating that the element's children are available)
 * @for YUI
 * @event contentready
 */
adapt.contentready = {
    on: function(type, fn, id, o) {
        var a = arguments.length > 4 ?  Y.Array(arguments, 4, true) : [];
        return Y.Event.onContentReady.call(Y.Event, id, fn, o, a);
    }
};

})();
