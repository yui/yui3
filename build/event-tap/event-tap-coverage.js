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
_yuitest_coverage["build/event-tap/event-tap.js"].code=["YUI.add('event-tap', function (Y, NAME) {","","/**","The tap module provides a gesture events, \"tap\", which normalizes user interactions","across touch and mouse or pointer based input devices.  This can be used by application developers","to build input device agnostic components which behave the same in response to either touch or mouse based","interaction.","","'tap' is like a touchscreen 'click', only it requires much less finger-down time since it listens to touch events,","but reverts to mouse events if touch is not supported. ","","@example","","    YUI().use('event-tap', function (Y) {","        Y.one('#my-button').on('tap', function (e) {","        });","    });","","@module event","@submodule event-tap","@author Andres Garza, matuzak and tilo mitra","@since 3.7.0 ","","*/","var doc = Y.config.doc,","    GESTURE_MAP = Y.Event._GESTURE_MAP,","    SUPPORTS_TOUCHES = !!(doc && doc.createTouch),","    EVT_START = GESTURE_MAP.start,","    EVT_MOVE = GESTURE_MAP.move,","    EVT_END = GESTURE_MAP.end,","    EVT_CANCEL = GESTURE_MAP.cancel,","    EVT_TAP = 'tap',","","    HANDLES = {","        START: 'Y_TAP_ON_START_HANDLE',","        MOVE: 'Y_TAP_ON_MOVE_HANDLE',","        END: 'Y_TAP_ON_END_HANDLE',","        CANCEL: 'Y_TAP_ON_CANCEL_HANDLE'","    };","","function detachHelper(subscription, handles, subset, context) {","","    handles = subset ? handles : [ handles.START, handles.MOVE, handles.END, handles.CANCEL ];","","    Y.Array.each(handles, function (item, index, array) {","        var handle = subscription[item];","        if (handle) {","            handle.detach();","            subscription[item] = null;","        }","    });","","}","","","/**","Sets up a \"tap\" event, that is fired on touch devices in response to a tap event (finger down, finder up).","This event can be used instead of listening for click events which have a 500ms delay on most touch devices.","This event can also be listened for using node.delegate().","","@event tap","@param type {string} \"tap\"","@param fn {function} The method the event invokes. It receives the event facade of the underlying DOM event.","@for Event","@return {EventHandle} the detach handle","*/","Y.Event.define(EVT_TAP, {","","    /**","    This function should set up the node that will eventually fire the event.","","    Usage: ","","        node.on('tap', function (e) {","        });","","    @method on","    @param {Y.Node} node","    @param {Array} subscription","    @param {Boolean} notifier","    @public","    @static","    **/","    on: function (node, subscription, notifier) {","        subscription[HANDLES.START] = node.on(EVT_START, this.touchStart, this, node, subscription, notifier);","","        /*","            Patch synthetic event's fire method to allow for e.preventDefault() ","            or e.stopPropagation() on a subsequent click event","            ","            Check https://gist.github.com/4272500 for some more info","            Check http://www.youtube.com/watch?v=v7Z6FlO1opU for the discussion.","        */","        notifier.handle.evt.fire = function (e) {","          var subs = this._subscribers.concat(this._afters),","              args = Y.Array(arguments, 0, true),","              i, len, halt;","              ","          for (i = 0, len = subs.length; i < len; ++i) {","            halt = subs[i].notify(args, this);","            ","            // stopImmediatePropagation","            if (halt === false || e.stopped > 1) {","              break;","            }","          }","          ","          if (e.prevented || e.stopped) {","            e.target.once('click', function (clickEvt) {","                e.prevented && clickEvt.preventDefault();","                e.stopped && clickEvt[e.stopped === 2 ? 'stopImmediatePropagation' : 'stopPropagation']();","            })","          }","          ","          return !!this.stopped;","        };","    },","","    /**","    Detaches all event subscriptions set up by the event-tap module","","    @method detach","    @param {Y.Node} node","    @param {Array} subscription","    @param {Boolean} notifier","    @public","    @static","    **/","    detach: function (node, subscription, notifier) {","        detachHelper(subscription, HANDLES);","    },","","    /**","    Event delegation for the 'tap' event. The delegated event will use a ","    supplied selector or filtering function to test if the event references at least one ","    node that should trigger the subscription callback.","","    Usage: ","","        node.delegate('tap', function (e) {","        }, 'li a');","","    @method delegate","    @param {Y.Node} node","    @param {Array} subscription","    @param {Boolean} notifier","    @param {String | Function} filter","    @public","    @static","    **/","    delegate: function (node, subscription, notifier, filter) {","        subscription[HANDLES.START] = node.delegate(EVT_START, function (e) {","            this.touchStart(e, node, subscription, notifier, true);","        }, filter, this);","    },","","    /**","    Detaches the delegated event subscriptions set up by the event-tap module.","    Only used if you use node.delegate(...) instead of node.on(...);","","    @method detachDelegate","    @param {Y.Node} node","    @param {Array} subscription","    @param {Boolean} notifier","    @public","    @static","    **/","    detachDelegate: function (node, subscription, notifier) {","        detachHelper(subscription, HANDLES);","    },","","","    /**","    Called when the monitor(s) are tapped on, either through touchstart or mousedown.","","    @method touchStart","    @param {DOMEventFacade} event","    @param {Y.Node} node","    @param {Array} subscription","    @param {Boolean} notifier","    @param {Boolean} delegate","    @protected","    @static","    **/","    touchStart: function (event, node, subscription, notifier, delegate) {","","        var context = {","                canceled: false","            };","        //move ways to quit early to the top.","","        // no right clicks","        if (event.button && event.button === 3) {","            return;","        }","","        // for now just support a 1 finger count (later enhance via config)","        if (event.touches && event.touches.length !== 1) {","            return;","        }","","        context.node = delegate ? event.currentTarget : node;","","        //There is a double check in here to support event simulation tests, in which","        //event.touches can be undefined when simulating 'touchstart' on touch devices.","        if (SUPPORTS_TOUCHES && event.touches) {","          context.startXY = [ event.touches[0].pageX, event.touches[0].pageY ];","        }","        else {","          context.startXY = [ event.pageX, event.pageY ];","        }","","        //Possibly outdated issue: something is off with the move that it attaches it but never triggers the handler","        subscription[HANDLES.MOVE] = node.once(EVT_MOVE, this.touchMove, this, node, subscription, notifier, delegate, context);","        subscription[HANDLES.END] = node.once(EVT_END, this.touchEnd, this, node, subscription, notifier, delegate, context);","        subscription[HANDLES.CANCEL] = node.once(EVT_CANCEL, this.touchMove, this, node, subscription, notifier, delegate, context);","    },","","    /**","    Called when the monitor(s) fires a touchmove or touchcancel event (or the mouse equivalent).","    This method detaches event handlers so that 'tap' is not fired.","","    @method touchMove","    @param {DOMEventFacade} event","    @param {Y.Node} node","    @param {Array} subscription","    @param {Boolean} notifier","    @param {Boolean} delegate","    @param {Object} context","    @protected","    @static","    **/","    touchMove: function (event, node, subscription, notifier, delegate, context) {","        detachHelper(subscription, [ HANDLES.MOVE, HANDLES.END, HANDLES.CANCEL ], true, context);","        context.cancelled = true;","","    },","","    /**","    Called when the monitor(s) fires a touchend event (or the mouse equivalent).","    This method fires the 'tap' event if certain requirements are met.","","    @method touchEnd","    @param {DOMEventFacade} event","    @param {Y.Node} node","    @param {Array} subscription","    @param {Boolean} notifier","    @param {Boolean} delegate","    @param {Object} context","    @protected","    @static","    **/","    touchEnd: function (event, node, subscription, notifier, delegate, context) {","        var startXY = context.startXY,","            endXY,","            clientXY;","","        //There is a double check in here to support event simulation tests, in which","        //event.touches can be undefined when simulating 'touchstart' on touch devices.","        if (SUPPORTS_TOUCHES && event.changedTouches) {","          endXY = [ event.changedTouches[0].pageX, event.changedTouches[0].pageY ];","          clientXY = [event.changedTouches[0].clientX, event.changedTouches[0].clientY];","        }","        else {","          endXY = [ event.pageX, event.pageY ];","          clientXY = [event.clientX, event.clientY];","        }","","        detachHelper(subscription, [ HANDLES.MOVE, HANDLES.END, HANDLES.CANCEL ], true, context);","","        // make sure mouse didn't move","        if (Math.abs(endXY[0] - startXY[0]) === 0 && Math.abs(endXY[1] - startXY[1]) === 0) {","","            event.type = EVT_TAP;","            event.pageX = endXY[0];","            event.pageY = endXY[1];","            event.clientX = clientXY[0];","            event.clientY = clientXY[1];","            event.currentTarget = context.node;","","            notifier.fire(event);","        }","    }","});","","","}, '@VERSION@', {\"requires\": [\"node-base\", \"event-base\", \"event-touch\", \"event-synthetic\"]});"];
_yuitest_coverage["build/event-tap/event-tap.js"].lines = {"1":0,"25":0,"41":0,"43":0,"45":0,"46":0,"47":0,"48":0,"49":0,"67":0,"85":0,"94":0,"95":0,"99":0,"100":0,"103":0,"104":0,"108":0,"109":0,"110":0,"111":0,"115":0,"130":0,"152":0,"153":0,"169":0,"187":0,"193":0,"194":0,"198":0,"199":0,"202":0,"206":0,"207":0,"210":0,"214":0,"215":0,"216":0,"234":0,"235":0,"254":0,"260":0,"261":0,"262":0,"265":0,"266":0,"269":0,"272":0,"274":0,"275":0,"276":0,"277":0,"278":0,"279":0,"281":0};
_yuitest_coverage["build/event-tap/event-tap.js"].functions = {"(anonymous 2):45":0,"detachHelper:41":0,"(anonymous 3):109":0,"fire:94":0,"on:84":0,"detach:129":0,"(anonymous 4):152":0,"delegate:151":0,"detachDelegate:168":0,"touchStart:185":0,"touchMove:233":0,"touchEnd:253":0,"(anonymous 1):1":0};
_yuitest_coverage["build/event-tap/event-tap.js"].coveredLines = 55;
_yuitest_coverage["build/event-tap/event-tap.js"].coveredFunctions = 13;
_yuitest_coverline("build/event-tap/event-tap.js", 1);
YUI.add('event-tap', function (Y, NAME) {

/**
The tap module provides a gesture events, "tap", which normalizes user interactions
across touch and mouse or pointer based input devices.  This can be used by application developers
to build input device agnostic components which behave the same in response to either touch or mouse based
interaction.

'tap' is like a touchscreen 'click', only it requires much less finger-down time since it listens to touch events,
but reverts to mouse events if touch is not supported. 

@example

    YUI().use('event-tap', function (Y) {
        Y.one('#my-button').on('tap', function (e) {
        });
    });

@module event
@submodule event-tap
@author Andres Garza, matuzak and tilo mitra
@since 3.7.0 

*/
_yuitest_coverfunc("build/event-tap/event-tap.js", "(anonymous 1)", 1);
_yuitest_coverline("build/event-tap/event-tap.js", 25);
var doc = Y.config.doc,
    GESTURE_MAP = Y.Event._GESTURE_MAP,
    SUPPORTS_TOUCHES = !!(doc && doc.createTouch),
    EVT_START = GESTURE_MAP.start,
    EVT_MOVE = GESTURE_MAP.move,
    EVT_END = GESTURE_MAP.end,
    EVT_CANCEL = GESTURE_MAP.cancel,
    EVT_TAP = 'tap',

    HANDLES = {
        START: 'Y_TAP_ON_START_HANDLE',
        MOVE: 'Y_TAP_ON_MOVE_HANDLE',
        END: 'Y_TAP_ON_END_HANDLE',
        CANCEL: 'Y_TAP_ON_CANCEL_HANDLE'
    };

_yuitest_coverline("build/event-tap/event-tap.js", 41);
function detachHelper(subscription, handles, subset, context) {

    _yuitest_coverfunc("build/event-tap/event-tap.js", "detachHelper", 41);
_yuitest_coverline("build/event-tap/event-tap.js", 43);
handles = subset ? handles : [ handles.START, handles.MOVE, handles.END, handles.CANCEL ];

    _yuitest_coverline("build/event-tap/event-tap.js", 45);
Y.Array.each(handles, function (item, index, array) {
        _yuitest_coverfunc("build/event-tap/event-tap.js", "(anonymous 2)", 45);
_yuitest_coverline("build/event-tap/event-tap.js", 46);
var handle = subscription[item];
        _yuitest_coverline("build/event-tap/event-tap.js", 47);
if (handle) {
            _yuitest_coverline("build/event-tap/event-tap.js", 48);
handle.detach();
            _yuitest_coverline("build/event-tap/event-tap.js", 49);
subscription[item] = null;
        }
    });

}


/**
Sets up a "tap" event, that is fired on touch devices in response to a tap event (finger down, finder up).
This event can be used instead of listening for click events which have a 500ms delay on most touch devices.
This event can also be listened for using node.delegate().

@event tap
@param type {string} "tap"
@param fn {function} The method the event invokes. It receives the event facade of the underlying DOM event.
@for Event
@return {EventHandle} the detach handle
*/
_yuitest_coverline("build/event-tap/event-tap.js", 67);
Y.Event.define(EVT_TAP, {

    /**
    This function should set up the node that will eventually fire the event.

    Usage: 

        node.on('tap', function (e) {
        });

    @method on
    @param {Y.Node} node
    @param {Array} subscription
    @param {Boolean} notifier
    @public
    @static
    **/
    on: function (node, subscription, notifier) {
        _yuitest_coverfunc("build/event-tap/event-tap.js", "on", 84);
_yuitest_coverline("build/event-tap/event-tap.js", 85);
subscription[HANDLES.START] = node.on(EVT_START, this.touchStart, this, node, subscription, notifier);

        /*
            Patch synthetic event's fire method to allow for e.preventDefault() 
            or e.stopPropagation() on a subsequent click event
            
            Check https://gist.github.com/4272500 for some more info
            Check http://www.youtube.com/watch?v=v7Z6FlO1opU for the discussion.
        */
        _yuitest_coverline("build/event-tap/event-tap.js", 94);
notifier.handle.evt.fire = function (e) {
          _yuitest_coverfunc("build/event-tap/event-tap.js", "fire", 94);
_yuitest_coverline("build/event-tap/event-tap.js", 95);
var subs = this._subscribers.concat(this._afters),
              args = Y.Array(arguments, 0, true),
              i, len, halt;
              
          _yuitest_coverline("build/event-tap/event-tap.js", 99);
for (i = 0, len = subs.length; i < len; ++i) {
            _yuitest_coverline("build/event-tap/event-tap.js", 100);
halt = subs[i].notify(args, this);
            
            // stopImmediatePropagation
            _yuitest_coverline("build/event-tap/event-tap.js", 103);
if (halt === false || e.stopped > 1) {
              _yuitest_coverline("build/event-tap/event-tap.js", 104);
break;
            }
          }
          
          _yuitest_coverline("build/event-tap/event-tap.js", 108);
if (e.prevented || e.stopped) {
            _yuitest_coverline("build/event-tap/event-tap.js", 109);
e.target.once('click', function (clickEvt) {
                _yuitest_coverfunc("build/event-tap/event-tap.js", "(anonymous 3)", 109);
_yuitest_coverline("build/event-tap/event-tap.js", 110);
e.prevented && clickEvt.preventDefault();
                _yuitest_coverline("build/event-tap/event-tap.js", 111);
e.stopped && clickEvt[e.stopped === 2 ? 'stopImmediatePropagation' : 'stopPropagation']();
            })
          }
          
          _yuitest_coverline("build/event-tap/event-tap.js", 115);
return !!this.stopped;
        };
    },

    /**
    Detaches all event subscriptions set up by the event-tap module

    @method detach
    @param {Y.Node} node
    @param {Array} subscription
    @param {Boolean} notifier
    @public
    @static
    **/
    detach: function (node, subscription, notifier) {
        _yuitest_coverfunc("build/event-tap/event-tap.js", "detach", 129);
_yuitest_coverline("build/event-tap/event-tap.js", 130);
detachHelper(subscription, HANDLES);
    },

    /**
    Event delegation for the 'tap' event. The delegated event will use a 
    supplied selector or filtering function to test if the event references at least one 
    node that should trigger the subscription callback.

    Usage: 

        node.delegate('tap', function (e) {
        }, 'li a');

    @method delegate
    @param {Y.Node} node
    @param {Array} subscription
    @param {Boolean} notifier
    @param {String | Function} filter
    @public
    @static
    **/
    delegate: function (node, subscription, notifier, filter) {
        _yuitest_coverfunc("build/event-tap/event-tap.js", "delegate", 151);
_yuitest_coverline("build/event-tap/event-tap.js", 152);
subscription[HANDLES.START] = node.delegate(EVT_START, function (e) {
            _yuitest_coverfunc("build/event-tap/event-tap.js", "(anonymous 4)", 152);
_yuitest_coverline("build/event-tap/event-tap.js", 153);
this.touchStart(e, node, subscription, notifier, true);
        }, filter, this);
    },

    /**
    Detaches the delegated event subscriptions set up by the event-tap module.
    Only used if you use node.delegate(...) instead of node.on(...);

    @method detachDelegate
    @param {Y.Node} node
    @param {Array} subscription
    @param {Boolean} notifier
    @public
    @static
    **/
    detachDelegate: function (node, subscription, notifier) {
        _yuitest_coverfunc("build/event-tap/event-tap.js", "detachDelegate", 168);
_yuitest_coverline("build/event-tap/event-tap.js", 169);
detachHelper(subscription, HANDLES);
    },


    /**
    Called when the monitor(s) are tapped on, either through touchstart or mousedown.

    @method touchStart
    @param {DOMEventFacade} event
    @param {Y.Node} node
    @param {Array} subscription
    @param {Boolean} notifier
    @param {Boolean} delegate
    @protected
    @static
    **/
    touchStart: function (event, node, subscription, notifier, delegate) {

        _yuitest_coverfunc("build/event-tap/event-tap.js", "touchStart", 185);
_yuitest_coverline("build/event-tap/event-tap.js", 187);
var context = {
                canceled: false
            };
        //move ways to quit early to the top.

        // no right clicks
        _yuitest_coverline("build/event-tap/event-tap.js", 193);
if (event.button && event.button === 3) {
            _yuitest_coverline("build/event-tap/event-tap.js", 194);
return;
        }

        // for now just support a 1 finger count (later enhance via config)
        _yuitest_coverline("build/event-tap/event-tap.js", 198);
if (event.touches && event.touches.length !== 1) {
            _yuitest_coverline("build/event-tap/event-tap.js", 199);
return;
        }

        _yuitest_coverline("build/event-tap/event-tap.js", 202);
context.node = delegate ? event.currentTarget : node;

        //There is a double check in here to support event simulation tests, in which
        //event.touches can be undefined when simulating 'touchstart' on touch devices.
        _yuitest_coverline("build/event-tap/event-tap.js", 206);
if (SUPPORTS_TOUCHES && event.touches) {
          _yuitest_coverline("build/event-tap/event-tap.js", 207);
context.startXY = [ event.touches[0].pageX, event.touches[0].pageY ];
        }
        else {
          _yuitest_coverline("build/event-tap/event-tap.js", 210);
context.startXY = [ event.pageX, event.pageY ];
        }

        //Possibly outdated issue: something is off with the move that it attaches it but never triggers the handler
        _yuitest_coverline("build/event-tap/event-tap.js", 214);
subscription[HANDLES.MOVE] = node.once(EVT_MOVE, this.touchMove, this, node, subscription, notifier, delegate, context);
        _yuitest_coverline("build/event-tap/event-tap.js", 215);
subscription[HANDLES.END] = node.once(EVT_END, this.touchEnd, this, node, subscription, notifier, delegate, context);
        _yuitest_coverline("build/event-tap/event-tap.js", 216);
subscription[HANDLES.CANCEL] = node.once(EVT_CANCEL, this.touchMove, this, node, subscription, notifier, delegate, context);
    },

    /**
    Called when the monitor(s) fires a touchmove or touchcancel event (or the mouse equivalent).
    This method detaches event handlers so that 'tap' is not fired.

    @method touchMove
    @param {DOMEventFacade} event
    @param {Y.Node} node
    @param {Array} subscription
    @param {Boolean} notifier
    @param {Boolean} delegate
    @param {Object} context
    @protected
    @static
    **/
    touchMove: function (event, node, subscription, notifier, delegate, context) {
        _yuitest_coverfunc("build/event-tap/event-tap.js", "touchMove", 233);
_yuitest_coverline("build/event-tap/event-tap.js", 234);
detachHelper(subscription, [ HANDLES.MOVE, HANDLES.END, HANDLES.CANCEL ], true, context);
        _yuitest_coverline("build/event-tap/event-tap.js", 235);
context.cancelled = true;

    },

    /**
    Called when the monitor(s) fires a touchend event (or the mouse equivalent).
    This method fires the 'tap' event if certain requirements are met.

    @method touchEnd
    @param {DOMEventFacade} event
    @param {Y.Node} node
    @param {Array} subscription
    @param {Boolean} notifier
    @param {Boolean} delegate
    @param {Object} context
    @protected
    @static
    **/
    touchEnd: function (event, node, subscription, notifier, delegate, context) {
        _yuitest_coverfunc("build/event-tap/event-tap.js", "touchEnd", 253);
_yuitest_coverline("build/event-tap/event-tap.js", 254);
var startXY = context.startXY,
            endXY,
            clientXY;

        //There is a double check in here to support event simulation tests, in which
        //event.touches can be undefined when simulating 'touchstart' on touch devices.
        _yuitest_coverline("build/event-tap/event-tap.js", 260);
if (SUPPORTS_TOUCHES && event.changedTouches) {
          _yuitest_coverline("build/event-tap/event-tap.js", 261);
endXY = [ event.changedTouches[0].pageX, event.changedTouches[0].pageY ];
          _yuitest_coverline("build/event-tap/event-tap.js", 262);
clientXY = [event.changedTouches[0].clientX, event.changedTouches[0].clientY];
        }
        else {
          _yuitest_coverline("build/event-tap/event-tap.js", 265);
endXY = [ event.pageX, event.pageY ];
          _yuitest_coverline("build/event-tap/event-tap.js", 266);
clientXY = [event.clientX, event.clientY];
        }

        _yuitest_coverline("build/event-tap/event-tap.js", 269);
detachHelper(subscription, [ HANDLES.MOVE, HANDLES.END, HANDLES.CANCEL ], true, context);

        // make sure mouse didn't move
        _yuitest_coverline("build/event-tap/event-tap.js", 272);
if (Math.abs(endXY[0] - startXY[0]) === 0 && Math.abs(endXY[1] - startXY[1]) === 0) {

            _yuitest_coverline("build/event-tap/event-tap.js", 274);
event.type = EVT_TAP;
            _yuitest_coverline("build/event-tap/event-tap.js", 275);
event.pageX = endXY[0];
            _yuitest_coverline("build/event-tap/event-tap.js", 276);
event.pageY = endXY[1];
            _yuitest_coverline("build/event-tap/event-tap.js", 277);
event.clientX = clientXY[0];
            _yuitest_coverline("build/event-tap/event-tap.js", 278);
event.clientY = clientXY[1];
            _yuitest_coverline("build/event-tap/event-tap.js", 279);
event.currentTarget = context.node;

            _yuitest_coverline("build/event-tap/event-tap.js", 281);
notifier.fire(event);
        }
    }
});


}, '@VERSION@', {"requires": ["node-base", "event-base", "event-touch", "event-synthetic"]});
