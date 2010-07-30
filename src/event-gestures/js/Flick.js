/**
 * The gestures module provides gesture events such as "flick", which normalize user interactions
 * across touch and mouse or pointer based input devices. This layer can be used by application developers
 * to build input device agnostic components which behave the same in response to either touch or mouse based  
 * interaction.
 *
 * <p>Documentation for events added by this module can be found in the event document for the <a href="YUI.html#events">YUI</event> global.</p>
 *
 * @module event-gestures
 */

/**
 * Adds support for a "flick" event, which is fired at the end of a touch or mouse based flick gesture, and provides 
 * velocity of the flick, along with distance and time information.
 *
 * @module event-gestures
 * @submodule event-flick
 */

var EVENT = ("ontouchstart" in Y.config.win && !Y.UA.chrome) ? {
        start: "touchstart",
        end: "touchend"
    } : {
        start: "mousedown",
        end: "mouseup"
    },

    START = "start",
    END = "end",

    OWNER_DOCUMENT = "ownerDocument",
    MIN_VELOCITY = "minVelocity",
    MIN_DISTANCE = "minDistance",

    _FLICK_START = "_fs",
    _FLICK_START_HANDLE = "_fsh",
    _FLICK_END_HANDLE = "_feh",

    NODE_TYPE = "nodeType";

/**
 * Sets up a "flick" event, that is fired whenever the user initiates a flick gesture on the node
 * where the listener is attached. The subscriber can specify a minimum distance or velocity for
 * which the event is to be fired. The subscriber can also specify if there is a particular axis which
 * they are interested in - "x" or "y". If no axis is specified, the axis along which there was most distance
 * covered is used.
 *
 * @event flick
 * @for YUI
 * @param type {string} "flick"
 * @param fn {function} The method the event invokes. It receives an event facade with an e.flick object containing the flick related properties: e.flick.time, e.flick.distance, e.flick.velocity and e.flick.axis, e.flick.start.
 * @param cfg {Object} Optional. An object which specifies the minimum distance and/or velocity  (in px/ms)
 * of the flick gesture for which the event is to be fired and an axis of interest. e.g. { minDistance:10, minVelocity:0.5, axis:"x" }.
 *
 * @return {EventHandle} the detach handle
 */

Y.Event.define('flick', {

    on: function (node, subscriber, ce) {

        var startHandle = node.on(EVENT[START],
            this._onStart,
            this,
            node,
            subscriber, 
            ce);
 
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

    processArgs: function(args) {
        var params = (args.length > 3) ? Y.merge(args.splice(3, 1)[0]) : {};

        if (!(MIN_VELOCITY in params)) {
            params.minVelocity = this.MIN_VELOCITY;
        }

        if (!(MIN_DISTANCE in params)) {
            params.minDistance = this.MIN_DISTANCE;
        }

        Y.log("flick, processArgs : minDistance =" + params.minDistance + ", minVelocity =" + params.minVelocity);

        return params;
    },

    _onStart: function(e, node, subscriber, ce) {

        var start = true, // always true for mouse
            endHandle,
            doc,
            origE = e; 

        if (e.touches) {
            start = (e.touches.length === 1);
            e = e.touches[0];
        }

        if (start) {
            origE.preventDefault();

            e.flick = {
                time : new Date().getTime()
            };

            subscriber[_FLICK_START] = e;

            endHandle = subscriber[_FLICK_END_HANDLE];

            if (!endHandle) {
                doc = (node.get(NODE_TYPE) === 9) ? node : node.get(OWNER_DOCUMENT);

                endHandle = doc.on(EVENT[END], Y.bind(this._onEnd, this), null, node, subscriber, ce);
                subscriber[_FLICK_END_HANDLE] = endHandle;
            }
        }
    },

    _onEnd: function(e, node, subscriber, ce) {

        var endTime = new Date().getTime(),
            start = subscriber[_FLICK_START],
            valid = !!start,
            endEvent = e,
            startTime,
            time,
            params,
            xyDistance, 
            distance,
            velocity,
            axis;

        if (valid) {

            if (e.changedTouches) {
                if (e.changedTouches.length === 1 && e.touches.length === 0) {
                    endEvent = e.changedTouches[0];
                } else {
                    valid = false;
                }
            }

            if (valid) {

                endEvent.preventDefault();

                startTime = start.flick.time;
                endTime = new Date().getTime();
                time = endTime - startTime;

                params = subscriber._extra;

                xyDistance = [
                    endEvent.pageX - start.pageX,
                    endEvent.pageY - start.pageY
                ];

                axis = params.axis || (Math.abs(xyDistance[0]) >= Math.abs(xyDistance[1])) ? 'x' : 'y';
                distance = xyDistance[(axis === 'x') ? 0 : 1];
                velocity = (time !== 0) ? distance/time : 0;

                if (isFinite(velocity) && (Math.abs(distance) >= params.minDistance) && (Math.abs(velocity)  >= params.minVelocity)) {

                    e.type = "flick";
                    e.flick = {
                        time:time,
                        distance: distance,
                        velocity:velocity,
                        axis: axis,
                        start : start
                    };

                    ce.fire(e);

                }

                subscriber[_FLICK_START] = null;
            }
        }
    },

    MIN_VELOCITY : 0,
    MIN_DISTANCE : 0
});
