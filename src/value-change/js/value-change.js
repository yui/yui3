var VALUE        = 'value',
    VALUE_CHANGE = 'valueChange',

// Just a simple namespace to make our methods overridable.
VC = {
    // -- Static Constants -----------------------------------------------------
    TIMEOUT: 10000,

    // -- Protected Static Properties ------------------------------------------
    _events   : {},
    _history  : {},
    _intervals: {},
    _timeouts : {},

    // -- Protected Static Methods ---------------------------------------------
    _poll: function (node, e) {
        var stamp   = Y.stamp(node),
            newVal  = node.get(VALUE),
            prevVal = VC._history[stamp];

        if (newVal !== prevVal) {
            VC._history[stamp] = newVal;

            VC._events[stamp].fire({
                // _event : e, // TODO: is this correct?
                newVal : newVal,
                prevVal: prevVal
            });

            VC._startPolling(node, e);
        }
    },

    _startPolling: function (node, e) {
        var stamp = Y.stamp(node);

        VC._stopPolling(node); // avoid dupes

        // Poll for changes to the node's value. We can't rely on keyboard
        // events for this, since the value may change due to a mouse-initiated
        // paste event, an IME input event, or for some other reason that
        // doesn't trigger a key event.
        VC._intervals[stamp] = setInterval(Y.bind(VC._poll, null, node, e), 20);

        // If we don't see any changes within the timeout period (10 seconds by
        // default), stop polling.
        VC._timeouts[stamp] = setTimeout(Y.bind(VC._stopPolling, null, node),
                VC.TIMEOUT);
    },

    _stopPolling: function (node) {
        var stamp = Y.stamp(node);

        clearTimeout(VC._timeouts[stamp]);
        clearInterval(VC._intervals[stamp]);
    },

    // -- Protected Static Event Handlers --------------------------------------
    _onBlur: function (e) {
        VC._stopPolling(e.currentTarget);
    },

    _onKeyDown: function (e) {
        VC._startPolling(e.currentTarget, e);
    },

    _onKeyUp: function (e) {
        // These charCodes indicate that an IME has started. We'll restart
        // polling and give the IME up to 10 seconds (by default) to finish.
        if (e.charCode === 229 || e.charCode === 197) {
            VC._startPolling(e.currentTarget, e);
        }
    },

    _onMouseDown: function (e) {
        VC._startPolling(e.currentTarget, e);
    },

    _onSubscribe: function (node, subscription, customEvent) {
        Y.all(node).each(function (node) {
            var stamp = Y.stamp(node);

            VC._events[stamp]  = customEvent;
            VC._history[stamp] = node.get(VALUE);

            node.on(VALUE_CHANGE + '|blur', VC._onBlur);
            node.on(VALUE_CHANGE + '|mousedown', VC._onMouseDown);
            node.on(VALUE_CHANGE + '|keydown', VC._onKeyDown);
            node.on(VALUE_CHANGE + '|keyup', VC._onKeyUp);
        });
    },

    _onUnsubscribe: function (node, subscription, customEvent) {
        Y.all(node).each(function (node) {
            var stamp = Y.stamp(node);

            node.detachAll(VALUE_CHANGE + '|*');
            VC._stopPolling(node);

            delete VC._events[stamp];
            delete VC._history[stamp];
        });
    }
};

// FIXME: synthetic events don't seem to respect the context param of on()
Y.Event.define(VALUE_CHANGE, {
    detach: VC._onUnsubscribe,
    on    : VC._onSubscribe,

    publishConfig: {
        broadcast: 1,
        emitFacade: true
    }
});

Y.ValueChange = VC;
