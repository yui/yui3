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
_yuitest_coverage["dd-ddm"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "dd-ddm",
    code: []
};
_yuitest_coverage["dd-ddm"].code=["YUI.add('dd-ddm', function (Y, NAME) {","","","    /**","     * Extends the dd-ddm-base Class to add support for the viewport shim to allow a draggable node to drag to be dragged over an iframe or any other node that traps mousemove events.","     * It is also required to have Drop Targets enabled, as the viewport shim will contain the shims for the Drop Targets.","     * @module dd","     * @submodule dd-ddm","     * @for DDM","     * @namespace DD","     */","    Y.mix(Y.DD.DDM, {","        /**","        * @private","        * @property _pg","        * @description The shim placed over the screen to track the mousemove event.","        * @type {Node}","        */","        _pg: null,","        /**","        * @private","        * @property _debugShim","        * @description Set this to true to set the shims opacity to .5 for debugging it, default: false.","        * @type {Boolean}","        */","        _debugShim: false,","        _activateTargets: function() { },","        _deactivateTargets: function() {},","        _startDrag: function() {","            if (this.activeDrag && this.activeDrag.get('useShim')) {","                this._pg_activate();","                this._activateTargets();","            }","        },","        _endDrag: function() {","            this._pg_deactivate();","            this._deactivateTargets();","        },","        /**","        * @private","        * @method _pg_deactivate","        * @description Deactivates the shim","        */","        _pg_deactivate: function() {","            this._pg.setStyle('display', 'none');","        },","        /**","        * @private","        * @method _pg_activate","        * @description Activates the shim","        */","        _pg_activate: function() {","            if (!this._pg) {","                this._createPG();","            }","            var ah = this.activeDrag.get('activeHandle'), cur = 'auto';","            if (ah) {","                cur = ah.getStyle('cursor');","            }","            if (cur == 'auto') {","                cur = this.get('dragCursor');","            }","            ","            this._pg_size();","            this._pg.setStyles({","                top: 0,","                left: 0,","                display: 'block',","                opacity: ((this._debugShim) ? '.5' : '0'),","                cursor: cur","            });","        },","        /**","        * @private","        * @method _pg_size","        * @description Sizes the shim on: activatation, window:scroll, window:resize","        */","        _pg_size: function() {","            if (this.activeDrag) {","                var b = Y.one('body'),","                h = b.get('docHeight'),","                w = b.get('docWidth');","                this._pg.setStyles({","                    height: h + 'px',","                    width: w + 'px'","                });","            }","        },","        /**","        * @private","        * @method _createPG","        * @description Creates the shim and adds it's listeners to it.","        */","        _createPG: function() {","            var pg = Y.Node.create('<div></div>'),","            bd = Y.one('body'), win;","            pg.setStyles({","                top: '0',","                left: '0',","                position: 'absolute',","                zIndex: '9999',","                overflow: 'hidden',","                backgroundColor: 'red',","                display: 'none',","                height: '5px',","                width: '5px'","            });","            pg.set('id', Y.stamp(pg));","            pg.addClass(Y.DD.DDM.CSS_PREFIX + '-shim');","            bd.prepend(pg);","            this._pg = pg;","            this._pg.on('mousemove', Y.throttle(Y.bind(this._move, this), this.get('throttleTime')));","            this._pg.on('mouseup', Y.bind(this._end, this));","            ","            win = Y.one('win');","            Y.on('window:resize', Y.bind(this._pg_size, this));","            win.on('scroll', Y.bind(this._pg_size, this));","        }   ","    }, true);","","","","","}, '@VERSION@', {\"requires\": [\"dd-ddm-base\", \"event-resize\"]});"];
_yuitest_coverage["dd-ddm"].lines = {"1":0,"12":0,"30":0,"31":0,"32":0,"36":0,"37":0,"45":0,"53":0,"54":0,"56":0,"57":0,"58":0,"60":0,"61":0,"64":0,"65":0,"79":0,"80":0,"83":0,"95":0,"97":0,"108":0,"109":0,"110":0,"111":0,"112":0,"113":0,"115":0,"116":0,"117":0};
_yuitest_coverage["dd-ddm"].functions = {"_startDrag:29":0,"_endDrag:35":0,"_pg_deactivate:44":0,"_pg_activate:52":0,"_pg_size:78":0,"_createPG:94":0,"(anonymous 1):1":0};
_yuitest_coverage["dd-ddm"].coveredLines = 31;
_yuitest_coverage["dd-ddm"].coveredFunctions = 7;
_yuitest_coverline("dd-ddm", 1);
YUI.add('dd-ddm', function (Y, NAME) {


    /**
     * Extends the dd-ddm-base Class to add support for the viewport shim to allow a draggable node to drag to be dragged over an iframe or any other node that traps mousemove events.
     * It is also required to have Drop Targets enabled, as the viewport shim will contain the shims for the Drop Targets.
     * @module dd
     * @submodule dd-ddm
     * @for DDM
     * @namespace DD
     */
    _yuitest_coverfunc("dd-ddm", "(anonymous 1)", 1);
_yuitest_coverline("dd-ddm", 12);
Y.mix(Y.DD.DDM, {
        /**
        * @private
        * @property _pg
        * @description The shim placed over the screen to track the mousemove event.
        * @type {Node}
        */
        _pg: null,
        /**
        * @private
        * @property _debugShim
        * @description Set this to true to set the shims opacity to .5 for debugging it, default: false.
        * @type {Boolean}
        */
        _debugShim: false,
        _activateTargets: function() { },
        _deactivateTargets: function() {},
        _startDrag: function() {
            _yuitest_coverfunc("dd-ddm", "_startDrag", 29);
_yuitest_coverline("dd-ddm", 30);
if (this.activeDrag && this.activeDrag.get('useShim')) {
                _yuitest_coverline("dd-ddm", 31);
this._pg_activate();
                _yuitest_coverline("dd-ddm", 32);
this._activateTargets();
            }
        },
        _endDrag: function() {
            _yuitest_coverfunc("dd-ddm", "_endDrag", 35);
_yuitest_coverline("dd-ddm", 36);
this._pg_deactivate();
            _yuitest_coverline("dd-ddm", 37);
this._deactivateTargets();
        },
        /**
        * @private
        * @method _pg_deactivate
        * @description Deactivates the shim
        */
        _pg_deactivate: function() {
            _yuitest_coverfunc("dd-ddm", "_pg_deactivate", 44);
_yuitest_coverline("dd-ddm", 45);
this._pg.setStyle('display', 'none');
        },
        /**
        * @private
        * @method _pg_activate
        * @description Activates the shim
        */
        _pg_activate: function() {
            _yuitest_coverfunc("dd-ddm", "_pg_activate", 52);
_yuitest_coverline("dd-ddm", 53);
if (!this._pg) {
                _yuitest_coverline("dd-ddm", 54);
this._createPG();
            }
            _yuitest_coverline("dd-ddm", 56);
var ah = this.activeDrag.get('activeHandle'), cur = 'auto';
            _yuitest_coverline("dd-ddm", 57);
if (ah) {
                _yuitest_coverline("dd-ddm", 58);
cur = ah.getStyle('cursor');
            }
            _yuitest_coverline("dd-ddm", 60);
if (cur == 'auto') {
                _yuitest_coverline("dd-ddm", 61);
cur = this.get('dragCursor');
            }
            
            _yuitest_coverline("dd-ddm", 64);
this._pg_size();
            _yuitest_coverline("dd-ddm", 65);
this._pg.setStyles({
                top: 0,
                left: 0,
                display: 'block',
                opacity: ((this._debugShim) ? '.5' : '0'),
                cursor: cur
            });
        },
        /**
        * @private
        * @method _pg_size
        * @description Sizes the shim on: activatation, window:scroll, window:resize
        */
        _pg_size: function() {
            _yuitest_coverfunc("dd-ddm", "_pg_size", 78);
_yuitest_coverline("dd-ddm", 79);
if (this.activeDrag) {
                _yuitest_coverline("dd-ddm", 80);
var b = Y.one('body'),
                h = b.get('docHeight'),
                w = b.get('docWidth');
                _yuitest_coverline("dd-ddm", 83);
this._pg.setStyles({
                    height: h + 'px',
                    width: w + 'px'
                });
            }
        },
        /**
        * @private
        * @method _createPG
        * @description Creates the shim and adds it's listeners to it.
        */
        _createPG: function() {
            _yuitest_coverfunc("dd-ddm", "_createPG", 94);
_yuitest_coverline("dd-ddm", 95);
var pg = Y.Node.create('<div></div>'),
            bd = Y.one('body'), win;
            _yuitest_coverline("dd-ddm", 97);
pg.setStyles({
                top: '0',
                left: '0',
                position: 'absolute',
                zIndex: '9999',
                overflow: 'hidden',
                backgroundColor: 'red',
                display: 'none',
                height: '5px',
                width: '5px'
            });
            _yuitest_coverline("dd-ddm", 108);
pg.set('id', Y.stamp(pg));
            _yuitest_coverline("dd-ddm", 109);
pg.addClass(Y.DD.DDM.CSS_PREFIX + '-shim');
            _yuitest_coverline("dd-ddm", 110);
bd.prepend(pg);
            _yuitest_coverline("dd-ddm", 111);
this._pg = pg;
            _yuitest_coverline("dd-ddm", 112);
this._pg.on('mousemove', Y.throttle(Y.bind(this._move, this), this.get('throttleTime')));
            _yuitest_coverline("dd-ddm", 113);
this._pg.on('mouseup', Y.bind(this._end, this));
            
            _yuitest_coverline("dd-ddm", 115);
win = Y.one('win');
            _yuitest_coverline("dd-ddm", 116);
Y.on('window:resize', Y.bind(this._pg_size, this));
            _yuitest_coverline("dd-ddm", 117);
win.on('scroll', Y.bind(this._pg_size, this));
        }   
    }, true);




}, '@VERSION@', {"requires": ["dd-ddm-base", "event-resize"]});
