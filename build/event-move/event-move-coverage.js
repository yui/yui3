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
_yuitest_coverage["build/event-move/event-move.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/event-move/event-move.js",
    code: []
};
_yuitest_coverage["build/event-move/event-move.js"].code=["YUI.add('event-move', function (Y, NAME) {","","/**"," * Adds lower level support for \"gesturemovestart\", \"gesturemove\" and \"gesturemoveend\" events, which can be used to create drag/drop"," * interactions which work across touch and mouse input devices. They correspond to \"touchstart\", \"touchmove\" and \"touchend\" on a touch input"," * device, and \"mousedown\", \"mousemove\", \"mouseup\" on a mouse based input device."," *"," * <p>Documentation for the gesturemove triplet of events can be found on the <a href=\"../classes/YUI.html#event_gesturemove\">YUI</a> global,"," * along with the other supported events.</p>"," *"," * @module event-gestures"," * @submodule event-move"," */",""," var GESTURE_MAP = Y.Event._GESTURE_MAP,","     EVENT = {","         start: GESTURE_MAP.start,","         end: GESTURE_MAP.end,","         move: GESTURE_MAP.move","     },","    START = \"start\",","    MOVE = \"move\",","    END = \"end\",","","    GESTURE_MOVE = \"gesture\" + MOVE,","    GESTURE_MOVE_END = GESTURE_MOVE + END,","    GESTURE_MOVE_START = GESTURE_MOVE + START,","","    _MOVE_START_HANDLE = \"_msh\",","    _MOVE_HANDLE = \"_mh\",","    _MOVE_END_HANDLE = \"_meh\",","","    _DEL_MOVE_START_HANDLE = \"_dmsh\",","    _DEL_MOVE_HANDLE = \"_dmh\",","    _DEL_MOVE_END_HANDLE = \"_dmeh\",","","    _MOVE_START = \"_ms\",","    _MOVE = \"_m\",","","    MIN_TIME = \"minTime\",","    MIN_DISTANCE = \"minDistance\",","    PREVENT_DEFAULT = \"preventDefault\",","    BUTTON = \"button\",","    OWNER_DOCUMENT = \"ownerDocument\",","","    CURRENT_TARGET = \"currentTarget\",","    TARGET = \"target\",","","    NODE_TYPE = \"nodeType\",","","    SUPPORTS_POINTER = Y.config.win && ((\"msMaxTouchPoints\" in Y.config.win.navigator) && (Y.config.win.navigator.msMaxTouchPoints)),","","    _defArgsProcessor = function(se, args, delegate) {","        var iConfig = (delegate) ? 4 : 3,","            config = (args.length > iConfig) ? Y.merge(args.splice(iConfig,1)[0]) : {};","","        if (!(PREVENT_DEFAULT in config)) {","            config[PREVENT_DEFAULT] = se.PREVENT_DEFAULT;","        }","","        return config;","    },","","    _getRoot = function(node, subscriber) {","        return subscriber._extra.root || (node.get(NODE_TYPE) === 9) ? node : node.get(OWNER_DOCUMENT);","    },","","    _normTouchFacade = function(touchFacade, touch, params) {","        touchFacade.pageX = touch.pageX;","        touchFacade.pageY = touch.pageY;","        touchFacade.screenX = touch.screenX;","        touchFacade.screenY = touch.screenY;","        touchFacade.clientX = touch.clientX;","        touchFacade.clientY = touch.clientY;","        touchFacade[TARGET] = touchFacade[TARGET] || touch[TARGET];","        touchFacade[CURRENT_TARGET] = touchFacade[CURRENT_TARGET] || touch[CURRENT_TARGET];","","        touchFacade[BUTTON] = (params && params[BUTTON]) || 1; // default to left (left as per vendors, not W3C which is 0)","    },","","    /*","    In IE10 touch mode, gestures will not work properly unless the -ms-touch-action CSS property is set to something other than 'auto'. Read http://msdn.microsoft.com/en-us/library/windows/apps/hh767313.aspx for more info. To get around this, we set -ms-touch-action: none which is the same as e.preventDefault() on touch environments. This tells the browser to fire DOM events for all touch events, and not perform any default behavior.","","    The user can over-ride this by setting a more lenient -ms-touch-action property on a node (such as pan-x, pan-y, etc.) via CSS when subscribing to the 'gesturemovestart' event.","    */","    _setTouchActions = function (node, subscriber, evtName) {","        var params = subscriber._extra,","            elem = node.getDOMNode();","","        if (SUPPORTS_POINTER) { //Checks to see if MSPointer events are supported.","            elem.style.msTouchAction = 'none';","        }","    },","","    /*","    Resets the element's -ms-touch-action property back to 'auto', which is the default. This is called on detach() and detachDelegate().","    */","    _unsetTouchActions = function (node) {","        if (SUPPORTS_POINTER) {","            var elem = node.getDOMNode();","            if (elem.style.msTouchAction !== 'auto') {","                elem.style.msTouchAction = 'auto'","            }","        }","    },","","    _prevent = function(e, preventDefault) {","        if (preventDefault) {","            // preventDefault is a boolean or a function","            if (!preventDefault.call || preventDefault(e)) {","                e.preventDefault();","            }","        }","    },","","    define = Y.Event.define;","","/**"," * Sets up a \"gesturemovestart\" event, that is fired on touch devices in response to a single finger \"touchstart\","," * and on mouse based devices in response to a \"mousedown\". The subscriber can specify the minimum time"," * and distance thresholds which should be crossed before the \"gesturemovestart\" is fired and for the mouse,"," * which button should initiate a \"gesturemovestart\". This event can also be listened for using node.delegate()."," *"," * <p>It is recommended that you use Y.bind to set up context and additional arguments for your event handler,"," * however if you want to pass the context and arguments as additional signature arguments to on/delegate,"," * you need to provide a null value for the configuration object, e.g: <code>node.on(\"gesturemovestart\", fn, null, context, arg1, arg2, arg3)</code></p>"," *"," * @event gesturemovestart"," * @for YUI"," * @param type {string} \"gesturemovestart\""," * @param fn {function} The method the event invokes. It receives the event facade of the underlying DOM event (mousedown or touchstart.touches[0]) which contains position co-ordinates."," * @param cfg {Object} Optional. An object which specifies:"," *"," * <dl>"," * <dt>minDistance (defaults to 0)</dt>"," * <dd>The minimum distance threshold which should be crossed before the gesturemovestart is fired</dd>"," * <dt>minTime (defaults to 0)</dt>"," * <dd>The minimum time threshold for which the finger/mouse should be help down before the gesturemovestart is fired</dd>"," * <dt>button (no default)</dt>"," * <dd>In the case of a mouse input device, if the event should only be fired for a specific mouse button.</dd>"," * <dt>preventDefault (defaults to false)</dt>"," * <dd>Can be set to true/false to prevent default behavior as soon as the touchstart or mousedown is received (that is before minTime or minDistance thresholds are crossed, and so before the gesturemovestart listener is notified) so that things like text selection and context popups (on touch devices) can be"," * prevented. This property can also be set to a function, which returns true or false, based on the event facade passed to it (for example, DragDrop can determine if the target is a valid handle or not before preventing default).</dd>"," * </dl>"," *"," * @return {EventHandle} the detach handle"," */","","define(GESTURE_MOVE_START, {","","    on: function (node, subscriber, ce) {","","        //Set -ms-touch-action on IE10 and set preventDefault to true","        _setTouchActions(node, subscriber, EVENT[START]);","","        subscriber[_MOVE_START_HANDLE] = node.on(EVENT[START],","            this._onStart,","            this,","            node,","            subscriber,","            ce);","    },","","    delegate : function(node, subscriber, ce, filter) {","","        var se = this;","","        subscriber[_DEL_MOVE_START_HANDLE] = node.delegate(EVENT[START],","            function(e) {","                se._onStart(e, node, subscriber, ce, true);","            },","            filter);","    },","","    detachDelegate : function(node, subscriber, ce, filter) {","        var handle = subscriber[_DEL_MOVE_START_HANDLE];","","        if (handle) {","            handle.detach();","            subscriber[_DEL_MOVE_START_HANDLE] = null;","        }","","        _unsetTouchActions(node);","    },","","    detach: function (node, subscriber, ce) {","        var startHandle = subscriber[_MOVE_START_HANDLE];","","        if (startHandle) {","            startHandle.detach();","            subscriber[_MOVE_START_HANDLE] = null;","        }","","        _unsetTouchActions(node);","    },","","    processArgs : function(args, delegate) {","        var params = _defArgsProcessor(this, args, delegate);","","        if (!(MIN_TIME in params)) {","            params[MIN_TIME] = this.MIN_TIME;","        }","","        if (!(MIN_DISTANCE in params)) {","            params[MIN_DISTANCE] = this.MIN_DISTANCE;","        }","","        return params;","    },","","    _onStart : function(e, node, subscriber, ce, delegate) {","","        if (delegate) {","            node = e[CURRENT_TARGET];","        }","","        var params = subscriber._extra,","            fireStart = true,","            minTime = params[MIN_TIME],","            minDistance = params[MIN_DISTANCE],","            button = params.button,","            preventDefault = params[PREVENT_DEFAULT],","            root = _getRoot(node, subscriber),","            startXY;","","        if (e.touches) {","            if (e.touches.length === 1) {","                _normTouchFacade(e, e.touches[0], params);","            } else {","                fireStart = false;","            }","        } else {","            fireStart = (button === undefined) || (button === e.button);","        }","","","        if (fireStart) {","","            _prevent(e, preventDefault);","","            if (minTime === 0 || minDistance === 0) {","                this._start(e, node, ce, params);","","            } else {","","                startXY = [e.pageX, e.pageY];","","                if (minTime > 0) {","","","                    params._ht = Y.later(minTime, this, this._start, [e, node, ce, params]);","","                    params._hme = root.on(EVENT[END], Y.bind(function() {","                        this._cancel(params);","                    }, this));","                }","","                if (minDistance > 0) {","","","                    params._hm = root.on(EVENT[MOVE], Y.bind(function(em) {","                        if (Math.abs(em.pageX - startXY[0]) > minDistance || Math.abs(em.pageY - startXY[1]) > minDistance) {","                            this._start(e, node, ce, params);","                        }","                    }, this));","                }","            }","        }","    },","","    _cancel : function(params) {","        if (params._ht) {","            params._ht.cancel();","            params._ht = null;","        }","        if (params._hme) {","            params._hme.detach();","            params._hme = null;","        }","        if (params._hm) {","            params._hm.detach();","            params._hm = null;","        }","    },","","    _start : function(e, node, ce, params) {","","        if (params) {","            this._cancel(params);","        }","","        e.type = GESTURE_MOVE_START;","","","        node.setData(_MOVE_START, e);","        ce.fire(e);","    },","","    MIN_TIME : 0,","    MIN_DISTANCE : 0,","    PREVENT_DEFAULT : false","});","","/**"," * Sets up a \"gesturemove\" event, that is fired on touch devices in response to a single finger \"touchmove\","," * and on mouse based devices in response to a \"mousemove\"."," *"," * <p>By default this event is only fired when the same node"," * has received a \"gesturemovestart\" event. The subscriber can set standAlone to true, in the configuration properties,"," * if they want to listen for this event without an initial \"gesturemovestart\".</p>"," *"," * <p>By default this event sets up it's internal \"touchmove\" and \"mousemove\" DOM listeners on the document element. The subscriber"," * can set the root configuration property, to specify which node to attach DOM listeners to, if different from the document.</p>"," *"," * <p>This event can also be listened for using node.delegate().</p>"," *"," * <p>It is recommended that you use Y.bind to set up context and additional arguments for your event handler,"," * however if you want to pass the context and arguments as additional signature arguments to on/delegate,"," * you need to provide a null value for the configuration object, e.g: <code>node.on(\"gesturemove\", fn, null, context, arg1, arg2, arg3)</code></p>"," *"," * @event gesturemove"," * @for YUI"," * @param type {string} \"gesturemove\""," * @param fn {function} The method the event invokes. It receives the event facade of the underlying DOM event (mousemove or touchmove.touches[0]) which contains position co-ordinates."," * @param cfg {Object} Optional. An object which specifies:"," * <dl>"," * <dt>standAlone (defaults to false)</dt>"," * <dd>true, if the subscriber should be notified even if a \"gesturemovestart\" has not occured on the same node.</dd>"," * <dt>root (defaults to document)</dt>"," * <dd>The node to which the internal DOM listeners should be attached.</dd>"," * <dt>preventDefault (defaults to false)</dt>"," * <dd>Can be set to true/false to prevent default behavior as soon as the touchmove or mousemove is received. As with gesturemovestart, can also be set to function which returns true/false based on the event facade passed to it.</dd>"," * </dl>"," *"," * @return {EventHandle} the detach handle"," */","define(GESTURE_MOVE, {","","    on : function (node, subscriber, ce) {","        var root = _getRoot(node, subscriber, EVENT[MOVE]),","","            moveHandle = root.on(EVENT[MOVE],","                this._onMove,","                this,","                node,","                subscriber,","                ce);","","        subscriber[_MOVE_HANDLE] = moveHandle;","","    },","","    delegate : function(node, subscriber, ce, filter) {","","        var se = this;","","        subscriber[_DEL_MOVE_HANDLE] = node.delegate(EVENT[MOVE],","            function(e) {","                se._onMove(e, node, subscriber, ce, true);","            },","            filter);","    },","","    detach : function (node, subscriber, ce) {","        var moveHandle = subscriber[_MOVE_HANDLE];","","        if (moveHandle) {","            moveHandle.detach();","            subscriber[_MOVE_HANDLE] = null;","        }","","        _unsetTouchActions(node);","    },","","    detachDelegate : function(node, subscriber, ce, filter) {","        var handle = subscriber[_DEL_MOVE_HANDLE];","","        if (handle) {","            handle.detach();","            subscriber[_DEL_MOVE_HANDLE] = null;","        }","","        _unsetTouchActions(node);","","    },","","    processArgs : function(args, delegate) {","        return _defArgsProcessor(this, args, delegate);","    },","","    _onMove : function(e, node, subscriber, ce, delegate) {","","        if (delegate) {","            node = e[CURRENT_TARGET];","        }","","        var fireMove = subscriber._extra.standAlone || node.getData(_MOVE_START),","            preventDefault = subscriber._extra.preventDefault;","","","        if (fireMove) {","","            if (e.touches) {","                if (e.touches.length === 1) {","                    _normTouchFacade(e, e.touches[0]);","                } else {","                    fireMove = false;","                }","            }","","            if (fireMove) {","","                _prevent(e, preventDefault);","","","                e.type = GESTURE_MOVE;","                ce.fire(e);","            }","        }","    },","","    PREVENT_DEFAULT : false","});","","/**"," * Sets up a \"gesturemoveend\" event, that is fired on touch devices in response to a single finger \"touchend\","," * and on mouse based devices in response to a \"mouseup\"."," *"," * <p>By default this event is only fired when the same node"," * has received a \"gesturemove\" or \"gesturemovestart\" event. The subscriber can set standAlone to true, in the configuration properties,"," * if they want to listen for this event without a preceding \"gesturemovestart\" or \"gesturemove\".</p>"," *"," * <p>By default this event sets up it's internal \"touchend\" and \"mouseup\" DOM listeners on the document element. The subscriber"," * can set the root configuration property, to specify which node to attach DOM listeners to, if different from the document.</p>"," *"," * <p>This event can also be listened for using node.delegate().</p>"," *"," * <p>It is recommended that you use Y.bind to set up context and additional arguments for your event handler,"," * however if you want to pass the context and arguments as additional signature arguments to on/delegate,"," * you need to provide a null value for the configuration object, e.g: <code>node.on(\"gesturemoveend\", fn, null, context, arg1, arg2, arg3)</code></p>"," *"," *"," * @event gesturemoveend"," * @for YUI"," * @param type {string} \"gesturemoveend\""," * @param fn {function} The method the event invokes. It receives the event facade of the underlying DOM event (mouseup or touchend.changedTouches[0])."," * @param cfg {Object} Optional. An object which specifies:"," * <dl>"," * <dt>standAlone (defaults to false)</dt>"," * <dd>true, if the subscriber should be notified even if a \"gesturemovestart\" or \"gesturemove\" has not occured on the same node.</dd>"," * <dt>root (defaults to document)</dt>"," * <dd>The node to which the internal DOM listeners should be attached.</dd>"," * <dt>preventDefault (defaults to false)</dt>"," * <dd>Can be set to true/false to prevent default behavior as soon as the touchend or mouseup is received. As with gesturemovestart, can also be set to function which returns true/false based on the event facade passed to it.</dd>"," * </dl>"," *"," * @return {EventHandle} the detach handle"," */","define(GESTURE_MOVE_END, {","","    on : function (node, subscriber, ce) {","","        var root = _getRoot(node, subscriber),","","            endHandle = root.on(EVENT[END],","                this._onEnd,","                this,","                node,","                subscriber,","                ce);","","        subscriber[_MOVE_END_HANDLE] = endHandle;","    },","","    delegate : function(node, subscriber, ce, filter) {","","        var se = this;","","        subscriber[_DEL_MOVE_END_HANDLE] = node.delegate(EVENT[END],","            function(e) {","                se._onEnd(e, node, subscriber, ce, true);","            },","            filter);","    },","","    detachDelegate : function(node, subscriber, ce, filter) {","        var handle = subscriber[_DEL_MOVE_END_HANDLE];","","        if (handle) {","            handle.detach();","            subscriber[_DEL_MOVE_END_HANDLE] = null;","        }","","        _unsetTouchActions(node);","","    },","","    detach : function (node, subscriber, ce) {","        var endHandle = subscriber[_MOVE_END_HANDLE];","","        if (endHandle) {","            endHandle.detach();","            subscriber[_MOVE_END_HANDLE] = null;","        }","","        _unsetTouchActions(node);","    },","","    processArgs : function(args, delegate) {","        return _defArgsProcessor(this, args, delegate);","    },","","    _onEnd : function(e, node, subscriber, ce, delegate) {","","        if (delegate) {","            node = e[CURRENT_TARGET];","        }","","        var fireMoveEnd = subscriber._extra.standAlone || node.getData(_MOVE) || node.getData(_MOVE_START),","            preventDefault = subscriber._extra.preventDefault;","","        if (fireMoveEnd) {","","            if (e.changedTouches) {","                if (e.changedTouches.length === 1) {","                    _normTouchFacade(e, e.changedTouches[0]);","                } else {","                    fireMoveEnd = false;","                }","            }","","            if (fireMoveEnd) {","","                _prevent(e, preventDefault);","","                e.type = GESTURE_MOVE_END;","                ce.fire(e);","","                node.clearData(_MOVE_START);","                node.clearData(_MOVE);","            }","        }","    },","","    PREVENT_DEFAULT : false","});","","","}, '@VERSION@', {\"requires\": [\"node-base\", \"event-touch\", \"event-synthetic\"]});"];
_yuitest_coverage["build/event-move/event-move.js"].lines = {"1":0,"15":0,"54":0,"57":0,"58":0,"61":0,"65":0,"69":0,"70":0,"71":0,"72":0,"73":0,"74":0,"75":0,"76":0,"78":0,"87":0,"90":0,"91":0,"99":0,"100":0,"101":0,"102":0,"108":0,"110":0,"111":0,"149":0,"154":0,"156":0,"166":0,"168":0,"170":0,"176":0,"178":0,"179":0,"180":0,"183":0,"187":0,"189":0,"190":0,"191":0,"194":0,"198":0,"200":0,"201":0,"204":0,"205":0,"208":0,"213":0,"214":0,"217":0,"226":0,"227":0,"228":0,"230":0,"233":0,"237":0,"239":0,"241":0,"242":0,"246":0,"248":0,"251":0,"253":0,"254":0,"258":0,"261":0,"262":0,"263":0,"272":0,"273":0,"274":0,"276":0,"277":0,"278":0,"280":0,"281":0,"282":0,"288":0,"289":0,"292":0,"295":0,"296":0,"337":0,"340":0,"349":0,"355":0,"357":0,"359":0,"365":0,"367":0,"368":0,"369":0,"372":0,"376":0,"378":0,"379":0,"380":0,"383":0,"388":0,"393":0,"394":0,"397":0,"401":0,"403":0,"404":0,"405":0,"407":0,"411":0,"413":0,"416":0,"417":0,"459":0,"463":0,"472":0,"477":0,"479":0,"481":0,"487":0,"489":0,"490":0,"491":0,"494":0,"499":0,"501":0,"502":0,"503":0,"506":0,"510":0,"515":0,"516":0,"519":0,"522":0,"524":0,"525":0,"526":0,"528":0,"532":0,"534":0,"536":0,"537":0,"539":0,"540":0};
_yuitest_coverage["build/event-move/event-move.js"].functions = {"_defArgsProcessor:53":0,"_getRoot:64":0,"_normTouchFacade:68":0,"_setTouchActions:86":0,"_unsetTouchActions:98":0,"_prevent:107":0,"on:151":0,"(anonymous 2):169":0,"delegate:164":0,"detachDelegate:175":0,"detach:186":0,"processArgs:197":0,"(anonymous 3):253":0,"(anonymous 4):261":0,"_onStart:211":0,"_cancel:271":0,"_start:286":0,"on:339":0,"(anonymous 5):358":0,"delegate:353":0,"detach:364":0,"detachDelegate:375":0,"processArgs:387":0,"_onMove:391":0,"on:461":0,"(anonymous 6):480":0,"delegate:475":0,"detachDelegate:486":0,"detach:498":0,"processArgs:509":0,"_onEnd:513":0,"(anonymous 1):1":0};
_yuitest_coverage["build/event-move/event-move.js"].coveredLines = 143;
_yuitest_coverage["build/event-move/event-move.js"].coveredFunctions = 32;
_yuitest_coverline("build/event-move/event-move.js", 1);
YUI.add('event-move', function (Y, NAME) {

/**
 * Adds lower level support for "gesturemovestart", "gesturemove" and "gesturemoveend" events, which can be used to create drag/drop
 * interactions which work across touch and mouse input devices. They correspond to "touchstart", "touchmove" and "touchend" on a touch input
 * device, and "mousedown", "mousemove", "mouseup" on a mouse based input device.
 *
 * <p>Documentation for the gesturemove triplet of events can be found on the <a href="../classes/YUI.html#event_gesturemove">YUI</a> global,
 * along with the other supported events.</p>
 *
 * @module event-gestures
 * @submodule event-move
 */

 _yuitest_coverfunc("build/event-move/event-move.js", "(anonymous 1)", 1);
_yuitest_coverline("build/event-move/event-move.js", 15);
var GESTURE_MAP = Y.Event._GESTURE_MAP,
     EVENT = {
         start: GESTURE_MAP.start,
         end: GESTURE_MAP.end,
         move: GESTURE_MAP.move
     },
    START = "start",
    MOVE = "move",
    END = "end",

    GESTURE_MOVE = "gesture" + MOVE,
    GESTURE_MOVE_END = GESTURE_MOVE + END,
    GESTURE_MOVE_START = GESTURE_MOVE + START,

    _MOVE_START_HANDLE = "_msh",
    _MOVE_HANDLE = "_mh",
    _MOVE_END_HANDLE = "_meh",

    _DEL_MOVE_START_HANDLE = "_dmsh",
    _DEL_MOVE_HANDLE = "_dmh",
    _DEL_MOVE_END_HANDLE = "_dmeh",

    _MOVE_START = "_ms",
    _MOVE = "_m",

    MIN_TIME = "minTime",
    MIN_DISTANCE = "minDistance",
    PREVENT_DEFAULT = "preventDefault",
    BUTTON = "button",
    OWNER_DOCUMENT = "ownerDocument",

    CURRENT_TARGET = "currentTarget",
    TARGET = "target",

    NODE_TYPE = "nodeType",

    SUPPORTS_POINTER = Y.config.win && (("msMaxTouchPoints" in Y.config.win.navigator) && (Y.config.win.navigator.msMaxTouchPoints)),

    _defArgsProcessor = function(se, args, delegate) {
        _yuitest_coverfunc("build/event-move/event-move.js", "_defArgsProcessor", 53);
_yuitest_coverline("build/event-move/event-move.js", 54);
var iConfig = (delegate) ? 4 : 3,
            config = (args.length > iConfig) ? Y.merge(args.splice(iConfig,1)[0]) : {};

        _yuitest_coverline("build/event-move/event-move.js", 57);
if (!(PREVENT_DEFAULT in config)) {
            _yuitest_coverline("build/event-move/event-move.js", 58);
config[PREVENT_DEFAULT] = se.PREVENT_DEFAULT;
        }

        _yuitest_coverline("build/event-move/event-move.js", 61);
return config;
    },

    _getRoot = function(node, subscriber) {
        _yuitest_coverfunc("build/event-move/event-move.js", "_getRoot", 64);
_yuitest_coverline("build/event-move/event-move.js", 65);
return subscriber._extra.root || (node.get(NODE_TYPE) === 9) ? node : node.get(OWNER_DOCUMENT);
    },

    _normTouchFacade = function(touchFacade, touch, params) {
        _yuitest_coverfunc("build/event-move/event-move.js", "_normTouchFacade", 68);
_yuitest_coverline("build/event-move/event-move.js", 69);
touchFacade.pageX = touch.pageX;
        _yuitest_coverline("build/event-move/event-move.js", 70);
touchFacade.pageY = touch.pageY;
        _yuitest_coverline("build/event-move/event-move.js", 71);
touchFacade.screenX = touch.screenX;
        _yuitest_coverline("build/event-move/event-move.js", 72);
touchFacade.screenY = touch.screenY;
        _yuitest_coverline("build/event-move/event-move.js", 73);
touchFacade.clientX = touch.clientX;
        _yuitest_coverline("build/event-move/event-move.js", 74);
touchFacade.clientY = touch.clientY;
        _yuitest_coverline("build/event-move/event-move.js", 75);
touchFacade[TARGET] = touchFacade[TARGET] || touch[TARGET];
        _yuitest_coverline("build/event-move/event-move.js", 76);
touchFacade[CURRENT_TARGET] = touchFacade[CURRENT_TARGET] || touch[CURRENT_TARGET];

        _yuitest_coverline("build/event-move/event-move.js", 78);
touchFacade[BUTTON] = (params && params[BUTTON]) || 1; // default to left (left as per vendors, not W3C which is 0)
    },

    /*
    In IE10 touch mode, gestures will not work properly unless the -ms-touch-action CSS property is set to something other than 'auto'. Read http://msdn.microsoft.com/en-us/library/windows/apps/hh767313.aspx for more info. To get around this, we set -ms-touch-action: none which is the same as e.preventDefault() on touch environments. This tells the browser to fire DOM events for all touch events, and not perform any default behavior.

    The user can over-ride this by setting a more lenient -ms-touch-action property on a node (such as pan-x, pan-y, etc.) via CSS when subscribing to the 'gesturemovestart' event.
    */
    _setTouchActions = function (node, subscriber, evtName) {
        _yuitest_coverfunc("build/event-move/event-move.js", "_setTouchActions", 86);
_yuitest_coverline("build/event-move/event-move.js", 87);
var params = subscriber._extra,
            elem = node.getDOMNode();

        _yuitest_coverline("build/event-move/event-move.js", 90);
if (SUPPORTS_POINTER) { //Checks to see if MSPointer events are supported.
            _yuitest_coverline("build/event-move/event-move.js", 91);
elem.style.msTouchAction = 'none';
        }
    },

    /*
    Resets the element's -ms-touch-action property back to 'auto', which is the default. This is called on detach() and detachDelegate().
    */
    _unsetTouchActions = function (node) {
        _yuitest_coverfunc("build/event-move/event-move.js", "_unsetTouchActions", 98);
_yuitest_coverline("build/event-move/event-move.js", 99);
if (SUPPORTS_POINTER) {
            _yuitest_coverline("build/event-move/event-move.js", 100);
var elem = node.getDOMNode();
            _yuitest_coverline("build/event-move/event-move.js", 101);
if (elem.style.msTouchAction !== 'auto') {
                _yuitest_coverline("build/event-move/event-move.js", 102);
elem.style.msTouchAction = 'auto'
            }
        }
    },

    _prevent = function(e, preventDefault) {
        _yuitest_coverfunc("build/event-move/event-move.js", "_prevent", 107);
_yuitest_coverline("build/event-move/event-move.js", 108);
if (preventDefault) {
            // preventDefault is a boolean or a function
            _yuitest_coverline("build/event-move/event-move.js", 110);
if (!preventDefault.call || preventDefault(e)) {
                _yuitest_coverline("build/event-move/event-move.js", 111);
e.preventDefault();
            }
        }
    },

    define = Y.Event.define;

/**
 * Sets up a "gesturemovestart" event, that is fired on touch devices in response to a single finger "touchstart",
 * and on mouse based devices in response to a "mousedown". The subscriber can specify the minimum time
 * and distance thresholds which should be crossed before the "gesturemovestart" is fired and for the mouse,
 * which button should initiate a "gesturemovestart". This event can also be listened for using node.delegate().
 *
 * <p>It is recommended that you use Y.bind to set up context and additional arguments for your event handler,
 * however if you want to pass the context and arguments as additional signature arguments to on/delegate,
 * you need to provide a null value for the configuration object, e.g: <code>node.on("gesturemovestart", fn, null, context, arg1, arg2, arg3)</code></p>
 *
 * @event gesturemovestart
 * @for YUI
 * @param type {string} "gesturemovestart"
 * @param fn {function} The method the event invokes. It receives the event facade of the underlying DOM event (mousedown or touchstart.touches[0]) which contains position co-ordinates.
 * @param cfg {Object} Optional. An object which specifies:
 *
 * <dl>
 * <dt>minDistance (defaults to 0)</dt>
 * <dd>The minimum distance threshold which should be crossed before the gesturemovestart is fired</dd>
 * <dt>minTime (defaults to 0)</dt>
 * <dd>The minimum time threshold for which the finger/mouse should be help down before the gesturemovestart is fired</dd>
 * <dt>button (no default)</dt>
 * <dd>In the case of a mouse input device, if the event should only be fired for a specific mouse button.</dd>
 * <dt>preventDefault (defaults to false)</dt>
 * <dd>Can be set to true/false to prevent default behavior as soon as the touchstart or mousedown is received (that is before minTime or minDistance thresholds are crossed, and so before the gesturemovestart listener is notified) so that things like text selection and context popups (on touch devices) can be
 * prevented. This property can also be set to a function, which returns true or false, based on the event facade passed to it (for example, DragDrop can determine if the target is a valid handle or not before preventing default).</dd>
 * </dl>
 *
 * @return {EventHandle} the detach handle
 */

_yuitest_coverline("build/event-move/event-move.js", 149);
define(GESTURE_MOVE_START, {

    on: function (node, subscriber, ce) {

        //Set -ms-touch-action on IE10 and set preventDefault to true
        _yuitest_coverfunc("build/event-move/event-move.js", "on", 151);
_yuitest_coverline("build/event-move/event-move.js", 154);
_setTouchActions(node, subscriber, EVENT[START]);

        _yuitest_coverline("build/event-move/event-move.js", 156);
subscriber[_MOVE_START_HANDLE] = node.on(EVENT[START],
            this._onStart,
            this,
            node,
            subscriber,
            ce);
    },

    delegate : function(node, subscriber, ce, filter) {

        _yuitest_coverfunc("build/event-move/event-move.js", "delegate", 164);
_yuitest_coverline("build/event-move/event-move.js", 166);
var se = this;

        _yuitest_coverline("build/event-move/event-move.js", 168);
subscriber[_DEL_MOVE_START_HANDLE] = node.delegate(EVENT[START],
            function(e) {
                _yuitest_coverfunc("build/event-move/event-move.js", "(anonymous 2)", 169);
_yuitest_coverline("build/event-move/event-move.js", 170);
se._onStart(e, node, subscriber, ce, true);
            },
            filter);
    },

    detachDelegate : function(node, subscriber, ce, filter) {
        _yuitest_coverfunc("build/event-move/event-move.js", "detachDelegate", 175);
_yuitest_coverline("build/event-move/event-move.js", 176);
var handle = subscriber[_DEL_MOVE_START_HANDLE];

        _yuitest_coverline("build/event-move/event-move.js", 178);
if (handle) {
            _yuitest_coverline("build/event-move/event-move.js", 179);
handle.detach();
            _yuitest_coverline("build/event-move/event-move.js", 180);
subscriber[_DEL_MOVE_START_HANDLE] = null;
        }

        _yuitest_coverline("build/event-move/event-move.js", 183);
_unsetTouchActions(node);
    },

    detach: function (node, subscriber, ce) {
        _yuitest_coverfunc("build/event-move/event-move.js", "detach", 186);
_yuitest_coverline("build/event-move/event-move.js", 187);
var startHandle = subscriber[_MOVE_START_HANDLE];

        _yuitest_coverline("build/event-move/event-move.js", 189);
if (startHandle) {
            _yuitest_coverline("build/event-move/event-move.js", 190);
startHandle.detach();
            _yuitest_coverline("build/event-move/event-move.js", 191);
subscriber[_MOVE_START_HANDLE] = null;
        }

        _yuitest_coverline("build/event-move/event-move.js", 194);
_unsetTouchActions(node);
    },

    processArgs : function(args, delegate) {
        _yuitest_coverfunc("build/event-move/event-move.js", "processArgs", 197);
_yuitest_coverline("build/event-move/event-move.js", 198);
var params = _defArgsProcessor(this, args, delegate);

        _yuitest_coverline("build/event-move/event-move.js", 200);
if (!(MIN_TIME in params)) {
            _yuitest_coverline("build/event-move/event-move.js", 201);
params[MIN_TIME] = this.MIN_TIME;
        }

        _yuitest_coverline("build/event-move/event-move.js", 204);
if (!(MIN_DISTANCE in params)) {
            _yuitest_coverline("build/event-move/event-move.js", 205);
params[MIN_DISTANCE] = this.MIN_DISTANCE;
        }

        _yuitest_coverline("build/event-move/event-move.js", 208);
return params;
    },

    _onStart : function(e, node, subscriber, ce, delegate) {

        _yuitest_coverfunc("build/event-move/event-move.js", "_onStart", 211);
_yuitest_coverline("build/event-move/event-move.js", 213);
if (delegate) {
            _yuitest_coverline("build/event-move/event-move.js", 214);
node = e[CURRENT_TARGET];
        }

        _yuitest_coverline("build/event-move/event-move.js", 217);
var params = subscriber._extra,
            fireStart = true,
            minTime = params[MIN_TIME],
            minDistance = params[MIN_DISTANCE],
            button = params.button,
            preventDefault = params[PREVENT_DEFAULT],
            root = _getRoot(node, subscriber),
            startXY;

        _yuitest_coverline("build/event-move/event-move.js", 226);
if (e.touches) {
            _yuitest_coverline("build/event-move/event-move.js", 227);
if (e.touches.length === 1) {
                _yuitest_coverline("build/event-move/event-move.js", 228);
_normTouchFacade(e, e.touches[0], params);
            } else {
                _yuitest_coverline("build/event-move/event-move.js", 230);
fireStart = false;
            }
        } else {
            _yuitest_coverline("build/event-move/event-move.js", 233);
fireStart = (button === undefined) || (button === e.button);
        }


        _yuitest_coverline("build/event-move/event-move.js", 237);
if (fireStart) {

            _yuitest_coverline("build/event-move/event-move.js", 239);
_prevent(e, preventDefault);

            _yuitest_coverline("build/event-move/event-move.js", 241);
if (minTime === 0 || minDistance === 0) {
                _yuitest_coverline("build/event-move/event-move.js", 242);
this._start(e, node, ce, params);

            } else {

                _yuitest_coverline("build/event-move/event-move.js", 246);
startXY = [e.pageX, e.pageY];

                _yuitest_coverline("build/event-move/event-move.js", 248);
if (minTime > 0) {


                    _yuitest_coverline("build/event-move/event-move.js", 251);
params._ht = Y.later(minTime, this, this._start, [e, node, ce, params]);

                    _yuitest_coverline("build/event-move/event-move.js", 253);
params._hme = root.on(EVENT[END], Y.bind(function() {
                        _yuitest_coverfunc("build/event-move/event-move.js", "(anonymous 3)", 253);
_yuitest_coverline("build/event-move/event-move.js", 254);
this._cancel(params);
                    }, this));
                }

                _yuitest_coverline("build/event-move/event-move.js", 258);
if (minDistance > 0) {


                    _yuitest_coverline("build/event-move/event-move.js", 261);
params._hm = root.on(EVENT[MOVE], Y.bind(function(em) {
                        _yuitest_coverfunc("build/event-move/event-move.js", "(anonymous 4)", 261);
_yuitest_coverline("build/event-move/event-move.js", 262);
if (Math.abs(em.pageX - startXY[0]) > minDistance || Math.abs(em.pageY - startXY[1]) > minDistance) {
                            _yuitest_coverline("build/event-move/event-move.js", 263);
this._start(e, node, ce, params);
                        }
                    }, this));
                }
            }
        }
    },

    _cancel : function(params) {
        _yuitest_coverfunc("build/event-move/event-move.js", "_cancel", 271);
_yuitest_coverline("build/event-move/event-move.js", 272);
if (params._ht) {
            _yuitest_coverline("build/event-move/event-move.js", 273);
params._ht.cancel();
            _yuitest_coverline("build/event-move/event-move.js", 274);
params._ht = null;
        }
        _yuitest_coverline("build/event-move/event-move.js", 276);
if (params._hme) {
            _yuitest_coverline("build/event-move/event-move.js", 277);
params._hme.detach();
            _yuitest_coverline("build/event-move/event-move.js", 278);
params._hme = null;
        }
        _yuitest_coverline("build/event-move/event-move.js", 280);
if (params._hm) {
            _yuitest_coverline("build/event-move/event-move.js", 281);
params._hm.detach();
            _yuitest_coverline("build/event-move/event-move.js", 282);
params._hm = null;
        }
    },

    _start : function(e, node, ce, params) {

        _yuitest_coverfunc("build/event-move/event-move.js", "_start", 286);
_yuitest_coverline("build/event-move/event-move.js", 288);
if (params) {
            _yuitest_coverline("build/event-move/event-move.js", 289);
this._cancel(params);
        }

        _yuitest_coverline("build/event-move/event-move.js", 292);
e.type = GESTURE_MOVE_START;


        _yuitest_coverline("build/event-move/event-move.js", 295);
node.setData(_MOVE_START, e);
        _yuitest_coverline("build/event-move/event-move.js", 296);
ce.fire(e);
    },

    MIN_TIME : 0,
    MIN_DISTANCE : 0,
    PREVENT_DEFAULT : false
});

/**
 * Sets up a "gesturemove" event, that is fired on touch devices in response to a single finger "touchmove",
 * and on mouse based devices in response to a "mousemove".
 *
 * <p>By default this event is only fired when the same node
 * has received a "gesturemovestart" event. The subscriber can set standAlone to true, in the configuration properties,
 * if they want to listen for this event without an initial "gesturemovestart".</p>
 *
 * <p>By default this event sets up it's internal "touchmove" and "mousemove" DOM listeners on the document element. The subscriber
 * can set the root configuration property, to specify which node to attach DOM listeners to, if different from the document.</p>
 *
 * <p>This event can also be listened for using node.delegate().</p>
 *
 * <p>It is recommended that you use Y.bind to set up context and additional arguments for your event handler,
 * however if you want to pass the context and arguments as additional signature arguments to on/delegate,
 * you need to provide a null value for the configuration object, e.g: <code>node.on("gesturemove", fn, null, context, arg1, arg2, arg3)</code></p>
 *
 * @event gesturemove
 * @for YUI
 * @param type {string} "gesturemove"
 * @param fn {function} The method the event invokes. It receives the event facade of the underlying DOM event (mousemove or touchmove.touches[0]) which contains position co-ordinates.
 * @param cfg {Object} Optional. An object which specifies:
 * <dl>
 * <dt>standAlone (defaults to false)</dt>
 * <dd>true, if the subscriber should be notified even if a "gesturemovestart" has not occured on the same node.</dd>
 * <dt>root (defaults to document)</dt>
 * <dd>The node to which the internal DOM listeners should be attached.</dd>
 * <dt>preventDefault (defaults to false)</dt>
 * <dd>Can be set to true/false to prevent default behavior as soon as the touchmove or mousemove is received. As with gesturemovestart, can also be set to function which returns true/false based on the event facade passed to it.</dd>
 * </dl>
 *
 * @return {EventHandle} the detach handle
 */
_yuitest_coverline("build/event-move/event-move.js", 337);
define(GESTURE_MOVE, {

    on : function (node, subscriber, ce) {
        _yuitest_coverfunc("build/event-move/event-move.js", "on", 339);
_yuitest_coverline("build/event-move/event-move.js", 340);
var root = _getRoot(node, subscriber, EVENT[MOVE]),

            moveHandle = root.on(EVENT[MOVE],
                this._onMove,
                this,
                node,
                subscriber,
                ce);

        _yuitest_coverline("build/event-move/event-move.js", 349);
subscriber[_MOVE_HANDLE] = moveHandle;

    },

    delegate : function(node, subscriber, ce, filter) {

        _yuitest_coverfunc("build/event-move/event-move.js", "delegate", 353);
_yuitest_coverline("build/event-move/event-move.js", 355);
var se = this;

        _yuitest_coverline("build/event-move/event-move.js", 357);
subscriber[_DEL_MOVE_HANDLE] = node.delegate(EVENT[MOVE],
            function(e) {
                _yuitest_coverfunc("build/event-move/event-move.js", "(anonymous 5)", 358);
_yuitest_coverline("build/event-move/event-move.js", 359);
se._onMove(e, node, subscriber, ce, true);
            },
            filter);
    },

    detach : function (node, subscriber, ce) {
        _yuitest_coverfunc("build/event-move/event-move.js", "detach", 364);
_yuitest_coverline("build/event-move/event-move.js", 365);
var moveHandle = subscriber[_MOVE_HANDLE];

        _yuitest_coverline("build/event-move/event-move.js", 367);
if (moveHandle) {
            _yuitest_coverline("build/event-move/event-move.js", 368);
moveHandle.detach();
            _yuitest_coverline("build/event-move/event-move.js", 369);
subscriber[_MOVE_HANDLE] = null;
        }

        _yuitest_coverline("build/event-move/event-move.js", 372);
_unsetTouchActions(node);
    },

    detachDelegate : function(node, subscriber, ce, filter) {
        _yuitest_coverfunc("build/event-move/event-move.js", "detachDelegate", 375);
_yuitest_coverline("build/event-move/event-move.js", 376);
var handle = subscriber[_DEL_MOVE_HANDLE];

        _yuitest_coverline("build/event-move/event-move.js", 378);
if (handle) {
            _yuitest_coverline("build/event-move/event-move.js", 379);
handle.detach();
            _yuitest_coverline("build/event-move/event-move.js", 380);
subscriber[_DEL_MOVE_HANDLE] = null;
        }

        _yuitest_coverline("build/event-move/event-move.js", 383);
_unsetTouchActions(node);

    },

    processArgs : function(args, delegate) {
        _yuitest_coverfunc("build/event-move/event-move.js", "processArgs", 387);
_yuitest_coverline("build/event-move/event-move.js", 388);
return _defArgsProcessor(this, args, delegate);
    },

    _onMove : function(e, node, subscriber, ce, delegate) {

        _yuitest_coverfunc("build/event-move/event-move.js", "_onMove", 391);
_yuitest_coverline("build/event-move/event-move.js", 393);
if (delegate) {
            _yuitest_coverline("build/event-move/event-move.js", 394);
node = e[CURRENT_TARGET];
        }

        _yuitest_coverline("build/event-move/event-move.js", 397);
var fireMove = subscriber._extra.standAlone || node.getData(_MOVE_START),
            preventDefault = subscriber._extra.preventDefault;


        _yuitest_coverline("build/event-move/event-move.js", 401);
if (fireMove) {

            _yuitest_coverline("build/event-move/event-move.js", 403);
if (e.touches) {
                _yuitest_coverline("build/event-move/event-move.js", 404);
if (e.touches.length === 1) {
                    _yuitest_coverline("build/event-move/event-move.js", 405);
_normTouchFacade(e, e.touches[0]);
                } else {
                    _yuitest_coverline("build/event-move/event-move.js", 407);
fireMove = false;
                }
            }

            _yuitest_coverline("build/event-move/event-move.js", 411);
if (fireMove) {

                _yuitest_coverline("build/event-move/event-move.js", 413);
_prevent(e, preventDefault);


                _yuitest_coverline("build/event-move/event-move.js", 416);
e.type = GESTURE_MOVE;
                _yuitest_coverline("build/event-move/event-move.js", 417);
ce.fire(e);
            }
        }
    },

    PREVENT_DEFAULT : false
});

/**
 * Sets up a "gesturemoveend" event, that is fired on touch devices in response to a single finger "touchend",
 * and on mouse based devices in response to a "mouseup".
 *
 * <p>By default this event is only fired when the same node
 * has received a "gesturemove" or "gesturemovestart" event. The subscriber can set standAlone to true, in the configuration properties,
 * if they want to listen for this event without a preceding "gesturemovestart" or "gesturemove".</p>
 *
 * <p>By default this event sets up it's internal "touchend" and "mouseup" DOM listeners on the document element. The subscriber
 * can set the root configuration property, to specify which node to attach DOM listeners to, if different from the document.</p>
 *
 * <p>This event can also be listened for using node.delegate().</p>
 *
 * <p>It is recommended that you use Y.bind to set up context and additional arguments for your event handler,
 * however if you want to pass the context and arguments as additional signature arguments to on/delegate,
 * you need to provide a null value for the configuration object, e.g: <code>node.on("gesturemoveend", fn, null, context, arg1, arg2, arg3)</code></p>
 *
 *
 * @event gesturemoveend
 * @for YUI
 * @param type {string} "gesturemoveend"
 * @param fn {function} The method the event invokes. It receives the event facade of the underlying DOM event (mouseup or touchend.changedTouches[0]).
 * @param cfg {Object} Optional. An object which specifies:
 * <dl>
 * <dt>standAlone (defaults to false)</dt>
 * <dd>true, if the subscriber should be notified even if a "gesturemovestart" or "gesturemove" has not occured on the same node.</dd>
 * <dt>root (defaults to document)</dt>
 * <dd>The node to which the internal DOM listeners should be attached.</dd>
 * <dt>preventDefault (defaults to false)</dt>
 * <dd>Can be set to true/false to prevent default behavior as soon as the touchend or mouseup is received. As with gesturemovestart, can also be set to function which returns true/false based on the event facade passed to it.</dd>
 * </dl>
 *
 * @return {EventHandle} the detach handle
 */
_yuitest_coverline("build/event-move/event-move.js", 459);
define(GESTURE_MOVE_END, {

    on : function (node, subscriber, ce) {

        _yuitest_coverfunc("build/event-move/event-move.js", "on", 461);
_yuitest_coverline("build/event-move/event-move.js", 463);
var root = _getRoot(node, subscriber),

            endHandle = root.on(EVENT[END],
                this._onEnd,
                this,
                node,
                subscriber,
                ce);

        _yuitest_coverline("build/event-move/event-move.js", 472);
subscriber[_MOVE_END_HANDLE] = endHandle;
    },

    delegate : function(node, subscriber, ce, filter) {

        _yuitest_coverfunc("build/event-move/event-move.js", "delegate", 475);
_yuitest_coverline("build/event-move/event-move.js", 477);
var se = this;

        _yuitest_coverline("build/event-move/event-move.js", 479);
subscriber[_DEL_MOVE_END_HANDLE] = node.delegate(EVENT[END],
            function(e) {
                _yuitest_coverfunc("build/event-move/event-move.js", "(anonymous 6)", 480);
_yuitest_coverline("build/event-move/event-move.js", 481);
se._onEnd(e, node, subscriber, ce, true);
            },
            filter);
    },

    detachDelegate : function(node, subscriber, ce, filter) {
        _yuitest_coverfunc("build/event-move/event-move.js", "detachDelegate", 486);
_yuitest_coverline("build/event-move/event-move.js", 487);
var handle = subscriber[_DEL_MOVE_END_HANDLE];

        _yuitest_coverline("build/event-move/event-move.js", 489);
if (handle) {
            _yuitest_coverline("build/event-move/event-move.js", 490);
handle.detach();
            _yuitest_coverline("build/event-move/event-move.js", 491);
subscriber[_DEL_MOVE_END_HANDLE] = null;
        }

        _yuitest_coverline("build/event-move/event-move.js", 494);
_unsetTouchActions(node);

    },

    detach : function (node, subscriber, ce) {
        _yuitest_coverfunc("build/event-move/event-move.js", "detach", 498);
_yuitest_coverline("build/event-move/event-move.js", 499);
var endHandle = subscriber[_MOVE_END_HANDLE];

        _yuitest_coverline("build/event-move/event-move.js", 501);
if (endHandle) {
            _yuitest_coverline("build/event-move/event-move.js", 502);
endHandle.detach();
            _yuitest_coverline("build/event-move/event-move.js", 503);
subscriber[_MOVE_END_HANDLE] = null;
        }

        _yuitest_coverline("build/event-move/event-move.js", 506);
_unsetTouchActions(node);
    },

    processArgs : function(args, delegate) {
        _yuitest_coverfunc("build/event-move/event-move.js", "processArgs", 509);
_yuitest_coverline("build/event-move/event-move.js", 510);
return _defArgsProcessor(this, args, delegate);
    },

    _onEnd : function(e, node, subscriber, ce, delegate) {

        _yuitest_coverfunc("build/event-move/event-move.js", "_onEnd", 513);
_yuitest_coverline("build/event-move/event-move.js", 515);
if (delegate) {
            _yuitest_coverline("build/event-move/event-move.js", 516);
node = e[CURRENT_TARGET];
        }

        _yuitest_coverline("build/event-move/event-move.js", 519);
var fireMoveEnd = subscriber._extra.standAlone || node.getData(_MOVE) || node.getData(_MOVE_START),
            preventDefault = subscriber._extra.preventDefault;

        _yuitest_coverline("build/event-move/event-move.js", 522);
if (fireMoveEnd) {

            _yuitest_coverline("build/event-move/event-move.js", 524);
if (e.changedTouches) {
                _yuitest_coverline("build/event-move/event-move.js", 525);
if (e.changedTouches.length === 1) {
                    _yuitest_coverline("build/event-move/event-move.js", 526);
_normTouchFacade(e, e.changedTouches[0]);
                } else {
                    _yuitest_coverline("build/event-move/event-move.js", 528);
fireMoveEnd = false;
                }
            }

            _yuitest_coverline("build/event-move/event-move.js", 532);
if (fireMoveEnd) {

                _yuitest_coverline("build/event-move/event-move.js", 534);
_prevent(e, preventDefault);

                _yuitest_coverline("build/event-move/event-move.js", 536);
e.type = GESTURE_MOVE_END;
                _yuitest_coverline("build/event-move/event-move.js", 537);
ce.fire(e);

                _yuitest_coverline("build/event-move/event-move.js", 539);
node.clearData(_MOVE_START);
                _yuitest_coverline("build/event-move/event-move.js", 540);
node.clearData(_MOVE);
            }
        }
    },

    PREVENT_DEFAULT : false
});


}, '@VERSION@', {"requires": ["node-base", "event-touch", "event-synthetic"]});
