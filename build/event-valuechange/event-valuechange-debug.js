YUI.add('event-valuechange', function(Y) {

/**
Adds a synthetic `valueChange` event that fires when the `value` property of an
`<input>` or `<textarea>` node changes as a result of a keystroke, mouse
operation, or input method editor (IME) input event.

Usage:

    YUI().use('event-valuechange', function (Y) {
        Y.one('#my-input').on('valueChange', function (e) {
            Y.log('previous value: ' + e.prevVal);
            Y.log('new value: ' + e.newVal);
        });
    });

@module event-valuechange
**/

/**
Provides the implementation for the synthetic `valueChange` event. This class
isn't meant to be used directly, but is public to make monkeypatching possible.

Usage:

    YUI().use('event-valuechange', function (Y) {
        Y.one('#my-input').on('valueChange', function (e) {
            Y.log('previous value: ' + e.prevVal);
            Y.log('new value: ' + e.newVal);
        });
    });

@class ValueChange
@static
*/

var VALUE = 'value',
    config, // defined at the end of this file

// Just a simple namespace to make methods overridable.
VC = {
    // -- Static Constants -----------------------------------------------------

    /**
    Interval (in milliseconds) at which to poll for changes to the value of an
    element with one or more `valueChange` subscribers when the user is likely
    to be interacting with it.

    @property POLL_INTERVAL
    @type Number
    @default 50
    @static
    **/
    POLL_INTERVAL: 50,

    /**
    Timeout (in milliseconds) after which to stop polling when there hasn't been
    any new activity (keypresses, mouse clicks, etc.) on an element.

    @property TIMEOUT
    @type Number
    @default 10000
    @static
    **/
    TIMEOUT: 10000,

    // -- Protected Static Properties ------------------------------------------
    _history  : {},
    _intervals: {},
    _notifiers: {},
    _timeouts : {},

    // -- Protected Static Methods ---------------------------------------------

    /**
    Called at an interval to poll for changes to the value of the specified
    node.

    @method _poll
    @param {Node} node
    @param {String} stamp
    @param {EventFacade} e
    @protected
    @static
    **/
    _poll: function (node, stamp, e) {
        var domNode = node._node, // performance cheat; getValue() is a big hit when polling
            newVal  = domNode && domNode.value,
            prevVal = VC._history[stamp],
            facade, i, len, notifiers;

        if (!domNode) {
            Y.log('_poll: node ' + stamp + ' disappeared; stopping polling.', 'warn', 'event-valuechange');
            VC._stopPolling(node, stamp);
            return;
        }

        if (newVal !== prevVal) {
            VC._history[stamp] = newVal;

            facade = {
                _event : e,
                newVal : newVal,
                prevVal: prevVal
            };

            notifiers = VC._notifiers[stamp];

            for (i = 0, len = notifiers.length; i < len; ++i) {
                notifiers[i].fire(facade);
            }

            VC._refreshTimeout(node, stamp);
        }
    },

    /**
    Restarts the inactivity timeout for the specified node.

    @method _refreshTimeout
    @param {Node} node
    @param {String} stamp
    @protected
    @static
    **/
    _refreshTimeout: function (node, stamp) {
        VC._stopTimeout(node, stamp); // avoid dupes

        // If we don't see any changes within the timeout period (10 seconds by
        // default), stop polling.
        VC._timeouts[stamp] = setTimeout(function () {
            VC._stopPolling(node, stamp);
        }, VC.TIMEOUT);

        Y.log('_refreshTimeout: ' + stamp, 'info', 'event-valuechange');
    },

    /**
    Begins polling for changes to the `value` property of the specified node. If
    polling is already underway for the specified node, it will not be restarted
    unless the _force_ parameter is `true`

    @method _startPolling
    @param {Node} node Node to watch.
    @param {String} [stamp] Object stamp for the node. Will be generated if not
        provided (provide it to improve performance).
    @param {EventFacade} [e] Event facade of the event that initiated the
        polling (if any).
    @param {Boolean} [force=false] If `true`, polling will be restarted even if
        we're already polling this node.
    @protected
    @static
    **/
    _startPolling: function (node, stamp, e, force) {
        stamp || (stamp = Y.stamp(node));

        // Don't bother continuing if we're already polling.
        if (!force && VC._intervals[stamp]) {
            return;
        }

        VC._stopPolling(node, stamp); // avoid dupes

        // Poll for changes to the node's value. We can't rely on keyboard
        // events for this, since the value may change due to a mouse-initiated
        // paste event, an IME input event, or for some other reason that
        // doesn't trigger a key event.
        VC._intervals[stamp] = setInterval(function () {
            VC._poll(node, stamp, e);
        }, VC.POLL_INTERVAL);

        VC._refreshTimeout(node, stamp, e);

        Y.log('_startPolling: ' + stamp, 'info', 'event-valuechange');
    },

    /**
    Stops polling for changes to the specified node's `value` attribute.

    @method _stopPolling
    @param {Node} node
    @param {String} [stamp]
    @protected
    @static
    **/
    _stopPolling: function (node, stamp) {
        stamp || (stamp = Y.stamp(node));

        VC._intervals[stamp] = clearInterval(VC._intervals[stamp]);
        VC._stopTimeout(node, stamp);

        Y.log('_stopPolling: ' + stamp, 'info', 'event-valuechange');
    },

    /**
    Clears the inactivity timeout for the specified node, if any.

    @method _stopTimeout
    @param {Node} node
    @param {String} [stamp]
    @protected
    @static
    **/
    _stopTimeout: function (node, stamp) {
        stamp || (stamp = Y.stamp(node));
        VC._timeouts[stamp] = clearTimeout(VC._timeouts[stamp]);
    },

    // -- Protected Static Event Handlers --------------------------------------

    /**
    Stops polling when a node's blur event fires.

    @method _onBlur
    @param {EventFacade} e
    @protected
    @static
    **/
    _onBlur: function (e) {
        VC._stopPolling(e.currentTarget);
    },

    /**
    Resets a node's history and starts polling when a focus event occurs.

    @method _onFocus
    @param {EventFacade} e
    @protected
    @static
    **/
    _onFocus: function (e) {
        var node = e.currentTarget;

        VC._history[Y.stamp(node)] = node.get(VALUE);
        VC._startPolling(node, null, e);
    },

    /**
    Starts polling when a node receives a keyDown event.

    @method _onKeyDown
    @param {EventFacade} e
    @protected
    @static
    **/
    _onKeyDown: function (e) {
        VC._startPolling(e.currentTarget, null, e);
    },

    /**
    Starts polling when an IME-related keyUp event occurs on a node.

    @method _onKeyUp
    @param {EventFacade} e
    @protected
    @static
    **/
    _onKeyUp: function (e) {
        // These charCodes indicate that an IME has started. We'll restart
        // polling and give the IME up to 10 seconds (by default) to finish.
        if (e.charCode === 229 || e.charCode === 197) {
            VC._startPolling(e.currentTarget, null, e, true);
        }
    },

    /**
    Starts polling when a node receives a mouseDown event.

    @method _onMouseDown
    @param {EventFacade} e
    @protected
    @static
    **/
    _onMouseDown: function (e) {
        VC._startPolling(e.currentTarget, null, e);
    },

    /**
    Called when the `valuechange` event receives a new subscriber.

    @method _onSubscribe
    @param {Node} node
    @param {Subscription} subscription
    @param {SyntheticEvent.Notifier} notifier
    @protected
    @static
    **/
    _onSubscribe: function (node, subscription, notifier) {
        var stamp     = Y.stamp(node),
            notifiers = VC._notifiers[stamp];

        VC._history[stamp] = node.get(VALUE);

        notifier._handles = node.on({
            blur     : VC._onBlur,
            focus    : VC._onFocus,
            keydown  : VC._onKeyDown,
            keyup    : VC._onKeyUp,
            mousedown: VC._onMouseDown
        });

        if (!notifiers) {
            notifiers = VC._notifiers[stamp] = [];
        }

        notifiers.push(notifier);
    },

    /**
    Called when the `valuechange` event loses a subscriber.

    @method _onUnsubscribe
    @param {Node} node
    @param {Subscription} subscription
    @param {SyntheticEvent.Notifier} notifier
    @protected
    @static
    **/
    _onUnsubscribe: function (node, subscription, notifier) {
        var stamp     = Y.stamp(node),
            notifiers = VC._notifiers[stamp],
            index     = Y.Array.indexOf(notifiers, notifier);

        notifier._handles.detach();

        if (index > -1) {
            notifiers.splice(index, 1);

            if (!notifiers.length) {
                VC._stopPolling(node, stamp);

                delete VC._notifiers[stamp];
                delete VC._history[stamp];
            }
        }
    }
};

/**
Synthetic event that fires when the `value` property of an `<input>` or
`<textarea>` node changes as a result of a user-initiated keystroke, mouse
operation, or input method editor (IME) input event.

Unlike the `onchange` event, this event fires when the value actually changes
and not when the element loses focus. This event also reports IME and
multi-stroke input more reliably than `oninput` or the various key events across
browsers.

For performance reasons, only focused nodes are monitored for changes, so
programmatic value changes on nodes that don't have focus won't be detected.

@example

    YUI().use('event-valuechange', function (Y) {
        Y.one('#my-input').on('valueChange', function (e) {
            Y.log('previous value: ' + e.prevVal);
            Y.log('new value: ' + e.newVal);
        });
    });

@event valuechange
@param {String} prevVal Previous value prior to the latest change.
@param {String} newVal New value after the latest change.
@for YUI
**/

config = {
    detach: VC._onUnsubscribe,
    on    : VC._onSubscribe,

    publishConfig: {
        emitFacade: true
    }
};

Y.Event.define('valuechange', config);
Y.Event.define('valueChange', config); // deprecated, but supported for backcompat

Y.ValueChange = VC;


}, '@VERSION@' ,{requires:['event-focus', 'event-synthetic']});
