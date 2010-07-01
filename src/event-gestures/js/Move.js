// TODO: Better way to sniff 'n' switch touch support?
var TOUCH = "ontouchstart" in Y.config.win,

    TOUCH_EVENT_MAP = {
        start: "touchstart",
        move: "touchmove",
        end: "touchend"
    },

    MOUSE_EVENT_MAP = {
        start: "mousedown",
        move: "mousemove",
        end: "mouseup"
    },

    EVENT = (TOUCH) ? TOUCH_EVENT_MAP : MOUSE_EVENT_MAP,

    START = "start",
    MOVE = "move",
    END = "end",
    
    MOVE_START_HANDLE = "_moveStartHandle",
    MOVE_HANDLE = "_moveHandle",
    MOVE_END_HANDLE = "_moveEndHandle",

    MOVE_START = "_moveStart",
    _MOVE = "_move",

    MIN_TIME = "minTime",
    MIN_DISTANCE = "minDistance",
    OWNER_DOCUMENT = "ownerDocument";

Y.Event.define('movestart', {
    
    init: function (node, subscriber, ce) {

        var startHandle = node.on(EVENT[START], 
            Y.bind(this._onStart, this), 
            null, 
            node,
            subscriber, 
            ce);

        node.setData(MOVE_START_HANDLE, startHandle);
    }, 

    destroy: function (node, subscriber, ce) {
        var startHandle = node.getData(MOVE_START_HANDLE);

        if (startHandle) {
            startHandle.detach();
            node.setData(MOVE_START_HANDLE, null);
        }
    },

    processArgs : function(args) {
        var params = args[3] ? args.splice(3,1) : {};

        if (!(MIN_TIME in params)) {
            params.minVelocity = this.MIN_TIME;
        }

        if (!(MIN_DISTANCE in params)) {
            params.minDistance = this.MIN_DISTANCE;
        }

        return params;
    },

    _onStart : function(e, node, subscriber, ce) {

        e.preventDefault();

        var start = true, // always true for mouse
            payload; 

        Y.log("_onStart");

        if (e.touches) {
            start = (e.touches.length === 1);
            e = e.touches[0];
        }

        if (start) {

            // TODO: Pass through e instead?
            payload = {
                time : new Date().getTime(),
                clientX: e.clientX,
                clientY: e.clientY,
                pageX: e.pageX, 
                pageY: e.pageY
            };

            node.setData(MOVE_START, payload);
            ce.fire(payload);
        }
    },

    MIN_TIME : 0,
    MIN_DISTANCE : 3
});

Y.Event.define('move', {

    init: function (node, subscriber, ce) {

        var doc = node.get(OWNER_DOCUMENT),

            moveHandle = doc.on(EVENT[MOVE], 
                Y.bind(this._onMove, this),
                null,
                node,
                subscriber,
                ce);

        node.setData(MOVE_HANDLE, moveHandle);
    },

    destroy: function (node, subscriber, ce) {
        var moveHandle = node.getData(MOVE_HANDLE);

        if (moveHandle) {
            moveHandle.detach();
            node.setData(MOVE_HANDLE, null);
            Y.log("detaching move handler");            
        }
    },

    _onMove : function(e, node, subscriber, ce) {

        var start = node.getData(MOVE_START),
            move = !!(start),
            payload;

        Y.log("_onMove:checkone. e.touches:" + e.touches);
        Y.log("_onMove:checkone. start:" + start);

        if (move) {

            if (e.touches) {
                move = (e.touches.length === 1);
                e = e.touches[0];
            }

            if (move) {

                e.preventDefault();

                Y.log("_onMove:checktwo");

                payload = {
                    time : new Date().getTime(),
                    clientX: e.clientX, 
                    clientY: e.clientY,
                    pageX: e.pageX, 
                    pageY: e.pageY
                };
    
                node.setData(_MOVE, payload);
                ce.fire(payload);
            }
        }
    }
});

Y.Event.define('moveend', {

    init: function (node, subscriber, ce) {
        var doc = node.get(OWNER_DOCUMENT),

            endHandle = doc.on(EVENT[END], 
                Y.bind(this._onEnd, this), 
                null,
                node,
                subscriber, 
                ce);

        node.setData(MOVE_END_HANDLE, endHandle);
    },

    destroy: function (node, subscriber, ce) {
        var endHandle = node.getData(MOVE_END_HANDLE);
    
        if (endHandle) {
            endHandle.detach();
            node.setData(MOVE_END_HANDLE, null);
        }
    },

    _onEnd : function(e, node, subscriber, ce) {

        var moveEnd = !!(node.getData(_MOVE) || node.getData(MOVE_START)),
            payload;

        if (moveEnd) {

            if (e.changedTouches) {
                if (e.changedTouches.length === 1) {
                    e = e.changedTouches[0];
                } else {
                    moveEnd = false;
                }
            }

            if (moveEnd) {

                e.preventDefault();

                payload = {
                    time : new Date().getTime(),
                    clientX: e.clientX, 
                    clientY: e.clientY,
                    pageX: e.pageX, 
                    pageY: e.pageY
                };

                node.setData(MOVE_START, null);
                node.setData(_MOVE, null);

                ce.fire(payload);
            }
        }
    }
});