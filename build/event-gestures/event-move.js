YUI.add('event-move', function(Y) {

// TODO: Better way to sniff 'n' switch touch support?
var TOUCH = "ontouchstart" in Y.config.win,

    EVENT = (TOUCH) ? {
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

    MOVE_START_HANDLE = "_msh",
    MOVE_HANDLE = "_mh",
    MOVE_END_HANDLE = "_meh",

    MOVE_START = "_ms",
    _MOVE = "_m",

    MIN_TIME = "minTime",
    MIN_DISTANCE = "minDistance",
    OWNER_DOCUMENT = "ownerDocument",

    NODE_TYPE = "nodeType",
    
    PUB_CFG = {
        emitFacade:false
    },

    define = Y.Event.define;

define('movestart', {
    
    init: function (node, subscriber, ce) {

        node.setData(MOVE_START_HANDLE, node.on(EVENT[START], 
            this._onStart, 
            null,
            node,
            subscriber, 
            ce));
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

        var start = true; // always true for mouse

        if (e.touches) {
            start = (e.touches.length === 1);
            e = e.touches[0];
        }

        if (start) {
            e.type = "movestart";

            // TODO: Pass through e instead?
            /*
            payload = {
                target: e.target,
                currentTarget: e.currentTarget,
                time : new Date().getTime(),
                clientX: e.clientX,
                clientY: e.clientY,
                pageX: e.pageX,
                pageY: e.pageY,
                button : e.button,
                _e : e
            };
            */
            node.setData(MOVE_START, e);
            ce.fire(e);
        }
    },

    MIN_TIME : 0,
    MIN_DISTANCE : 3
});

define('move', {

    init: function (node, subscriber, ce) {

        var doc = node.get(NODE_TYPE) === 9 ? node : node.get(OWNER_DOCUMENT),

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
        }
    },

    publishConfig: PUB_CFG,

    _onMove : function(e, node, subscriber, ce) {

        var start = node.getData(MOVE_START),
            move = !!(start),
            te;

        if (move) {

            if (e.touches) {
                move = (e.touches.length === 1);
                te = e;
                e = e.touches[0];

                if (!e.target) {
                    e.target = te.target;
                    e.currentTarget = te.currentTarget;
                }
            }

            if (move) {
                e.preventDefault();

                e.type = "move";

                /*
                payload = {
                    target: e.target,
                    currentTarget: e.currentTarget,
                    time : new Date().getTime(),
                    clientX: e.clientX, 
                    clientY: e.clientY,
                    pageX: e.pageX, 
                    pageY: e.pageY,
                    button : e.button,
                    _e : e
                };
                */
    
                node.setData(_MOVE, e);
                ce.fire(e);
            }
        }
    }
});

define('moveend', {

    init: function (node, subscriber, ce) {
        var doc = node.get(NODE_TYPE) === 9 ? node : node.get(OWNER_DOCUMENT),

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

    publishConfig: PUB_CFG,

    _onEnd : function(e, node, subscriber, ce) {

        var moveEnd = !!(node.getData(_MOVE) || node.getData(MOVE_START));

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
                e.type = "moveend";

                /*
                payload = {
                    target: e.target,
                    currentTarget: e.currentTarget,
                    time : new Date().getTime(),
                    clientX: e.clientX, 
                    clientY: e.clientY,
                    pageX: e.pageX, 
                    pageY: e.pageY,
                    button: e.button,
                    _e : e
                };
                */

                node.setData(MOVE_START, null);
                node.setData(_MOVE, null);

                ce.fire(e);
            }
        }
    }
});


}, '@VERSION@' ,{requires:['node-base','event-touch','event-synthetic']});
