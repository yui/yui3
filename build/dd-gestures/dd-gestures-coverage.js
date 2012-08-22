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
_yuitest_coverage["dd-gestures"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "dd-gestures",
    code: []
};
_yuitest_coverage["dd-gestures"].code=["YUI.add('dd-gestures', function (Y, NAME) {","","","    /**","    * This module is the conditional loaded `dd` module to support gesture events","    * in the event that `dd` is loaded onto a device that support touch based events.","    *","    * This module is loaded and over rides 2 key methods on `DD.Drag` and `DD.DDM` to","    * attach the gesture events. Overrides `DD.Drag._prep` and `DD.DDM._setupListeners`","    * methods as well as set's the property `DD.Drag.START_EVENT` to `gesturemovestart`","    * to enable gesture movement instead of mouse based movement.","    * @module dd","    * @submodule dd-gestures","    */","    ","    Y.DD.Drag.START_EVENT = 'gesturemovestart';","","    Y.DD.Drag.prototype._prep = function() {","        this._dragThreshMet = false;","        var node = this.get('node'), DDM = Y.DD.DDM;","","        node.addClass(DDM.CSS_PREFIX + '-draggable');","","        node.on(Y.DD.Drag.START_EVENT, Y.bind(this._handleMouseDownEvent, this), {","            minDistance: 0,","            minTime: 0","        });","","        node.on('gesturemoveend', Y.bind(this._handleMouseUp, this), { standAlone: true });","        node.on('dragstart', Y.bind(this._fixDragStart, this));","","    };","","    Y.DD.DDM._setupListeners = function() {","        var DDM = Y.DD.DDM;","","        this._createPG();","        this._active = true;","        Y.one(Y.config.doc).on('gesturemove', Y.throttle(Y.bind(DDM._move, DDM), DDM.get('throttleTime')), { standAlone: true });","    };","","","","}, '@VERSION@', {\"requires\": [\"dd-drag\", \"event-synthetic\", \"event-gestures\"]});"];
_yuitest_coverage["dd-gestures"].lines = {"1":0,"16":0,"18":0,"19":0,"20":0,"22":0,"24":0,"29":0,"30":0,"34":0,"35":0,"37":0,"38":0,"39":0};
_yuitest_coverage["dd-gestures"].functions = {"_prep:18":0,"_setupListeners:34":0,"(anonymous 1):1":0};
_yuitest_coverage["dd-gestures"].coveredLines = 14;
_yuitest_coverage["dd-gestures"].coveredFunctions = 3;
_yuitest_coverline("dd-gestures", 1);
YUI.add('dd-gestures', function (Y, NAME) {


    /**
    * This module is the conditional loaded `dd` module to support gesture events
    * in the event that `dd` is loaded onto a device that support touch based events.
    *
    * This module is loaded and over rides 2 key methods on `DD.Drag` and `DD.DDM` to
    * attach the gesture events. Overrides `DD.Drag._prep` and `DD.DDM._setupListeners`
    * methods as well as set's the property `DD.Drag.START_EVENT` to `gesturemovestart`
    * to enable gesture movement instead of mouse based movement.
    * @module dd
    * @submodule dd-gestures
    */
    
    _yuitest_coverfunc("dd-gestures", "(anonymous 1)", 1);
_yuitest_coverline("dd-gestures", 16);
Y.DD.Drag.START_EVENT = 'gesturemovestart';

    _yuitest_coverline("dd-gestures", 18);
Y.DD.Drag.prototype._prep = function() {
        _yuitest_coverfunc("dd-gestures", "_prep", 18);
_yuitest_coverline("dd-gestures", 19);
this._dragThreshMet = false;
        _yuitest_coverline("dd-gestures", 20);
var node = this.get('node'), DDM = Y.DD.DDM;

        _yuitest_coverline("dd-gestures", 22);
node.addClass(DDM.CSS_PREFIX + '-draggable');

        _yuitest_coverline("dd-gestures", 24);
node.on(Y.DD.Drag.START_EVENT, Y.bind(this._handleMouseDownEvent, this), {
            minDistance: 0,
            minTime: 0
        });

        _yuitest_coverline("dd-gestures", 29);
node.on('gesturemoveend', Y.bind(this._handleMouseUp, this), { standAlone: true });
        _yuitest_coverline("dd-gestures", 30);
node.on('dragstart', Y.bind(this._fixDragStart, this));

    };

    _yuitest_coverline("dd-gestures", 34);
Y.DD.DDM._setupListeners = function() {
        _yuitest_coverfunc("dd-gestures", "_setupListeners", 34);
_yuitest_coverline("dd-gestures", 35);
var DDM = Y.DD.DDM;

        _yuitest_coverline("dd-gestures", 37);
this._createPG();
        _yuitest_coverline("dd-gestures", 38);
this._active = true;
        _yuitest_coverline("dd-gestures", 39);
Y.one(Y.config.doc).on('gesturemove', Y.throttle(Y.bind(DDM._move, DDM), DDM.get('throttleTime')), { standAlone: true });
    };



}, '@VERSION@', {"requires": ["dd-drag", "event-synthetic", "event-gestures"]});
