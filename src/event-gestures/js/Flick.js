/**
 * The gestures module provides gesture events such as "flick", which normalize user interactions
 * across touch and mouse or pointer based input devices. This layer can be used by application developers
 * to build input device agnostic components which behave the same in response to either touch or mouse based
 * interaction.
 *
 * <p>Documentation for events added by this module can be found in the event document for the <a href="../classes/YUI.html#events">YUI</a> global.</p>
 *
 *
 @example

     YUI().use('event-flick', function (Y) {
         Y.one('#myNode').on('flick', function (e) {
             Y.log('flick event fired. The event payload has goodies.');
         });
     });

 *
 * @module event-gestures
 */

/**
 * Adds support for a "flick" event, which is fired at the end of a touch or mouse based flick gesture, and provides
 * velocity of the flick, along with distance and time information.
 *
 * <p>Documentation for the flick event can be found on the <a href="../classes/YUI.html#event_flick">YUI</a> global,
 * along with the other supported events.</p>
 *
 * @module event-gestures
 * @submodule event-flick
 */
var GESTURE_MAP = Y.Event._GESTURE_MAP,
    EVENT = {
        start: GESTURE_MAP.start,
        end: GESTURE_MAP.end,
        move: GESTURE_MAP.move
    },
    START = "start",
    END = "end",
    MOVE = "move",

    OWNER_DOCUMENT = "ownerDocument",
    MIN_VELOCITY = "minVelocity",
    MIN_DISTANCE = "minDistance",
    PREVENT_DEFAULT = "preventDefault",

    _FLICK_START = "_fs",
    _FLICK_START_HANDLE = "_fsh",
    _FLICK_END_HANDLE = "_feh",
    _FLICK_MOVE_HANDLE = "_fmh",
    NODE_TYPE = "nodeType",
    config;

/**
 * Sets up a "flick" event, that is fired whenever the user initiates a flick gesture on the node
 * where the listener is attached. The subscriber can specify a minimum distance or velocity for
 * which the event is to be fired. The subscriber can also specify if there is a particular axis which
 * they are interested in - "x" or "y". If no axis is specified, the axis along which there was most distance
 * covered is used.
 *
 * <p>It is recommended that you use Y.bind to set up context and additional arguments for your event handler,
 * however if you want to pass the context and arguments as additional signature arguments to "on",
 * you need to provide a null value for the configuration object, e.g: <code>node.on("flick", fn, null, context, arg1, arg2, arg3)</code></p>
 *
 * @event flick
 * @for YUI
 * @param type {string} "flick"
 * @param fn {function} The method the event invokes. It receives an event facade with an e.flick object containing the flick related properties: e.flick.time, e.flick.distance, e.flick.velocity and e.flick.axis, e.flick.start.
 * @param cfg {Object} Optional. An object which specifies any of the following:
 * <dl>
 * <dt>minDistance (in pixels, defaults to 100)</dt>
 * <dd>The minimum distance between start and end points, which would qualify the gesture as a flick.</dd>
 * <dt>minVelocity (in pixels/ms, defaults to 0)</dt>
 * <dd>The minimum velocity which would qualify the gesture as a flick.</dd>
 * <dt>preventDefault (defaults to false)</dt>
 * <dd>Can be set to true/false to prevent default behavior as soon as the touchstart/touchend or mousedown/mouseup is received so that things like scrolling or text selection can be
 * prevented. This property can also be set to a function, which returns true or false, based on the event facade passed to it.</dd>
 * <dt>axis (no default)</dt>
 * <dd>Can be set to "x" or "y" if you want to constrain the flick velocity and distance to a single axis. If not
 * defined, the axis along which the maximum distance was covered is used.</dd>
 * </dl>
 * @return {EventHandle} the detach handle
 */
config = {
    _eventType: "flick",

    on: function (node, subscriber, ce) {

        //Using this instead of Y.bind() here because I find
        //the order of arguments easier to read in this case
        //since the callback gets the DOMEventFacade as it's first arg.
        var self = this;
        var startHandle = node.on(EVENT[START], function (e) {
            self._onStart(e, node, subscriber, ce);
        });
        subscriber[_FLICK_START_HANDLE] = startHandle;
    },

    detach: function (node, subscriber, ce) {

        var startHandle = subscriber[_FLICK_START_HANDLE],
            endHandle = subscriber[_FLICK_END_HANDLE];

        if (startHandle) {
            startHandle.detach();
            subscriber[_FLICK_START_HANDLE] = null;
        }

        if (endHandle) {
            endHandle.detach();
            subscriber[_FLICK_END_HANDLE] = null;
        }
    },

    processArgs: function(args, delegate) {
        if (!delegate) {
            var extra = args[3] || {};
            // remove the extra arguments from the array as specified by
            // http://yuilibrary.com/yui/docs/event/synths.html
            args.splice(3,1);

            if (extra && !extra[MIN_DISTANCE]) {
                extra[MIN_DISTANCE] = this.MIN_DISTANCE;
            }

            if (extra && !extra[MIN_VELOCITY]) {
                extra[MIN_VELOCITY] = this.MIN_VELOCITY;
            }

            if (extra && !extra[PREVENT_DEFAULT]) {
                extra[PREVENT_DEFAULT] = this.PREVENT_DEFAULT;
            }

            return extra;
        }
    },

    _onStart: function(e, node, subscriber, ce) {

        var start = true, // always true for mouse
            endHandle,
            doc,
            preventDefault = subscriber._extra[PREVENT_DEFAULT],
            origE = e,
            self = this;

        if (e.touches) {
            start = (e.touches.length === 1);
            e = e.touches[0];
        }

        if (start) {

            if (preventDefault) {
                // preventDefault is a boolean or function
                if (!preventDefault.call || preventDefault(e)) {
                    origE.preventDefault();
                }
            }

            e.flick = {
                time : new Date().getTime()
            };

            subscriber[_FLICK_START] = e;

            endHandle = subscriber[_FLICK_END_HANDLE];

            doc = (node.get(NODE_TYPE) === 9) ? node : node.get(OWNER_DOCUMENT);
            if (!endHandle) {
                endHandle = doc.on(EVENT[END], function (e) {
                    self._onEnd(e, node, subscriber, ce);
                }, { standAlone: true });
                subscriber[_FLICK_END_HANDLE] = endHandle;
            }

            subscriber[_FLICK_MOVE_HANDLE] = doc.once(EVENT[MOVE], Y.bind(this._onMove, this), null, node, subscriber, ce);
        }
    },

    _onMove: function(e, node, subscriber, ce) {
        var start = subscriber[_FLICK_START];

        // Start timing from first move.
        if (start && start.flick) {
            start.flick.time = new Date().getTime();
        }
    },

    _onEnd: function(e, node, subscriber, ce) {

        var endTime = new Date().getTime(),
            start = subscriber[_FLICK_START],
            valid = !!start,
            endEvent = e,
            startTime,
            time,
            preventDefault,
            params,
            xyDistance,
            distance,
            velocity,
            axis,
            moveHandle = subscriber[_FLICK_MOVE_HANDLE];

        if (moveHandle) {
            moveHandle.detach();
            delete subscriber[_FLICK_MOVE_HANDLE];
        }

        if (valid) {

            if (e.changedTouches) {
                if (e.changedTouches.length === 1 && e.touches.length === 0) {
                    endEvent = e.changedTouches[0];
                } else {
                    valid = false;
                }
            }

            if (valid) {

                params = subscriber._extra;
                preventDefault = params[PREVENT_DEFAULT];

                if (preventDefault) {
                    // preventDefault is a boolean or function
                    if (!preventDefault.call || preventDefault(e)) {
                        e.preventDefault();
                    }
                }

                startTime = start.flick.time;
                endTime = new Date().getTime();
                time = endTime - startTime;

                xyDistance = [
                    endEvent.pageX - start.pageX,
                    endEvent.pageY - start.pageY
                ];

                if (params.axis) {
                    axis = params.axis;
                } else {
                    axis = (Math.abs(xyDistance[0]) >= Math.abs(xyDistance[1])) ? "x" : "y";
                }

                distance = xyDistance[(axis === "x") ? 0 : 1];
                velocity = (time !== 0) ? distance/time : 0;

                this._fireEvent(e, time, distance, velocity, axis, start, params, ce);
                subscriber[_FLICK_START] = null;
            }
        }
    },

    _fireEvent: function (e, time, distance, velocity, axis, start, params, ce) {
        if (this._isValidFlick(velocity, distance, params, axis)) {

            e.type = this._eventType;
            e.flick = {
                time:time,
                distance: distance,
                velocity:velocity,
                axis: axis,
                start : start
            };

            ce.fire(e);
        }
    },

    _isValidFlick: function (velocity, distance, params, axis) {
        if (isFinite(velocity) && (Math.abs(distance) >= params[MIN_DISTANCE]) && (Math.abs(velocity)  >= params[MIN_VELOCITY])) {
            return true;
        }
        else {
            return false;
        }
    },

    MIN_VELOCITY : 0,
    MIN_DISTANCE : 100,
    PREVENT_DEFAULT : false
};


Y.Event.define('flick', config);
Y.Event.define('flickleft', Y.merge(config, {
    _eventType: 'flickleft',
    _isValidFlick: function (velocity, distance, params, axis) {
        if (isFinite(velocity) && (Math.abs(distance) >= params[MIN_DISTANCE]) &&
            (Math.abs(velocity)  >= params[MIN_VELOCITY]) &&
            axis === 'x' && distance < 0) {

            return true;
        }
        else {
            return false;
        }
    }
}));

Y.Event.define('flickright', Y.merge(config, {
    _eventType: 'flickright',
    _isValidFlick: function (velocity, distance, params, axis) {
        if (isFinite(velocity) && (Math.abs(distance) >= params[MIN_DISTANCE]) &&
            (Math.abs(velocity)  >= params[MIN_VELOCITY]) &&
            axis === 'x' && distance > 0) {

            return true;
        }
        else {
            return false;
        }
    }
}));

Y.Event.define('flickup', Y.merge(config, {
    _eventType: 'flickup',
    _isValidFlick: function (velocity, distance, params, axis) {
        if (isFinite(velocity) && (Math.abs(distance) >= params[MIN_DISTANCE]) &&
            (Math.abs(velocity)  >= params[MIN_VELOCITY]) &&
            axis === 'y' && distance < 0) {

            return true;
        }
        else {
            return false;
        }
    }
}));

Y.Event.define('flickdown', Y.merge(config, {
    _eventType: 'flickdown',
    _isValidFlick: function (velocity, distance, params, axis) {
        if (isFinite(velocity) && (Math.abs(distance) >= params[MIN_DISTANCE]) &&
            (Math.abs(velocity)  >= params[MIN_VELOCITY]) &&
            axis === 'y' && distance > 0) {

            return true;
        }
        else {
            return false;
        }
    }
}));
