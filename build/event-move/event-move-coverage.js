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
_yuitest_coverage["build/event-move/event-move.js"].code=["YUI.add('event-move', function (Y, NAME) {","","/**"," * Adds lower level support for \"gesturemovestart\", \"gesturemove\" and \"gesturemoveend\" events, which can be used to create drag/drop"," * interactions which work across touch and mouse input devices. They correspond to \"touchstart\", \"touchmove\" and \"touchend\" on a touch input"," * device, and \"mousedown\", \"mousemove\", \"mouseup\" on a mouse based input device."," *"," * <p>Documentation for the gesturemove triplet of events can be found on the <a href=\"../classes/YUI.html#event_gesturemove\">YUI</a> global,"," * along with the other supported events.</p>"," *"," * @module event-gestures"," * @submodule event-move"," */",""," var GESTURE_MAP = Y.Event._GESTURE_MAP,","     EVENT = {","         start: GESTURE_MAP.start,","         end: GESTURE_MAP.end,","         move: GESTURE_MAP.move","     },","    START = \"start\",","    MOVE = \"move\",","    END = \"end\",","","    GESTURE_MOVE = \"gesture\" + MOVE,","    GESTURE_MOVE_END = GESTURE_MOVE + END,","    GESTURE_MOVE_START = GESTURE_MOVE + START,","","    _MOVE_START_HANDLE = \"_msh\",","    _MOVE_HANDLE = \"_mh\",","    _MOVE_END_HANDLE = \"_meh\",","","    _DEL_MOVE_START_HANDLE = \"_dmsh\",","    _DEL_MOVE_HANDLE = \"_dmh\",","    _DEL_MOVE_END_HANDLE = \"_dmeh\",","","    _MOVE_START = \"_ms\",","    _MOVE = \"_m\",","","    MIN_TIME = \"minTime\",","    MIN_DISTANCE = \"minDistance\",","    PREVENT_DEFAULT = \"preventDefault\",","    BUTTON = \"button\",","    OWNER_DOCUMENT = \"ownerDocument\",","","    CURRENT_TARGET = \"currentTarget\",","    TARGET = \"target\",","","    NODE_TYPE = \"nodeType\",","","    SUPPORTS_POINTER = Y.config.win && (\"msPointerEnabled\" in Y.config.win.navigator),","","    _defArgsProcessor = function(se, args, delegate) {","        var iConfig = (delegate) ? 4 : 3,","            config = (args.length > iConfig) ? Y.merge(args.splice(iConfig,1)[0]) : {};","","        if (!(PREVENT_DEFAULT in config)) {","            config[PREVENT_DEFAULT] = se.PREVENT_DEFAULT;","        }","","        return config;","    },","","    _getRoot = function(node, subscriber) {","        return subscriber._extra.root || (node.get(NODE_TYPE) === 9) ? node : node.get(OWNER_DOCUMENT);","    },","","    _normTouchFacade = function(touchFacade, touch, params) {","        touchFacade.pageX = touch.pageX;","        touchFacade.pageY = touch.pageY;","        touchFacade.screenX = touch.screenX;","        touchFacade.screenY = touch.screenY;","        touchFacade.clientX = touch.clientX;","        touchFacade.clientY = touch.clientY;","        touchFacade[TARGET] = touchFacade[TARGET] || touch[TARGET];","        touchFacade[CURRENT_TARGET] = touchFacade[CURRENT_TARGET] || touch[CURRENT_TARGET];","","        touchFacade[BUTTON] = (params && params[BUTTON]) || 1; // default to left (left as per vendors, not W3C which is 0)","    },","","    /*","    In IE10, gestures will not work properly unless the -ms-touch-action CSS property is set to something other than 'auto'. Read http://msdn.microsoft.com/en-us/library/windows/apps/hh767313.aspx for more info. To get around this, we set -ms-touch-action: none which is the same as e.preventDefault(). This tells the browser to fire DOM events for all touch events, and not perform any default behavior.","","    The user can over-ride this by setting a more lenient -ms-touch-action property on a node (such as pan-x, pan-y, etc.) via CSS when subscribing to the 'gesturemovestart' event.","    */","    _setTouchActions = function (node, subscriber, evtName) {","        var params = subscriber._extra,","            elem = node.getDOMNode();","","        if (SUPPORTS_POINTER) { //Checks to see if MSPointer events are supported.","            params[PREVENT_DEFAULT] = true;","            elem.style.msTouchAction = 'none';","        }","    },","","    /*","    Resets the element's -ms-touch-action property back to 'auto', which is the default. This is called on detach() and detachDelegate().","    */","    _unsetTouchActions = function (node) {","        if (SUPPORTS_POINTER) {","            var elem = node.getDOMNode();","            if (elem.style.msTouchAction !== 'auto') {","                elem.style.msTouchAction = 'auto'","            }","        }","    },","","    _prevent = function(e, preventDefault) {","        if (preventDefault) {","            // preventDefault is a boolean or a function","            if (!preventDefault.call || preventDefault(e)) {","                e.preventDefault();","            }","        }","    },","","    define = Y.Event.define;","","/**"," * Sets up a \"gesturemovestart\" event, that is fired on touch devices in response to a single finger \"touchstart\","," * and on mouse based devices in response to a \"mousedown\". The subscriber can specify the minimum time"," * and distance thresholds which should be crossed before the \"gesturemovestart\" is fired and for the mouse,"," * which button should initiate a \"gesturemovestart\". This event can also be listened for using node.delegate()."," *"," * <p>It is recommended that you use Y.bind to set up context and additional arguments for your event handler,"," * however if you want to pass the context and arguments as additional signature arguments to on/delegate,"," * you need to provide a null value for the configuration object, e.g: <code>node.on(\"gesturemovestart\", fn, null, context, arg1, arg2, arg3)</code></p>"," *"," * @event gesturemovestart"," * @for YUI"," * @param type {string} \"gesturemovestart\""," * @param fn {function} The method the event invokes. It receives the event facade of the underlying DOM event (mousedown or touchstart.touches[0]) which contains position co-ordinates."," * @param cfg {Object} Optional. An object which specifies:"," *"," * <dl>"," * <dt>minDistance (defaults to 0)</dt>"," * <dd>The minimum distance threshold which should be crossed before the gesturemovestart is fired</dd>"," * <dt>minTime (defaults to 0)</dt>"," * <dd>The minimum time threshold for which the finger/mouse should be help down before the gesturemovestart is fired</dd>"," * <dt>button (no default)</dt>"," * <dd>In the case of a mouse input device, if the event should only be fired for a specific mouse button.</dd>"," * <dt>preventDefault (defaults to false)</dt>"," * <dd>Can be set to true/false to prevent default behavior as soon as the touchstart or mousedown is received (that is before minTime or minDistance thresholds are crossed, and so before the gesturemovestart listener is notified) so that things like text selection and context popups (on touch devices) can be"," * prevented. This property can also be set to a function, which returns true or false, based on the event facade passed to it (for example, DragDrop can determine if the target is a valid handle or not before preventing default).</dd>"," * </dl>"," *"," * @return {EventHandle} the detach handle"," */","","define(GESTURE_MOVE_START, {","","    on: function (node, subscriber, ce) {","","        //Set -ms-touch-action on IE10 and set preventDefault to true","        _setTouchActions(node, subscriber, EVENT[START]);","","        subscriber[_MOVE_START_HANDLE] = node.on(EVENT[START],","            this._onStart,","            this,","            node,","            subscriber,","            ce);","    },","","    delegate : function(node, subscriber, ce, filter) {","","        var se = this;","","        subscriber[_DEL_MOVE_START_HANDLE] = node.delegate(EVENT[START],","            function(e) {","                se._onStart(e, node, subscriber, ce, true);","            },","            filter);","    },","","    detachDelegate : function(node, subscriber, ce, filter) {","        var handle = subscriber[_DEL_MOVE_START_HANDLE];","","        if (handle) {","            handle.detach();","            subscriber[_DEL_MOVE_START_HANDLE] = null;","        }","","        _unsetTouchActions(node);","    },","","    detach: function (node, subscriber, ce) {","        var startHandle = subscriber[_MOVE_START_HANDLE];","","        if (startHandle) {","            startHandle.detach();","            subscriber[_MOVE_START_HANDLE] = null;","        }","","        _unsetTouchActions(node);","    },","","    processArgs : function(args, delegate) {","        var params = _defArgsProcessor(this, args, delegate);","","        if (!(MIN_TIME in params)) {","            params[MIN_TIME] = this.MIN_TIME;","        }","","        if (!(MIN_DISTANCE in params)) {","            params[MIN_DISTANCE] = this.MIN_DISTANCE;","        }","","        return params;","    },","","    _onStart : function(e, node, subscriber, ce, delegate) {","","        if (delegate) {","            node = e[CURRENT_TARGET];","        }","","        var params = subscriber._extra,","            fireStart = true,","            minTime = params[MIN_TIME],","            minDistance = params[MIN_DISTANCE],","            button = params.button,","            preventDefault = params[PREVENT_DEFAULT],","            root = _getRoot(node, subscriber),","            startXY;","","        if (e.touches) {","            if (e.touches.length === 1) {","                _normTouchFacade(e, e.touches[0], params);","            } else {","                fireStart = false;","            }","        } else {","            fireStart = (button === undefined) || (button === e.button);","        }","","","        if (fireStart) {","","            _prevent(e, preventDefault);","","            if (minTime === 0 || minDistance === 0) {","                this._start(e, node, ce, params);","","            } else {","","                startXY = [e.pageX, e.pageY];","","                if (minTime > 0) {","","","                    params._ht = Y.later(minTime, this, this._start, [e, node, ce, params]);","","                    params._hme = root.on(EVENT[END], Y.bind(function() {","                        this._cancel(params);","                    }, this));","                }","","                if (minDistance > 0) {","","","                    params._hm = root.on(EVENT[MOVE], Y.bind(function(em) {","                        if (Math.abs(em.pageX - startXY[0]) > minDistance || Math.abs(em.pageY - startXY[1]) > minDistance) {","                            this._start(e, node, ce, params);","                        }","                    }, this));","                }","            }","        }","    },","","    _cancel : function(params) {","        if (params._ht) {","            params._ht.cancel();","            params._ht = null;","        }","        if (params._hme) {","            params._hme.detach();","            params._hme = null;","        }","        if (params._hm) {","            params._hm.detach();","            params._hm = null;","        }","    },","","    _start : function(e, node, ce, params) {","","        if (params) {","            this._cancel(params);","        }","","        e.type = GESTURE_MOVE_START;","","","        node.setData(_MOVE_START, e);","        ce.fire(e);","    },","","    MIN_TIME : 0,","    MIN_DISTANCE : 0,","    PREVENT_DEFAULT : false","});","","/**"," * Sets up a \"gesturemove\" event, that is fired on touch devices in response to a single finger \"touchmove\","," * and on mouse based devices in response to a \"mousemove\"."," *"," * <p>By default this event is only fired when the same node"," * has received a \"gesturemovestart\" event. The subscriber can set standAlone to true, in the configuration properties,"," * if they want to listen for this event without an initial \"gesturemovestart\".</p>"," *"," * <p>By default this event sets up it's internal \"touchmove\" and \"mousemove\" DOM listeners on the document element. The subscriber"," * can set the root configuration property, to specify which node to attach DOM listeners to, if different from the document.</p>"," *"," * <p>This event can also be listened for using node.delegate().</p>"," *"," * <p>It is recommended that you use Y.bind to set up context and additional arguments for your event handler,"," * however if you want to pass the context and arguments as additional signature arguments to on/delegate,"," * you need to provide a null value for the configuration object, e.g: <code>node.on(\"gesturemove\", fn, null, context, arg1, arg2, arg3)</code></p>"," *"," * @event gesturemove"," * @for YUI"," * @param type {string} \"gesturemove\""," * @param fn {function} The method the event invokes. It receives the event facade of the underlying DOM event (mousemove or touchmove.touches[0]) which contains position co-ordinates."," * @param cfg {Object} Optional. An object which specifies:"," * <dl>"," * <dt>standAlone (defaults to false)</dt>"," * <dd>true, if the subscriber should be notified even if a \"gesturemovestart\" has not occured on the same node.</dd>"," * <dt>root (defaults to document)</dt>"," * <dd>The node to which the internal DOM listeners should be attached.</dd>"," * <dt>preventDefault (defaults to false)</dt>"," * <dd>Can be set to true/false to prevent default behavior as soon as the touchmove or mousemove is received. As with gesturemovestart, can also be set to function which returns true/false based on the event facade passed to it.</dd>"," * </dl>"," *"," * @return {EventHandle} the detach handle"," */","define(GESTURE_MOVE, {","","    on : function (node, subscriber, ce) {","        var root = _getRoot(node, subscriber, EVENT[MOVE]),","","            moveHandle = root.on(EVENT[MOVE],","                this._onMove,","                this,","                node,","                subscriber,","                ce);","","        subscriber[_MOVE_HANDLE] = moveHandle;","","    },","","    delegate : function(node, subscriber, ce, filter) {","","        var se = this;","","        subscriber[_DEL_MOVE_HANDLE] = node.delegate(EVENT[MOVE],","            function(e) {","                se._onMove(e, node, subscriber, ce, true);","            },","            filter);","    },","","    detach : function (node, subscriber, ce) {","        var moveHandle = subscriber[_MOVE_HANDLE];","","        if (moveHandle) {","            moveHandle.detach();","            subscriber[_MOVE_HANDLE] = null;","        }","","        _unsetTouchActions(node);","    },","","    detachDelegate : function(node, subscriber, ce, filter) {","        var handle = subscriber[_DEL_MOVE_HANDLE];","","        if (handle) {","            handle.detach();","            subscriber[_DEL_MOVE_HANDLE] = null;","        }","","        _unsetTouchActions(node);","","    },","","    processArgs : function(args, delegate) {","        return _defArgsProcessor(this, args, delegate);","    },","","    _onMove : function(e, node, subscriber, ce, delegate) {","","        if (delegate) {","            node = e[CURRENT_TARGET];","        }","","        var fireMove = subscriber._extra.standAlone || node.getData(_MOVE_START),","            preventDefault = subscriber._extra.preventDefault;","","","        if (fireMove) {","","            if (e.touches) {","                if (e.touches.length === 1) {","                    _normTouchFacade(e, e.touches[0]);","                } else {","                    fireMove = false;","                }","            }","","            if (fireMove) {","","                _prevent(e, preventDefault);","","","                e.type = GESTURE_MOVE;","                ce.fire(e);","            }","        }","    },","","    PREVENT_DEFAULT : false","});","","/**"," * Sets up a \"gesturemoveend\" event, that is fired on touch devices in response to a single finger \"touchend\","," * and on mouse based devices in response to a \"mouseup\"."," *"," * <p>By default this event is only fired when the same node"," * has received a \"gesturemove\" or \"gesturemovestart\" event. The subscriber can set standAlone to true, in the configuration properties,"," * if they want to listen for this event without a preceding \"gesturemovestart\" or \"gesturemove\".</p>"," *"," * <p>By default this event sets up it's internal \"touchend\" and \"mouseup\" DOM listeners on the document element. The subscriber"," * can set the root configuration property, to specify which node to attach DOM listeners to, if different from the document.</p>"," *"," * <p>This event can also be listened for using node.delegate().</p>"," *"," * <p>It is recommended that you use Y.bind to set up context and additional arguments for your event handler,"," * however if you want to pass the context and arguments as additional signature arguments to on/delegate,"," * you need to provide a null value for the configuration object, e.g: <code>node.on(\"gesturemoveend\", fn, null, context, arg1, arg2, arg3)</code></p>"," *"," *"," * @event gesturemoveend"," * @for YUI"," * @param type {string} \"gesturemoveend\""," * @param fn {function} The method the event invokes. It receives the event facade of the underlying DOM event (mouseup or touchend.changedTouches[0])."," * @param cfg {Object} Optional. An object which specifies:"," * <dl>"," * <dt>standAlone (defaults to false)</dt>"," * <dd>true, if the subscriber should be notified even if a \"gesturemovestart\" or \"gesturemove\" has not occured on the same node.</dd>"," * <dt>root (defaults to document)</dt>"," * <dd>The node to which the internal DOM listeners should be attached.</dd>"," * <dt>preventDefault (defaults to false)</dt>"," * <dd>Can be set to true/false to prevent default behavior as soon as the touchend or mouseup is received. As with gesturemovestart, can also be set to function which returns true/false based on the event facade passed to it.</dd>"," * </dl>"," *"," * @return {EventHandle} the detach handle"," */","define(GESTURE_MOVE_END, {","","    on : function (node, subscriber, ce) {","","        var root = _getRoot(node, subscriber),","","            endHandle = root.on(EVENT[END],","                this._onEnd,","                this,","                node,","                subscriber,","                ce);","","        subscriber[_MOVE_END_HANDLE] = endHandle;","    },","","    delegate : function(node, subscriber, ce, filter) {","","        var se = this;","","        subscriber[_DEL_MOVE_END_HANDLE] = node.delegate(EVENT[END],","            function(e) {","                se._onEnd(e, node, subscriber, ce, true);","            },","            filter);","    },","","    detachDelegate : function(node, subscriber, ce, filter) {","        var handle = subscriber[_DEL_MOVE_END_HANDLE];","","        if (handle) {","            handle.detach();","            subscriber[_DEL_MOVE_END_HANDLE] = null;","        }","","        _unsetTouchActions(node);","","    },","","    detach : function (node, subscriber, ce) {","        var endHandle = subscriber[_MOVE_END_HANDLE];","","        if (endHandle) {","            endHandle.detach();","            subscriber[_MOVE_END_HANDLE] = null;","        }","","        _unsetTouchActions(node);","    },","","    processArgs : function(args, delegate) {","        return _defArgsProcessor(this, args, delegate);","    },","","    _onEnd : function(e, node, subscriber, ce, delegate) {","","        if (delegate) {","            node = e[CURRENT_TARGET];","        }","","        var fireMoveEnd = subscriber._extra.standAlone || node.getData(_MOVE) || node.getData(_MOVE_START),","            preventDefault = subscriber._extra.preventDefault;","","        if (fireMoveEnd) {","","            if (e.changedTouches) {","                if (e.changedTouches.length === 1) {","                    _normTouchFacade(e, e.changedTouches[0]);","                } else {","                    fireMoveEnd = false;","                }","            }","","            if (fireMoveEnd) {","","                _prevent(e, preventDefault);","","                e.type = GESTURE_MOVE_END;","                ce.fire(e);","","                node.clearData(_MOVE_START);","                node.clearData(_MOVE);","            }","        }","    },","","    PREVENT_DEFAULT : false","});","","","}, '@VERSION@', {\"requires\": [\"node-base\", \"event-touch\", \"event-synthetic\"]});"];
_yuitest_coverage["build/event-move/event-move.js"].lines = {"1":0,"15":0,"54":0,"57":0,"58":0,"61":0,"65":0,"69":0,"70":0,"71":0,"72":0,"73":0,"74":0,"75":0,"76":0,"78":0,"87":0,"90":0,"91":0,"92":0,"100":0,"101":0,"102":0,"103":0,"109":0,"111":0,"112":0,"150":0,"155":0,"157":0,"167":0,"169":0,"171":0,"177":0,"179":0,"180":0,"181":0,"184":0,"188":0,"190":0,"191":0,"192":0,"195":0,"199":0,"201":0,"202":0,"205":0,"206":0,"209":0,"214":0,"215":0,"218":0,"227":0,"228":0,"229":0,"231":0,"234":0,"238":0,"240":0,"242":0,"243":0,"247":0,"249":0,"252":0,"254":0,"255":0,"259":0,"262":0,"263":0,"264":0,"273":0,"274":0,"275":0,"277":0,"278":0,"279":0,"281":0,"282":0,"283":0,"289":0,"290":0,"293":0,"296":0,"297":0,"338":0,"341":0,"350":0,"356":0,"358":0,"360":0,"366":0,"368":0,"369":0,"370":0,"373":0,"377":0,"379":0,"380":0,"381":0,"384":0,"389":0,"394":0,"395":0,"398":0,"402":0,"404":0,"405":0,"406":0,"408":0,"412":0,"414":0,"417":0,"418":0,"460":0,"464":0,"473":0,"478":0,"480":0,"482":0,"488":0,"490":0,"491":0,"492":0,"495":0,"500":0,"502":0,"503":0,"504":0,"507":0,"511":0,"516":0,"517":0,"520":0,"523":0,"525":0,"526":0,"527":0,"529":0,"533":0,"535":0,"537":0,"538":0,"540":0,"541":0};
_yuitest_coverage["build/event-move/event-move.js"].functions = {"_defArgsProcessor:53":0,"_getRoot:64":0,"_normTouchFacade:68":0,"_setTouchActions:86":0,"_unsetTouchActions:99":0,"_prevent:108":0,"on:152":0,"(anonymous 2):170":0,"delegate:165":0,"detachDelegate:176":0,"detach:187":0,"processArgs:198":0,"(anonymous 3):254":0,"(anonymous 4):262":0,"_onStart:212":0,"_cancel:272":0,"_start:287":0,"on:340":0,"(anonymous 5):359":0,"delegate:354":0,"detach:365":0,"detachDelegate:376":0,"processArgs:388":0,"_onMove:392":0,"on:462":0,"(anonymous 6):481":0,"delegate:476":0,"detachDelegate:487":0,"detach:499":0,"processArgs:510":0,"_onEnd:514":0,"(anonymous 1):1":0};
_yuitest_coverage["build/event-move/event-move.js"].coveredLines = 144;
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

    SUPPORTS_POINTER = Y.config.win && ("msPointerEnabled" in Y.config.win.navigator),

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
    In IE10, gestures will not work properly unless the -ms-touch-action CSS property is set to something other than 'auto'. Read http://msdn.microsoft.com/en-us/library/windows/apps/hh767313.aspx for more info. To get around this, we set -ms-touch-action: none which is the same as e.preventDefault(). This tells the browser to fire DOM events for all touch events, and not perform any default behavior.

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
params[PREVENT_DEFAULT] = true;
            _yuitest_coverline("build/event-move/event-move.js", 92);
elem.style.msTouchAction = 'none';
        }
    },

    /*
    Resets the element's -ms-touch-action property back to 'auto', which is the default. This is called on detach() and detachDelegate().
    */
    _unsetTouchActions = function (node) {
        _yuitest_coverfunc("build/event-move/event-move.js", "_unsetTouchActions", 99);
_yuitest_coverline("build/event-move/event-move.js", 100);
if (SUPPORTS_POINTER) {
            _yuitest_coverline("build/event-move/event-move.js", 101);
var elem = node.getDOMNode();
            _yuitest_coverline("build/event-move/event-move.js", 102);
if (elem.style.msTouchAction !== 'auto') {
                _yuitest_coverline("build/event-move/event-move.js", 103);
elem.style.msTouchAction = 'auto'
            }
        }
    },

    _prevent = function(e, preventDefault) {
        _yuitest_coverfunc("build/event-move/event-move.js", "_prevent", 108);
_yuitest_coverline("build/event-move/event-move.js", 109);
if (preventDefault) {
            // preventDefault is a boolean or a function
            _yuitest_coverline("build/event-move/event-move.js", 111);
if (!preventDefault.call || preventDefault(e)) {
                _yuitest_coverline("build/event-move/event-move.js", 112);
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

_yuitest_coverline("build/event-move/event-move.js", 150);
define(GESTURE_MOVE_START, {

    on: function (node, subscriber, ce) {

        //Set -ms-touch-action on IE10 and set preventDefault to true
        _yuitest_coverfunc("build/event-move/event-move.js", "on", 152);
_yuitest_coverline("build/event-move/event-move.js", 155);
_setTouchActions(node, subscriber, EVENT[START]);

        _yuitest_coverline("build/event-move/event-move.js", 157);
subscriber[_MOVE_START_HANDLE] = node.on(EVENT[START],
            this._onStart,
            this,
            node,
            subscriber,
            ce);
    },

    delegate : function(node, subscriber, ce, filter) {

        _yuitest_coverfunc("build/event-move/event-move.js", "delegate", 165);
_yuitest_coverline("build/event-move/event-move.js", 167);
var se = this;

        _yuitest_coverline("build/event-move/event-move.js", 169);
subscriber[_DEL_MOVE_START_HANDLE] = node.delegate(EVENT[START],
            function(e) {
                _yuitest_coverfunc("build/event-move/event-move.js", "(anonymous 2)", 170);
_yuitest_coverline("build/event-move/event-move.js", 171);
se._onStart(e, node, subscriber, ce, true);
            },
            filter);
    },

    detachDelegate : function(node, subscriber, ce, filter) {
        _yuitest_coverfunc("build/event-move/event-move.js", "detachDelegate", 176);
_yuitest_coverline("build/event-move/event-move.js", 177);
var handle = subscriber[_DEL_MOVE_START_HANDLE];

        _yuitest_coverline("build/event-move/event-move.js", 179);
if (handle) {
            _yuitest_coverline("build/event-move/event-move.js", 180);
handle.detach();
            _yuitest_coverline("build/event-move/event-move.js", 181);
subscriber[_DEL_MOVE_START_HANDLE] = null;
        }

        _yuitest_coverline("build/event-move/event-move.js", 184);
_unsetTouchActions(node);
    },

    detach: function (node, subscriber, ce) {
        _yuitest_coverfunc("build/event-move/event-move.js", "detach", 187);
_yuitest_coverline("build/event-move/event-move.js", 188);
var startHandle = subscriber[_MOVE_START_HANDLE];

        _yuitest_coverline("build/event-move/event-move.js", 190);
if (startHandle) {
            _yuitest_coverline("build/event-move/event-move.js", 191);
startHandle.detach();
            _yuitest_coverline("build/event-move/event-move.js", 192);
subscriber[_MOVE_START_HANDLE] = null;
        }

        _yuitest_coverline("build/event-move/event-move.js", 195);
_unsetTouchActions(node);
    },

    processArgs : function(args, delegate) {
        _yuitest_coverfunc("build/event-move/event-move.js", "processArgs", 198);
_yuitest_coverline("build/event-move/event-move.js", 199);
var params = _defArgsProcessor(this, args, delegate);

        _yuitest_coverline("build/event-move/event-move.js", 201);
if (!(MIN_TIME in params)) {
            _yuitest_coverline("build/event-move/event-move.js", 202);
params[MIN_TIME] = this.MIN_TIME;
        }

        _yuitest_coverline("build/event-move/event-move.js", 205);
if (!(MIN_DISTANCE in params)) {
            _yuitest_coverline("build/event-move/event-move.js", 206);
params[MIN_DISTANCE] = this.MIN_DISTANCE;
        }

        _yuitest_coverline("build/event-move/event-move.js", 209);
return params;
    },

    _onStart : function(e, node, subscriber, ce, delegate) {

        _yuitest_coverfunc("build/event-move/event-move.js", "_onStart", 212);
_yuitest_coverline("build/event-move/event-move.js", 214);
if (delegate) {
            _yuitest_coverline("build/event-move/event-move.js", 215);
node = e[CURRENT_TARGET];
        }

        _yuitest_coverline("build/event-move/event-move.js", 218);
var params = subscriber._extra,
            fireStart = true,
            minTime = params[MIN_TIME],
            minDistance = params[MIN_DISTANCE],
            button = params.button,
            preventDefault = params[PREVENT_DEFAULT],
            root = _getRoot(node, subscriber),
            startXY;

        _yuitest_coverline("build/event-move/event-move.js", 227);
if (e.touches) {
            _yuitest_coverline("build/event-move/event-move.js", 228);
if (e.touches.length === 1) {
                _yuitest_coverline("build/event-move/event-move.js", 229);
_normTouchFacade(e, e.touches[0], params);
            } else {
                _yuitest_coverline("build/event-move/event-move.js", 231);
fireStart = false;
            }
        } else {
            _yuitest_coverline("build/event-move/event-move.js", 234);
fireStart = (button === undefined) || (button === e.button);
        }


        _yuitest_coverline("build/event-move/event-move.js", 238);
if (fireStart) {

            _yuitest_coverline("build/event-move/event-move.js", 240);
_prevent(e, preventDefault);

            _yuitest_coverline("build/event-move/event-move.js", 242);
if (minTime === 0 || minDistance === 0) {
                _yuitest_coverline("build/event-move/event-move.js", 243);
this._start(e, node, ce, params);

            } else {

                _yuitest_coverline("build/event-move/event-move.js", 247);
startXY = [e.pageX, e.pageY];

                _yuitest_coverline("build/event-move/event-move.js", 249);
if (minTime > 0) {


                    _yuitest_coverline("build/event-move/event-move.js", 252);
params._ht = Y.later(minTime, this, this._start, [e, node, ce, params]);

                    _yuitest_coverline("build/event-move/event-move.js", 254);
params._hme = root.on(EVENT[END], Y.bind(function() {
                        _yuitest_coverfunc("build/event-move/event-move.js", "(anonymous 3)", 254);
_yuitest_coverline("build/event-move/event-move.js", 255);
this._cancel(params);
                    }, this));
                }

                _yuitest_coverline("build/event-move/event-move.js", 259);
if (minDistance > 0) {


                    _yuitest_coverline("build/event-move/event-move.js", 262);
params._hm = root.on(EVENT[MOVE], Y.bind(function(em) {
                        _yuitest_coverfunc("build/event-move/event-move.js", "(anonymous 4)", 262);
_yuitest_coverline("build/event-move/event-move.js", 263);
if (Math.abs(em.pageX - startXY[0]) > minDistance || Math.abs(em.pageY - startXY[1]) > minDistance) {
                            _yuitest_coverline("build/event-move/event-move.js", 264);
this._start(e, node, ce, params);
                        }
                    }, this));
                }
            }
        }
    },

    _cancel : function(params) {
        _yuitest_coverfunc("build/event-move/event-move.js", "_cancel", 272);
_yuitest_coverline("build/event-move/event-move.js", 273);
if (params._ht) {
            _yuitest_coverline("build/event-move/event-move.js", 274);
params._ht.cancel();
            _yuitest_coverline("build/event-move/event-move.js", 275);
params._ht = null;
        }
        _yuitest_coverline("build/event-move/event-move.js", 277);
if (params._hme) {
            _yuitest_coverline("build/event-move/event-move.js", 278);
params._hme.detach();
            _yuitest_coverline("build/event-move/event-move.js", 279);
params._hme = null;
        }
        _yuitest_coverline("build/event-move/event-move.js", 281);
if (params._hm) {
            _yuitest_coverline("build/event-move/event-move.js", 282);
params._hm.detach();
            _yuitest_coverline("build/event-move/event-move.js", 283);
params._hm = null;
        }
    },

    _start : function(e, node, ce, params) {

        _yuitest_coverfunc("build/event-move/event-move.js", "_start", 287);
_yuitest_coverline("build/event-move/event-move.js", 289);
if (params) {
            _yuitest_coverline("build/event-move/event-move.js", 290);
this._cancel(params);
        }

        _yuitest_coverline("build/event-move/event-move.js", 293);
e.type = GESTURE_MOVE_START;


        _yuitest_coverline("build/event-move/event-move.js", 296);
node.setData(_MOVE_START, e);
        _yuitest_coverline("build/event-move/event-move.js", 297);
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
_yuitest_coverline("build/event-move/event-move.js", 338);
define(GESTURE_MOVE, {

    on : function (node, subscriber, ce) {
        _yuitest_coverfunc("build/event-move/event-move.js", "on", 340);
_yuitest_coverline("build/event-move/event-move.js", 341);
var root = _getRoot(node, subscriber, EVENT[MOVE]),

            moveHandle = root.on(EVENT[MOVE],
                this._onMove,
                this,
                node,
                subscriber,
                ce);

        _yuitest_coverline("build/event-move/event-move.js", 350);
subscriber[_MOVE_HANDLE] = moveHandle;

    },

    delegate : function(node, subscriber, ce, filter) {

        _yuitest_coverfunc("build/event-move/event-move.js", "delegate", 354);
_yuitest_coverline("build/event-move/event-move.js", 356);
var se = this;

        _yuitest_coverline("build/event-move/event-move.js", 358);
subscriber[_DEL_MOVE_HANDLE] = node.delegate(EVENT[MOVE],
            function(e) {
                _yuitest_coverfunc("build/event-move/event-move.js", "(anonymous 5)", 359);
_yuitest_coverline("build/event-move/event-move.js", 360);
se._onMove(e, node, subscriber, ce, true);
            },
            filter);
    },

    detach : function (node, subscriber, ce) {
        _yuitest_coverfunc("build/event-move/event-move.js", "detach", 365);
_yuitest_coverline("build/event-move/event-move.js", 366);
var moveHandle = subscriber[_MOVE_HANDLE];

        _yuitest_coverline("build/event-move/event-move.js", 368);
if (moveHandle) {
            _yuitest_coverline("build/event-move/event-move.js", 369);
moveHandle.detach();
            _yuitest_coverline("build/event-move/event-move.js", 370);
subscriber[_MOVE_HANDLE] = null;
        }

        _yuitest_coverline("build/event-move/event-move.js", 373);
_unsetTouchActions(node);
    },

    detachDelegate : function(node, subscriber, ce, filter) {
        _yuitest_coverfunc("build/event-move/event-move.js", "detachDelegate", 376);
_yuitest_coverline("build/event-move/event-move.js", 377);
var handle = subscriber[_DEL_MOVE_HANDLE];

        _yuitest_coverline("build/event-move/event-move.js", 379);
if (handle) {
            _yuitest_coverline("build/event-move/event-move.js", 380);
handle.detach();
            _yuitest_coverline("build/event-move/event-move.js", 381);
subscriber[_DEL_MOVE_HANDLE] = null;
        }

        _yuitest_coverline("build/event-move/event-move.js", 384);
_unsetTouchActions(node);

    },

    processArgs : function(args, delegate) {
        _yuitest_coverfunc("build/event-move/event-move.js", "processArgs", 388);
_yuitest_coverline("build/event-move/event-move.js", 389);
return _defArgsProcessor(this, args, delegate);
    },

    _onMove : function(e, node, subscriber, ce, delegate) {

        _yuitest_coverfunc("build/event-move/event-move.js", "_onMove", 392);
_yuitest_coverline("build/event-move/event-move.js", 394);
if (delegate) {
            _yuitest_coverline("build/event-move/event-move.js", 395);
node = e[CURRENT_TARGET];
        }

        _yuitest_coverline("build/event-move/event-move.js", 398);
var fireMove = subscriber._extra.standAlone || node.getData(_MOVE_START),
            preventDefault = subscriber._extra.preventDefault;


        _yuitest_coverline("build/event-move/event-move.js", 402);
if (fireMove) {

            _yuitest_coverline("build/event-move/event-move.js", 404);
if (e.touches) {
                _yuitest_coverline("build/event-move/event-move.js", 405);
if (e.touches.length === 1) {
                    _yuitest_coverline("build/event-move/event-move.js", 406);
_normTouchFacade(e, e.touches[0]);
                } else {
                    _yuitest_coverline("build/event-move/event-move.js", 408);
fireMove = false;
                }
            }

            _yuitest_coverline("build/event-move/event-move.js", 412);
if (fireMove) {

                _yuitest_coverline("build/event-move/event-move.js", 414);
_prevent(e, preventDefault);


                _yuitest_coverline("build/event-move/event-move.js", 417);
e.type = GESTURE_MOVE;
                _yuitest_coverline("build/event-move/event-move.js", 418);
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
_yuitest_coverline("build/event-move/event-move.js", 460);
define(GESTURE_MOVE_END, {

    on : function (node, subscriber, ce) {

        _yuitest_coverfunc("build/event-move/event-move.js", "on", 462);
_yuitest_coverline("build/event-move/event-move.js", 464);
var root = _getRoot(node, subscriber),

            endHandle = root.on(EVENT[END],
                this._onEnd,
                this,
                node,
                subscriber,
                ce);

        _yuitest_coverline("build/event-move/event-move.js", 473);
subscriber[_MOVE_END_HANDLE] = endHandle;
    },

    delegate : function(node, subscriber, ce, filter) {

        _yuitest_coverfunc("build/event-move/event-move.js", "delegate", 476);
_yuitest_coverline("build/event-move/event-move.js", 478);
var se = this;

        _yuitest_coverline("build/event-move/event-move.js", 480);
subscriber[_DEL_MOVE_END_HANDLE] = node.delegate(EVENT[END],
            function(e) {
                _yuitest_coverfunc("build/event-move/event-move.js", "(anonymous 6)", 481);
_yuitest_coverline("build/event-move/event-move.js", 482);
se._onEnd(e, node, subscriber, ce, true);
            },
            filter);
    },

    detachDelegate : function(node, subscriber, ce, filter) {
        _yuitest_coverfunc("build/event-move/event-move.js", "detachDelegate", 487);
_yuitest_coverline("build/event-move/event-move.js", 488);
var handle = subscriber[_DEL_MOVE_END_HANDLE];

        _yuitest_coverline("build/event-move/event-move.js", 490);
if (handle) {
            _yuitest_coverline("build/event-move/event-move.js", 491);
handle.detach();
            _yuitest_coverline("build/event-move/event-move.js", 492);
subscriber[_DEL_MOVE_END_HANDLE] = null;
        }

        _yuitest_coverline("build/event-move/event-move.js", 495);
_unsetTouchActions(node);

    },

    detach : function (node, subscriber, ce) {
        _yuitest_coverfunc("build/event-move/event-move.js", "detach", 499);
_yuitest_coverline("build/event-move/event-move.js", 500);
var endHandle = subscriber[_MOVE_END_HANDLE];

        _yuitest_coverline("build/event-move/event-move.js", 502);
if (endHandle) {
            _yuitest_coverline("build/event-move/event-move.js", 503);
endHandle.detach();
            _yuitest_coverline("build/event-move/event-move.js", 504);
subscriber[_MOVE_END_HANDLE] = null;
        }

        _yuitest_coverline("build/event-move/event-move.js", 507);
_unsetTouchActions(node);
    },

    processArgs : function(args, delegate) {
        _yuitest_coverfunc("build/event-move/event-move.js", "processArgs", 510);
_yuitest_coverline("build/event-move/event-move.js", 511);
return _defArgsProcessor(this, args, delegate);
    },

    _onEnd : function(e, node, subscriber, ce, delegate) {

        _yuitest_coverfunc("build/event-move/event-move.js", "_onEnd", 514);
_yuitest_coverline("build/event-move/event-move.js", 516);
if (delegate) {
            _yuitest_coverline("build/event-move/event-move.js", 517);
node = e[CURRENT_TARGET];
        }

        _yuitest_coverline("build/event-move/event-move.js", 520);
var fireMoveEnd = subscriber._extra.standAlone || node.getData(_MOVE) || node.getData(_MOVE_START),
            preventDefault = subscriber._extra.preventDefault;

        _yuitest_coverline("build/event-move/event-move.js", 523);
if (fireMoveEnd) {

            _yuitest_coverline("build/event-move/event-move.js", 525);
if (e.changedTouches) {
                _yuitest_coverline("build/event-move/event-move.js", 526);
if (e.changedTouches.length === 1) {
                    _yuitest_coverline("build/event-move/event-move.js", 527);
_normTouchFacade(e, e.changedTouches[0]);
                } else {
                    _yuitest_coverline("build/event-move/event-move.js", 529);
fireMoveEnd = false;
                }
            }

            _yuitest_coverline("build/event-move/event-move.js", 533);
if (fireMoveEnd) {

                _yuitest_coverline("build/event-move/event-move.js", 535);
_prevent(e, preventDefault);

                _yuitest_coverline("build/event-move/event-move.js", 537);
e.type = GESTURE_MOVE_END;
                _yuitest_coverline("build/event-move/event-move.js", 538);
ce.fire(e);

                _yuitest_coverline("build/event-move/event-move.js", 540);
node.clearData(_MOVE_START);
                _yuitest_coverline("build/event-move/event-move.js", 541);
node.clearData(_MOVE);
            }
        }
    },

    PREVENT_DEFAULT : false
});


}, '@VERSION@', {"requires": ["node-base", "event-touch", "event-synthetic"]});
