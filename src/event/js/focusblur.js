(function() {

var FOCUS   = Y.UA.ie ? "focusin" : "focus",
    BLUR    = Y.UA.ie ? "focusout" : "blur",
    CAPTURE = "capture_",
    adapt = Y.Env.eventAdaptors;


/**
 * Adds a DOM focus listener.  Uses the focusin event in IE,
 * and the capture phase otherwise so that
 * the event propagates properly.
 * @for YUI
 * @event focus
 */
adapt.focus = {
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
};

/**
 * Adds a DOM focus listener.  Uses the focusout event in IE,
 * and the capture phase otherwise so that
 * the event propagates properly.
 * @for YUI
 * @event blur
 */
adapt.blur = {
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
};

})();
