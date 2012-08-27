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
_yuitest_coverage["dd-drop"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "dd-drop",
    code: []
};
_yuitest_coverage["dd-drop"].code=["YUI.add('dd-drop', function (Y, NAME) {","","","    /**","     * Provides the ability to create a Drop Target.","     * @module dd","     * @submodule dd-drop","     */     ","    /**","     * Provides the ability to create a Drop Target.","     * @class Drop","     * @extends Base","     * @constructor","     * @namespace DD","     */","","    var NODE = 'node',","        DDM = Y.DD.DDM,","        OFFSET_HEIGHT = 'offsetHeight',","        OFFSET_WIDTH = 'offsetWidth',","        /**","        * @event drop:over","        * @description Fires when a drag element is over this target.","        * @param {EventFacade} event An Event Facade object with the following specific property added:","        * <dl>","        * <dt>drop</dt><dd>The drop object at the time of the event.</dd>","        * <dt>drag</dt><dd>The drag object at the time of the event.</dd>","        * </dl>        ","        * @bubbles DDM","        * @type {CustomEvent}","        */","        EV_DROP_OVER = 'drop:over',","        /**","        * @event drop:enter","        * @description Fires when a drag element enters this target.","        * @param {EventFacade} event An Event Facade object with the following specific property added:","        * <dl>","        * <dt>drop</dt><dd>The drop object at the time of the event.</dd>","        * <dt>drag</dt><dd>The drag object at the time of the event.</dd>","        * </dl>        ","        * @bubbles DDM","        * @type {CustomEvent}","        */","        EV_DROP_ENTER = 'drop:enter',","        /**","        * @event drop:exit","        * @description Fires when a drag element exits this target.","        * @param {EventFacade} event An Event Facade object","        * @bubbles DDM","        * @type {CustomEvent}","        */","        EV_DROP_EXIT = 'drop:exit',","","        /**","        * @event drop:hit","        * @description Fires when a draggable node is dropped on this Drop Target. (Fired from dd-ddm-drop)","        * @param {EventFacade} event An Event Facade object with the following specific property added:","        * <dl>","        * <dt>drop</dt><dd>The best guess on what was dropped on.</dd>","        * <dt>drag</dt><dd>The drag object at the time of the event.</dd>","        * <dt>others</dt><dd>An array of all the other drop targets that was dropped on.</dd>","        * </dl>        ","        * @bubbles DDM","        * @type {CustomEvent}","        */","        ","","    Drop = function() {","        this._lazyAddAttrs = false;","        Drop.superclass.constructor.apply(this, arguments);","","","        //DD init speed up.","        Y.on('domready', Y.bind(function() {","            Y.later(100, this, this._createShim);","        }, this));","        DDM._regTarget(this);","","        /* TODO","        if (Dom.getStyle(this.el, 'position') == 'fixed') {","            Event.on(window, 'scroll', function() {","                this.activateShim();","            }, this, true);","        }","        */","    };","","    Drop.NAME = 'drop';","","    Drop.ATTRS = {","        /**","        * @attribute node","        * @description Y.Node instanace to use as the element to make a Drop Target","        * @type Node","        */        ","        node: {","            setter: function(node) {","                var n = Y.one(node);","                if (!n) {","                    Y.error('DD.Drop: Invalid Node Given: ' + node);","                }","                return n;               ","            }","        },","        /**","        * @attribute groups","        * @description Array of groups to add this drop into.","        * @type Array","        */        ","        groups: {","            value: ['default'],","            getter: function() {","                if (!this._groups) {","                    this._groups = {};","                }","                var ret = [];","                Y.each(this._groups, function(v, k) {","                    ret[ret.length] = k;","                });","                return ret;","            },            ","            setter: function(g) {","                this._groups = {};","                Y.each(g, function(v, k) {","                    this._groups[v] = true;","                }, this);","                return g;","            }","        },   ","        /**","        * @attribute padding","        * @description CSS style padding to make the Drop Target bigger than the node.","        * @type String","        */","        padding: {","            value: '0',","            setter: function(p) {","                return DDM.cssSizestoObject(p);","            }","        },","        /**","        * @attribute lock","        * @description Set to lock this drop element.","        * @type Boolean","        */        ","        lock: {","            value: false,","            setter: function(lock) {","                if (lock) {","                    this.get(NODE).addClass(DDM.CSS_PREFIX + '-drop-locked');","                } else {","                    this.get(NODE).removeClass(DDM.CSS_PREFIX + '-drop-locked');","                }","                return lock;","            }","        },","        /**","        * @deprecated","        * @attribute bubbles","        * @description Controls the default bubble parent for this Drop instance. Default: Y.DD.DDM. Set to false to disable bubbling. Use bubbleTargets in config.","        * @type Object","        */","        bubbles: {","            setter: function(t) {","                this.addTarget(t);","                return t;","            }","        },","        /**","        * @deprecated","        * @attribute useShim","        * @description Use the Drop shim. Default: true","        * @type Boolean","        */","        useShim: {","            value: true,","            setter: function(v) {","                Y.DD.DDM._noShim = !v;","                return v;","            }","        }","    };","","    Y.extend(Drop, Y.Base, {","        /**","        * @private","        * @property _bubbleTargets","        * @description The default bubbleTarget for this object. Default: Y.DD.DDM","        */","        _bubbleTargets: Y.DD.DDM,","        /**","        * @method addToGroup","        * @description Add this Drop instance to a group, this should be used for on-the-fly group additions.","        * @param {String} g The group to add this Drop Instance to.","        * @return {Self}","        * @chainable","        */","        addToGroup: function(g) {","            this._groups[g] = true;","            return this;","        },","        /**","        * @method removeFromGroup","        * @description Remove this Drop instance from a group, this should be used for on-the-fly group removals.","        * @param {String} g The group to remove this Drop Instance from.","        * @return {Self}","        * @chainable","        */","        removeFromGroup: function(g) {","            delete this._groups[g];","            return this;","        },","        /**","        * @private","        * @method _createEvents","        * @description This method creates all the events for this Event Target and publishes them so we get Event Bubbling.","        */","        _createEvents: function() {","            ","            var ev = [","                EV_DROP_OVER,","                EV_DROP_ENTER,","                EV_DROP_EXIT,","                'drop:hit'","            ];","","            Y.each(ev, function(v, k) {","                this.publish(v, {","                    type: v,","                    emitFacade: true,","                    preventable: false,","                    bubbles: true,","                    queuable: false,","                    prefix: 'drop'","                });","            }, this);","        },","        /**","        * @private","        * @property _valid","        * @description Flag for determining if the target is valid in this operation.","        * @type Boolean","        */","        _valid: null,","        /**","        * @private","        * @property _groups","        * @description The groups this target belongs to.","        * @type Array","        */","        _groups: null,","        /**","        * @property shim","        * @description Node reference to the targets shim","        * @type {Object}","        */","        shim: null,","        /**","        * @property region","        * @description A region object associated with this target, used for checking regions while dragging.","        * @type Object","        */","        region: null,","        /**","        * @property overTarget","        * @description This flag is tripped when a drag element is over this target.","        * @type Boolean","        */","        overTarget: null,","        /**","        * @method inGroup","        * @description Check if this target is in one of the supplied groups.","        * @param {Array} groups The groups to check against","        * @return Boolean","        */","        inGroup: function(groups) {","            this._valid = false;","            var ret = false;","            Y.each(groups, function(v, k) {","                if (this._groups[v]) {","                    ret = true;","                    this._valid = true;","                }","            }, this);","            return ret;","        },","        /**","        * @private","        * @method initializer","        * @description Private lifecycle method","        */","        initializer: function(cfg) {","            Y.later(100, this, this._createEvents);","","            var node = this.get(NODE), id;","            if (!node.get('id')) {","                id = Y.stamp(node);","                node.set('id', id);","            }","            node.addClass(DDM.CSS_PREFIX + '-drop');","            //Shouldn't have to do this..","            this.set('groups', this.get('groups'));           ","        },","        /**","        * @private","        * @method destructor","        * @description Lifecycle destructor, unreg the drag from the DDM and remove listeners","        */","        destructor: function() {","            DDM._unregTarget(this);","            if (this.shim && (this.shim !== this.get(NODE))) {","                this.shim.detachAll();","                this.shim.remove();","                this.shim = null;","            }","            this.get(NODE).removeClass(DDM.CSS_PREFIX + '-drop');","            this.detachAll();","        },","        /**","        * @private","        * @method _deactivateShim","        * @description Removes classes from the target, resets some flags and sets the shims deactive position [-999, -999]","        */","        _deactivateShim: function() {","            if (!this.shim) {","                return false;","            }","            this.get(NODE).removeClass(DDM.CSS_PREFIX + '-drop-active-valid');","            this.get(NODE).removeClass(DDM.CSS_PREFIX + '-drop-active-invalid');","            this.get(NODE).removeClass(DDM.CSS_PREFIX + '-drop-over');","","            if (this.get('useShim')) {","                this.shim.setStyles({","                    top: '-999px',","                    left: '-999px',","                    zIndex: '1'","                });","            }","            this.overTarget = false;","        },","        /**","        * @private","        * @method _activateShim","        * @description Activates the shim and adds some interaction CSS classes","        */","        _activateShim: function() {","            if (!DDM.activeDrag) {","                return false; //Nothing is dragging, no reason to activate.","            }","            if (this.get(NODE) === DDM.activeDrag.get(NODE)) {","                return false;","            }","            if (this.get('lock')) {","                return false;","            }","            var node = this.get(NODE);","            //TODO Visibility Check..","            //if (this.inGroup(DDM.activeDrag.get('groups')) && this.get(NODE).isVisible()) {","            if (this.inGroup(DDM.activeDrag.get('groups'))) {","                node.removeClass(DDM.CSS_PREFIX + '-drop-active-invalid');","                node.addClass(DDM.CSS_PREFIX + '-drop-active-valid');","                DDM._addValid(this);","                this.overTarget = false;","                if (!this.get('useShim')) {","                    this.shim = this.get(NODE);","                }","                this.sizeShim();","            } else {","                DDM._removeValid(this);","                node.removeClass(DDM.CSS_PREFIX + '-drop-active-valid');","                node.addClass(DDM.CSS_PREFIX + '-drop-active-invalid');","            }","        },","        /**","        * @method sizeShim","        * @description Positions and sizes the shim with the raw data from the node, this can be used to programatically adjust the Targets shim for Animation..","        */","        sizeShim: function() {","            if (!DDM.activeDrag) {","                return false; //Nothing is dragging, no reason to activate.","            }","            if (this.get(NODE) === DDM.activeDrag.get(NODE)) {","                return false;","            }","            //if (this.get('lock') || !this.get('useShim')) {","            if (this.get('lock')) {","                return false;","            }","            if (!this.shim) {","                Y.later(100, this, this.sizeShim);","                return false;","            }","            var node = this.get(NODE),","                nh = node.get(OFFSET_HEIGHT),","                nw = node.get(OFFSET_WIDTH),","                xy = node.getXY(),","                p = this.get('padding'),","                dd, dH, dW;","","","            //Apply padding","            nw = nw + p.left + p.right;","            nh = nh + p.top + p.bottom;","            xy[0] = xy[0] - p.left;","            xy[1] = xy[1] - p.top;","            ","","            if (DDM.activeDrag.get('dragMode') === DDM.INTERSECT) {","                //Intersect Mode, make the shim bigger","                dd = DDM.activeDrag;","                dH = dd.get(NODE).get(OFFSET_HEIGHT);","                dW = dd.get(NODE).get(OFFSET_WIDTH);","                ","                nh = (nh + dH);","                nw = (nw + dW);","                xy[0] = xy[0] - (dW - dd.deltaXY[0]);","                xy[1] = xy[1] - (dH - dd.deltaXY[1]);","","            }","            ","            if (this.get('useShim')) {","                //Set the style on the shim","                this.shim.setStyles({","                    height: nh + 'px',","                    width: nw + 'px',","                    top: xy[1] + 'px',","                    left: xy[0] + 'px'","                });","            }","","            //Create the region to be used by intersect when a drag node is over us.","            this.region = {","                '0': xy[0], ","                '1': xy[1],","                area: 0,","                top: xy[1],","                right: xy[0] + nw,","                bottom: xy[1] + nh,","                left: xy[0]","            };","        },","        /**","        * @private","        * @method _createShim","        * @description Creates the Target shim and adds it to the DDM's playground..","        */","        _createShim: function() {","            //No playground, defer","            if (!DDM._pg) {","                Y.later(10, this, this._createShim);","                return;","            }","            //Shim already here, cancel","            if (this.shim) {","                return;","            }","            var s = this.get('node');","","            if (this.get('useShim')) {","                s = Y.Node.create('<div id=\"' + this.get(NODE).get('id') + '_shim\"></div>');","                s.setStyles({","                    height: this.get(NODE).get(OFFSET_HEIGHT) + 'px',","                    width: this.get(NODE).get(OFFSET_WIDTH) + 'px',","                    backgroundColor: 'yellow',","                    opacity: '.5',","                    zIndex: '1',","                    overflow: 'hidden',","                    top: '-900px',","                    left: '-900px',","                    position:  'absolute'","                });","","                DDM._pg.appendChild(s);","","                s.on('mouseover', Y.bind(this._handleOverEvent, this));","                s.on('mouseout', Y.bind(this._handleOutEvent, this));","            }","","","            this.shim = s;","        },","        /**","        * @private","        * @method _handleOverTarget","        * @description This handles the over target call made from this object or from the DDM","        */","        _handleTargetOver: function() {","            if (DDM.isOverTarget(this)) {","                this.get(NODE).addClass(DDM.CSS_PREFIX + '-drop-over');","                DDM.activeDrop = this;","                DDM.otherDrops[this] = this;","                if (this.overTarget) {","                    DDM.activeDrag.fire('drag:over', { drop: this, drag: DDM.activeDrag });","                    this.fire(EV_DROP_OVER, { drop: this, drag: DDM.activeDrag });","                } else {","                    //Prevent an enter before a start..","                    if (DDM.activeDrag.get('dragging')) {","                        this.overTarget = true;","                        this.fire(EV_DROP_ENTER, { drop: this, drag: DDM.activeDrag });","                        DDM.activeDrag.fire('drag:enter', { drop: this, drag: DDM.activeDrag });","                        DDM.activeDrag.get(NODE).addClass(DDM.CSS_PREFIX + '-drag-over');","                        //TODO - Is this needed??","                        //DDM._handleTargetOver();","                    }","                }","            } else {","                this._handleOut();","            }","        },","        /**","        * @private","        * @method _handleOverEvent","        * @description Handles the mouseover DOM event on the Target Shim","        */","        _handleOverEvent: function() {","            this.shim.setStyle('zIndex', '999');","            DDM._addActiveShim(this);","        },","        /**","        * @private","        * @method _handleOutEvent","        * @description Handles the mouseout DOM event on the Target Shim","        */","        _handleOutEvent: function() {","            this.shim.setStyle('zIndex', '1');","            DDM._removeActiveShim(this);","        },","        /**","        * @private","        * @method _handleOut","        * @description Handles out of target calls/checks","        */","        _handleOut: function(force) {","            if (!DDM.isOverTarget(this) || force) {","                if (this.overTarget) {","                    this.overTarget = false;","                    if (!force) {","                        DDM._removeActiveShim(this);","                    }","                    if (DDM.activeDrag) {","                        this.get(NODE).removeClass(DDM.CSS_PREFIX + '-drop-over');","                        DDM.activeDrag.get(NODE).removeClass(DDM.CSS_PREFIX + '-drag-over');","                        this.fire(EV_DROP_EXIT, { drop: this, drag: DDM.activeDrag });","                        DDM.activeDrag.fire('drag:exit', { drop: this, drag: DDM.activeDrag });","                        delete DDM.otherDrops[this];","                    }","                }","            }","        }","    });","","    Y.DD.Drop = Drop;","","","","","}, '@VERSION@', {\"requires\": [\"dd-drag\", \"dd-ddm-drop\"]});"];
_yuitest_coverage["dd-drop"].lines = {"1":0,"17":0,"69":0,"70":0,"74":0,"75":0,"77":0,"88":0,"90":0,"98":0,"99":0,"100":0,"102":0,"113":0,"114":0,"116":0,"117":0,"118":0,"120":0,"123":0,"124":0,"125":0,"127":0,"138":0,"149":0,"150":0,"152":0,"154":0,"165":0,"166":0,"178":0,"179":0,"184":0,"199":0,"200":0,"210":0,"211":0,"220":0,"227":0,"228":0,"277":0,"278":0,"279":0,"280":0,"281":0,"282":0,"285":0,"293":0,"295":0,"296":0,"297":0,"298":0,"300":0,"302":0,"310":0,"311":0,"312":0,"313":0,"314":0,"316":0,"317":0,"325":0,"326":0,"328":0,"329":0,"330":0,"332":0,"333":0,"339":0,"347":0,"348":0,"350":0,"351":0,"353":0,"354":0,"356":0,"359":0,"360":0,"361":0,"362":0,"363":0,"364":0,"365":0,"367":0,"369":0,"370":0,"371":0,"379":0,"380":0,"382":0,"383":0,"386":0,"387":0,"389":0,"390":0,"391":0,"393":0,"402":0,"403":0,"404":0,"405":0,"408":0,"410":0,"411":0,"412":0,"414":0,"415":0,"416":0,"417":0,"421":0,"423":0,"432":0,"449":0,"450":0,"451":0,"454":0,"455":0,"457":0,"459":0,"460":0,"461":0,"473":0,"475":0,"476":0,"480":0,"488":0,"489":0,"490":0,"491":0,"492":0,"493":0,"494":0,"497":0,"498":0,"499":0,"500":0,"501":0,"507":0,"516":0,"517":0,"525":0,"526":0,"534":0,"535":0,"536":0,"537":0,"538":0,"540":0,"541":0,"542":0,"543":0,"544":0,"545":0,"552":0};
_yuitest_coverage["dd-drop"].functions = {"(anonymous 2):74":0,"Drop:68":0,"setter:97":0,"(anonymous 3):117":0,"getter:112":0,"(anonymous 4):124":0,"setter:122":0,"setter:137":0,"setter:148":0,"setter:164":0,"setter:177":0,"addToGroup:198":0,"removeFromGroup:209":0,"(anonymous 5):227":0,"_createEvents:218":0,"(anonymous 6):279":0,"inGroup:276":0,"initializer:292":0,"destructor:309":0,"_deactivateShim:324":0,"_activateShim:346":0,"sizeShim:378":0,"_createShim:447":0,"_handleTargetOver:487":0,"_handleOverEvent:515":0,"_handleOutEvent:524":0,"_handleOut:533":0,"(anonymous 1):1":0};
_yuitest_coverage["dd-drop"].coveredLines = 154;
_yuitest_coverage["dd-drop"].coveredFunctions = 28;
_yuitest_coverline("dd-drop", 1);
YUI.add('dd-drop', function (Y, NAME) {


    /**
     * Provides the ability to create a Drop Target.
     * @module dd
     * @submodule dd-drop
     */     
    /**
     * Provides the ability to create a Drop Target.
     * @class Drop
     * @extends Base
     * @constructor
     * @namespace DD
     */

    _yuitest_coverfunc("dd-drop", "(anonymous 1)", 1);
_yuitest_coverline("dd-drop", 17);
var NODE = 'node',
        DDM = Y.DD.DDM,
        OFFSET_HEIGHT = 'offsetHeight',
        OFFSET_WIDTH = 'offsetWidth',
        /**
        * @event drop:over
        * @description Fires when a drag element is over this target.
        * @param {EventFacade} event An Event Facade object with the following specific property added:
        * <dl>
        * <dt>drop</dt><dd>The drop object at the time of the event.</dd>
        * <dt>drag</dt><dd>The drag object at the time of the event.</dd>
        * </dl>        
        * @bubbles DDM
        * @type {CustomEvent}
        */
        EV_DROP_OVER = 'drop:over',
        /**
        * @event drop:enter
        * @description Fires when a drag element enters this target.
        * @param {EventFacade} event An Event Facade object with the following specific property added:
        * <dl>
        * <dt>drop</dt><dd>The drop object at the time of the event.</dd>
        * <dt>drag</dt><dd>The drag object at the time of the event.</dd>
        * </dl>        
        * @bubbles DDM
        * @type {CustomEvent}
        */
        EV_DROP_ENTER = 'drop:enter',
        /**
        * @event drop:exit
        * @description Fires when a drag element exits this target.
        * @param {EventFacade} event An Event Facade object
        * @bubbles DDM
        * @type {CustomEvent}
        */
        EV_DROP_EXIT = 'drop:exit',

        /**
        * @event drop:hit
        * @description Fires when a draggable node is dropped on this Drop Target. (Fired from dd-ddm-drop)
        * @param {EventFacade} event An Event Facade object with the following specific property added:
        * <dl>
        * <dt>drop</dt><dd>The best guess on what was dropped on.</dd>
        * <dt>drag</dt><dd>The drag object at the time of the event.</dd>
        * <dt>others</dt><dd>An array of all the other drop targets that was dropped on.</dd>
        * </dl>        
        * @bubbles DDM
        * @type {CustomEvent}
        */
        

    Drop = function() {
        _yuitest_coverfunc("dd-drop", "Drop", 68);
_yuitest_coverline("dd-drop", 69);
this._lazyAddAttrs = false;
        _yuitest_coverline("dd-drop", 70);
Drop.superclass.constructor.apply(this, arguments);


        //DD init speed up.
        _yuitest_coverline("dd-drop", 74);
Y.on('domready', Y.bind(function() {
            _yuitest_coverfunc("dd-drop", "(anonymous 2)", 74);
_yuitest_coverline("dd-drop", 75);
Y.later(100, this, this._createShim);
        }, this));
        _yuitest_coverline("dd-drop", 77);
DDM._regTarget(this);

        /* TODO
        if (Dom.getStyle(this.el, 'position') == 'fixed') {
            Event.on(window, 'scroll', function() {
                this.activateShim();
            }, this, true);
        }
        */
    };

    _yuitest_coverline("dd-drop", 88);
Drop.NAME = 'drop';

    _yuitest_coverline("dd-drop", 90);
Drop.ATTRS = {
        /**
        * @attribute node
        * @description Y.Node instanace to use as the element to make a Drop Target
        * @type Node
        */        
        node: {
            setter: function(node) {
                _yuitest_coverfunc("dd-drop", "setter", 97);
_yuitest_coverline("dd-drop", 98);
var n = Y.one(node);
                _yuitest_coverline("dd-drop", 99);
if (!n) {
                    _yuitest_coverline("dd-drop", 100);
Y.error('DD.Drop: Invalid Node Given: ' + node);
                }
                _yuitest_coverline("dd-drop", 102);
return n;               
            }
        },
        /**
        * @attribute groups
        * @description Array of groups to add this drop into.
        * @type Array
        */        
        groups: {
            value: ['default'],
            getter: function() {
                _yuitest_coverfunc("dd-drop", "getter", 112);
_yuitest_coverline("dd-drop", 113);
if (!this._groups) {
                    _yuitest_coverline("dd-drop", 114);
this._groups = {};
                }
                _yuitest_coverline("dd-drop", 116);
var ret = [];
                _yuitest_coverline("dd-drop", 117);
Y.each(this._groups, function(v, k) {
                    _yuitest_coverfunc("dd-drop", "(anonymous 3)", 117);
_yuitest_coverline("dd-drop", 118);
ret[ret.length] = k;
                });
                _yuitest_coverline("dd-drop", 120);
return ret;
            },            
            setter: function(g) {
                _yuitest_coverfunc("dd-drop", "setter", 122);
_yuitest_coverline("dd-drop", 123);
this._groups = {};
                _yuitest_coverline("dd-drop", 124);
Y.each(g, function(v, k) {
                    _yuitest_coverfunc("dd-drop", "(anonymous 4)", 124);
_yuitest_coverline("dd-drop", 125);
this._groups[v] = true;
                }, this);
                _yuitest_coverline("dd-drop", 127);
return g;
            }
        },   
        /**
        * @attribute padding
        * @description CSS style padding to make the Drop Target bigger than the node.
        * @type String
        */
        padding: {
            value: '0',
            setter: function(p) {
                _yuitest_coverfunc("dd-drop", "setter", 137);
_yuitest_coverline("dd-drop", 138);
return DDM.cssSizestoObject(p);
            }
        },
        /**
        * @attribute lock
        * @description Set to lock this drop element.
        * @type Boolean
        */        
        lock: {
            value: false,
            setter: function(lock) {
                _yuitest_coverfunc("dd-drop", "setter", 148);
_yuitest_coverline("dd-drop", 149);
if (lock) {
                    _yuitest_coverline("dd-drop", 150);
this.get(NODE).addClass(DDM.CSS_PREFIX + '-drop-locked');
                } else {
                    _yuitest_coverline("dd-drop", 152);
this.get(NODE).removeClass(DDM.CSS_PREFIX + '-drop-locked');
                }
                _yuitest_coverline("dd-drop", 154);
return lock;
            }
        },
        /**
        * @deprecated
        * @attribute bubbles
        * @description Controls the default bubble parent for this Drop instance. Default: Y.DD.DDM. Set to false to disable bubbling. Use bubbleTargets in config.
        * @type Object
        */
        bubbles: {
            setter: function(t) {
                _yuitest_coverfunc("dd-drop", "setter", 164);
_yuitest_coverline("dd-drop", 165);
this.addTarget(t);
                _yuitest_coverline("dd-drop", 166);
return t;
            }
        },
        /**
        * @deprecated
        * @attribute useShim
        * @description Use the Drop shim. Default: true
        * @type Boolean
        */
        useShim: {
            value: true,
            setter: function(v) {
                _yuitest_coverfunc("dd-drop", "setter", 177);
_yuitest_coverline("dd-drop", 178);
Y.DD.DDM._noShim = !v;
                _yuitest_coverline("dd-drop", 179);
return v;
            }
        }
    };

    _yuitest_coverline("dd-drop", 184);
Y.extend(Drop, Y.Base, {
        /**
        * @private
        * @property _bubbleTargets
        * @description The default bubbleTarget for this object. Default: Y.DD.DDM
        */
        _bubbleTargets: Y.DD.DDM,
        /**
        * @method addToGroup
        * @description Add this Drop instance to a group, this should be used for on-the-fly group additions.
        * @param {String} g The group to add this Drop Instance to.
        * @return {Self}
        * @chainable
        */
        addToGroup: function(g) {
            _yuitest_coverfunc("dd-drop", "addToGroup", 198);
_yuitest_coverline("dd-drop", 199);
this._groups[g] = true;
            _yuitest_coverline("dd-drop", 200);
return this;
        },
        /**
        * @method removeFromGroup
        * @description Remove this Drop instance from a group, this should be used for on-the-fly group removals.
        * @param {String} g The group to remove this Drop Instance from.
        * @return {Self}
        * @chainable
        */
        removeFromGroup: function(g) {
            _yuitest_coverfunc("dd-drop", "removeFromGroup", 209);
_yuitest_coverline("dd-drop", 210);
delete this._groups[g];
            _yuitest_coverline("dd-drop", 211);
return this;
        },
        /**
        * @private
        * @method _createEvents
        * @description This method creates all the events for this Event Target and publishes them so we get Event Bubbling.
        */
        _createEvents: function() {
            
            _yuitest_coverfunc("dd-drop", "_createEvents", 218);
_yuitest_coverline("dd-drop", 220);
var ev = [
                EV_DROP_OVER,
                EV_DROP_ENTER,
                EV_DROP_EXIT,
                'drop:hit'
            ];

            _yuitest_coverline("dd-drop", 227);
Y.each(ev, function(v, k) {
                _yuitest_coverfunc("dd-drop", "(anonymous 5)", 227);
_yuitest_coverline("dd-drop", 228);
this.publish(v, {
                    type: v,
                    emitFacade: true,
                    preventable: false,
                    bubbles: true,
                    queuable: false,
                    prefix: 'drop'
                });
            }, this);
        },
        /**
        * @private
        * @property _valid
        * @description Flag for determining if the target is valid in this operation.
        * @type Boolean
        */
        _valid: null,
        /**
        * @private
        * @property _groups
        * @description The groups this target belongs to.
        * @type Array
        */
        _groups: null,
        /**
        * @property shim
        * @description Node reference to the targets shim
        * @type {Object}
        */
        shim: null,
        /**
        * @property region
        * @description A region object associated with this target, used for checking regions while dragging.
        * @type Object
        */
        region: null,
        /**
        * @property overTarget
        * @description This flag is tripped when a drag element is over this target.
        * @type Boolean
        */
        overTarget: null,
        /**
        * @method inGroup
        * @description Check if this target is in one of the supplied groups.
        * @param {Array} groups The groups to check against
        * @return Boolean
        */
        inGroup: function(groups) {
            _yuitest_coverfunc("dd-drop", "inGroup", 276);
_yuitest_coverline("dd-drop", 277);
this._valid = false;
            _yuitest_coverline("dd-drop", 278);
var ret = false;
            _yuitest_coverline("dd-drop", 279);
Y.each(groups, function(v, k) {
                _yuitest_coverfunc("dd-drop", "(anonymous 6)", 279);
_yuitest_coverline("dd-drop", 280);
if (this._groups[v]) {
                    _yuitest_coverline("dd-drop", 281);
ret = true;
                    _yuitest_coverline("dd-drop", 282);
this._valid = true;
                }
            }, this);
            _yuitest_coverline("dd-drop", 285);
return ret;
        },
        /**
        * @private
        * @method initializer
        * @description Private lifecycle method
        */
        initializer: function(cfg) {
            _yuitest_coverfunc("dd-drop", "initializer", 292);
_yuitest_coverline("dd-drop", 293);
Y.later(100, this, this._createEvents);

            _yuitest_coverline("dd-drop", 295);
var node = this.get(NODE), id;
            _yuitest_coverline("dd-drop", 296);
if (!node.get('id')) {
                _yuitest_coverline("dd-drop", 297);
id = Y.stamp(node);
                _yuitest_coverline("dd-drop", 298);
node.set('id', id);
            }
            _yuitest_coverline("dd-drop", 300);
node.addClass(DDM.CSS_PREFIX + '-drop');
            //Shouldn't have to do this..
            _yuitest_coverline("dd-drop", 302);
this.set('groups', this.get('groups'));           
        },
        /**
        * @private
        * @method destructor
        * @description Lifecycle destructor, unreg the drag from the DDM and remove listeners
        */
        destructor: function() {
            _yuitest_coverfunc("dd-drop", "destructor", 309);
_yuitest_coverline("dd-drop", 310);
DDM._unregTarget(this);
            _yuitest_coverline("dd-drop", 311);
if (this.shim && (this.shim !== this.get(NODE))) {
                _yuitest_coverline("dd-drop", 312);
this.shim.detachAll();
                _yuitest_coverline("dd-drop", 313);
this.shim.remove();
                _yuitest_coverline("dd-drop", 314);
this.shim = null;
            }
            _yuitest_coverline("dd-drop", 316);
this.get(NODE).removeClass(DDM.CSS_PREFIX + '-drop');
            _yuitest_coverline("dd-drop", 317);
this.detachAll();
        },
        /**
        * @private
        * @method _deactivateShim
        * @description Removes classes from the target, resets some flags and sets the shims deactive position [-999, -999]
        */
        _deactivateShim: function() {
            _yuitest_coverfunc("dd-drop", "_deactivateShim", 324);
_yuitest_coverline("dd-drop", 325);
if (!this.shim) {
                _yuitest_coverline("dd-drop", 326);
return false;
            }
            _yuitest_coverline("dd-drop", 328);
this.get(NODE).removeClass(DDM.CSS_PREFIX + '-drop-active-valid');
            _yuitest_coverline("dd-drop", 329);
this.get(NODE).removeClass(DDM.CSS_PREFIX + '-drop-active-invalid');
            _yuitest_coverline("dd-drop", 330);
this.get(NODE).removeClass(DDM.CSS_PREFIX + '-drop-over');

            _yuitest_coverline("dd-drop", 332);
if (this.get('useShim')) {
                _yuitest_coverline("dd-drop", 333);
this.shim.setStyles({
                    top: '-999px',
                    left: '-999px',
                    zIndex: '1'
                });
            }
            _yuitest_coverline("dd-drop", 339);
this.overTarget = false;
        },
        /**
        * @private
        * @method _activateShim
        * @description Activates the shim and adds some interaction CSS classes
        */
        _activateShim: function() {
            _yuitest_coverfunc("dd-drop", "_activateShim", 346);
_yuitest_coverline("dd-drop", 347);
if (!DDM.activeDrag) {
                _yuitest_coverline("dd-drop", 348);
return false; //Nothing is dragging, no reason to activate.
            }
            _yuitest_coverline("dd-drop", 350);
if (this.get(NODE) === DDM.activeDrag.get(NODE)) {
                _yuitest_coverline("dd-drop", 351);
return false;
            }
            _yuitest_coverline("dd-drop", 353);
if (this.get('lock')) {
                _yuitest_coverline("dd-drop", 354);
return false;
            }
            _yuitest_coverline("dd-drop", 356);
var node = this.get(NODE);
            //TODO Visibility Check..
            //if (this.inGroup(DDM.activeDrag.get('groups')) && this.get(NODE).isVisible()) {
            _yuitest_coverline("dd-drop", 359);
if (this.inGroup(DDM.activeDrag.get('groups'))) {
                _yuitest_coverline("dd-drop", 360);
node.removeClass(DDM.CSS_PREFIX + '-drop-active-invalid');
                _yuitest_coverline("dd-drop", 361);
node.addClass(DDM.CSS_PREFIX + '-drop-active-valid');
                _yuitest_coverline("dd-drop", 362);
DDM._addValid(this);
                _yuitest_coverline("dd-drop", 363);
this.overTarget = false;
                _yuitest_coverline("dd-drop", 364);
if (!this.get('useShim')) {
                    _yuitest_coverline("dd-drop", 365);
this.shim = this.get(NODE);
                }
                _yuitest_coverline("dd-drop", 367);
this.sizeShim();
            } else {
                _yuitest_coverline("dd-drop", 369);
DDM._removeValid(this);
                _yuitest_coverline("dd-drop", 370);
node.removeClass(DDM.CSS_PREFIX + '-drop-active-valid');
                _yuitest_coverline("dd-drop", 371);
node.addClass(DDM.CSS_PREFIX + '-drop-active-invalid');
            }
        },
        /**
        * @method sizeShim
        * @description Positions and sizes the shim with the raw data from the node, this can be used to programatically adjust the Targets shim for Animation..
        */
        sizeShim: function() {
            _yuitest_coverfunc("dd-drop", "sizeShim", 378);
_yuitest_coverline("dd-drop", 379);
if (!DDM.activeDrag) {
                _yuitest_coverline("dd-drop", 380);
return false; //Nothing is dragging, no reason to activate.
            }
            _yuitest_coverline("dd-drop", 382);
if (this.get(NODE) === DDM.activeDrag.get(NODE)) {
                _yuitest_coverline("dd-drop", 383);
return false;
            }
            //if (this.get('lock') || !this.get('useShim')) {
            _yuitest_coverline("dd-drop", 386);
if (this.get('lock')) {
                _yuitest_coverline("dd-drop", 387);
return false;
            }
            _yuitest_coverline("dd-drop", 389);
if (!this.shim) {
                _yuitest_coverline("dd-drop", 390);
Y.later(100, this, this.sizeShim);
                _yuitest_coverline("dd-drop", 391);
return false;
            }
            _yuitest_coverline("dd-drop", 393);
var node = this.get(NODE),
                nh = node.get(OFFSET_HEIGHT),
                nw = node.get(OFFSET_WIDTH),
                xy = node.getXY(),
                p = this.get('padding'),
                dd, dH, dW;


            //Apply padding
            _yuitest_coverline("dd-drop", 402);
nw = nw + p.left + p.right;
            _yuitest_coverline("dd-drop", 403);
nh = nh + p.top + p.bottom;
            _yuitest_coverline("dd-drop", 404);
xy[0] = xy[0] - p.left;
            _yuitest_coverline("dd-drop", 405);
xy[1] = xy[1] - p.top;
            

            _yuitest_coverline("dd-drop", 408);
if (DDM.activeDrag.get('dragMode') === DDM.INTERSECT) {
                //Intersect Mode, make the shim bigger
                _yuitest_coverline("dd-drop", 410);
dd = DDM.activeDrag;
                _yuitest_coverline("dd-drop", 411);
dH = dd.get(NODE).get(OFFSET_HEIGHT);
                _yuitest_coverline("dd-drop", 412);
dW = dd.get(NODE).get(OFFSET_WIDTH);
                
                _yuitest_coverline("dd-drop", 414);
nh = (nh + dH);
                _yuitest_coverline("dd-drop", 415);
nw = (nw + dW);
                _yuitest_coverline("dd-drop", 416);
xy[0] = xy[0] - (dW - dd.deltaXY[0]);
                _yuitest_coverline("dd-drop", 417);
xy[1] = xy[1] - (dH - dd.deltaXY[1]);

            }
            
            _yuitest_coverline("dd-drop", 421);
if (this.get('useShim')) {
                //Set the style on the shim
                _yuitest_coverline("dd-drop", 423);
this.shim.setStyles({
                    height: nh + 'px',
                    width: nw + 'px',
                    top: xy[1] + 'px',
                    left: xy[0] + 'px'
                });
            }

            //Create the region to be used by intersect when a drag node is over us.
            _yuitest_coverline("dd-drop", 432);
this.region = {
                '0': xy[0], 
                '1': xy[1],
                area: 0,
                top: xy[1],
                right: xy[0] + nw,
                bottom: xy[1] + nh,
                left: xy[0]
            };
        },
        /**
        * @private
        * @method _createShim
        * @description Creates the Target shim and adds it to the DDM's playground..
        */
        _createShim: function() {
            //No playground, defer
            _yuitest_coverfunc("dd-drop", "_createShim", 447);
_yuitest_coverline("dd-drop", 449);
if (!DDM._pg) {
                _yuitest_coverline("dd-drop", 450);
Y.later(10, this, this._createShim);
                _yuitest_coverline("dd-drop", 451);
return;
            }
            //Shim already here, cancel
            _yuitest_coverline("dd-drop", 454);
if (this.shim) {
                _yuitest_coverline("dd-drop", 455);
return;
            }
            _yuitest_coverline("dd-drop", 457);
var s = this.get('node');

            _yuitest_coverline("dd-drop", 459);
if (this.get('useShim')) {
                _yuitest_coverline("dd-drop", 460);
s = Y.Node.create('<div id="' + this.get(NODE).get('id') + '_shim"></div>');
                _yuitest_coverline("dd-drop", 461);
s.setStyles({
                    height: this.get(NODE).get(OFFSET_HEIGHT) + 'px',
                    width: this.get(NODE).get(OFFSET_WIDTH) + 'px',
                    backgroundColor: 'yellow',
                    opacity: '.5',
                    zIndex: '1',
                    overflow: 'hidden',
                    top: '-900px',
                    left: '-900px',
                    position:  'absolute'
                });

                _yuitest_coverline("dd-drop", 473);
DDM._pg.appendChild(s);

                _yuitest_coverline("dd-drop", 475);
s.on('mouseover', Y.bind(this._handleOverEvent, this));
                _yuitest_coverline("dd-drop", 476);
s.on('mouseout', Y.bind(this._handleOutEvent, this));
            }


            _yuitest_coverline("dd-drop", 480);
this.shim = s;
        },
        /**
        * @private
        * @method _handleOverTarget
        * @description This handles the over target call made from this object or from the DDM
        */
        _handleTargetOver: function() {
            _yuitest_coverfunc("dd-drop", "_handleTargetOver", 487);
_yuitest_coverline("dd-drop", 488);
if (DDM.isOverTarget(this)) {
                _yuitest_coverline("dd-drop", 489);
this.get(NODE).addClass(DDM.CSS_PREFIX + '-drop-over');
                _yuitest_coverline("dd-drop", 490);
DDM.activeDrop = this;
                _yuitest_coverline("dd-drop", 491);
DDM.otherDrops[this] = this;
                _yuitest_coverline("dd-drop", 492);
if (this.overTarget) {
                    _yuitest_coverline("dd-drop", 493);
DDM.activeDrag.fire('drag:over', { drop: this, drag: DDM.activeDrag });
                    _yuitest_coverline("dd-drop", 494);
this.fire(EV_DROP_OVER, { drop: this, drag: DDM.activeDrag });
                } else {
                    //Prevent an enter before a start..
                    _yuitest_coverline("dd-drop", 497);
if (DDM.activeDrag.get('dragging')) {
                        _yuitest_coverline("dd-drop", 498);
this.overTarget = true;
                        _yuitest_coverline("dd-drop", 499);
this.fire(EV_DROP_ENTER, { drop: this, drag: DDM.activeDrag });
                        _yuitest_coverline("dd-drop", 500);
DDM.activeDrag.fire('drag:enter', { drop: this, drag: DDM.activeDrag });
                        _yuitest_coverline("dd-drop", 501);
DDM.activeDrag.get(NODE).addClass(DDM.CSS_PREFIX + '-drag-over');
                        //TODO - Is this needed??
                        //DDM._handleTargetOver();
                    }
                }
            } else {
                _yuitest_coverline("dd-drop", 507);
this._handleOut();
            }
        },
        /**
        * @private
        * @method _handleOverEvent
        * @description Handles the mouseover DOM event on the Target Shim
        */
        _handleOverEvent: function() {
            _yuitest_coverfunc("dd-drop", "_handleOverEvent", 515);
_yuitest_coverline("dd-drop", 516);
this.shim.setStyle('zIndex', '999');
            _yuitest_coverline("dd-drop", 517);
DDM._addActiveShim(this);
        },
        /**
        * @private
        * @method _handleOutEvent
        * @description Handles the mouseout DOM event on the Target Shim
        */
        _handleOutEvent: function() {
            _yuitest_coverfunc("dd-drop", "_handleOutEvent", 524);
_yuitest_coverline("dd-drop", 525);
this.shim.setStyle('zIndex', '1');
            _yuitest_coverline("dd-drop", 526);
DDM._removeActiveShim(this);
        },
        /**
        * @private
        * @method _handleOut
        * @description Handles out of target calls/checks
        */
        _handleOut: function(force) {
            _yuitest_coverfunc("dd-drop", "_handleOut", 533);
_yuitest_coverline("dd-drop", 534);
if (!DDM.isOverTarget(this) || force) {
                _yuitest_coverline("dd-drop", 535);
if (this.overTarget) {
                    _yuitest_coverline("dd-drop", 536);
this.overTarget = false;
                    _yuitest_coverline("dd-drop", 537);
if (!force) {
                        _yuitest_coverline("dd-drop", 538);
DDM._removeActiveShim(this);
                    }
                    _yuitest_coverline("dd-drop", 540);
if (DDM.activeDrag) {
                        _yuitest_coverline("dd-drop", 541);
this.get(NODE).removeClass(DDM.CSS_PREFIX + '-drop-over');
                        _yuitest_coverline("dd-drop", 542);
DDM.activeDrag.get(NODE).removeClass(DDM.CSS_PREFIX + '-drag-over');
                        _yuitest_coverline("dd-drop", 543);
this.fire(EV_DROP_EXIT, { drop: this, drag: DDM.activeDrag });
                        _yuitest_coverline("dd-drop", 544);
DDM.activeDrag.fire('drag:exit', { drop: this, drag: DDM.activeDrag });
                        _yuitest_coverline("dd-drop", 545);
delete DDM.otherDrops[this];
                    }
                }
            }
        }
    });

    _yuitest_coverline("dd-drop", 552);
Y.DD.Drop = Drop;




}, '@VERSION@', {"requires": ["dd-drag", "dd-ddm-drop"]});
