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
_yuitest_coverage["build/event-move/event-move.js"].code=["YUI.add('event-move', function (Y, NAME) {","","/**"," * Adds lower level support for \"gesturemovestart\", \"gesturemove\" and \"gesturemoveend\" events, which can be used to create drag/drop"," * interactions which work across touch and mouse input devices. They correspond to \"touchstart\", \"touchmove\" and \"touchend\" on a touch input"," * device, and \"mousedown\", \"mousemove\", \"mouseup\" on a mouse based input device."," *"," * <p>Documentation for the gesturemove triplet of events can be found on the <a href=\"../classes/YUI.html#event_gesturemove\">YUI</a> global,"," * along with the other supported events.</p>"," *"," * @module event-gestures"," * @submodule event-move"," */","",""," var GESTURE_MAP = Y.Event._GESTURE_MAP,","     EVENT = {","         start: GESTURE_MAP.start,","         end: GESTURE_MAP.end,","         move: GESTURE_MAP.move","     },","    START = \"start\",","    MOVE = \"move\",","    END = \"end\",","","    GESTURE_MOVE = \"gesture\" + MOVE,","    GESTURE_MOVE_END = GESTURE_MOVE + END,","    GESTURE_MOVE_START = GESTURE_MOVE + START,","","    _MOVE_START_HANDLE = \"_msh\",","    _MOVE_HANDLE = \"_mh\",","    _MOVE_END_HANDLE = \"_meh\",","","    _DEL_MOVE_START_HANDLE = \"_dmsh\",","    _DEL_MOVE_HANDLE = \"_dmh\",","    _DEL_MOVE_END_HANDLE = \"_dmeh\",","","    _MOVE_START = \"_ms\",","    _MOVE = \"_m\",","","    MIN_TIME = \"minTime\",","    MIN_DISTANCE = \"minDistance\",","    PREVENT_DEFAULT = \"preventDefault\",","    BUTTON = \"button\",","    OWNER_DOCUMENT = \"ownerDocument\",","","    CURRENT_TARGET = \"currentTarget\",","    TARGET = \"target\",","","    NODE_TYPE = \"nodeType\",","","    SUPPORTS_POINTER = Y.config.win && (\"msPointerEnabled\" in Y.config.win.navigator),","    TOUCH_ACTION_COUNT = {},","    ORIG_TOUCH_ACTION = {},","","    _defArgsProcessor = function(se, args, delegate) {","        var iConfig = (delegate) ? 4 : 3,","            config = (args.length > iConfig) ? Y.merge(args.splice(iConfig,1)[0]) : {};","","        if (!(PREVENT_DEFAULT in config)) {","            config[PREVENT_DEFAULT] = se.PREVENT_DEFAULT;","        }","","        return config;","    },","","    _getRoot = function(node, subscriber) {","        return subscriber._extra.root || (node.get(NODE_TYPE) === 9) ? node : node.get(OWNER_DOCUMENT);","    },","","    //Checks to see if the node is the document, and if it is, returns the documentElement.","    _checkDocumentElem = function(node) {","        var elem = node.getDOMNode();","        if (node.compareTo(Y.config.doc) && elem.documentElement) {","            return elem.documentElement;","        }","        else {","            return false;","        }","    },","","    _normTouchFacade = function(touchFacade, touch, params) {","        touchFacade.pageX = touch.pageX;","        touchFacade.pageY = touch.pageY;","        touchFacade.screenX = touch.screenX;","        touchFacade.screenY = touch.screenY;","        touchFacade.clientX = touch.clientX;","        touchFacade.clientY = touch.clientY;","        touchFacade[TARGET] = touchFacade[TARGET] || touch[TARGET];","        touchFacade[CURRENT_TARGET] = touchFacade[CURRENT_TARGET] || touch[CURRENT_TARGET];","","        touchFacade[BUTTON] = (params && params[BUTTON]) || 1; // default to left (left as per vendors, not W3C which is 0)","    },","","    /*","    In IE10 touch mode, gestures will not work properly unless the -ms-touch-action CSS property is set to something other than 'auto'. Read http://msdn.microsoft.com/en-us/library/windows/apps/hh767313.aspx for more info. To get around this, we set -ms-touch-action: none which is the same as e.preventDefault() on touch environments. This tells the browser to fire DOM events for all touch events, and not perform any default behavior.","","    The user can over-ride this by setting a more lenient -ms-touch-action property on a node (such as pan-x, pan-y, etc.) via CSS when subscribing to the 'gesturemovestart' event.","    */","    _setTouchActions = function (node) {","        var elem = _checkDocumentElem(node) || node.getDOMNode(),","            id = node.get('id');","","        //Checks to see if MSPointer events are supported.","        if (SUPPORTS_POINTER) {","","            if (!TOUCH_ACTION_COUNT[id]) {","                TOUCH_ACTION_COUNT[id] = 0;","                ORIG_TOUCH_ACTION[id] = elem.style.msTouchAction;","            }","            elem.style.msTouchAction = Y.Event._DEFAULT_TOUCH_ACTION;","            TOUCH_ACTION_COUNT[id]++;","        }","    },","","    /*","    Resets the element's -ms-touch-action property back to the original value, This is called on detach() and detachDelegate().","    */","    _unsetTouchActions = function (node) {","        var elem = _checkDocumentElem(node) || node.getDOMNode(),","            id = node.get('id');","","        if (SUPPORTS_POINTER) {","            TOUCH_ACTION_COUNT[id]--;","            if (TOUCH_ACTION_COUNT[id] === 0 && elem.style.msTouchAction !== ORIG_TOUCH_ACTION[id]) {","                elem.style.msTouchAction = ORIG_TOUCH_ACTION[id];","            }","        }","    },","","    _prevent = function(e, preventDefault) {","        if (preventDefault) {","            // preventDefault is a boolean or a function","            if (!preventDefault.call || preventDefault(e)) {","                e.preventDefault();","            }","        }","    },","","    define = Y.Event.define;","    Y.Event._DEFAULT_TOUCH_ACTION = 'none';","","/**"," * Sets up a \"gesturemovestart\" event, that is fired on touch devices in response to a single finger \"touchstart\","," * and on mouse based devices in response to a \"mousedown\". The subscriber can specify the minimum time"," * and distance thresholds which should be crossed before the \"gesturemovestart\" is fired and for the mouse,"," * which button should initiate a \"gesturemovestart\". This event can also be listened for using node.delegate()."," *"," * <p>It is recommended that you use Y.bind to set up context and additional arguments for your event handler,"," * however if you want to pass the context and arguments as additional signature arguments to on/delegate,"," * you need to provide a null value for the configuration object, e.g: <code>node.on(\"gesturemovestart\", fn, null, context, arg1, arg2, arg3)</code></p>"," *"," * @event gesturemovestart"," * @for YUI"," * @param type {string} \"gesturemovestart\""," * @param fn {function} The method the event invokes. It receives the event facade of the underlying DOM event (mousedown or touchstart.touches[0]) which contains position co-ordinates."," * @param cfg {Object} Optional. An object which specifies:"," *"," * <dl>"," * <dt>minDistance (defaults to 0)</dt>"," * <dd>The minimum distance threshold which should be crossed before the gesturemovestart is fired</dd>"," * <dt>minTime (defaults to 0)</dt>"," * <dd>The minimum time threshold for which the finger/mouse should be help down before the gesturemovestart is fired</dd>"," * <dt>button (no default)</dt>"," * <dd>In the case of a mouse input device, if the event should only be fired for a specific mouse button.</dd>"," * <dt>preventDefault (defaults to false)</dt>"," * <dd>Can be set to true/false to prevent default behavior as soon as the touchstart or mousedown is received (that is before minTime or minDistance thresholds are crossed, and so before the gesturemovestart listener is notified) so that things like text selection and context popups (on touch devices) can be"," * prevented. This property can also be set to a function, which returns true or false, based on the event facade passed to it (for example, DragDrop can determine if the target is a valid handle or not before preventing default).</dd>"," * </dl>"," *"," * @return {EventHandle} the detach handle"," */","","define(GESTURE_MOVE_START, {","","    on: function (node, subscriber, ce) {","","        //Set -ms-touch-action on IE10 and set preventDefault to true","        _setTouchActions(node);","","        subscriber[_MOVE_START_HANDLE] = node.on(EVENT[START],","            this._onStart,","            this,","            node,","            subscriber,","            ce);","    },","","    delegate : function(node, subscriber, ce, filter) {","","        var se = this;","","        subscriber[_DEL_MOVE_START_HANDLE] = node.delegate(EVENT[START],","            function(e) {","                se._onStart(e, node, subscriber, ce, true);","            },","            filter);","    },","","    detachDelegate : function(node, subscriber, ce, filter) {","        var handle = subscriber[_DEL_MOVE_START_HANDLE];","","        if (handle) {","            handle.detach();","            subscriber[_DEL_MOVE_START_HANDLE] = null;","        }","","        _unsetTouchActions(node);","    },","","    detach: function (node, subscriber, ce) {","        var startHandle = subscriber[_MOVE_START_HANDLE];","","        if (startHandle) {","            startHandle.detach();","            subscriber[_MOVE_START_HANDLE] = null;","        }","","        _unsetTouchActions(node);","    },","","    processArgs : function(args, delegate) {","        var params = _defArgsProcessor(this, args, delegate);","","        if (!(MIN_TIME in params)) {","            params[MIN_TIME] = this.MIN_TIME;","        }","","        if (!(MIN_DISTANCE in params)) {","            params[MIN_DISTANCE] = this.MIN_DISTANCE;","        }","","        return params;","    },","","    _onStart : function(e, node, subscriber, ce, delegate) {","","        if (delegate) {","            node = e[CURRENT_TARGET];","        }","","        var params = subscriber._extra,","            fireStart = true,","            minTime = params[MIN_TIME],","            minDistance = params[MIN_DISTANCE],","            button = params.button,","            preventDefault = params[PREVENT_DEFAULT],","            root = _getRoot(node, subscriber),","            startXY;","","        if (e.touches) {","            if (e.touches.length === 1) {","                _normTouchFacade(e, e.touches[0], params);","            } else {","                fireStart = false;","            }","        } else {","            fireStart = (button === undefined) || (button === e.button);","        }","","","        if (fireStart) {","","            _prevent(e, preventDefault);","","            if (minTime === 0 || minDistance === 0) {","                this._start(e, node, ce, params);","","            } else {","","                startXY = [e.pageX, e.pageY];","","                if (minTime > 0) {","","","                    params._ht = Y.later(minTime, this, this._start, [e, node, ce, params]);","","                    params._hme = root.on(EVENT[END], Y.bind(function() {","                        this._cancel(params);","                    }, this));","                }","","                if (minDistance > 0) {","","","                    params._hm = root.on(EVENT[MOVE], Y.bind(function(em) {","                        if (Math.abs(em.pageX - startXY[0]) > minDistance || Math.abs(em.pageY - startXY[1]) > minDistance) {","                            this._start(e, node, ce, params);","                        }","                    }, this));","                }","            }","        }","    },","","    _cancel : function(params) {","        if (params._ht) {","            params._ht.cancel();","            params._ht = null;","        }","        if (params._hme) {","            params._hme.detach();","            params._hme = null;","        }","        if (params._hm) {","            params._hm.detach();","            params._hm = null;","        }","    },","","    _start : function(e, node, ce, params) {","","        if (params) {","            this._cancel(params);","        }","","        e.type = GESTURE_MOVE_START;","","","        node.setData(_MOVE_START, e);","        ce.fire(e);","    },","","    MIN_TIME : 0,","    MIN_DISTANCE : 0,","    PREVENT_DEFAULT : false","});","","/**"," * Sets up a \"gesturemove\" event, that is fired on touch devices in response to a single finger \"touchmove\","," * and on mouse based devices in response to a \"mousemove\"."," *"," * <p>By default this event is only fired when the same node"," * has received a \"gesturemovestart\" event. The subscriber can set standAlone to true, in the configuration properties,"," * if they want to listen for this event without an initial \"gesturemovestart\".</p>"," *"," * <p>By default this event sets up it's internal \"touchmove\" and \"mousemove\" DOM listeners on the document element. The subscriber"," * can set the root configuration property, to specify which node to attach DOM listeners to, if different from the document.</p>"," *"," * <p>This event can also be listened for using node.delegate().</p>"," *"," * <p>It is recommended that you use Y.bind to set up context and additional arguments for your event handler,"," * however if you want to pass the context and arguments as additional signature arguments to on/delegate,"," * you need to provide a null value for the configuration object, e.g: <code>node.on(\"gesturemove\", fn, null, context, arg1, arg2, arg3)</code></p>"," *"," * @event gesturemove"," * @for YUI"," * @param type {string} \"gesturemove\""," * @param fn {function} The method the event invokes. It receives the event facade of the underlying DOM event (mousemove or touchmove.touches[0]) which contains position co-ordinates."," * @param cfg {Object} Optional. An object which specifies:"," * <dl>"," * <dt>standAlone (defaults to false)</dt>"," * <dd>true, if the subscriber should be notified even if a \"gesturemovestart\" has not occured on the same node.</dd>"," * <dt>root (defaults to document)</dt>"," * <dd>The node to which the internal DOM listeners should be attached.</dd>"," * <dt>preventDefault (defaults to false)</dt>"," * <dd>Can be set to true/false to prevent default behavior as soon as the touchmove or mousemove is received. As with gesturemovestart, can also be set to function which returns true/false based on the event facade passed to it.</dd>"," * </dl>"," *"," * @return {EventHandle} the detach handle"," */","define(GESTURE_MOVE, {","","    on : function (node, subscriber, ce) {","","        _setTouchActions(node);","        var root = _getRoot(node, subscriber, EVENT[MOVE]),","","            moveHandle = root.on(EVENT[MOVE],","                this._onMove,","                this,","                node,","                subscriber,","                ce);","","        subscriber[_MOVE_HANDLE] = moveHandle;","","    },","","    delegate : function(node, subscriber, ce, filter) {","","        var se = this;","","        subscriber[_DEL_MOVE_HANDLE] = node.delegate(EVENT[MOVE],","            function(e) {","                se._onMove(e, node, subscriber, ce, true);","            },","            filter);","    },","","    detach : function (node, subscriber, ce) {","        var moveHandle = subscriber[_MOVE_HANDLE];","","        if (moveHandle) {","            moveHandle.detach();","            subscriber[_MOVE_HANDLE] = null;","        }","","        _unsetTouchActions(node);","    },","","    detachDelegate : function(node, subscriber, ce, filter) {","        var handle = subscriber[_DEL_MOVE_HANDLE];","","        if (handle) {","            handle.detach();","            subscriber[_DEL_MOVE_HANDLE] = null;","        }","","        _unsetTouchActions(node);","","    },","","    processArgs : function(args, delegate) {","        return _defArgsProcessor(this, args, delegate);","    },","","    _onMove : function(e, node, subscriber, ce, delegate) {","","        if (delegate) {","            node = e[CURRENT_TARGET];","        }","","        var fireMove = subscriber._extra.standAlone || node.getData(_MOVE_START),","            preventDefault = subscriber._extra.preventDefault;","","","        if (fireMove) {","","            if (e.touches) {","                if (e.touches.length === 1) {","                    _normTouchFacade(e, e.touches[0]);","                } else {","                    fireMove = false;","                }","            }","","            if (fireMove) {","","                _prevent(e, preventDefault);","","","                e.type = GESTURE_MOVE;","                ce.fire(e);","            }","        }","    },","","    PREVENT_DEFAULT : false","});","","/**"," * Sets up a \"gesturemoveend\" event, that is fired on touch devices in response to a single finger \"touchend\","," * and on mouse based devices in response to a \"mouseup\"."," *"," * <p>By default this event is only fired when the same node"," * has received a \"gesturemove\" or \"gesturemovestart\" event. The subscriber can set standAlone to true, in the configuration properties,"," * if they want to listen for this event without a preceding \"gesturemovestart\" or \"gesturemove\".</p>"," *"," * <p>By default this event sets up it's internal \"touchend\" and \"mouseup\" DOM listeners on the document element. The subscriber"," * can set the root configuration property, to specify which node to attach DOM listeners to, if different from the document.</p>"," *"," * <p>This event can also be listened for using node.delegate().</p>"," *"," * <p>It is recommended that you use Y.bind to set up context and additional arguments for your event handler,"," * however if you want to pass the context and arguments as additional signature arguments to on/delegate,"," * you need to provide a null value for the configuration object, e.g: <code>node.on(\"gesturemoveend\", fn, null, context, arg1, arg2, arg3)</code></p>"," *"," *"," * @event gesturemoveend"," * @for YUI"," * @param type {string} \"gesturemoveend\""," * @param fn {function} The method the event invokes. It receives the event facade of the underlying DOM event (mouseup or touchend.changedTouches[0])."," * @param cfg {Object} Optional. An object which specifies:"," * <dl>"," * <dt>standAlone (defaults to false)</dt>"," * <dd>true, if the subscriber should be notified even if a \"gesturemovestart\" or \"gesturemove\" has not occured on the same node.</dd>"," * <dt>root (defaults to document)</dt>"," * <dd>The node to which the internal DOM listeners should be attached.</dd>"," * <dt>preventDefault (defaults to false)</dt>"," * <dd>Can be set to true/false to prevent default behavior as soon as the touchend or mouseup is received. As with gesturemovestart, can also be set to function which returns true/false based on the event facade passed to it.</dd>"," * </dl>"," *"," * @return {EventHandle} the detach handle"," */","define(GESTURE_MOVE_END, {","","    on : function (node, subscriber, ce) {","        _setTouchActions(node);","        var root = _getRoot(node, subscriber),","","            endHandle = root.on(EVENT[END],","                this._onEnd,","                this,","                node,","                subscriber,","                ce);","","        subscriber[_MOVE_END_HANDLE] = endHandle;","    },","","    delegate : function(node, subscriber, ce, filter) {","","        var se = this;","","        subscriber[_DEL_MOVE_END_HANDLE] = node.delegate(EVENT[END],","            function(e) {","                se._onEnd(e, node, subscriber, ce, true);","            },","            filter);","    },","","    detachDelegate : function(node, subscriber, ce, filter) {","        var handle = subscriber[_DEL_MOVE_END_HANDLE];","","        if (handle) {","            handle.detach();","            subscriber[_DEL_MOVE_END_HANDLE] = null;","        }","","        _unsetTouchActions(node);","","    },","","    detach : function (node, subscriber, ce) {","        var endHandle = subscriber[_MOVE_END_HANDLE];","","        if (endHandle) {","            endHandle.detach();","            subscriber[_MOVE_END_HANDLE] = null;","        }","","        _unsetTouchActions(node);","    },","","    processArgs : function(args, delegate) {","        return _defArgsProcessor(this, args, delegate);","    },","","    _onEnd : function(e, node, subscriber, ce, delegate) {","","        if (delegate) {","            node = e[CURRENT_TARGET];","        }","","        var fireMoveEnd = subscriber._extra.standAlone || node.getData(_MOVE) || node.getData(_MOVE_START),","            preventDefault = subscriber._extra.preventDefault;","","        if (fireMoveEnd) {","","            if (e.changedTouches) {","                if (e.changedTouches.length === 1) {","                    _normTouchFacade(e, e.changedTouches[0]);","                } else {","                    fireMoveEnd = false;","                }","            }","","            if (fireMoveEnd) {","","                _prevent(e, preventDefault);","","                e.type = GESTURE_MOVE_END;","                ce.fire(e);","","                node.clearData(_MOVE_START);","                node.clearData(_MOVE);","            }","        }","    },","","    PREVENT_DEFAULT : false","});","","","}, '@VERSION@', {\"requires\": [\"node-base\", \"event-touch\", \"event-synthetic\"]});"];
_yuitest_coverage["build/event-move/event-move.js"].lines = {"1":0,"16":0,"57":0,"60":0,"61":0,"64":0,"68":0,"73":0,"74":0,"75":0,"78":0,"83":0,"84":0,"85":0,"86":0,"87":0,"88":0,"89":0,"90":0,"92":0,"101":0,"105":0,"107":0,"108":0,"109":0,"111":0,"112":0,"120":0,"123":0,"124":0,"125":0,"126":0,"132":0,"134":0,"135":0,"141":0,"174":0,"179":0,"181":0,"191":0,"193":0,"195":0,"201":0,"203":0,"204":0,"205":0,"208":0,"212":0,"214":0,"215":0,"216":0,"219":0,"223":0,"225":0,"226":0,"229":0,"230":0,"233":0,"238":0,"239":0,"242":0,"251":0,"252":0,"253":0,"255":0,"258":0,"262":0,"264":0,"266":0,"267":0,"271":0,"273":0,"276":0,"278":0,"279":0,"283":0,"286":0,"287":0,"288":0,"297":0,"298":0,"299":0,"301":0,"302":0,"303":0,"305":0,"306":0,"307":0,"313":0,"314":0,"317":0,"320":0,"321":0,"362":0,"366":0,"367":0,"376":0,"382":0,"384":0,"386":0,"392":0,"394":0,"395":0,"396":0,"399":0,"403":0,"405":0,"406":0,"407":0,"410":0,"415":0,"420":0,"421":0,"424":0,"428":0,"430":0,"431":0,"432":0,"434":0,"438":0,"440":0,"443":0,"444":0,"486":0,"489":0,"490":0,"499":0,"504":0,"506":0,"508":0,"514":0,"516":0,"517":0,"518":0,"521":0,"526":0,"528":0,"529":0,"530":0,"533":0,"537":0,"542":0,"543":0,"546":0,"549":0,"551":0,"552":0,"553":0,"555":0,"559":0,"561":0,"563":0,"564":0,"566":0,"567":0};
_yuitest_coverage["build/event-move/event-move.js"].functions = {"_defArgsProcessor:56":0,"_getRoot:67":0,"_checkDocumentElem:72":0,"_normTouchFacade:82":0,"_setTouchActions:100":0,"_unsetTouchActions:119":0,"_prevent:131":0,"on:176":0,"(anonymous 2):194":0,"delegate:189":0,"detachDelegate:200":0,"detach:211":0,"processArgs:222":0,"(anonymous 3):278":0,"(anonymous 4):286":0,"_onStart:236":0,"_cancel:296":0,"_start:311":0,"on:364":0,"(anonymous 5):385":0,"delegate:380":0,"detach:391":0,"detachDelegate:402":0,"processArgs:414":0,"_onMove:418":0,"on:488":0,"(anonymous 6):507":0,"delegate:502":0,"detachDelegate:513":0,"detach:525":0,"processArgs:536":0,"_onEnd:540":0,"(anonymous 1):1":0};
_yuitest_coverage["build/event-move/event-move.js"].coveredLines = 155;
_yuitest_coverage["build/event-move/event-move.js"].coveredFunctions = 33;
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
_yuitest_coverline("build/event-move/event-move.js", 16);
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
    TOUCH_ACTION_COUNT = {},
    ORIG_TOUCH_ACTION = {},

    _defArgsProcessor = function(se, args, delegate) {
        _yuitest_coverfunc("build/event-move/event-move.js", "_defArgsProcessor", 56);
_yuitest_coverline("build/event-move/event-move.js", 57);
var iConfig = (delegate) ? 4 : 3,
            config = (args.length > iConfig) ? Y.merge(args.splice(iConfig,1)[0]) : {};

        _yuitest_coverline("build/event-move/event-move.js", 60);
if (!(PREVENT_DEFAULT in config)) {
            _yuitest_coverline("build/event-move/event-move.js", 61);
config[PREVENT_DEFAULT] = se.PREVENT_DEFAULT;
        }

        _yuitest_coverline("build/event-move/event-move.js", 64);
return config;
    },

    _getRoot = function(node, subscriber) {
        _yuitest_coverfunc("build/event-move/event-move.js", "_getRoot", 67);
_yuitest_coverline("build/event-move/event-move.js", 68);
return subscriber._extra.root || (node.get(NODE_TYPE) === 9) ? node : node.get(OWNER_DOCUMENT);
    },

    //Checks to see if the node is the document, and if it is, returns the documentElement.
    _checkDocumentElem = function(node) {
        _yuitest_coverfunc("build/event-move/event-move.js", "_checkDocumentElem", 72);
_yuitest_coverline("build/event-move/event-move.js", 73);
var elem = node.getDOMNode();
        _yuitest_coverline("build/event-move/event-move.js", 74);
if (node.compareTo(Y.config.doc) && elem.documentElement) {
            _yuitest_coverline("build/event-move/event-move.js", 75);
return elem.documentElement;
        }
        else {
            _yuitest_coverline("build/event-move/event-move.js", 78);
return false;
        }
    },

    _normTouchFacade = function(touchFacade, touch, params) {
        _yuitest_coverfunc("build/event-move/event-move.js", "_normTouchFacade", 82);
_yuitest_coverline("build/event-move/event-move.js", 83);
touchFacade.pageX = touch.pageX;
        _yuitest_coverline("build/event-move/event-move.js", 84);
touchFacade.pageY = touch.pageY;
        _yuitest_coverline("build/event-move/event-move.js", 85);
touchFacade.screenX = touch.screenX;
        _yuitest_coverline("build/event-move/event-move.js", 86);
touchFacade.screenY = touch.screenY;
        _yuitest_coverline("build/event-move/event-move.js", 87);
touchFacade.clientX = touch.clientX;
        _yuitest_coverline("build/event-move/event-move.js", 88);
touchFacade.clientY = touch.clientY;
        _yuitest_coverline("build/event-move/event-move.js", 89);
touchFacade[TARGET] = touchFacade[TARGET] || touch[TARGET];
        _yuitest_coverline("build/event-move/event-move.js", 90);
touchFacade[CURRENT_TARGET] = touchFacade[CURRENT_TARGET] || touch[CURRENT_TARGET];

        _yuitest_coverline("build/event-move/event-move.js", 92);
touchFacade[BUTTON] = (params && params[BUTTON]) || 1; // default to left (left as per vendors, not W3C which is 0)
    },

    /*
    In IE10 touch mode, gestures will not work properly unless the -ms-touch-action CSS property is set to something other than 'auto'. Read http://msdn.microsoft.com/en-us/library/windows/apps/hh767313.aspx for more info. To get around this, we set -ms-touch-action: none which is the same as e.preventDefault() on touch environments. This tells the browser to fire DOM events for all touch events, and not perform any default behavior.

    The user can over-ride this by setting a more lenient -ms-touch-action property on a node (such as pan-x, pan-y, etc.) via CSS when subscribing to the 'gesturemovestart' event.
    */
    _setTouchActions = function (node) {
        _yuitest_coverfunc("build/event-move/event-move.js", "_setTouchActions", 100);
_yuitest_coverline("build/event-move/event-move.js", 101);
var elem = _checkDocumentElem(node) || node.getDOMNode(),
            id = node.get('id');

        //Checks to see if MSPointer events are supported.
        _yuitest_coverline("build/event-move/event-move.js", 105);
if (SUPPORTS_POINTER) {

            _yuitest_coverline("build/event-move/event-move.js", 107);
if (!TOUCH_ACTION_COUNT[id]) {
                _yuitest_coverline("build/event-move/event-move.js", 108);
TOUCH_ACTION_COUNT[id] = 0;
                _yuitest_coverline("build/event-move/event-move.js", 109);
ORIG_TOUCH_ACTION[id] = elem.style.msTouchAction;
            }
            _yuitest_coverline("build/event-move/event-move.js", 111);
elem.style.msTouchAction = Y.Event._DEFAULT_TOUCH_ACTION;
            _yuitest_coverline("build/event-move/event-move.js", 112);
TOUCH_ACTION_COUNT[id]++;
        }
    },

    /*
    Resets the element's -ms-touch-action property back to the original value, This is called on detach() and detachDelegate().
    */
    _unsetTouchActions = function (node) {
        _yuitest_coverfunc("build/event-move/event-move.js", "_unsetTouchActions", 119);
_yuitest_coverline("build/event-move/event-move.js", 120);
var elem = _checkDocumentElem(node) || node.getDOMNode(),
            id = node.get('id');

        _yuitest_coverline("build/event-move/event-move.js", 123);
if (SUPPORTS_POINTER) {
            _yuitest_coverline("build/event-move/event-move.js", 124);
TOUCH_ACTION_COUNT[id]--;
            _yuitest_coverline("build/event-move/event-move.js", 125);
if (TOUCH_ACTION_COUNT[id] === 0 && elem.style.msTouchAction !== ORIG_TOUCH_ACTION[id]) {
                _yuitest_coverline("build/event-move/event-move.js", 126);
elem.style.msTouchAction = ORIG_TOUCH_ACTION[id];
            }
        }
    },

    _prevent = function(e, preventDefault) {
        _yuitest_coverfunc("build/event-move/event-move.js", "_prevent", 131);
_yuitest_coverline("build/event-move/event-move.js", 132);
if (preventDefault) {
            // preventDefault is a boolean or a function
            _yuitest_coverline("build/event-move/event-move.js", 134);
if (!preventDefault.call || preventDefault(e)) {
                _yuitest_coverline("build/event-move/event-move.js", 135);
e.preventDefault();
            }
        }
    },

    define = Y.Event.define;
    _yuitest_coverline("build/event-move/event-move.js", 141);
Y.Event._DEFAULT_TOUCH_ACTION = 'none';

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

_yuitest_coverline("build/event-move/event-move.js", 174);
define(GESTURE_MOVE_START, {

    on: function (node, subscriber, ce) {

        //Set -ms-touch-action on IE10 and set preventDefault to true
        _yuitest_coverfunc("build/event-move/event-move.js", "on", 176);
_yuitest_coverline("build/event-move/event-move.js", 179);
_setTouchActions(node);

        _yuitest_coverline("build/event-move/event-move.js", 181);
subscriber[_MOVE_START_HANDLE] = node.on(EVENT[START],
            this._onStart,
            this,
            node,
            subscriber,
            ce);
    },

    delegate : function(node, subscriber, ce, filter) {

        _yuitest_coverfunc("build/event-move/event-move.js", "delegate", 189);
_yuitest_coverline("build/event-move/event-move.js", 191);
var se = this;

        _yuitest_coverline("build/event-move/event-move.js", 193);
subscriber[_DEL_MOVE_START_HANDLE] = node.delegate(EVENT[START],
            function(e) {
                _yuitest_coverfunc("build/event-move/event-move.js", "(anonymous 2)", 194);
_yuitest_coverline("build/event-move/event-move.js", 195);
se._onStart(e, node, subscriber, ce, true);
            },
            filter);
    },

    detachDelegate : function(node, subscriber, ce, filter) {
        _yuitest_coverfunc("build/event-move/event-move.js", "detachDelegate", 200);
_yuitest_coverline("build/event-move/event-move.js", 201);
var handle = subscriber[_DEL_MOVE_START_HANDLE];

        _yuitest_coverline("build/event-move/event-move.js", 203);
if (handle) {
            _yuitest_coverline("build/event-move/event-move.js", 204);
handle.detach();
            _yuitest_coverline("build/event-move/event-move.js", 205);
subscriber[_DEL_MOVE_START_HANDLE] = null;
        }

        _yuitest_coverline("build/event-move/event-move.js", 208);
_unsetTouchActions(node);
    },

    detach: function (node, subscriber, ce) {
        _yuitest_coverfunc("build/event-move/event-move.js", "detach", 211);
_yuitest_coverline("build/event-move/event-move.js", 212);
var startHandle = subscriber[_MOVE_START_HANDLE];

        _yuitest_coverline("build/event-move/event-move.js", 214);
if (startHandle) {
            _yuitest_coverline("build/event-move/event-move.js", 215);
startHandle.detach();
            _yuitest_coverline("build/event-move/event-move.js", 216);
subscriber[_MOVE_START_HANDLE] = null;
        }

        _yuitest_coverline("build/event-move/event-move.js", 219);
_unsetTouchActions(node);
    },

    processArgs : function(args, delegate) {
        _yuitest_coverfunc("build/event-move/event-move.js", "processArgs", 222);
_yuitest_coverline("build/event-move/event-move.js", 223);
var params = _defArgsProcessor(this, args, delegate);

        _yuitest_coverline("build/event-move/event-move.js", 225);
if (!(MIN_TIME in params)) {
            _yuitest_coverline("build/event-move/event-move.js", 226);
params[MIN_TIME] = this.MIN_TIME;
        }

        _yuitest_coverline("build/event-move/event-move.js", 229);
if (!(MIN_DISTANCE in params)) {
            _yuitest_coverline("build/event-move/event-move.js", 230);
params[MIN_DISTANCE] = this.MIN_DISTANCE;
        }

        _yuitest_coverline("build/event-move/event-move.js", 233);
return params;
    },

    _onStart : function(e, node, subscriber, ce, delegate) {

        _yuitest_coverfunc("build/event-move/event-move.js", "_onStart", 236);
_yuitest_coverline("build/event-move/event-move.js", 238);
if (delegate) {
            _yuitest_coverline("build/event-move/event-move.js", 239);
node = e[CURRENT_TARGET];
        }

        _yuitest_coverline("build/event-move/event-move.js", 242);
var params = subscriber._extra,
            fireStart = true,
            minTime = params[MIN_TIME],
            minDistance = params[MIN_DISTANCE],
            button = params.button,
            preventDefault = params[PREVENT_DEFAULT],
            root = _getRoot(node, subscriber),
            startXY;

        _yuitest_coverline("build/event-move/event-move.js", 251);
if (e.touches) {
            _yuitest_coverline("build/event-move/event-move.js", 252);
if (e.touches.length === 1) {
                _yuitest_coverline("build/event-move/event-move.js", 253);
_normTouchFacade(e, e.touches[0], params);
            } else {
                _yuitest_coverline("build/event-move/event-move.js", 255);
fireStart = false;
            }
        } else {
            _yuitest_coverline("build/event-move/event-move.js", 258);
fireStart = (button === undefined) || (button === e.button);
        }


        _yuitest_coverline("build/event-move/event-move.js", 262);
if (fireStart) {

            _yuitest_coverline("build/event-move/event-move.js", 264);
_prevent(e, preventDefault);

            _yuitest_coverline("build/event-move/event-move.js", 266);
if (minTime === 0 || minDistance === 0) {
                _yuitest_coverline("build/event-move/event-move.js", 267);
this._start(e, node, ce, params);

            } else {

                _yuitest_coverline("build/event-move/event-move.js", 271);
startXY = [e.pageX, e.pageY];

                _yuitest_coverline("build/event-move/event-move.js", 273);
if (minTime > 0) {


                    _yuitest_coverline("build/event-move/event-move.js", 276);
params._ht = Y.later(minTime, this, this._start, [e, node, ce, params]);

                    _yuitest_coverline("build/event-move/event-move.js", 278);
params._hme = root.on(EVENT[END], Y.bind(function() {
                        _yuitest_coverfunc("build/event-move/event-move.js", "(anonymous 3)", 278);
_yuitest_coverline("build/event-move/event-move.js", 279);
this._cancel(params);
                    }, this));
                }

                _yuitest_coverline("build/event-move/event-move.js", 283);
if (minDistance > 0) {


                    _yuitest_coverline("build/event-move/event-move.js", 286);
params._hm = root.on(EVENT[MOVE], Y.bind(function(em) {
                        _yuitest_coverfunc("build/event-move/event-move.js", "(anonymous 4)", 286);
_yuitest_coverline("build/event-move/event-move.js", 287);
if (Math.abs(em.pageX - startXY[0]) > minDistance || Math.abs(em.pageY - startXY[1]) > minDistance) {
                            _yuitest_coverline("build/event-move/event-move.js", 288);
this._start(e, node, ce, params);
                        }
                    }, this));
                }
            }
        }
    },

    _cancel : function(params) {
        _yuitest_coverfunc("build/event-move/event-move.js", "_cancel", 296);
_yuitest_coverline("build/event-move/event-move.js", 297);
if (params._ht) {
            _yuitest_coverline("build/event-move/event-move.js", 298);
params._ht.cancel();
            _yuitest_coverline("build/event-move/event-move.js", 299);
params._ht = null;
        }
        _yuitest_coverline("build/event-move/event-move.js", 301);
if (params._hme) {
            _yuitest_coverline("build/event-move/event-move.js", 302);
params._hme.detach();
            _yuitest_coverline("build/event-move/event-move.js", 303);
params._hme = null;
        }
        _yuitest_coverline("build/event-move/event-move.js", 305);
if (params._hm) {
            _yuitest_coverline("build/event-move/event-move.js", 306);
params._hm.detach();
            _yuitest_coverline("build/event-move/event-move.js", 307);
params._hm = null;
        }
    },

    _start : function(e, node, ce, params) {

        _yuitest_coverfunc("build/event-move/event-move.js", "_start", 311);
_yuitest_coverline("build/event-move/event-move.js", 313);
if (params) {
            _yuitest_coverline("build/event-move/event-move.js", 314);
this._cancel(params);
        }

        _yuitest_coverline("build/event-move/event-move.js", 317);
e.type = GESTURE_MOVE_START;


        _yuitest_coverline("build/event-move/event-move.js", 320);
node.setData(_MOVE_START, e);
        _yuitest_coverline("build/event-move/event-move.js", 321);
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
_yuitest_coverline("build/event-move/event-move.js", 362);
define(GESTURE_MOVE, {

    on : function (node, subscriber, ce) {

        _yuitest_coverfunc("build/event-move/event-move.js", "on", 364);
_yuitest_coverline("build/event-move/event-move.js", 366);
_setTouchActions(node);
        _yuitest_coverline("build/event-move/event-move.js", 367);
var root = _getRoot(node, subscriber, EVENT[MOVE]),

            moveHandle = root.on(EVENT[MOVE],
                this._onMove,
                this,
                node,
                subscriber,
                ce);

        _yuitest_coverline("build/event-move/event-move.js", 376);
subscriber[_MOVE_HANDLE] = moveHandle;

    },

    delegate : function(node, subscriber, ce, filter) {

        _yuitest_coverfunc("build/event-move/event-move.js", "delegate", 380);
_yuitest_coverline("build/event-move/event-move.js", 382);
var se = this;

        _yuitest_coverline("build/event-move/event-move.js", 384);
subscriber[_DEL_MOVE_HANDLE] = node.delegate(EVENT[MOVE],
            function(e) {
                _yuitest_coverfunc("build/event-move/event-move.js", "(anonymous 5)", 385);
_yuitest_coverline("build/event-move/event-move.js", 386);
se._onMove(e, node, subscriber, ce, true);
            },
            filter);
    },

    detach : function (node, subscriber, ce) {
        _yuitest_coverfunc("build/event-move/event-move.js", "detach", 391);
_yuitest_coverline("build/event-move/event-move.js", 392);
var moveHandle = subscriber[_MOVE_HANDLE];

        _yuitest_coverline("build/event-move/event-move.js", 394);
if (moveHandle) {
            _yuitest_coverline("build/event-move/event-move.js", 395);
moveHandle.detach();
            _yuitest_coverline("build/event-move/event-move.js", 396);
subscriber[_MOVE_HANDLE] = null;
        }

        _yuitest_coverline("build/event-move/event-move.js", 399);
_unsetTouchActions(node);
    },

    detachDelegate : function(node, subscriber, ce, filter) {
        _yuitest_coverfunc("build/event-move/event-move.js", "detachDelegate", 402);
_yuitest_coverline("build/event-move/event-move.js", 403);
var handle = subscriber[_DEL_MOVE_HANDLE];

        _yuitest_coverline("build/event-move/event-move.js", 405);
if (handle) {
            _yuitest_coverline("build/event-move/event-move.js", 406);
handle.detach();
            _yuitest_coverline("build/event-move/event-move.js", 407);
subscriber[_DEL_MOVE_HANDLE] = null;
        }

        _yuitest_coverline("build/event-move/event-move.js", 410);
_unsetTouchActions(node);

    },

    processArgs : function(args, delegate) {
        _yuitest_coverfunc("build/event-move/event-move.js", "processArgs", 414);
_yuitest_coverline("build/event-move/event-move.js", 415);
return _defArgsProcessor(this, args, delegate);
    },

    _onMove : function(e, node, subscriber, ce, delegate) {

        _yuitest_coverfunc("build/event-move/event-move.js", "_onMove", 418);
_yuitest_coverline("build/event-move/event-move.js", 420);
if (delegate) {
            _yuitest_coverline("build/event-move/event-move.js", 421);
node = e[CURRENT_TARGET];
        }

        _yuitest_coverline("build/event-move/event-move.js", 424);
var fireMove = subscriber._extra.standAlone || node.getData(_MOVE_START),
            preventDefault = subscriber._extra.preventDefault;


        _yuitest_coverline("build/event-move/event-move.js", 428);
if (fireMove) {

            _yuitest_coverline("build/event-move/event-move.js", 430);
if (e.touches) {
                _yuitest_coverline("build/event-move/event-move.js", 431);
if (e.touches.length === 1) {
                    _yuitest_coverline("build/event-move/event-move.js", 432);
_normTouchFacade(e, e.touches[0]);
                } else {
                    _yuitest_coverline("build/event-move/event-move.js", 434);
fireMove = false;
                }
            }

            _yuitest_coverline("build/event-move/event-move.js", 438);
if (fireMove) {

                _yuitest_coverline("build/event-move/event-move.js", 440);
_prevent(e, preventDefault);


                _yuitest_coverline("build/event-move/event-move.js", 443);
e.type = GESTURE_MOVE;
                _yuitest_coverline("build/event-move/event-move.js", 444);
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
_yuitest_coverline("build/event-move/event-move.js", 486);
define(GESTURE_MOVE_END, {

    on : function (node, subscriber, ce) {
        _yuitest_coverfunc("build/event-move/event-move.js", "on", 488);
_yuitest_coverline("build/event-move/event-move.js", 489);
_setTouchActions(node);
        _yuitest_coverline("build/event-move/event-move.js", 490);
var root = _getRoot(node, subscriber),

            endHandle = root.on(EVENT[END],
                this._onEnd,
                this,
                node,
                subscriber,
                ce);

        _yuitest_coverline("build/event-move/event-move.js", 499);
subscriber[_MOVE_END_HANDLE] = endHandle;
    },

    delegate : function(node, subscriber, ce, filter) {

        _yuitest_coverfunc("build/event-move/event-move.js", "delegate", 502);
_yuitest_coverline("build/event-move/event-move.js", 504);
var se = this;

        _yuitest_coverline("build/event-move/event-move.js", 506);
subscriber[_DEL_MOVE_END_HANDLE] = node.delegate(EVENT[END],
            function(e) {
                _yuitest_coverfunc("build/event-move/event-move.js", "(anonymous 6)", 507);
_yuitest_coverline("build/event-move/event-move.js", 508);
se._onEnd(e, node, subscriber, ce, true);
            },
            filter);
    },

    detachDelegate : function(node, subscriber, ce, filter) {
        _yuitest_coverfunc("build/event-move/event-move.js", "detachDelegate", 513);
_yuitest_coverline("build/event-move/event-move.js", 514);
var handle = subscriber[_DEL_MOVE_END_HANDLE];

        _yuitest_coverline("build/event-move/event-move.js", 516);
if (handle) {
            _yuitest_coverline("build/event-move/event-move.js", 517);
handle.detach();
            _yuitest_coverline("build/event-move/event-move.js", 518);
subscriber[_DEL_MOVE_END_HANDLE] = null;
        }

        _yuitest_coverline("build/event-move/event-move.js", 521);
_unsetTouchActions(node);

    },

    detach : function (node, subscriber, ce) {
        _yuitest_coverfunc("build/event-move/event-move.js", "detach", 525);
_yuitest_coverline("build/event-move/event-move.js", 526);
var endHandle = subscriber[_MOVE_END_HANDLE];

        _yuitest_coverline("build/event-move/event-move.js", 528);
if (endHandle) {
            _yuitest_coverline("build/event-move/event-move.js", 529);
endHandle.detach();
            _yuitest_coverline("build/event-move/event-move.js", 530);
subscriber[_MOVE_END_HANDLE] = null;
        }

        _yuitest_coverline("build/event-move/event-move.js", 533);
_unsetTouchActions(node);
    },

    processArgs : function(args, delegate) {
        _yuitest_coverfunc("build/event-move/event-move.js", "processArgs", 536);
_yuitest_coverline("build/event-move/event-move.js", 537);
return _defArgsProcessor(this, args, delegate);
    },

    _onEnd : function(e, node, subscriber, ce, delegate) {

        _yuitest_coverfunc("build/event-move/event-move.js", "_onEnd", 540);
_yuitest_coverline("build/event-move/event-move.js", 542);
if (delegate) {
            _yuitest_coverline("build/event-move/event-move.js", 543);
node = e[CURRENT_TARGET];
        }

        _yuitest_coverline("build/event-move/event-move.js", 546);
var fireMoveEnd = subscriber._extra.standAlone || node.getData(_MOVE) || node.getData(_MOVE_START),
            preventDefault = subscriber._extra.preventDefault;

        _yuitest_coverline("build/event-move/event-move.js", 549);
if (fireMoveEnd) {

            _yuitest_coverline("build/event-move/event-move.js", 551);
if (e.changedTouches) {
                _yuitest_coverline("build/event-move/event-move.js", 552);
if (e.changedTouches.length === 1) {
                    _yuitest_coverline("build/event-move/event-move.js", 553);
_normTouchFacade(e, e.changedTouches[0]);
                } else {
                    _yuitest_coverline("build/event-move/event-move.js", 555);
fireMoveEnd = false;
                }
            }

            _yuitest_coverline("build/event-move/event-move.js", 559);
if (fireMoveEnd) {

                _yuitest_coverline("build/event-move/event-move.js", 561);
_prevent(e, preventDefault);

                _yuitest_coverline("build/event-move/event-move.js", 563);
e.type = GESTURE_MOVE_END;
                _yuitest_coverline("build/event-move/event-move.js", 564);
ce.fire(e);

                _yuitest_coverline("build/event-move/event-move.js", 566);
node.clearData(_MOVE_START);
                _yuitest_coverline("build/event-move/event-move.js", 567);
node.clearData(_MOVE);
            }
        }
    },

    PREVENT_DEFAULT : false
});


}, '@VERSION@', {"requires": ["node-base", "event-touch", "event-synthetic"]});
