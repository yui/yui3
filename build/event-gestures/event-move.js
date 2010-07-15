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

    _defArgsProcessor = function(args) {
        return args[3] ? Y.merge(args.splice(3,1)[0]) : {};
    },

    _getRoot = function(node, subscriber) {
        return subscriber._extra.root || (node.get(NODE_TYPE) === 9) ? node : node.get(OWNER_DOCUMENT);
    },

    define = Y.Event.define;

define('gesturemovestart', {

    on: function (node, subscriber, ce) {

        // TODO: optimize to one listener per node.
        subscriber[_MOVE_START_HANDLE] = node.on(EVENT[START], 
            this._onStart,
            this,
            node,
            subscriber,
            ce);

    },

    detach: function (node, subscriber, ce) {
        var startHandle = subscriber[_MOVE_START_HANDLE];

        if (startHandle) {
            startHandle.detach();
            subscriber[_MOVE_START_HANDLE] = null;
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

    fireFilter: function (sub, args) {
        return args[0]._extra === sub._extra;
    },

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


        if (start) {

            if (minTime === 0 || minDistance === 0) {
                this._start(e, node, ce, params);
            } else {

                startXY = [e.pageX, e.pageY];

                if (minTime > 0) {

            
                    params._ht = Y.later(minTime, this, this._start, [e, node, ce, params]);

                    params._hme = root.on(EVENT[END], Y.bind(function() {
                        this._cancel(params);
                    }, this));
                }

                if (minDistance > 0) {


                    params._hm = root.on(EVENT[MOVE], Y.bind(function(em) {
                        if (Math.abs(em.pageX - startXY[0]) > minDistance || Math.abs(em.pageY - startXY[1]) > minDistance) {
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
        e._extra = params;


        node.setData(_MOVE_START, e);
        ce.fire(e);
    },

    MIN_TIME : 0,
    MIN_DISTANCE : 0
});

define('gesturemove', {

    on : function (node, subscriber, ce) {

        var root = _getRoot(node, subscriber),

            moveHandle = root.on(EVENT[MOVE], 
                this._onMove,
                this,
                node,
                subscriber,
                ce);

        subscriber[_MOVE_HANDLE] = moveHandle;
    },

    processArgs : _defArgsProcessor,

    detach : function (node, subscriber, ce) {
        var moveHandle = subscriber[_MOVE_HANDLE];

        if (moveHandle) {
            moveHandle.detach();
            subscriber[_MOVE_HANDLE] = null;
        }
    },

    publishConfig : PUB_CFG,

    fireFilter: function (sub, args) {
        var node = args[0]._extra.node,
            standAlone= sub._extra.standAlone;

        return standAlone || node.getData(_MOVE_START);
    },

    _onMove : function(e, node, subscriber, ce) {

        var move = true,
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

                e._extra = {
                    node : node
                };

                ce.fire(e);
            }
        }
    }
});

define('gesturemoveend', {

    on : function (node, subscriber, ce) {

        var root = _getRoot(node, subscriber),

            endHandle = root.on(EVENT[END], 
                this._onEnd, 
                this,
                node,
                subscriber, 
                ce);

        subscriber[_MOVE_END_HANDLE] = endHandle;
    },

    processArgs : _defArgsProcessor,

    detach : function (node, subscriber, ce) {
        var endHandle = subscriber[_MOVE_END_HANDLE];
    
        if (endHandle) {
            endHandle.detach();
            subscriber[_MOVE_END_HANDLE] = null;
        }
    },
    
    fireFilter: function (sub, args) {
        var node = args[0]._extra.node,
            standAlone= sub._extra.standAlone;

        return standAlone || node.getData(_MOVE) || node.getData(_MOVE_START);
    },

    publishConfig : PUB_CFG,

    _onEnd : function(e, node, subscriber, ce) {

        var moveEnd = true,
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
                e._extra = {
                    node:node
                };

                ce.fire(e);

                node.clearData(_MOVE_START);
                node.clearData(_MOVE);
            }
        }
    }
});


}, '@VERSION@' ,{requires:['node-base','event-touch','event-synthetic']});
