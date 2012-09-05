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
_yuitest_coverage["build/event-touch/event-touch.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/event-touch/event-touch.js",
    code: []
};
_yuitest_coverage["build/event-touch/event-touch.js"].code=["YUI.add('event-touch', function (Y, NAME) {","","/**"," * Adds touch event facade normalization properties (touches, changedTouches, targetTouches etc.) to the DOM event facade"," *"," * @module event-touch"," */","var SCALE = \"scale\",","    ROTATION = \"rotation\",","    IDENTIFIER = \"identifier\";","","/**"," * Adds touch event facade normalization properties to the DOM event facade"," *"," * @method _touch"," * @for DOMEventFacade"," * @private"," * @param ev {Event} the DOM event"," * @param currentTarget {HTMLElement} the element the listener was attached to"," * @param wrapper {Event.Custom} the custom event wrapper for this DOM event"," */","Y.DOMEventFacade.prototype._touch = function(e, currentTarget, wrapper) {","","    var i,l, etCached, et,touchCache;","","","    if (e.touches) {","","        /**","         * Array of individual touch events for touch points that are still in","         * contact with the touch surface.","         *","         * @property touches","         * @type {DOMEventFacade[]}","         */","        this.touches = [];","        touchCache = {};","","        for (i = 0, l = e.touches.length; i < l; ++i) {","            et = e.touches[i];","            touchCache[Y.stamp(et)] = this.touches[i] = new Y.DOMEventFacade(et, currentTarget, wrapper);","        }","    }","","    if (e.targetTouches) {","","        /**","         * Array of individual touch events still in contact with the touch","         * surface and whose `touchstart` event occurred inside the same taregt","         * element as the current target element.","         *","         * @property targetTouches","         * @type {DOMEventFacade[]}","         */","        this.targetTouches = [];","","        for (i = 0, l = e.targetTouches.length; i < l; ++i) {","            et = e.targetTouches[i];","            etCached = touchCache && touchCache[Y.stamp(et, true)];","","            this.targetTouches[i] = etCached || new Y.DOMEventFacade(et, currentTarget, wrapper);","            ","        }","    }","","    if (e.changedTouches) {","","        /**","        An array of event-specific touch events.","","        For `touchstart`, the touch points that became active with the current","        event.","","        For `touchmove`, the touch points that have changed since the last","        event.","        ","        For `touchend`, the touch points that have been removed from the touch","        surface.","","        @property changedTouches","        @type {DOMEventFacade[]}","        **/","        this.changedTouches = [];","","        for (i = 0, l = e.changedTouches.length; i < l; ++i) {","            et = e.changedTouches[i];","            etCached = touchCache && touchCache[Y.stamp(et, true)];","","            this.changedTouches[i] = etCached || new Y.DOMEventFacade(et, currentTarget, wrapper);","            ","        }","    }","","    if (SCALE in e) {","        this[SCALE] = e[SCALE];","    }","","    if (ROTATION in e) {","        this[ROTATION] = e[ROTATION];","    }","","    if (IDENTIFIER in e) {","        this[IDENTIFIER] = e[IDENTIFIER];","    }","};","","//Adding MSPointer events to whitelisted DOM Events. MSPointer event payloads","//have the same properties as mouse events.","if (Y.Node.DOM_EVENTS) {","    Y.mix(Y.Node.DOM_EVENTS, {","        touchstart:1,","        touchmove:1,","        touchend:1,","        touchcancel:1,","        gesturestart:1,","        gesturechange:1,","        gestureend:1,","        MSPointerDown:1, ","        MSPointerUp:1,","        MSPointerMove:1","    });","}","","","}, '@VERSION@', {\"requires\": [\"node-base\"]});"];
_yuitest_coverage["build/event-touch/event-touch.js"].lines = {"1":0,"8":0,"22":0,"24":0,"27":0,"36":0,"37":0,"39":0,"40":0,"41":0,"45":0,"55":0,"57":0,"58":0,"59":0,"61":0,"66":0,"83":0,"85":0,"86":0,"87":0,"89":0,"94":0,"95":0,"98":0,"99":0,"102":0,"103":0,"109":0,"110":0};
_yuitest_coverage["build/event-touch/event-touch.js"].functions = {"_touch:22":0,"(anonymous 1):1":0};
_yuitest_coverage["build/event-touch/event-touch.js"].coveredLines = 30;
_yuitest_coverage["build/event-touch/event-touch.js"].coveredFunctions = 2;
_yuitest_coverline("build/event-touch/event-touch.js", 1);
YUI.add('event-touch', function (Y, NAME) {

/**
 * Adds touch event facade normalization properties (touches, changedTouches, targetTouches etc.) to the DOM event facade
 *
 * @module event-touch
 */
_yuitest_coverfunc("build/event-touch/event-touch.js", "(anonymous 1)", 1);
_yuitest_coverline("build/event-touch/event-touch.js", 8);
var SCALE = "scale",
    ROTATION = "rotation",
    IDENTIFIER = "identifier";

/**
 * Adds touch event facade normalization properties to the DOM event facade
 *
 * @method _touch
 * @for DOMEventFacade
 * @private
 * @param ev {Event} the DOM event
 * @param currentTarget {HTMLElement} the element the listener was attached to
 * @param wrapper {Event.Custom} the custom event wrapper for this DOM event
 */
_yuitest_coverline("build/event-touch/event-touch.js", 22);
Y.DOMEventFacade.prototype._touch = function(e, currentTarget, wrapper) {

    _yuitest_coverfunc("build/event-touch/event-touch.js", "_touch", 22);
_yuitest_coverline("build/event-touch/event-touch.js", 24);
var i,l, etCached, et,touchCache;


    _yuitest_coverline("build/event-touch/event-touch.js", 27);
if (e.touches) {

        /**
         * Array of individual touch events for touch points that are still in
         * contact with the touch surface.
         *
         * @property touches
         * @type {DOMEventFacade[]}
         */
        _yuitest_coverline("build/event-touch/event-touch.js", 36);
this.touches = [];
        _yuitest_coverline("build/event-touch/event-touch.js", 37);
touchCache = {};

        _yuitest_coverline("build/event-touch/event-touch.js", 39);
for (i = 0, l = e.touches.length; i < l; ++i) {
            _yuitest_coverline("build/event-touch/event-touch.js", 40);
et = e.touches[i];
            _yuitest_coverline("build/event-touch/event-touch.js", 41);
touchCache[Y.stamp(et)] = this.touches[i] = new Y.DOMEventFacade(et, currentTarget, wrapper);
        }
    }

    _yuitest_coverline("build/event-touch/event-touch.js", 45);
if (e.targetTouches) {

        /**
         * Array of individual touch events still in contact with the touch
         * surface and whose `touchstart` event occurred inside the same taregt
         * element as the current target element.
         *
         * @property targetTouches
         * @type {DOMEventFacade[]}
         */
        _yuitest_coverline("build/event-touch/event-touch.js", 55);
this.targetTouches = [];

        _yuitest_coverline("build/event-touch/event-touch.js", 57);
for (i = 0, l = e.targetTouches.length; i < l; ++i) {
            _yuitest_coverline("build/event-touch/event-touch.js", 58);
et = e.targetTouches[i];
            _yuitest_coverline("build/event-touch/event-touch.js", 59);
etCached = touchCache && touchCache[Y.stamp(et, true)];

            _yuitest_coverline("build/event-touch/event-touch.js", 61);
this.targetTouches[i] = etCached || new Y.DOMEventFacade(et, currentTarget, wrapper);
            
        }
    }

    _yuitest_coverline("build/event-touch/event-touch.js", 66);
if (e.changedTouches) {

        /**
        An array of event-specific touch events.

        For `touchstart`, the touch points that became active with the current
        event.

        For `touchmove`, the touch points that have changed since the last
        event.
        
        For `touchend`, the touch points that have been removed from the touch
        surface.

        @property changedTouches
        @type {DOMEventFacade[]}
        **/
        _yuitest_coverline("build/event-touch/event-touch.js", 83);
this.changedTouches = [];

        _yuitest_coverline("build/event-touch/event-touch.js", 85);
for (i = 0, l = e.changedTouches.length; i < l; ++i) {
            _yuitest_coverline("build/event-touch/event-touch.js", 86);
et = e.changedTouches[i];
            _yuitest_coverline("build/event-touch/event-touch.js", 87);
etCached = touchCache && touchCache[Y.stamp(et, true)];

            _yuitest_coverline("build/event-touch/event-touch.js", 89);
this.changedTouches[i] = etCached || new Y.DOMEventFacade(et, currentTarget, wrapper);
            
        }
    }

    _yuitest_coverline("build/event-touch/event-touch.js", 94);
if (SCALE in e) {
        _yuitest_coverline("build/event-touch/event-touch.js", 95);
this[SCALE] = e[SCALE];
    }

    _yuitest_coverline("build/event-touch/event-touch.js", 98);
if (ROTATION in e) {
        _yuitest_coverline("build/event-touch/event-touch.js", 99);
this[ROTATION] = e[ROTATION];
    }

    _yuitest_coverline("build/event-touch/event-touch.js", 102);
if (IDENTIFIER in e) {
        _yuitest_coverline("build/event-touch/event-touch.js", 103);
this[IDENTIFIER] = e[IDENTIFIER];
    }
};

//Adding MSPointer events to whitelisted DOM Events. MSPointer event payloads
//have the same properties as mouse events.
_yuitest_coverline("build/event-touch/event-touch.js", 109);
if (Y.Node.DOM_EVENTS) {
    _yuitest_coverline("build/event-touch/event-touch.js", 110);
Y.mix(Y.Node.DOM_EVENTS, {
        touchstart:1,
        touchmove:1,
        touchend:1,
        touchcancel:1,
        gesturestart:1,
        gesturechange:1,
        gestureend:1,
        MSPointerDown:1, 
        MSPointerUp:1,
        MSPointerMove:1
    });
}


}, '@VERSION@', {"requires": ["node-base"]});
