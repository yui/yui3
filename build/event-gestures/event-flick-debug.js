YUI.add('event-flick', function(Y) {

/**
 * Adds support for a "flick" event, which is fired at the end of a touch or mouse based flick gesture, and provides 
 * velocity of the flick, along with distance and time information.
 *
 * @module event-gestures
 * @submodule event-flick
 */

// TODO: Better way to sniff 'n' switch touch support?
var EVENT = ("ontouchstart" in Y.config.win) ? {
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
 * which the event is to be fired.  
 * 
 * @event flick
 * @param type {string} "flick"
 * @param fn {function} The method the event invokes.
 * @param cfg {Object} Optional. An object which specifies the minimum distance and/or velocity
 * of the flick gesture for which the event is to be fired.
 *  
 * @return {EventHandle} the detach handle
 */

Y.Event.define('flick', {

    init: function (node, subscriber, ce) {

        var startHandle = node.on(EVENT[START],
            this._onStart,
            this,
            node,
            subscriber, 
            ce);
 
        node.setData(_FLICK_START_HANDLE, startHandle);
    },

    destroy: function (node, subscriber, ce) {

        var startHandle = node.getData(_FLICK_START_HANDLE),
            endHandle = node.getData(_FLICK_END_HANDLE);

        if (startHandle) {
            startHandle.detach();
            node.clearData(_FLICK_START_HANDLE);
        }

        if (endHandle) {
            endHandle.detach();
            node.clearData(_FLICK_END_HANDLE);
        }
    },

    processArgs: function(args) {
        var params = (args[3]) ? args.splice(3, 1)[0] : {};

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

            node.setData(_FLICK_START, {
                time : new Date().getTime(),
                pageX: e.pageX, 
                pageY: e.pageY,
                clientX: e.clientX, 
                clientY: e.clientY,
                _e : e
            });

            endHandle = node.getData(_FLICK_END_HANDLE);

            if (!endHandle) {
                doc = (node.get(NODE_TYPE) === 9) ? node : node.get(OWNER_DOCUMENT);

                endHandle = doc.on(EVENT[END], Y.bind(this._onEnd, this), null, node, subscriber, ce);
                node.setData(_FLICK_END_HANDLE,endHandle);
            }
        }
    },

    _onEnd: function(e, node, subscriber, ce) {

        var endTime = new Date().getTime(),
            valid = node.getData(_FLICK_START),
            start = valid,
            endEvent = e,

            startTime,
            time,
            params,
            xyDistance, 
            distance,
            absDistance,
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

                startTime = start.time;
                endTime = new Date().getTime();
                time = endTime - startTime;

                params = subscriber._extra;

                xyDistance = [
                    endEvent.pageX - start.pageX,
                    endEvent.pageY - start.pageY
                ];

                axis = params.axis || (Math.abs(xyDistance[0]) >= Math.abs(xyDistance[1])) ? 'x' : 'y';

                distance = xyDistance[(axis === 'x') ? 0 : 1];
                absDistance = Math.abs(distance); 
                velocity = absDistance/time;

                if (isFinite(velocity) && velocity >= params.minVelocity && absDistance >= params.minDistance) {
                    ce.fire({
                        distance: distance,
                        time: time,
                        direction: distance/absDistance,
                        velocity: velocity,
                        axis: axis,
                        button: e.button,
                        start: start,
                        end: {
                            time: endTime,
                            clientX: endEvent.clientX, 
                            clientY: endEvent.clientY,
                            pageX: endEvent.pageX,
                            pageY: endEvent.pageY,
                            _e : e 
                        }
                    });
                }

                node.clearData(_FLICK_START);
            }
        }
    },

    MIN_VELOCITY : 0,
    MIN_DISTANCE : 10
});


}, '@VERSION@' ,{requires:['node-base','event-touch','event-synthetic']});
