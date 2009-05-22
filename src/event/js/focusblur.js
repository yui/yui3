(function() {

var FOCUS   = Y.UA.ie ? "focusin" : "focus",
    BLUR    = Y.UA.ie ? "focusout" : "blur",
    CAPTURE = "capture_",
    adapt = Y.Env.evt.plugins,
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
            Y.Event.attach(type, NOOP, p);
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
 */
adapt.focus = {
    on: function(type, fn, o) {
        var a = Y.Array(arguments, 0, true);
        a[0] = CAPTURE + FOCUS;
        if (Y.UA.opera) {
            _captureHack(a[0], o);
        }
        return Y.Event.attach.apply(Y.Event, a);
    },

    detach: function() {
        var a = Y.Array(arguments, 0, true);
        a[0] = CAPTURE + FOCUS;
        return Y.Event.detach.apply(Y.Event, a);

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
 */
adapt.blur = {
    on: function(type, fn, o) {
        var a = Y.Array(arguments, 0, true);
        a[0] = CAPTURE + BLUR;
        if (Y.UA.opera) {
            _captureHack(a[0], o);
        }
        return Y.Event.attach.apply(Y.Event, a);
    },

    detach: function() {
        var a = Y.Array(arguments, 0, true);
        a[0] = CAPTURE + BLUR;
        return Y.Event.detach.apply(Y.Event, a);
    }
};

})();
