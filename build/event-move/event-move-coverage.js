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
_yuitest_coverage["build/event-move/event-move.js"].code=["YUI.add('event-move', function (Y, NAME) {","","/**"," * Adds lower level support for \"gesturemovestart\", \"gesturemove\" and \"gesturemoveend\" events, which can be used to create drag/drop"," * interactions which work across touch and mouse input devices. They correspond to \"touchstart\", \"touchmove\" and \"touchend\" on a touch input"," * device, and \"mousedown\", \"mousemove\", \"mouseup\" on a mouse based input device."," *"," * <p>Documentation for the gesturemove triplet of events can be found on the <a href=\"../classes/YUI.html#event_gesturemove\">YUI</a> global,"," * along with the other supported events.</p>"," *"," * @module event-gestures"," * @submodule event-move"," */",""," var GESTURE_MAP = Y.Event._GESTURE_MAP,","     EVENT = {","         start: GESTURE_MAP.start,","         end: GESTURE_MAP.end,","         move: GESTURE_MAP.move","     },","    START = \"start\",","    MOVE = \"move\",","    END = \"end\",","","    GESTURE_MOVE = \"gesture\" + MOVE,","    GESTURE_MOVE_END = GESTURE_MOVE + END,","    GESTURE_MOVE_START = GESTURE_MOVE + START,","","    _MOVE_START_HANDLE = \"_msh\",","    _MOVE_HANDLE = \"_mh\",","    _MOVE_END_HANDLE = \"_meh\",","","    _DEL_MOVE_START_HANDLE = \"_dmsh\",","    _DEL_MOVE_HANDLE = \"_dmh\",","    _DEL_MOVE_END_HANDLE = \"_dmeh\",","","    _MOVE_START = \"_ms\",","    _MOVE = \"_m\",","","    MIN_TIME = \"minTime\",","    MIN_DISTANCE = \"minDistance\",","    PREVENT_DEFAULT = \"preventDefault\",","    BUTTON = \"button\",","    OWNER_DOCUMENT = \"ownerDocument\",","","    CURRENT_TARGET = \"currentTarget\",","    TARGET = \"target\",","","    NODE_TYPE = \"nodeType\",","","    SUPPORTS_POINTER = Y.config.win && (\"msPointerEnabled\" in Y.config.win.navigator),","    TOUCH_ACTION_COUNT = 0,","    ORIG_TOUCH_ACTION = '',","","    _defArgsProcessor = function(se, args, delegate) {","        var iConfig = (delegate) ? 4 : 3,","            config = (args.length > iConfig) ? Y.merge(args.splice(iConfig,1)[0]) : {};","","        if (!(PREVENT_DEFAULT in config)) {","            config[PREVENT_DEFAULT] = se.PREVENT_DEFAULT;","        }","","        return config;","    },","","    _getRoot = function(node, subscriber) {","        return subscriber._extra.root || (node.get(NODE_TYPE) === 9) ? node : node.get(OWNER_DOCUMENT);","    },","","    _normTouchFacade = function(touchFacade, touch, params) {","        touchFacade.pageX = touch.pageX;","        touchFacade.pageY = touch.pageY;","        touchFacade.screenX = touch.screenX;","        touchFacade.screenY = touch.screenY;","        touchFacade.clientX = touch.clientX;","        touchFacade.clientY = touch.clientY;","        touchFacade[TARGET] = touchFacade[TARGET] || touch[TARGET];","        touchFacade[CURRENT_TARGET] = touchFacade[CURRENT_TARGET] || touch[CURRENT_TARGET];","","        touchFacade[BUTTON] = (params && params[BUTTON]) || 1; // default to left (left as per vendors, not W3C which is 0)","    },","","    /*","    In IE10 touch mode, gestures will not work properly unless the -ms-touch-action CSS property is set to something other than 'auto'. Read http://msdn.microsoft.com/en-us/library/windows/apps/hh767313.aspx for more info. To get around this, we set -ms-touch-action: none which is the same as e.preventDefault() on touch environments. This tells the browser to fire DOM events for all touch events, and not perform any default behavior.","","    The user can over-ride this by setting a more lenient -ms-touch-action property on a node (such as pan-x, pan-y, etc.) via CSS when subscribing to the 'gesturemovestart' event.","    */","    _setTouchActions = function (node) {","        var elem = node.getDOMNode();","","        //Checks to see if MSPointer events are supported. The elem.style check is for events that are","        //subscribed from Y.config.doc (dd-gestures has this)","        if (SUPPORTS_POINTER && elem.style) {","","            if (TOUCH_ACTION_COUNT === 0) {","                ORIG_TOUCH_ACTION = elem.style.msTouchAction;","            }","            elem.style.msTouchAction = 'none';","            TOUCH_ACTION_COUNT++;","        }","    },","","    /*","    Resets the element's -ms-touch-action property back to the original value, This is called on detach() and detachDelegate().","    */","    _unsetTouchActions = function (node) {","        var elem = node.getDOMNode();","        if (SUPPORTS_POINTER && elem.style) {","            TOUCH_ACTION_COUNT--;","            if (TOUCH_ACTION_COUNT === 0 && elem.style.msTouchAction !== ORIG_TOUCH_ACTION) {","                elem.style.msTouchAction = ORIG_TOUCH_ACTION;","            }","        }","    },","","    _prevent = function(e, preventDefault) {","        if (preventDefault) {","            // preventDefault is a boolean or a function","            if (!preventDefault.call || preventDefault(e)) {","                e.preventDefault();","            }","        }","    },","","    define = Y.Event.define;","","/**"," * Sets up a \"gesturemovestart\" event, that is fired on touch devices in response to a single finger \"touchstart\","," * and on mouse based devices in response to a \"mousedown\". The subscriber can specify the minimum time"," * and distance thresholds which should be crossed before the \"gesturemovestart\" is fired and for the mouse,"," * which button should initiate a \"gesturemovestart\". This event can also be listened for using node.delegate()."," *"," * <p>It is recommended that you use Y.bind to set up context and additional arguments for your event handler,"," * however if you want to pass the context and arguments as additional signature arguments to on/delegate,"," * you need to provide a null value for the configuration object, e.g: <code>node.on(\"gesturemovestart\", fn, null, context, arg1, arg2, arg3)</code></p>"," *"," * @event gesturemovestart"," * @for YUI"," * @param type {string} \"gesturemovestart\""," * @param fn {function} The method the event invokes. It receives the event facade of the underlying DOM event (mousedown or touchstart.touches[0]) which contains position co-ordinates."," * @param cfg {Object} Optional. An object which specifies:"," *"," * <dl>"," * <dt>minDistance (defaults to 0)</dt>"," * <dd>The minimum distance threshold which should be crossed before the gesturemovestart is fired</dd>"," * <dt>minTime (defaults to 0)</dt>"," * <dd>The minimum time threshold for which the finger/mouse should be help down before the gesturemovestart is fired</dd>"," * <dt>button (no default)</dt>"," * <dd>In the case of a mouse input device, if the event should only be fired for a specific mouse button.</dd>"," * <dt>preventDefault (defaults to false)</dt>"," * <dd>Can be set to true/false to prevent default behavior as soon as the touchstart or mousedown is received (that is before minTime or minDistance thresholds are crossed, and so before the gesturemovestart listener is notified) so that things like text selection and context popups (on touch devices) can be"," * prevented. This property can also be set to a function, which returns true or false, based on the event facade passed to it (for example, DragDrop can determine if the target is a valid handle or not before preventing default).</dd>"," * </dl>"," *"," * @return {EventHandle} the detach handle"," */","","define(GESTURE_MOVE_START, {","","    on: function (node, subscriber, ce) {","","        //Set -ms-touch-action on IE10 and set preventDefault to true","        _setTouchActions(node);","","        subscriber[_MOVE_START_HANDLE] = node.on(EVENT[START],","            this._onStart,","            this,","            node,","            subscriber,","            ce);","    },","","    delegate : function(node, subscriber, ce, filter) {","","        var se = this;","","        subscriber[_DEL_MOVE_START_HANDLE] = node.delegate(EVENT[START],","            function(e) {","                se._onStart(e, node, subscriber, ce, true);","            },","            filter);","    },","","    detachDelegate : function(node, subscriber, ce, filter) {","        var handle = subscriber[_DEL_MOVE_START_HANDLE];","","        if (handle) {","            handle.detach();","            subscriber[_DEL_MOVE_START_HANDLE] = null;","        }","","        _unsetTouchActions(node);","    },","","    detach: function (node, subscriber, ce) {","        var startHandle = subscriber[_MOVE_START_HANDLE];","","        if (startHandle) {","            startHandle.detach();","            subscriber[_MOVE_START_HANDLE] = null;","        }","","        _unsetTouchActions(node);","    },","","    processArgs : function(args, delegate) {","        var params = _defArgsProcessor(this, args, delegate);","","        if (!(MIN_TIME in params)) {","            params[MIN_TIME] = this.MIN_TIME;","        }","","        if (!(MIN_DISTANCE in params)) {","            params[MIN_DISTANCE] = this.MIN_DISTANCE;","        }","","        return params;","    },","","    _onStart : function(e, node, subscriber, ce, delegate) {","","        if (delegate) {","            node = e[CURRENT_TARGET];","        }","","        var params = subscriber._extra,","            fireStart = true,","            minTime = params[MIN_TIME],","            minDistance = params[MIN_DISTANCE],","            button = params.button,","            preventDefault = params[PREVENT_DEFAULT],","            root = _getRoot(node, subscriber),","            startXY;","","        if (e.touches) {","            if (e.touches.length === 1) {","                _normTouchFacade(e, e.touches[0], params);","            } else {","                fireStart = false;","            }","        } else {","            fireStart = (button === undefined) || (button === e.button);","        }","","","        if (fireStart) {","","            _prevent(e, preventDefault);","","            if (minTime === 0 || minDistance === 0) {","                this._start(e, node, ce, params);","","            } else {","","                startXY = [e.pageX, e.pageY];","","                if (minTime > 0) {","","","                    params._ht = Y.later(minTime, this, this._start, [e, node, ce, params]);","","                    params._hme = root.on(EVENT[END], Y.bind(function() {","                        this._cancel(params);","                    }, this));","                }","","                if (minDistance > 0) {","","","                    params._hm = root.on(EVENT[MOVE], Y.bind(function(em) {","                        if (Math.abs(em.pageX - startXY[0]) > minDistance || Math.abs(em.pageY - startXY[1]) > minDistance) {","                            this._start(e, node, ce, params);","                        }","                    }, this));","                }","            }","        }","    },","","    _cancel : function(params) {","        if (params._ht) {","            params._ht.cancel();","            params._ht = null;","        }","        if (params._hme) {","            params._hme.detach();","            params._hme = null;","        }","        if (params._hm) {","            params._hm.detach();","            params._hm = null;","        }","    },","","    _start : function(e, node, ce, params) {","","        if (params) {","            this._cancel(params);","        }","","        e.type = GESTURE_MOVE_START;","","","        node.setData(_MOVE_START, e);","        ce.fire(e);","    },","","    MIN_TIME : 0,","    MIN_DISTANCE : 0,","    PREVENT_DEFAULT : false","});","","/**"," * Sets up a \"gesturemove\" event, that is fired on touch devices in response to a single finger \"touchmove\","," * and on mouse based devices in response to a \"mousemove\"."," *"," * <p>By default this event is only fired when the same node"," * has received a \"gesturemovestart\" event. The subscriber can set standAlone to true, in the configuration properties,"," * if they want to listen for this event without an initial \"gesturemovestart\".</p>"," *"," * <p>By default this event sets up it's internal \"touchmove\" and \"mousemove\" DOM listeners on the document element. The subscriber"," * can set the root configuration property, to specify which node to attach DOM listeners to, if different from the document.</p>"," *"," * <p>This event can also be listened for using node.delegate().</p>"," *"," * <p>It is recommended that you use Y.bind to set up context and additional arguments for your event handler,"," * however if you want to pass the context and arguments as additional signature arguments to on/delegate,"," * you need to provide a null value for the configuration object, e.g: <code>node.on(\"gesturemove\", fn, null, context, arg1, arg2, arg3)</code></p>"," *"," * @event gesturemove"," * @for YUI"," * @param type {string} \"gesturemove\""," * @param fn {function} The method the event invokes. It receives the event facade of the underlying DOM event (mousemove or touchmove.touches[0]) which contains position co-ordinates."," * @param cfg {Object} Optional. An object which specifies:"," * <dl>"," * <dt>standAlone (defaults to false)</dt>"," * <dd>true, if the subscriber should be notified even if a \"gesturemovestart\" has not occured on the same node.</dd>"," * <dt>root (defaults to document)</dt>"," * <dd>The node to which the internal DOM listeners should be attached.</dd>"," * <dt>preventDefault (defaults to false)</dt>"," * <dd>Can be set to true/false to prevent default behavior as soon as the touchmove or mousemove is received. As with gesturemovestart, can also be set to function which returns true/false based on the event facade passed to it.</dd>"," * </dl>"," *"," * @return {EventHandle} the detach handle"," */","define(GESTURE_MOVE, {","","    on : function (node, subscriber, ce) {","","        _setTouchActions(node);","        var root = _getRoot(node, subscriber, EVENT[MOVE]),","","            moveHandle = root.on(EVENT[MOVE],","                this._onMove,","                this,","                node,","                subscriber,","                ce);","","        subscriber[_MOVE_HANDLE] = moveHandle;","","    },","","    delegate : function(node, subscriber, ce, filter) {","","        var se = this;","","        subscriber[_DEL_MOVE_HANDLE] = node.delegate(EVENT[MOVE],","            function(e) {","                se._onMove(e, node, subscriber, ce, true);","            },","            filter);","    },","","    detach : function (node, subscriber, ce) {","        var moveHandle = subscriber[_MOVE_HANDLE];","","        if (moveHandle) {","            moveHandle.detach();","            subscriber[_MOVE_HANDLE] = null;","        }","","        _unsetTouchActions(node);","    },","","    detachDelegate : function(node, subscriber, ce, filter) {","        var handle = subscriber[_DEL_MOVE_HANDLE];","","        if (handle) {","            handle.detach();","            subscriber[_DEL_MOVE_HANDLE] = null;","        }","","        _unsetTouchActions(node);","","    },","","    processArgs : function(args, delegate) {","        return _defArgsProcessor(this, args, delegate);","    },","","    _onMove : function(e, node, subscriber, ce, delegate) {","","        if (delegate) {","            node = e[CURRENT_TARGET];","        }","","        var fireMove = subscriber._extra.standAlone || node.getData(_MOVE_START),","            preventDefault = subscriber._extra.preventDefault;","","","        if (fireMove) {","","            if (e.touches) {","                if (e.touches.length === 1) {","                    _normTouchFacade(e, e.touches[0]);","                } else {","                    fireMove = false;","                }","            }","","            if (fireMove) {","","                _prevent(e, preventDefault);","","","                e.type = GESTURE_MOVE;","                ce.fire(e);","            }","        }","    },","","    PREVENT_DEFAULT : false","});","","/**"," * Sets up a \"gesturemoveend\" event, that is fired on touch devices in response to a single finger \"touchend\","," * and on mouse based devices in response to a \"mouseup\"."," *"," * <p>By default this event is only fired when the same node"," * has received a \"gesturemove\" or \"gesturemovestart\" event. The subscriber can set standAlone to true, in the configuration properties,"," * if they want to listen for this event without a preceding \"gesturemovestart\" or \"gesturemove\".</p>"," *"," * <p>By default this event sets up it's internal \"touchend\" and \"mouseup\" DOM listeners on the document element. The subscriber"," * can set the root configuration property, to specify which node to attach DOM listeners to, if different from the document.</p>"," *"," * <p>This event can also be listened for using node.delegate().</p>"," *"," * <p>It is recommended that you use Y.bind to set up context and additional arguments for your event handler,"," * however if you want to pass the context and arguments as additional signature arguments to on/delegate,"," * you need to provide a null value for the configuration object, e.g: <code>node.on(\"gesturemoveend\", fn, null, context, arg1, arg2, arg3)</code></p>"," *"," *"," * @event gesturemoveend"," * @for YUI"," * @param type {string} \"gesturemoveend\""," * @param fn {function} The method the event invokes. It receives the event facade of the underlying DOM event (mouseup or touchend.changedTouches[0])."," * @param cfg {Object} Optional. An object which specifies:"," * <dl>"," * <dt>standAlone (defaults to false)</dt>"," * <dd>true, if the subscriber should be notified even if a \"gesturemovestart\" or \"gesturemove\" has not occured on the same node.</dd>"," * <dt>root (defaults to document)</dt>"," * <dd>The node to which the internal DOM listeners should be attached.</dd>"," * <dt>preventDefault (defaults to false)</dt>"," * <dd>Can be set to true/false to prevent default behavior as soon as the touchend or mouseup is received. As with gesturemovestart, can also be set to function which returns true/false based on the event facade passed to it.</dd>"," * </dl>"," *"," * @return {EventHandle} the detach handle"," */","define(GESTURE_MOVE_END, {","","    on : function (node, subscriber, ce) {","        _setTouchActions(node);","        var root = _getRoot(node, subscriber),","","            endHandle = root.on(EVENT[END],","                this._onEnd,","                this,","                node,","                subscriber,","                ce);","","        subscriber[_MOVE_END_HANDLE] = endHandle;","    },","","    delegate : function(node, subscriber, ce, filter) {","","        var se = this;","","        subscriber[_DEL_MOVE_END_HANDLE] = node.delegate(EVENT[END],","            function(e) {","                se._onEnd(e, node, subscriber, ce, true);","            },","            filter);","    },","","    detachDelegate : function(node, subscriber, ce, filter) {","        var handle = subscriber[_DEL_MOVE_END_HANDLE];","","        if (handle) {","            handle.detach();","            subscriber[_DEL_MOVE_END_HANDLE] = null;","        }","","        _unsetTouchActions(node);","","    },","","    detach : function (node, subscriber, ce) {","        var endHandle = subscriber[_MOVE_END_HANDLE];","","        if (endHandle) {","            endHandle.detach();","            subscriber[_MOVE_END_HANDLE] = null;","        }","","        _unsetTouchActions(node);","    },","","    processArgs : function(args, delegate) {","        return _defArgsProcessor(this, args, delegate);","    },","","    _onEnd : function(e, node, subscriber, ce, delegate) {","","        if (delegate) {","            node = e[CURRENT_TARGET];","        }","","        var fireMoveEnd = subscriber._extra.standAlone || node.getData(_MOVE) || node.getData(_MOVE_START),","            preventDefault = subscriber._extra.preventDefault;","","        if (fireMoveEnd) {","","            if (e.changedTouches) {","                if (e.changedTouches.length === 1) {","                    _normTouchFacade(e, e.changedTouches[0]);","                } else {","                    fireMoveEnd = false;","                }","            }","","            if (fireMoveEnd) {","","                _prevent(e, preventDefault);","","                e.type = GESTURE_MOVE_END;","                ce.fire(e);","","                node.clearData(_MOVE_START);","                node.clearData(_MOVE);","            }","        }","    },","","    PREVENT_DEFAULT : false","});","","","}, '@VERSION@', {\"requires\": [\"node-base\", \"event-touch\", \"event-synthetic\"]});"];
_yuitest_coverage["build/event-move/event-move.js"].lines = {"1":0,"15":0,"56":0,"59":0,"60":0,"63":0,"67":0,"71":0,"72":0,"73":0,"74":0,"75":0,"76":0,"77":0,"78":0,"80":0,"89":0,"93":0,"95":0,"96":0,"98":0,"99":0,"107":0,"108":0,"109":0,"110":0,"111":0,"117":0,"119":0,"120":0,"158":0,"163":0,"165":0,"175":0,"177":0,"179":0,"185":0,"187":0,"188":0,"189":0,"192":0,"196":0,"198":0,"199":0,"200":0,"203":0,"207":0,"209":0,"210":0,"213":0,"214":0,"217":0,"222":0,"223":0,"226":0,"235":0,"236":0,"237":0,"239":0,"242":0,"246":0,"248":0,"250":0,"251":0,"255":0,"257":0,"260":0,"262":0,"263":0,"267":0,"270":0,"271":0,"272":0,"281":0,"282":0,"283":0,"285":0,"286":0,"287":0,"289":0,"290":0,"291":0,"297":0,"298":0,"301":0,"304":0,"305":0,"346":0,"350":0,"351":0,"360":0,"366":0,"368":0,"370":0,"376":0,"378":0,"379":0,"380":0,"383":0,"387":0,"389":0,"390":0,"391":0,"394":0,"399":0,"404":0,"405":0,"408":0,"412":0,"414":0,"415":0,"416":0,"418":0,"422":0,"424":0,"427":0,"428":0,"470":0,"473":0,"474":0,"483":0,"488":0,"490":0,"492":0,"498":0,"500":0,"501":0,"502":0,"505":0,"510":0,"512":0,"513":0,"514":0,"517":0,"521":0,"526":0,"527":0,"530":0,"533":0,"535":0,"536":0,"537":0,"539":0,"543":0,"545":0,"547":0,"548":0,"550":0,"551":0};
_yuitest_coverage["build/event-move/event-move.js"].functions = {"_defArgsProcessor:55":0,"_getRoot:66":0,"_normTouchFacade:70":0,"_setTouchActions:88":0,"_unsetTouchActions:106":0,"_prevent:116":0,"on:160":0,"(anonymous 2):178":0,"delegate:173":0,"detachDelegate:184":0,"detach:195":0,"processArgs:206":0,"(anonymous 3):262":0,"(anonymous 4):270":0,"_onStart:220":0,"_cancel:280":0,"_start:295":0,"on:348":0,"(anonymous 5):369":0,"delegate:364":0,"detach:375":0,"detachDelegate:386":0,"processArgs:398":0,"_onMove:402":0,"on:472":0,"(anonymous 6):491":0,"delegate:486":0,"detachDelegate:497":0,"detach:509":0,"processArgs:520":0,"_onEnd:524":0,"(anonymous 1):1":0};
_yuitest_coverage["build/event-move/event-move.js"].coveredLines = 149;
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
    TOUCH_ACTION_COUNT = 0,
    ORIG_TOUCH_ACTION = '',

    _defArgsProcessor = function(se, args, delegate) {
        _yuitest_coverfunc("build/event-move/event-move.js", "_defArgsProcessor", 55);
_yuitest_coverline("build/event-move/event-move.js", 56);
var iConfig = (delegate) ? 4 : 3,
            config = (args.length > iConfig) ? Y.merge(args.splice(iConfig,1)[0]) : {};

        _yuitest_coverline("build/event-move/event-move.js", 59);
if (!(PREVENT_DEFAULT in config)) {
            _yuitest_coverline("build/event-move/event-move.js", 60);
config[PREVENT_DEFAULT] = se.PREVENT_DEFAULT;
        }

        _yuitest_coverline("build/event-move/event-move.js", 63);
return config;
    },

    _getRoot = function(node, subscriber) {
        _yuitest_coverfunc("build/event-move/event-move.js", "_getRoot", 66);
_yuitest_coverline("build/event-move/event-move.js", 67);
return subscriber._extra.root || (node.get(NODE_TYPE) === 9) ? node : node.get(OWNER_DOCUMENT);
    },

    _normTouchFacade = function(touchFacade, touch, params) {
        _yuitest_coverfunc("build/event-move/event-move.js", "_normTouchFacade", 70);
_yuitest_coverline("build/event-move/event-move.js", 71);
touchFacade.pageX = touch.pageX;
        _yuitest_coverline("build/event-move/event-move.js", 72);
touchFacade.pageY = touch.pageY;
        _yuitest_coverline("build/event-move/event-move.js", 73);
touchFacade.screenX = touch.screenX;
        _yuitest_coverline("build/event-move/event-move.js", 74);
touchFacade.screenY = touch.screenY;
        _yuitest_coverline("build/event-move/event-move.js", 75);
touchFacade.clientX = touch.clientX;
        _yuitest_coverline("build/event-move/event-move.js", 76);
touchFacade.clientY = touch.clientY;
        _yuitest_coverline("build/event-move/event-move.js", 77);
touchFacade[TARGET] = touchFacade[TARGET] || touch[TARGET];
        _yuitest_coverline("build/event-move/event-move.js", 78);
touchFacade[CURRENT_TARGET] = touchFacade[CURRENT_TARGET] || touch[CURRENT_TARGET];

        _yuitest_coverline("build/event-move/event-move.js", 80);
touchFacade[BUTTON] = (params && params[BUTTON]) || 1; // default to left (left as per vendors, not W3C which is 0)
    },

    /*
    In IE10 touch mode, gestures will not work properly unless the -ms-touch-action CSS property is set to something other than 'auto'. Read http://msdn.microsoft.com/en-us/library/windows/apps/hh767313.aspx for more info. To get around this, we set -ms-touch-action: none which is the same as e.preventDefault() on touch environments. This tells the browser to fire DOM events for all touch events, and not perform any default behavior.

    The user can over-ride this by setting a more lenient -ms-touch-action property on a node (such as pan-x, pan-y, etc.) via CSS when subscribing to the 'gesturemovestart' event.
    */
    _setTouchActions = function (node) {
        _yuitest_coverfunc("build/event-move/event-move.js", "_setTouchActions", 88);
_yuitest_coverline("build/event-move/event-move.js", 89);
var elem = node.getDOMNode();

        //Checks to see if MSPointer events are supported. The elem.style check is for events that are
        //subscribed from Y.config.doc (dd-gestures has this)
        _yuitest_coverline("build/event-move/event-move.js", 93);
if (SUPPORTS_POINTER && elem.style) {

            _yuitest_coverline("build/event-move/event-move.js", 95);
if (TOUCH_ACTION_COUNT === 0) {
                _yuitest_coverline("build/event-move/event-move.js", 96);
ORIG_TOUCH_ACTION = elem.style.msTouchAction;
            }
            _yuitest_coverline("build/event-move/event-move.js", 98);
elem.style.msTouchAction = 'none';
            _yuitest_coverline("build/event-move/event-move.js", 99);
TOUCH_ACTION_COUNT++;
        }
    },

    /*
    Resets the element's -ms-touch-action property back to the original value, This is called on detach() and detachDelegate().
    */
    _unsetTouchActions = function (node) {
        _yuitest_coverfunc("build/event-move/event-move.js", "_unsetTouchActions", 106);
_yuitest_coverline("build/event-move/event-move.js", 107);
var elem = node.getDOMNode();
        _yuitest_coverline("build/event-move/event-move.js", 108);
if (SUPPORTS_POINTER && elem.style) {
            _yuitest_coverline("build/event-move/event-move.js", 109);
TOUCH_ACTION_COUNT--;
            _yuitest_coverline("build/event-move/event-move.js", 110);
if (TOUCH_ACTION_COUNT === 0 && elem.style.msTouchAction !== ORIG_TOUCH_ACTION) {
                _yuitest_coverline("build/event-move/event-move.js", 111);
elem.style.msTouchAction = ORIG_TOUCH_ACTION;
            }
        }
    },

    _prevent = function(e, preventDefault) {
        _yuitest_coverfunc("build/event-move/event-move.js", "_prevent", 116);
_yuitest_coverline("build/event-move/event-move.js", 117);
if (preventDefault) {
            // preventDefault is a boolean or a function
            _yuitest_coverline("build/event-move/event-move.js", 119);
if (!preventDefault.call || preventDefault(e)) {
                _yuitest_coverline("build/event-move/event-move.js", 120);
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

_yuitest_coverline("build/event-move/event-move.js", 158);
define(GESTURE_MOVE_START, {

    on: function (node, subscriber, ce) {

        //Set -ms-touch-action on IE10 and set preventDefault to true
        _yuitest_coverfunc("build/event-move/event-move.js", "on", 160);
_yuitest_coverline("build/event-move/event-move.js", 163);
_setTouchActions(node);

        _yuitest_coverline("build/event-move/event-move.js", 165);
subscriber[_MOVE_START_HANDLE] = node.on(EVENT[START],
            this._onStart,
            this,
            node,
            subscriber,
            ce);
    },

    delegate : function(node, subscriber, ce, filter) {

        _yuitest_coverfunc("build/event-move/event-move.js", "delegate", 173);
_yuitest_coverline("build/event-move/event-move.js", 175);
var se = this;

        _yuitest_coverline("build/event-move/event-move.js", 177);
subscriber[_DEL_MOVE_START_HANDLE] = node.delegate(EVENT[START],
            function(e) {
                _yuitest_coverfunc("build/event-move/event-move.js", "(anonymous 2)", 178);
_yuitest_coverline("build/event-move/event-move.js", 179);
se._onStart(e, node, subscriber, ce, true);
            },
            filter);
    },

    detachDelegate : function(node, subscriber, ce, filter) {
        _yuitest_coverfunc("build/event-move/event-move.js", "detachDelegate", 184);
_yuitest_coverline("build/event-move/event-move.js", 185);
var handle = subscriber[_DEL_MOVE_START_HANDLE];

        _yuitest_coverline("build/event-move/event-move.js", 187);
if (handle) {
            _yuitest_coverline("build/event-move/event-move.js", 188);
handle.detach();
            _yuitest_coverline("build/event-move/event-move.js", 189);
subscriber[_DEL_MOVE_START_HANDLE] = null;
        }

        _yuitest_coverline("build/event-move/event-move.js", 192);
_unsetTouchActions(node);
    },

    detach: function (node, subscriber, ce) {
        _yuitest_coverfunc("build/event-move/event-move.js", "detach", 195);
_yuitest_coverline("build/event-move/event-move.js", 196);
var startHandle = subscriber[_MOVE_START_HANDLE];

        _yuitest_coverline("build/event-move/event-move.js", 198);
if (startHandle) {
            _yuitest_coverline("build/event-move/event-move.js", 199);
startHandle.detach();
            _yuitest_coverline("build/event-move/event-move.js", 200);
subscriber[_MOVE_START_HANDLE] = null;
        }

        _yuitest_coverline("build/event-move/event-move.js", 203);
_unsetTouchActions(node);
    },

    processArgs : function(args, delegate) {
        _yuitest_coverfunc("build/event-move/event-move.js", "processArgs", 206);
_yuitest_coverline("build/event-move/event-move.js", 207);
var params = _defArgsProcessor(this, args, delegate);

        _yuitest_coverline("build/event-move/event-move.js", 209);
if (!(MIN_TIME in params)) {
            _yuitest_coverline("build/event-move/event-move.js", 210);
params[MIN_TIME] = this.MIN_TIME;
        }

        _yuitest_coverline("build/event-move/event-move.js", 213);
if (!(MIN_DISTANCE in params)) {
            _yuitest_coverline("build/event-move/event-move.js", 214);
params[MIN_DISTANCE] = this.MIN_DISTANCE;
        }

        _yuitest_coverline("build/event-move/event-move.js", 217);
return params;
    },

    _onStart : function(e, node, subscriber, ce, delegate) {

        _yuitest_coverfunc("build/event-move/event-move.js", "_onStart", 220);
_yuitest_coverline("build/event-move/event-move.js", 222);
if (delegate) {
            _yuitest_coverline("build/event-move/event-move.js", 223);
node = e[CURRENT_TARGET];
        }

        _yuitest_coverline("build/event-move/event-move.js", 226);
var params = subscriber._extra,
            fireStart = true,
            minTime = params[MIN_TIME],
            minDistance = params[MIN_DISTANCE],
            button = params.button,
            preventDefault = params[PREVENT_DEFAULT],
            root = _getRoot(node, subscriber),
            startXY;

        _yuitest_coverline("build/event-move/event-move.js", 235);
if (e.touches) {
            _yuitest_coverline("build/event-move/event-move.js", 236);
if (e.touches.length === 1) {
                _yuitest_coverline("build/event-move/event-move.js", 237);
_normTouchFacade(e, e.touches[0], params);
            } else {
                _yuitest_coverline("build/event-move/event-move.js", 239);
fireStart = false;
            }
        } else {
            _yuitest_coverline("build/event-move/event-move.js", 242);
fireStart = (button === undefined) || (button === e.button);
        }


        _yuitest_coverline("build/event-move/event-move.js", 246);
if (fireStart) {

            _yuitest_coverline("build/event-move/event-move.js", 248);
_prevent(e, preventDefault);

            _yuitest_coverline("build/event-move/event-move.js", 250);
if (minTime === 0 || minDistance === 0) {
                _yuitest_coverline("build/event-move/event-move.js", 251);
this._start(e, node, ce, params);

            } else {

                _yuitest_coverline("build/event-move/event-move.js", 255);
startXY = [e.pageX, e.pageY];

                _yuitest_coverline("build/event-move/event-move.js", 257);
if (minTime > 0) {


                    _yuitest_coverline("build/event-move/event-move.js", 260);
params._ht = Y.later(minTime, this, this._start, [e, node, ce, params]);

                    _yuitest_coverline("build/event-move/event-move.js", 262);
params._hme = root.on(EVENT[END], Y.bind(function() {
                        _yuitest_coverfunc("build/event-move/event-move.js", "(anonymous 3)", 262);
_yuitest_coverline("build/event-move/event-move.js", 263);
this._cancel(params);
                    }, this));
                }

                _yuitest_coverline("build/event-move/event-move.js", 267);
if (minDistance > 0) {


                    _yuitest_coverline("build/event-move/event-move.js", 270);
params._hm = root.on(EVENT[MOVE], Y.bind(function(em) {
                        _yuitest_coverfunc("build/event-move/event-move.js", "(anonymous 4)", 270);
_yuitest_coverline("build/event-move/event-move.js", 271);
if (Math.abs(em.pageX - startXY[0]) > minDistance || Math.abs(em.pageY - startXY[1]) > minDistance) {
                            _yuitest_coverline("build/event-move/event-move.js", 272);
this._start(e, node, ce, params);
                        }
                    }, this));
                }
            }
        }
    },

    _cancel : function(params) {
        _yuitest_coverfunc("build/event-move/event-move.js", "_cancel", 280);
_yuitest_coverline("build/event-move/event-move.js", 281);
if (params._ht) {
            _yuitest_coverline("build/event-move/event-move.js", 282);
params._ht.cancel();
            _yuitest_coverline("build/event-move/event-move.js", 283);
params._ht = null;
        }
        _yuitest_coverline("build/event-move/event-move.js", 285);
if (params._hme) {
            _yuitest_coverline("build/event-move/event-move.js", 286);
params._hme.detach();
            _yuitest_coverline("build/event-move/event-move.js", 287);
params._hme = null;
        }
        _yuitest_coverline("build/event-move/event-move.js", 289);
if (params._hm) {
            _yuitest_coverline("build/event-move/event-move.js", 290);
params._hm.detach();
            _yuitest_coverline("build/event-move/event-move.js", 291);
params._hm = null;
        }
    },

    _start : function(e, node, ce, params) {

        _yuitest_coverfunc("build/event-move/event-move.js", "_start", 295);
_yuitest_coverline("build/event-move/event-move.js", 297);
if (params) {
            _yuitest_coverline("build/event-move/event-move.js", 298);
this._cancel(params);
        }

        _yuitest_coverline("build/event-move/event-move.js", 301);
e.type = GESTURE_MOVE_START;


        _yuitest_coverline("build/event-move/event-move.js", 304);
node.setData(_MOVE_START, e);
        _yuitest_coverline("build/event-move/event-move.js", 305);
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
_yuitest_coverline("build/event-move/event-move.js", 346);
define(GESTURE_MOVE, {

    on : function (node, subscriber, ce) {

        _yuitest_coverfunc("build/event-move/event-move.js", "on", 348);
_yuitest_coverline("build/event-move/event-move.js", 350);
_setTouchActions(node);
        _yuitest_coverline("build/event-move/event-move.js", 351);
var root = _getRoot(node, subscriber, EVENT[MOVE]),

            moveHandle = root.on(EVENT[MOVE],
                this._onMove,
                this,
                node,
                subscriber,
                ce);

        _yuitest_coverline("build/event-move/event-move.js", 360);
subscriber[_MOVE_HANDLE] = moveHandle;

    },

    delegate : function(node, subscriber, ce, filter) {

        _yuitest_coverfunc("build/event-move/event-move.js", "delegate", 364);
_yuitest_coverline("build/event-move/event-move.js", 366);
var se = this;

        _yuitest_coverline("build/event-move/event-move.js", 368);
subscriber[_DEL_MOVE_HANDLE] = node.delegate(EVENT[MOVE],
            function(e) {
                _yuitest_coverfunc("build/event-move/event-move.js", "(anonymous 5)", 369);
_yuitest_coverline("build/event-move/event-move.js", 370);
se._onMove(e, node, subscriber, ce, true);
            },
            filter);
    },

    detach : function (node, subscriber, ce) {
        _yuitest_coverfunc("build/event-move/event-move.js", "detach", 375);
_yuitest_coverline("build/event-move/event-move.js", 376);
var moveHandle = subscriber[_MOVE_HANDLE];

        _yuitest_coverline("build/event-move/event-move.js", 378);
if (moveHandle) {
            _yuitest_coverline("build/event-move/event-move.js", 379);
moveHandle.detach();
            _yuitest_coverline("build/event-move/event-move.js", 380);
subscriber[_MOVE_HANDLE] = null;
        }

        _yuitest_coverline("build/event-move/event-move.js", 383);
_unsetTouchActions(node);
    },

    detachDelegate : function(node, subscriber, ce, filter) {
        _yuitest_coverfunc("build/event-move/event-move.js", "detachDelegate", 386);
_yuitest_coverline("build/event-move/event-move.js", 387);
var handle = subscriber[_DEL_MOVE_HANDLE];

        _yuitest_coverline("build/event-move/event-move.js", 389);
if (handle) {
            _yuitest_coverline("build/event-move/event-move.js", 390);
handle.detach();
            _yuitest_coverline("build/event-move/event-move.js", 391);
subscriber[_DEL_MOVE_HANDLE] = null;
        }

        _yuitest_coverline("build/event-move/event-move.js", 394);
_unsetTouchActions(node);

    },

    processArgs : function(args, delegate) {
        _yuitest_coverfunc("build/event-move/event-move.js", "processArgs", 398);
_yuitest_coverline("build/event-move/event-move.js", 399);
return _defArgsProcessor(this, args, delegate);
    },

    _onMove : function(e, node, subscriber, ce, delegate) {

        _yuitest_coverfunc("build/event-move/event-move.js", "_onMove", 402);
_yuitest_coverline("build/event-move/event-move.js", 404);
if (delegate) {
            _yuitest_coverline("build/event-move/event-move.js", 405);
node = e[CURRENT_TARGET];
        }

        _yuitest_coverline("build/event-move/event-move.js", 408);
var fireMove = subscriber._extra.standAlone || node.getData(_MOVE_START),
            preventDefault = subscriber._extra.preventDefault;


        _yuitest_coverline("build/event-move/event-move.js", 412);
if (fireMove) {

            _yuitest_coverline("build/event-move/event-move.js", 414);
if (e.touches) {
                _yuitest_coverline("build/event-move/event-move.js", 415);
if (e.touches.length === 1) {
                    _yuitest_coverline("build/event-move/event-move.js", 416);
_normTouchFacade(e, e.touches[0]);
                } else {
                    _yuitest_coverline("build/event-move/event-move.js", 418);
fireMove = false;
                }
            }

            _yuitest_coverline("build/event-move/event-move.js", 422);
if (fireMove) {

                _yuitest_coverline("build/event-move/event-move.js", 424);
_prevent(e, preventDefault);


                _yuitest_coverline("build/event-move/event-move.js", 427);
e.type = GESTURE_MOVE;
                _yuitest_coverline("build/event-move/event-move.js", 428);
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
_yuitest_coverline("build/event-move/event-move.js", 470);
define(GESTURE_MOVE_END, {

    on : function (node, subscriber, ce) {
        _yuitest_coverfunc("build/event-move/event-move.js", "on", 472);
_yuitest_coverline("build/event-move/event-move.js", 473);
_setTouchActions(node);
        _yuitest_coverline("build/event-move/event-move.js", 474);
var root = _getRoot(node, subscriber),

            endHandle = root.on(EVENT[END],
                this._onEnd,
                this,
                node,
                subscriber,
                ce);

        _yuitest_coverline("build/event-move/event-move.js", 483);
subscriber[_MOVE_END_HANDLE] = endHandle;
    },

    delegate : function(node, subscriber, ce, filter) {

        _yuitest_coverfunc("build/event-move/event-move.js", "delegate", 486);
_yuitest_coverline("build/event-move/event-move.js", 488);
var se = this;

        _yuitest_coverline("build/event-move/event-move.js", 490);
subscriber[_DEL_MOVE_END_HANDLE] = node.delegate(EVENT[END],
            function(e) {
                _yuitest_coverfunc("build/event-move/event-move.js", "(anonymous 6)", 491);
_yuitest_coverline("build/event-move/event-move.js", 492);
se._onEnd(e, node, subscriber, ce, true);
            },
            filter);
    },

    detachDelegate : function(node, subscriber, ce, filter) {
        _yuitest_coverfunc("build/event-move/event-move.js", "detachDelegate", 497);
_yuitest_coverline("build/event-move/event-move.js", 498);
var handle = subscriber[_DEL_MOVE_END_HANDLE];

        _yuitest_coverline("build/event-move/event-move.js", 500);
if (handle) {
            _yuitest_coverline("build/event-move/event-move.js", 501);
handle.detach();
            _yuitest_coverline("build/event-move/event-move.js", 502);
subscriber[_DEL_MOVE_END_HANDLE] = null;
        }

        _yuitest_coverline("build/event-move/event-move.js", 505);
_unsetTouchActions(node);

    },

    detach : function (node, subscriber, ce) {
        _yuitest_coverfunc("build/event-move/event-move.js", "detach", 509);
_yuitest_coverline("build/event-move/event-move.js", 510);
var endHandle = subscriber[_MOVE_END_HANDLE];

        _yuitest_coverline("build/event-move/event-move.js", 512);
if (endHandle) {
            _yuitest_coverline("build/event-move/event-move.js", 513);
endHandle.detach();
            _yuitest_coverline("build/event-move/event-move.js", 514);
subscriber[_MOVE_END_HANDLE] = null;
        }

        _yuitest_coverline("build/event-move/event-move.js", 517);
_unsetTouchActions(node);
    },

    processArgs : function(args, delegate) {
        _yuitest_coverfunc("build/event-move/event-move.js", "processArgs", 520);
_yuitest_coverline("build/event-move/event-move.js", 521);
return _defArgsProcessor(this, args, delegate);
    },

    _onEnd : function(e, node, subscriber, ce, delegate) {

        _yuitest_coverfunc("build/event-move/event-move.js", "_onEnd", 524);
_yuitest_coverline("build/event-move/event-move.js", 526);
if (delegate) {
            _yuitest_coverline("build/event-move/event-move.js", 527);
node = e[CURRENT_TARGET];
        }

        _yuitest_coverline("build/event-move/event-move.js", 530);
var fireMoveEnd = subscriber._extra.standAlone || node.getData(_MOVE) || node.getData(_MOVE_START),
            preventDefault = subscriber._extra.preventDefault;

        _yuitest_coverline("build/event-move/event-move.js", 533);
if (fireMoveEnd) {

            _yuitest_coverline("build/event-move/event-move.js", 535);
if (e.changedTouches) {
                _yuitest_coverline("build/event-move/event-move.js", 536);
if (e.changedTouches.length === 1) {
                    _yuitest_coverline("build/event-move/event-move.js", 537);
_normTouchFacade(e, e.changedTouches[0]);
                } else {
                    _yuitest_coverline("build/event-move/event-move.js", 539);
fireMoveEnd = false;
                }
            }

            _yuitest_coverline("build/event-move/event-move.js", 543);
if (fireMoveEnd) {

                _yuitest_coverline("build/event-move/event-move.js", 545);
_prevent(e, preventDefault);

                _yuitest_coverline("build/event-move/event-move.js", 547);
e.type = GESTURE_MOVE_END;
                _yuitest_coverline("build/event-move/event-move.js", 548);
ce.fire(e);

                _yuitest_coverline("build/event-move/event-move.js", 550);
node.clearData(_MOVE_START);
                _yuitest_coverline("build/event-move/event-move.js", 551);
node.clearData(_MOVE);
            }
        }
    },

    PREVENT_DEFAULT : false
});


}, '@VERSION@', {"requires": ["node-base", "event-touch", "event-synthetic"]});
