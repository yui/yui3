if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/event-tap/event-tap.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/event-tap/event-tap.js",
    code: []
};
_yuitest_coverage["build/event-tap/event-tap.js"].code=["YUI.add('event-tap', function (Y, NAME) {","","/**"," * The tap module provides a gesture events, \"tap\", which normalizes user interactions"," * across touch and mouse or pointer based input devices.  This can be used by application developers"," * to build input device agnostic components which behave the same in response to either touch or mouse based"," * interaction."," *"," * 'tap' is like a touchscreen 'click', only it requires much less finger-down time since it listens to touch events,"," * but reverts to mouse events if touch is not supported. "," * @module event"," * @submodule event-tap"," * @author matuzak and tilo mitra"," * @since 3.7.0 "," * ","*/","var doc = Y.config.doc,","    SUPPORTS_TOUCHES = !!(doc && doc.createTouch),","    EVT_START = SUPPORTS_TOUCHES ? 'touchstart' : 'mousedown',","    EVT_MOVE = SUPPORTS_TOUCHES ? 'touchmove' : 'mousemove',","    EVT_END = SUPPORTS_TOUCHES ? 'touchend' : 'mouseup',","    EVT_CANCEL = SUPPORTS_TOUCHES ? 'touchcancel' : 'mousecancel',","    EVT_TAP = 'tap',","","    HANDLES = {","        START: 'Y_TAP_ON_START_HANDLE',","        MOVE: 'Y_TAP_ON_MOVE_HANDLE',","        END: 'Y_TAP_ON_END_HANDLE',","        CANCEL: 'Y_TAP_ON_CANCEL_HANDLE'","    };","","function detachHelper(subscription, handles, subset, context) {","","    handles = subset ? handles : [ handles.START, handles.MOVE, handles.END, handles.CANCEL ];","","    Y.Array.each(handles, function (item, index, array) {","        var handle = subscription[item];","        if (handle) {","            handle.detach();","            subscription[item] = null;","        }","    });","","}","","","/**"," * Sets up a \"tap\" event, that is fired on touch devices in response to a tap event (finger down, finder up)."," * This event can be used instead of listening for click events which have a 500ms delay on most touch devices."," * This event can also be listened for using node.delegate()."," *"," * @event tap"," * @param type {string} \"tap\""," * @param fn {function} The method the event invokes. It receives the event facade of the underlying DOM event."," *"," * @return {EventHandle} the detach handle","*/","Y.Event.define(EVT_TAP, {","","    on: function (node, subscription, notifier) {","        subscription[HANDLES.START] = node.on(EVT_START, this.touchStart, this, node, subscription, notifier);","    },","","    detach: function (node, subscription, notifier) {","        detachHelper(subscription, HANDLES);","    },","","    delegate: function (node, subscription, notifier, filter) {","        subscription[HANDLES.START] = node.delegate(EVT_START, function (e) {","            this.touchStart(e, node, subscription, notifier, true);","        }, filter, this);","    },","","    detachDelegate: function (node, subscription, notifier) {","        detachHelper(subscription, HANDLES);","    },","","    touchStart: function (event, node, subscription, notifier, delegate) {","","        var context = {","                canceled: false","            };","        //move ways to quit early to the top.","","        // no right clicks","        if (event.button && event.button === 3) {","            return;","        }","","        // for now just support a 1 finger count (later enhance via config)","        if (event.touches && event.touches.length !== 1) {","            return;","        }","","        context.node = delegate ? event.currentTarget : node;","","        //There is a double check in here to support event simulation tests, in which","        //event.touches can be undefined when simulating 'touchstart' on touch devices.","        if (SUPPORTS_TOUCHES && event.touches) {","          context.startXY = [ event.touches[0].pageX, event.touches[0].pageY ];","        }","        else {","          context.startXY = [ event.pageX, event.pageY ];","        }","","        //Possibly outdated issue: something is off with the move that it attaches it but never triggers the handler","        subscription[HANDLES.MOVE] = node.once(EVT_MOVE, this.touchMove, this, node, subscription, notifier, delegate, context);","        subscription[HANDLES.END] = node.once(EVT_END, this.touchEnd, this, node, subscription, notifier, delegate, context);","        subscription[HANDLES.CANCEL] = node.once(EVT_CANCEL, this.touchMove, this, node, subscription, notifier, delegate, context);","    },","","    touchMove: function (event, node, subscription, notifier, delegate, context) {","        detachHelper(subscription, [ HANDLES.MOVE, HANDLES.END, HANDLES.CANCEL ], true, context);","        context.cancelled = true;","","    },","","    touchEnd: function (event, node, subscription, notifier, delegate, context) {","        var startXY = context.startXY,","            endXY,","            clientXY;","","        //There is a double check in here to support event simulation tests, in which","        //event.touches can be undefined when simulating 'touchstart' on touch devices.","        if (SUPPORTS_TOUCHES && event.changedTouches) {","          endXY = [ event.changedTouches[0].pageX, event.changedTouches[0].pageY ];","          clientXY = [event.changedTouches[0].clientX, event.changedTouches[0].clientY];","        }","        else {","          endXY = [ event.pageX, event.pageY ];","          clientXY = [event.clientX, event.clientY];","        }","","        detachHelper(subscription, [ HANDLES.MOVE, HANDLES.END, HANDLES.CANCEL ], true, context);","","        // make sure mouse didn't move","        if (Math.abs(endXY[0] - startXY[0]) === 0 && Math.abs(endXY[1] - startXY[1]) === 0) {","","            event.type = EVT_TAP;","            event.pageX = endXY[0];","            event.pageY = endXY[1];","            event.clientX = clientXY[0];","            event.clientY = clientXY[1];","            event.currentTarget = context.node;","","            notifier.fire(event);","        }","    }","});","","","}, '@VERSION@', {\"requires\": [\"node-base\", \"event-base\", \"event-touch\", \"event-synthetic\"]});"];
_yuitest_coverage["build/event-tap/event-tap.js"].lines = {"1":0,"17":0,"32":0,"34":0,"36":0,"37":0,"38":0,"39":0,"40":0,"58":0,"61":0,"65":0,"69":0,"70":0,"75":0,"80":0,"86":0,"87":0,"91":0,"92":0,"95":0,"99":0,"100":0,"103":0,"107":0,"108":0,"109":0,"113":0,"114":0,"119":0,"125":0,"126":0,"127":0,"130":0,"131":0,"134":0,"137":0,"139":0,"140":0,"141":0,"142":0,"143":0,"144":0,"146":0};
_yuitest_coverage["build/event-tap/event-tap.js"].functions = {"(anonymous 2):36":0,"detachHelper:32":0,"on:60":0,"detach:64":0,"(anonymous 3):69":0,"delegate:68":0,"detachDelegate:74":0,"touchStart:78":0,"touchMove:112":0,"touchEnd:118":0,"(anonymous 1):1":0};
_yuitest_coverage["build/event-tap/event-tap.js"].coveredLines = 44;
_yuitest_coverage["build/event-tap/event-tap.js"].coveredFunctions = 11;
_yuitest_coverline("build/event-tap/event-tap.js", 1);
YUI.add('event-tap', function (Y, NAME) {

/**
 * The tap module provides a gesture events, "tap", which normalizes user interactions
 * across touch and mouse or pointer based input devices.  This can be used by application developers
 * to build input device agnostic components which behave the same in response to either touch or mouse based
 * interaction.
 *
 * 'tap' is like a touchscreen 'click', only it requires much less finger-down time since it listens to touch events,
 * but reverts to mouse events if touch is not supported. 
 * @module event
 * @submodule event-tap
 * @author matuzak and tilo mitra
 * @since 3.7.0 
 * 
*/
_yuitest_coverfunc("build/event-tap/event-tap.js", "(anonymous 1)", 1);
_yuitest_coverline("build/event-tap/event-tap.js", 17);
var doc = Y.config.doc,
    SUPPORTS_TOUCHES = !!(doc && doc.createTouch),
    EVT_START = SUPPORTS_TOUCHES ? 'touchstart' : 'mousedown',
    EVT_MOVE = SUPPORTS_TOUCHES ? 'touchmove' : 'mousemove',
    EVT_END = SUPPORTS_TOUCHES ? 'touchend' : 'mouseup',
    EVT_CANCEL = SUPPORTS_TOUCHES ? 'touchcancel' : 'mousecancel',
    EVT_TAP = 'tap',

    HANDLES = {
        START: 'Y_TAP_ON_START_HANDLE',
        MOVE: 'Y_TAP_ON_MOVE_HANDLE',
        END: 'Y_TAP_ON_END_HANDLE',
        CANCEL: 'Y_TAP_ON_CANCEL_HANDLE'
    };

_yuitest_coverline("build/event-tap/event-tap.js", 32);
function detachHelper(subscription, handles, subset, context) {

    _yuitest_coverfunc("build/event-tap/event-tap.js", "detachHelper", 32);
_yuitest_coverline("build/event-tap/event-tap.js", 34);
handles = subset ? handles : [ handles.START, handles.MOVE, handles.END, handles.CANCEL ];

    _yuitest_coverline("build/event-tap/event-tap.js", 36);
Y.Array.each(handles, function (item, index, array) {
        _yuitest_coverfunc("build/event-tap/event-tap.js", "(anonymous 2)", 36);
_yuitest_coverline("build/event-tap/event-tap.js", 37);
var handle = subscription[item];
        _yuitest_coverline("build/event-tap/event-tap.js", 38);
if (handle) {
            _yuitest_coverline("build/event-tap/event-tap.js", 39);
handle.detach();
            _yuitest_coverline("build/event-tap/event-tap.js", 40);
subscription[item] = null;
        }
    });

}


/**
 * Sets up a "tap" event, that is fired on touch devices in response to a tap event (finger down, finder up).
 * This event can be used instead of listening for click events which have a 500ms delay on most touch devices.
 * This event can also be listened for using node.delegate().
 *
 * @event tap
 * @param type {string} "tap"
 * @param fn {function} The method the event invokes. It receives the event facade of the underlying DOM event.
 *
 * @return {EventHandle} the detach handle
*/
_yuitest_coverline("build/event-tap/event-tap.js", 58);
Y.Event.define(EVT_TAP, {

    on: function (node, subscription, notifier) {
        _yuitest_coverfunc("build/event-tap/event-tap.js", "on", 60);
_yuitest_coverline("build/event-tap/event-tap.js", 61);
subscription[HANDLES.START] = node.on(EVT_START, this.touchStart, this, node, subscription, notifier);
    },

    detach: function (node, subscription, notifier) {
        _yuitest_coverfunc("build/event-tap/event-tap.js", "detach", 64);
_yuitest_coverline("build/event-tap/event-tap.js", 65);
detachHelper(subscription, HANDLES);
    },

    delegate: function (node, subscription, notifier, filter) {
        _yuitest_coverfunc("build/event-tap/event-tap.js", "delegate", 68);
_yuitest_coverline("build/event-tap/event-tap.js", 69);
subscription[HANDLES.START] = node.delegate(EVT_START, function (e) {
            _yuitest_coverfunc("build/event-tap/event-tap.js", "(anonymous 3)", 69);
_yuitest_coverline("build/event-tap/event-tap.js", 70);
this.touchStart(e, node, subscription, notifier, true);
        }, filter, this);
    },

    detachDelegate: function (node, subscription, notifier) {
        _yuitest_coverfunc("build/event-tap/event-tap.js", "detachDelegate", 74);
_yuitest_coverline("build/event-tap/event-tap.js", 75);
detachHelper(subscription, HANDLES);
    },

    touchStart: function (event, node, subscription, notifier, delegate) {

        _yuitest_coverfunc("build/event-tap/event-tap.js", "touchStart", 78);
_yuitest_coverline("build/event-tap/event-tap.js", 80);
var context = {
                canceled: false
            };
        //move ways to quit early to the top.

        // no right clicks
        _yuitest_coverline("build/event-tap/event-tap.js", 86);
if (event.button && event.button === 3) {
            _yuitest_coverline("build/event-tap/event-tap.js", 87);
return;
        }

        // for now just support a 1 finger count (later enhance via config)
        _yuitest_coverline("build/event-tap/event-tap.js", 91);
if (event.touches && event.touches.length !== 1) {
            _yuitest_coverline("build/event-tap/event-tap.js", 92);
return;
        }

        _yuitest_coverline("build/event-tap/event-tap.js", 95);
context.node = delegate ? event.currentTarget : node;

        //There is a double check in here to support event simulation tests, in which
        //event.touches can be undefined when simulating 'touchstart' on touch devices.
        _yuitest_coverline("build/event-tap/event-tap.js", 99);
if (SUPPORTS_TOUCHES && event.touches) {
          _yuitest_coverline("build/event-tap/event-tap.js", 100);
context.startXY = [ event.touches[0].pageX, event.touches[0].pageY ];
        }
        else {
          _yuitest_coverline("build/event-tap/event-tap.js", 103);
context.startXY = [ event.pageX, event.pageY ];
        }

        //Possibly outdated issue: something is off with the move that it attaches it but never triggers the handler
        _yuitest_coverline("build/event-tap/event-tap.js", 107);
subscription[HANDLES.MOVE] = node.once(EVT_MOVE, this.touchMove, this, node, subscription, notifier, delegate, context);
        _yuitest_coverline("build/event-tap/event-tap.js", 108);
subscription[HANDLES.END] = node.once(EVT_END, this.touchEnd, this, node, subscription, notifier, delegate, context);
        _yuitest_coverline("build/event-tap/event-tap.js", 109);
subscription[HANDLES.CANCEL] = node.once(EVT_CANCEL, this.touchMove, this, node, subscription, notifier, delegate, context);
    },

    touchMove: function (event, node, subscription, notifier, delegate, context) {
        _yuitest_coverfunc("build/event-tap/event-tap.js", "touchMove", 112);
_yuitest_coverline("build/event-tap/event-tap.js", 113);
detachHelper(subscription, [ HANDLES.MOVE, HANDLES.END, HANDLES.CANCEL ], true, context);
        _yuitest_coverline("build/event-tap/event-tap.js", 114);
context.cancelled = true;

    },

    touchEnd: function (event, node, subscription, notifier, delegate, context) {
        _yuitest_coverfunc("build/event-tap/event-tap.js", "touchEnd", 118);
_yuitest_coverline("build/event-tap/event-tap.js", 119);
var startXY = context.startXY,
            endXY,
            clientXY;

        //There is a double check in here to support event simulation tests, in which
        //event.touches can be undefined when simulating 'touchstart' on touch devices.
        _yuitest_coverline("build/event-tap/event-tap.js", 125);
if (SUPPORTS_TOUCHES && event.changedTouches) {
          _yuitest_coverline("build/event-tap/event-tap.js", 126);
endXY = [ event.changedTouches[0].pageX, event.changedTouches[0].pageY ];
          _yuitest_coverline("build/event-tap/event-tap.js", 127);
clientXY = [event.changedTouches[0].clientX, event.changedTouches[0].clientY];
        }
        else {
          _yuitest_coverline("build/event-tap/event-tap.js", 130);
endXY = [ event.pageX, event.pageY ];
          _yuitest_coverline("build/event-tap/event-tap.js", 131);
clientXY = [event.clientX, event.clientY];
        }

        _yuitest_coverline("build/event-tap/event-tap.js", 134);
detachHelper(subscription, [ HANDLES.MOVE, HANDLES.END, HANDLES.CANCEL ], true, context);

        // make sure mouse didn't move
        _yuitest_coverline("build/event-tap/event-tap.js", 137);
if (Math.abs(endXY[0] - startXY[0]) === 0 && Math.abs(endXY[1] - startXY[1]) === 0) {

            _yuitest_coverline("build/event-tap/event-tap.js", 139);
event.type = EVT_TAP;
            _yuitest_coverline("build/event-tap/event-tap.js", 140);
event.pageX = endXY[0];
            _yuitest_coverline("build/event-tap/event-tap.js", 141);
event.pageY = endXY[1];
            _yuitest_coverline("build/event-tap/event-tap.js", 142);
event.clientX = clientXY[0];
            _yuitest_coverline("build/event-tap/event-tap.js", 143);
event.clientY = clientXY[1];
            _yuitest_coverline("build/event-tap/event-tap.js", 144);
event.currentTarget = context.node;

            _yuitest_coverline("build/event-tap/event-tap.js", 146);
notifier.fire(event);
        }
    }
});


}, '@VERSION@', {"requires": ["node-base", "event-base", "event-touch", "event-synthetic"]});
