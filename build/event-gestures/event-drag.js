YUI.add('event-drag', function(Y) {

/*
nodeA.on("dragstart", function(e) { }, {
    minTime:10,
    minDistance:20
});

nodeA.on("drag", function(e) { });

nodeA.on("dragend", function(e) { });
*/

var TOUCH = Y.UA.mobile,   // TODO: sniff 'n' switch touch support?

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
    END = "end";

Y.Event.define('movestart', {
    
    init: function (node, subscriber, ce) {
        node._dragStart = node.on(EVENT[START], Y.bind(this._onStart, this), null, subscriber, ce);
    }, 

    destroy: function (node, subscriber, ce) {
        if (node._dragStart) {
            node._dragStart.detach();
        }
    },

    processArgs : function(args) {
        var params = args[3] || {};

        if (!("minTime" in params)) {
            params.minVelocity = this.MIN_TIME;
        }

        if (!("minDistance" in params)) {
            params.minDistance = this.MIN_DISTANCE;
        }

        return params;
    },

    _onStart : function(e, subscriber, ce) {

        var node = e.currentTarget,
            start = true, // always true for mouse
            payload; 

        e.preventDefault();

        if (e.touches) {
            start = (e.touches.length === 1);
            e = e.touches[0];
        }

        if (start) {

            payload = {
                time : new Date().getTime(),
                clientXY: [e.clientX, e.clientY],
                pageXY: [e.pageX, e.pageY]
            };

            node.setData("_dragStart", payload);
            ce.fire(payload);
        }
    },

    MIN_TIME : 0,
    MIN_DISTANCE : 3
});

Y.Event.define('move', {

    init: function (node, subscriber, ce) {
        node._drag = node.get("ownerDocument").on(EVENT[MOVE], Y.bind(this._onDrag, this), null, node, subscriber, ce);
    },

    destroy: function (node, subscriber, ce) {
        if (node._drag) {
            node._drag.detach();
        }
    },

    _onDrag : function(e, node, subscriber, ce) {

        var start = node.getData("_dragStart"),
            drag = !!(start),
            payload;

        e.preventDefault();

        if (drag) {

            if (e.touches) {
                drag = drag && (e.touches.length === 1);
                e = e.touches[0];
            }

            if (drag) {

                payload = {
                    time : new Date().getTime(),
                    clientXY: [e.clientX, e.clientY],
                    pageXY: [e.clientX, e.clientY]
                };
    
                node.setData("_drag", payload);
                ce.fire(payload);
            }
        }
    }
});

Y.Event.define('moveend', {

    init: function (node, subscriber, ce) {
        node._dragEnd = node.get("ownerDocument").on(EVENT[END], Y.bind(this._onEnd, this), null, node, subscriber, ce);
    },

    destroy: function (node, subscriber, ce) {
        if (node._dragEnd) {
            node._dragEnd.detach();
        }
    },

    _onEnd : function(e, node, subscriber, ce) {

        var drag = !!(node.getData("_drag") || node.getData("_dragStart")),
            payload;

        e.preventDefault();

        if (drag) {

            if (e.changedTouches) {
                if (e.changedTouches.length === 1) {
                    e = e.changedTouches[0];
                } else {
                    drag = false;
                }
            }

            if (drag) {

                payload = {
                    time : new Date().getTime(),
                    clientXY: [e.clientX, e.clientY],
                    pageXY: [e.clientX, e.clientY]
                };

                node.setData("_dragEnd", payload);
                node.setData("_dragStart", null);
                node.setData("_drag", null);
    
                ce.fire(payload);

            } else {
                node.setData("_dragStart", null);
                node.setData("_drag", null);
            }

        } else {
            node.setData("_dragStart", null);
            node.setData("_drag", null);
        }
    }
});


}, '@VERSION@' ,{use:['node-base','event-touch','event-synthetic']});
