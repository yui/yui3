/**
 * Adds a synthetic <code>valueChange</code> event that fires when the
 * <code>value</code> property of an input field or textarea changes as a result
 * of a keystroke, mouse operation, or input method editor (IME) input event.
 *
 * @module event-valuechange
 */

/**
 * Provides the implementation for the synthetic <code>valueChange</code> event.
 *
 * @class ValueChange
 * @static
 */

var VALUE        = 'value',
    VALUE_CHANGE = 'valueChange',

// Just a simple namespace to make methods overridable.
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
                _event : e,
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

/**
 * <p>
 * Synthetic event that fires when the <code>value</code> property of an input
 * field or textarea changes as a result of a keystroke, mouse operation, or
 * input method editor (IME) input event.
 * </p>
 *
 * <p>
 * Unlike the <code>onchange</code> event, this event fires when the value
 * actually changes and not when the element loses focus. This event also
 * reports IME and multi-stroke input more reliably than <code>oninput</code> or
 * the various key events across browsers.
 * </p>
 *
 * <p>
 * This event is provided by the <code>value-change</code> module.
 * </p>
 *
 * <p>
 * <strong>Usage example:</strong>
 * </p>
 *
 * <code><pre>
 * YUI().use('value-change', function (Y) {
 * &nbsp;&nbsp;Y.one('input').on('valueChange', function (e) {
 * &nbsp;&nbsp;&nbsp;&nbsp;// Handle valueChange events on the first input element on the page.
 * &nbsp;&nbsp;});
 * });
 * </pre></code>
 *
 * @event valueChange
 * @param {EventFacade} e Event facade with the following additional
 *   properties:
 *
 * <dl>
 *   <dt>prevVal (String)</dt>
 *   <dd>
 *     Previous value before the latest change.
 *   </dd>
 *
 *   <dt>newVal (String)</dt>
 *   <dd>
 *     New value after the latest change.
 *   </dd>
 * </dl>
 *
 * @for YUI
 */

Y.Event.define(VALUE_CHANGE, {
    detach: VC._onUnsubscribe,
    on    : VC._onSubscribe,

    publishConfig: {
        broadcast: 1,
        emitFacade: true
    }
});

Y.ValueChange = VC;
