YUI.add('event-flick', function(Y) {

/**
 * Adds support for a "flick" event, which is fired at the end of a touch or mouse based flick gesture, and provides 
 * velocity of the flick, along with distance and time information.
 *
 * @module event-gestures
 * @submodule event-flick
 */

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

    publishConfig: {
        emitFacade:false
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

    fireFilter: function (sub, args) {
        var e      = args[0],
            params = sub._extra;

        return Math.abs(e.distance) >= params.minDistance &&
                        e.velocity  >= params.minVelocity;
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

            node.setData(_FLICK_START, e);

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
            start = node.getData(_FLICK_START),
            valid = !!start,
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
                absDistance = Math.abs(distance); 
                velocity = absDistance/time;

                if (isFinite(velocity)) {

                    e.type = "flick";
                    e.flick = {
                        time:time,
                        distance: distance,
                        direction: distance/absDistance,
                        velocity:velocity,
                        axis: axis,
                        start : start
                    };

                    ce.fire(e);

                }

                node.clearData(_FLICK_START);
            }
        }
    },

    MIN_VELOCITY : 0,
    MIN_DISTANCE : 10
});


}, '@VERSION@' ,{requires:['node-base','event-touch','event-synthetic']});
YUI.add('event-move', function(Y) {

// TODO: Better way to sniff 'n' switch touch support?

var EVENT = ("ontouchstart" in Y.config.win) ? {
        start: "touchstart",
        move: "touchmove",
        end: "touchend"
    } : {
        start: "mousedown",
        move: "mousemove",
        end: "mouseup"
    },

    START = "start",
    MOVE = "move",
    END = "end",

    _MOVE_START_HANDLE = "_msh",
    _MOVE_HANDLE = "_mh",
    _MOVE_END_HANDLE = "_meh",

    _MOVE_START = "_ms",
    _MOVE = "_m",

    MIN_TIME = "minTime",
    MIN_DISTANCE = "minDistance",
    OWNER_DOCUMENT = "ownerDocument",

    NODE_TYPE = "nodeType",

    PUB_CFG = {
        emitFacade:false
    },

    // TODO: Should this be in SynthEvent as the default?
    _defArgsProcessor = function(args) {
        return args[3] ? args.splice(3,1)[0] : {};
    },

    _getRoot = function(node, subscriber) {
        return subscriber._extra.root || (node.get(NODE_TYPE) === 9) ? node : node.get(OWNER_DOCUMENT);
    },

    define = Y.Event.define;

define('gesturemovestart', {

    init: function (node, subscriber, ce) {

        node.setData(_MOVE_START_HANDLE, node.on(EVENT[START], 
            this._onStart, 
            this,
            node,
            subscriber, 
            ce));

    },

    destroy: function (node, subscriber, ce) {
        var startHandle = node.getData(_MOVE_START_HANDLE);

        if (startHandle) {
            startHandle.detach();
            node.clearData(_MOVE_START_HANDLE);
        }
    },

    processArgs : function(args) {
        var params = _defArgsProcessor(args);

        if (!(MIN_TIME in params)) {
            params[MIN_TIME] = this.MIN_TIME;
        }

        if (!(MIN_DISTANCE in params)) {
            params[MIN_DISTANCE] = this.MIN_DISTANCE;
        }

        return params;
    },

    publishConfig: PUB_CFG,

    _onStart : function(e, node, subscriber, ce) {

        e.preventDefault();

        var origE = e,
            params = subscriber._extra,
            start = true,  
            minTime = params.minTime,
            minDistance = params.minDistance,
            button = params.button,
            root = _getRoot(node, subscriber),
            startXY;

        if (e.touches) {
            start = (e.touches.length === 1);
            e = e.touches[0];

            e.target = e.target || origE.target;
            e.currentTarget = e.currentTarget || origE.currentTarget;
        } else {
            start = (button === undefined) || (button = e.button);
        }

        Y.log("gesturemovestart: params = button:" + button + ", minTime = " + minTime + ", minDistance = " + minDistance);

        if (start) {

            if (minTime === 0 || minDistance === 0) {
                Y.log("gesturemovestart: No minTime or minDistance.");
                this._start(e, node, ce, params);
            } else {

                startXY = [e.pageX, e.pageY];

                if (minTime > 0) {

                    Y.log("gesturemovestart: minTime specified. Setup timer.");
                    Y.log("gesturemovestart: initialTime for minTime = " + new Date().getTime());
                    
                    params._ht = Y.later(minTime, this, this._start, [e, node, ce, params]);

                    params._hme = root.on(EVENT[END], Y.bind(function() {
                        this._cancel(params);
                    }, this));
                }

                if (minDistance > 0) {

                    Y.log("gesturemovestart: minDistance specified. Setup native mouse/touchmove listener to measure distance.");
                    Y.log("gesturemovestart: initialXY for minDistance = " + startXY);

                    params._hm = root.on(EVENT[MOVE], Y.bind(function(em) {
                        if (Math.abs(em.pageX - startXY[0]) > minDistance || Math.abs(em.pageY - startXY[1]) > minDistance) {
                            Y.log("gesturemovestart: minDistance hit.");
                            this._start(e, node, ce, params);
                        }
                    }, this));
                }                        
            }
        }
    },
    
    _cancel : function(params) {
        if (params._ht) {
            params._ht.cancel();
            params._ht = null;
        }
        if (params._hme) {
            params._hme.detach();
            params._hme = null;
        }
        if (params._hm) {
            params._hm.detach();
            params._hm = null;
        }
    },

    _start : function(e, node, ce, params) {
        if (params) {
            this._cancel(params);
        }

        e.type = "gesturemovestart";

        Y.log("gesturemovestart: Firing start: " + new Date().getTime());

        node.setData(_MOVE_START, e);
        ce.fire(e);
    },

    MIN_TIME : 0,
    MIN_DISTANCE : 0
});

define('gesturemove', {

    init : function (node, subscriber, ce) {

        var root = _getRoot(node, subscriber),

            moveHandle = root.on(EVENT[MOVE], 
                this._onMove,
                this,
                node,
                subscriber,
                ce);

        node.setData(_MOVE_HANDLE, moveHandle);
    },

    processArgs : _defArgsProcessor,

    destroy : function (node, subscriber, ce) {
        var moveHandle = node.getData(_MOVE_HANDLE);

        if (moveHandle) {
            moveHandle.detach();
            node.clearData(_MOVE_HANDLE);
        }
    },

    publishConfig : PUB_CFG,

    _onMove : function(e, node, subscriber, ce) {

        var move = subscriber._extra.standAlone || node.getData(_MOVE_START),
            origE = e;

        if (move) {

            if (e.touches) {
                move = (e.touches.length === 1);
                e = e.touches[0];

                e.target = e.target || origE.target;
                e.currentTarget = e.currentTarget || origE.currentTarget;
            }

            if (move) {
                origE.preventDefault();

                e.type = "gesturemove";
                node.setData(_MOVE, e);
                ce.fire(e);
            }
        }
    }
});

define('gesturemoveend', {

    init : function (node, subscriber, ce) {

        var root = _getRoot(node, subscriber),

            endHandle = root.on(EVENT[END], 
                this._onEnd, 
                this,
                node,
                subscriber, 
                ce);

        node.setData(_MOVE_END_HANDLE, endHandle);
    },

    processArgs : _defArgsProcessor,

    destroy : function (node, subscriber, ce) {
        var endHandle = node.getData(_MOVE_END_HANDLE);
    
        if (endHandle) {
            endHandle.detach();
            node.clearData(_MOVE_END_HANDLE);
        }
    },

    publishConfig : PUB_CFG,

    _onEnd : function(e, node, subscriber, ce) {

        var moveEnd = subscriber._extra.standAlone || node.getData(_MOVE) || node.getData(_MOVE_START),
            origE = e;

        if (moveEnd) {

            if (e.changedTouches) {
                if (e.changedTouches.length === 1) {
                    e = e.changedTouches[0];

                    e.target = e.target || origE.target;
                    e.currentTarget = e.currentTarget || origE.currentTarget;
                    
                } else {
                    moveEnd = false;
                }
            }

            if (moveEnd) {
                origE.preventDefault();
                e.type = "gesturemoveend";

                node.clearData(_MOVE_START);
                node.clearData(_MOVE);

                ce.fire(e);
            }
        }
    }
});


}, '@VERSION@' ,{requires:['node-base','event-touch','event-synthetic']});


YUI.add('event-gestures', function(Y){}, '@VERSION@' ,{use:['event-flick', 'event-move']});

