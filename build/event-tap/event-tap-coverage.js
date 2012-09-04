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
_yuitest_coverage["build/event-tap/event-tap.js"].code=["YUI.add('event-tap', function (Y, NAME) {","","/**"," * The tap module provides a gesture events, \"tap\", which normalizes user interactions"," * across touch and mouse or pointer based input devices.  This can be used by application developers"," * to build input device agnostic components which behave the same in response to either touch or mouse based"," * interaction."," *"," * 'tap' is like a touchscreen 'click', only it requires much less finger-down time since it listens to touch events,"," * but reverts to mouse events if touch is not supported. "," * @module event"," * @submodule event-tap"," * @author matuzak and tilo mitra"," * @since 3.7.0 "," * ","*/","var SUPPORTS_TOUCHES = (\"createTouch\" in document),","     EVENTS = {","         START: SUPPORTS_TOUCHES ? 'touchstart' : 'mousedown',","         MOVE: SUPPORTS_TOUCHES ? 'touchmove' : 'mousemove',","         END: SUPPORTS_TOUCHES ? 'touchend' : 'mouseup',","       CANCEL: SUPPORTS_TOUCHES ? 'touchcancel' : 'mousecancel',","        TAP: 'tap'","    },","    HANDLES = {","        ON: {","            START: 'Y_TAP_ON_START_HANDLE',","            MOVE: 'Y_TAP_ON_MOVE_HANDLE',","            END: 'Y_TAP_ON_END_HANDLE',","            CANCEL: 'Y_TAP_ON_CANCEL_HANDLE'","        },","        DELEGATE: {","            START: 'Y_TAP_DELEGATE_START_HANDLE',","            MOVE: 'Y_TAP_DELEGATE_MOVE_HANDLE',","            END: 'Y_TAP_DELEGATE_END_HANDLE',","            CANCEL: 'Y_TAP_DELEGATE_CANCEL_HANDLE'","        }","    };","","function detachHelper(subscription, handles, subset, context) {","","    handles = subset ? handles : [ handles.START, handles.MOVE, handles.END, handles.CANCEL ];","","    Y.each(handles, function (name) {","        var handle = subscription[name];","        if (handle) {","            handle.detach();","            subscription[name] = null;","        }","    });","","}","","","/**"," * Sets up a \"tap\" event, that is fired on touch devices in response to a tap event (finger down, finder up)."," * This event can be used instead of listening for click events which have a 500ms delay on most touch devices."," * This event can also be listened for using node.delegate()."," *"," * @event tap"," * @param type {string} \"tap\""," * @param fn {function} The method the event invokes. It receives the event facade of the underlying DOM event."," *"," * @return {EventHandle} the detach handle","*/","Y.Event.define(EVENTS.TAP, {","","    on: function (node, subscription, notifier) {","        subscription[HANDLES.ON.START] = node.on(EVENTS.START, this.touchStart, this, node, subscription, notifier);","    },","","    detach: function (node, subscription, notifier) {","        detachHelper(subscription, HANDLES.ON);","    },","","    delegate: function (node, subscription, notifier, filter) {","        subscription[HANDLES.DELEGATE.START] = node.delegate(EVENTS.START, function (e) {","            this.touchStart(e, node, subscription, notifier, true);","        }, filter, this);","    },","","    detachDelegate: function (node, subscription, notifier) {","        detachHelper(subscription, HANDLES.DELEGATE);","    },","","    touchStart: function (event, node, subscription, notifier, delegate) {","        var curr_handles = delegate ? HANDLES.DELEGATE : HANDLES.ON,","            context = {","                cancelled: false","            };","","        // no right clicks","        if (event.button && event.button === 3) {","            return;","        }","        context.node = delegate ? event.currentTarget : node;","","        //There is a double check in here to support event simulation tests, in which","        //event.touches can be undefined when simulating 'touchstart' on touch devices.","        if (SUPPORTS_TOUCHES && event.touches) {","          context.startXY = [ event.touches[0].pageX, event.touches[0].pageY ];","        }","        else {","          context.startXY = [ event.pageX, event.pageY ];","        }","        // for now just support a 1 finger count (later enhance via config)","        if (event.touches && event.touches.length !== 1) {","            return;","        }","","","","        // something is off with the move that it attaches it but never triggers the handler","        subscription[curr_handles.MOVE] = node.once(EVENTS.MOVE, this.touchMove, this, node, subscription, notifier, delegate, context);","        subscription[curr_handles.END] = node.once(EVENTS.END, this.touchEnd, this, node, subscription, notifier, delegate, context);","        subscription[curr_handles.CANCEL] = node.once(EVENTS.CANCEL, this.touchMove, this, node, subscription, notifier, delegate, context);","    },","","    touchMove: function (event, node, subscription, notifier, delegate, context) {","        var handles = delegate ? HANDLES.DELEGATE : HANDLES.ON;","","        detachHelper(subscription, [ handles.MOVE, handles.END, handles.CANCEL ], true, context);","        context.cancelled = true;","","    },","","    touchEnd: function (event, node, subscription, notifier, delegate, context) {","        var startXY = context.startXY,","            endXY,","            clientXY,","            handles = delegate ? HANDLES.DELEGATE : HANDLES.ON;","","        //There is a double check in here to support event simulation tests, in which","        //event.touches can be undefined when simulating 'touchstart' on touch devices.","        if (SUPPORTS_TOUCHES && event.changedTouches) {","          endXY = [ event.changedTouches[0].pageX, event.changedTouches[0].pageY ];","          clientXY = [event.changedTouches[0].clientX, event.changedTouches[0].clientY];","        }","        else {","          endXY = [ event.pageX, event.pageY ];","          clientXY = [event.clientX, event.clientY];","        }","","        detachHelper(subscription, [ handles.MOVE, handles.END, handles.CANCEL ], true, context);","","        // make sure mouse didn't move","        if (Math.abs(endXY[0] - startXY[0]) === 0 && Math.abs(endXY[1] - startXY[1]) === 0) {","","            event.type = EVENTS.TAP;","            event.pageX = endXY[0];","            event.pageY = endXY[1];","            event.clientX = clientXY[0];","            event.clientY = clientXY[1];","            event.currentTarget = context.node;","","            notifier.fire(event);","        }","    }","});","","","}, '@VERSION@', {\"requires\": [\"node-base\", \"event-base\", \"event-touch\"]});"];
_yuitest_coverage["build/event-tap/event-tap.js"].lines = {"1":0,"17":0,"40":0,"42":0,"44":0,"45":0,"46":0,"47":0,"48":0,"66":0,"69":0,"73":0,"77":0,"78":0,"83":0,"87":0,"93":0,"94":0,"96":0,"100":0,"101":0,"104":0,"107":0,"108":0,"114":0,"115":0,"116":0,"120":0,"122":0,"123":0,"128":0,"135":0,"136":0,"137":0,"140":0,"141":0,"144":0,"147":0,"149":0,"150":0,"151":0,"152":0,"153":0,"154":0,"156":0};
_yuitest_coverage["build/event-tap/event-tap.js"].functions = {"(anonymous 2):44":0,"detachHelper:40":0,"on:68":0,"detach:72":0,"(anonymous 3):77":0,"delegate:76":0,"detachDelegate:82":0,"touchStart:86":0,"touchMove:119":0,"touchEnd:127":0,"(anonymous 1):1":0};
_yuitest_coverage["build/event-tap/event-tap.js"].coveredLines = 45;
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
var SUPPORTS_TOUCHES = ("createTouch" in document),
     EVENTS = {
         START: SUPPORTS_TOUCHES ? 'touchstart' : 'mousedown',
         MOVE: SUPPORTS_TOUCHES ? 'touchmove' : 'mousemove',
         END: SUPPORTS_TOUCHES ? 'touchend' : 'mouseup',
       CANCEL: SUPPORTS_TOUCHES ? 'touchcancel' : 'mousecancel',
        TAP: 'tap'
    },
    HANDLES = {
        ON: {
            START: 'Y_TAP_ON_START_HANDLE',
            MOVE: 'Y_TAP_ON_MOVE_HANDLE',
            END: 'Y_TAP_ON_END_HANDLE',
            CANCEL: 'Y_TAP_ON_CANCEL_HANDLE'
        },
        DELEGATE: {
            START: 'Y_TAP_DELEGATE_START_HANDLE',
            MOVE: 'Y_TAP_DELEGATE_MOVE_HANDLE',
            END: 'Y_TAP_DELEGATE_END_HANDLE',
            CANCEL: 'Y_TAP_DELEGATE_CANCEL_HANDLE'
        }
    };

_yuitest_coverline("build/event-tap/event-tap.js", 40);
function detachHelper(subscription, handles, subset, context) {

    _yuitest_coverfunc("build/event-tap/event-tap.js", "detachHelper", 40);
_yuitest_coverline("build/event-tap/event-tap.js", 42);
handles = subset ? handles : [ handles.START, handles.MOVE, handles.END, handles.CANCEL ];

    _yuitest_coverline("build/event-tap/event-tap.js", 44);
Y.each(handles, function (name) {
        _yuitest_coverfunc("build/event-tap/event-tap.js", "(anonymous 2)", 44);
_yuitest_coverline("build/event-tap/event-tap.js", 45);
var handle = subscription[name];
        _yuitest_coverline("build/event-tap/event-tap.js", 46);
if (handle) {
            _yuitest_coverline("build/event-tap/event-tap.js", 47);
handle.detach();
            _yuitest_coverline("build/event-tap/event-tap.js", 48);
subscription[name] = null;
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
_yuitest_coverline("build/event-tap/event-tap.js", 66);
Y.Event.define(EVENTS.TAP, {

    on: function (node, subscription, notifier) {
        _yuitest_coverfunc("build/event-tap/event-tap.js", "on", 68);
_yuitest_coverline("build/event-tap/event-tap.js", 69);
subscription[HANDLES.ON.START] = node.on(EVENTS.START, this.touchStart, this, node, subscription, notifier);
    },

    detach: function (node, subscription, notifier) {
        _yuitest_coverfunc("build/event-tap/event-tap.js", "detach", 72);
_yuitest_coverline("build/event-tap/event-tap.js", 73);
detachHelper(subscription, HANDLES.ON);
    },

    delegate: function (node, subscription, notifier, filter) {
        _yuitest_coverfunc("build/event-tap/event-tap.js", "delegate", 76);
_yuitest_coverline("build/event-tap/event-tap.js", 77);
subscription[HANDLES.DELEGATE.START] = node.delegate(EVENTS.START, function (e) {
            _yuitest_coverfunc("build/event-tap/event-tap.js", "(anonymous 3)", 77);
_yuitest_coverline("build/event-tap/event-tap.js", 78);
this.touchStart(e, node, subscription, notifier, true);
        }, filter, this);
    },

    detachDelegate: function (node, subscription, notifier) {
        _yuitest_coverfunc("build/event-tap/event-tap.js", "detachDelegate", 82);
_yuitest_coverline("build/event-tap/event-tap.js", 83);
detachHelper(subscription, HANDLES.DELEGATE);
    },

    touchStart: function (event, node, subscription, notifier, delegate) {
        _yuitest_coverfunc("build/event-tap/event-tap.js", "touchStart", 86);
_yuitest_coverline("build/event-tap/event-tap.js", 87);
var curr_handles = delegate ? HANDLES.DELEGATE : HANDLES.ON,
            context = {
                cancelled: false
            };

        // no right clicks
        _yuitest_coverline("build/event-tap/event-tap.js", 93);
if (event.button && event.button === 3) {
            _yuitest_coverline("build/event-tap/event-tap.js", 94);
return;
        }
        _yuitest_coverline("build/event-tap/event-tap.js", 96);
context.node = delegate ? event.currentTarget : node;

        //There is a double check in here to support event simulation tests, in which
        //event.touches can be undefined when simulating 'touchstart' on touch devices.
        _yuitest_coverline("build/event-tap/event-tap.js", 100);
if (SUPPORTS_TOUCHES && event.touches) {
          _yuitest_coverline("build/event-tap/event-tap.js", 101);
context.startXY = [ event.touches[0].pageX, event.touches[0].pageY ];
        }
        else {
          _yuitest_coverline("build/event-tap/event-tap.js", 104);
context.startXY = [ event.pageX, event.pageY ];
        }
        // for now just support a 1 finger count (later enhance via config)
        _yuitest_coverline("build/event-tap/event-tap.js", 107);
if (event.touches && event.touches.length !== 1) {
            _yuitest_coverline("build/event-tap/event-tap.js", 108);
return;
        }



        // something is off with the move that it attaches it but never triggers the handler
        _yuitest_coverline("build/event-tap/event-tap.js", 114);
subscription[curr_handles.MOVE] = node.once(EVENTS.MOVE, this.touchMove, this, node, subscription, notifier, delegate, context);
        _yuitest_coverline("build/event-tap/event-tap.js", 115);
subscription[curr_handles.END] = node.once(EVENTS.END, this.touchEnd, this, node, subscription, notifier, delegate, context);
        _yuitest_coverline("build/event-tap/event-tap.js", 116);
subscription[curr_handles.CANCEL] = node.once(EVENTS.CANCEL, this.touchMove, this, node, subscription, notifier, delegate, context);
    },

    touchMove: function (event, node, subscription, notifier, delegate, context) {
        _yuitest_coverfunc("build/event-tap/event-tap.js", "touchMove", 119);
_yuitest_coverline("build/event-tap/event-tap.js", 120);
var handles = delegate ? HANDLES.DELEGATE : HANDLES.ON;

        _yuitest_coverline("build/event-tap/event-tap.js", 122);
detachHelper(subscription, [ handles.MOVE, handles.END, handles.CANCEL ], true, context);
        _yuitest_coverline("build/event-tap/event-tap.js", 123);
context.cancelled = true;

    },

    touchEnd: function (event, node, subscription, notifier, delegate, context) {
        _yuitest_coverfunc("build/event-tap/event-tap.js", "touchEnd", 127);
_yuitest_coverline("build/event-tap/event-tap.js", 128);
var startXY = context.startXY,
            endXY,
            clientXY,
            handles = delegate ? HANDLES.DELEGATE : HANDLES.ON;

        //There is a double check in here to support event simulation tests, in which
        //event.touches can be undefined when simulating 'touchstart' on touch devices.
        _yuitest_coverline("build/event-tap/event-tap.js", 135);
if (SUPPORTS_TOUCHES && event.changedTouches) {
          _yuitest_coverline("build/event-tap/event-tap.js", 136);
endXY = [ event.changedTouches[0].pageX, event.changedTouches[0].pageY ];
          _yuitest_coverline("build/event-tap/event-tap.js", 137);
clientXY = [event.changedTouches[0].clientX, event.changedTouches[0].clientY];
        }
        else {
          _yuitest_coverline("build/event-tap/event-tap.js", 140);
endXY = [ event.pageX, event.pageY ];
          _yuitest_coverline("build/event-tap/event-tap.js", 141);
clientXY = [event.clientX, event.clientY];
        }

        _yuitest_coverline("build/event-tap/event-tap.js", 144);
detachHelper(subscription, [ handles.MOVE, handles.END, handles.CANCEL ], true, context);

        // make sure mouse didn't move
        _yuitest_coverline("build/event-tap/event-tap.js", 147);
if (Math.abs(endXY[0] - startXY[0]) === 0 && Math.abs(endXY[1] - startXY[1]) === 0) {

            _yuitest_coverline("build/event-tap/event-tap.js", 149);
event.type = EVENTS.TAP;
            _yuitest_coverline("build/event-tap/event-tap.js", 150);
event.pageX = endXY[0];
            _yuitest_coverline("build/event-tap/event-tap.js", 151);
event.pageY = endXY[1];
            _yuitest_coverline("build/event-tap/event-tap.js", 152);
event.clientX = clientXY[0];
            _yuitest_coverline("build/event-tap/event-tap.js", 153);
event.clientY = clientXY[1];
            _yuitest_coverline("build/event-tap/event-tap.js", 154);
event.currentTarget = context.node;

            _yuitest_coverline("build/event-tap/event-tap.js", 156);
notifier.fire(event);
        }
    }
});


}, '@VERSION@', {"requires": ["node-base", "event-base", "event-touch"]});
