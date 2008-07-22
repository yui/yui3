YUI.add('dd-ddm-drop', function(Y) {

    /**
     * Extends the dd-ddm Class to add support for the placement of Drop Target shims inside the viewport shim. It also handles all Drop Target related events and interactions.
     * <p>Module Name: <strong>dd-ddm-drop</strong></p>
     * @module dd
     */
    /**
     * Extends the dd-ddm Class to add support for the placement of Drop Target shims inside the viewport shim. It also handles all Drop Target related events and interactions.
     * @class DDM
     * @extends Base
     * @constructor
     */    
    //TODO CSS class name for the bestMatch..
    Y.mix(Y.DD.DDM, {
        /**
        * @private
        * @property _noShim
        * @description This flag turns off the use of the mouseover/mouseout shim. It should not be used unless you know what you are doing.
        * @type {Boolean}
        */
        _noShim: false,
        /**
        * @private
        * @property _activeShims
        * @description Placeholder for all active shims on the page
        * @type {Array}
        */
        _activeShims: [],
        /**
        * @private
        * @method _hasActiveShim
        * @description This method checks the _activeShims Object to see if there is a shim active.
        * @return {Boolean}
        */
        _hasActiveShim: function() {
            if (this._noShim) {
                return true;
            }
            return this._activeShims.length;
        },
        /**
        * @private
        * @method _addActiveShim 
        * @description Adds a Drop Target to the list of active shims
        * @param {Object} d The Drop instance to add to the list.
        */
        _addActiveShim: function(d) {
            this._activeShims[this._activeShims.length] = d;
        },
        /**
        * @private
        * @method _removeActiveShim 
        * @description Removes a Drop Target to the list of active shims
        * @param {Object} d The Drop instance to remove from the list.
        */
        _removeActiveShim: function(d) {
            var s = [];
            Y.each(this._activeShims, function(v, k) {
                if (v._yuid !== d._yuid) {
                    s[s.length] = v;
                }
                
            });
            this._activeShims = s;
        },
        /**
        * @method syncActiveShims
        * @description This method will sync the position of the shims on the Drop Targets that are currently active.
        * @param {Boolean} force Resize/sync all Targets.
        * @return {Array} drops The list of Drop Targets that was just synced.
        */
        syncActiveShims: function(force) {
            var drops = ((force) ? this.targets : this._lookup());
            Y.each(drops, function(v, k) {
                v.sizeShim.call(v);
            }, this);

            return drops;
        },
        /**
        * @private
        * @property mode
        * @description The mode that the drag operations will run in 0 for Point, 1 for Intersect, 2 for Strict
        * @type Number
        */
        mode: 0,
        /**
        * @private
        * @property POINT
        * @description In point mode, a Drop is targeted by the cursor being over the Target
        * @type Number
        */
        POINT: 0,
        /**
        * @private
        * @property INTERSECT
        * @description In intersect mode, a Drop is targeted by "part" of the drag node being over the Target
        * @type Number
        */
        INTERSECT: 1,
        /**
        * @private
        * @property STRICT
        * @description In strict mode, a Drop is targeted by the "entire" drag node being over the Target
        * @type Number
        */
        STRICT: 2,
        /**
        * @property useHash
        * @description Should we only check targets that are in the viewport on drags (for performance), default: true
        * @type {Boolean}
        */
        useHash: true,
        /**
        * @property activeDrop
        * @description A reference to the active Drop Target
        * @type {Object}
        */
        activeDrop: null,
        /**
        * @property validDrops
        * @description An array of the valid Drop Targets for this interaction.
        * @type {Array}
        */
        //TODO Change array/object literals to be in sync..
        validDrops: [],
        /**
        * @property otherDrops
        * @description An object literal of Other Drop Targets that we encountered during this interaction (in the case of overlapping Drop Targets)
        * @type {Object}
        */
        otherDrops: {},
        /**
        * @property targets
        * @description All of the Targets
        * @type {Array}
        */
        targets: [],
        /**
        * @private 
        * @method _addValid
        * @description Add a Drop Target to the list of Valid Targets. This list get's regenerated on each new drag operation.
        * @param {Object} drop
        * @return {Self}
        */
        _addValid: function(drop) {
            this.validDrops[this.validDrops.length] = drop;
            return this;
        },
        /**
        * @private 
        * @method _removeValid
        * @description Removes a Drop Target from the list of Valid Targets. This list get's regenerated on each new drag operation.
        * @param {Object} drop
        * @return {Self}
        */
        _removeValid: function(drop) {
            var drops = [];
            Y.each(this.validDrops, function(v, k) {
                if (v !== drop) {
                    drops[drops.length] = v
                }
            });

            this.validDrops = drops;
            return this;
        },
        /**
        * @method isOverTarget
        * @description Check to see if the Drag element is over the target, method varies on current mode
        * @param {Object} drop The drop to check against
        * @return {Boolean}
        */
        isOverTarget: function(drop) {
            //if (Y.Lang.isObject(this.activeDrag) && drop) { //TODO, check this check..
            if (this.activeDrag && drop) {
                var xy = this.activeDrag.mouseXY;
                if (xy) {
                    if (this.activeDrag.get('dragMode') == this.STRICT) {
                        return this.activeDrag.get('dragNode').inRegion(drop.region, true, this.activeDrag.region);
                    } else {
                        return drop.shim.intersect({
                            top: xy[1],
                            bottom: xy[1],
                            left: xy[0], 
                            right: xy[0]
                        }, drop.region).inRegion;
                    }
                    
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },
        /**
        * @method clearCache
        * @description Clears the cache data used for this interaction.
        */
        clearCache: function() {
            this.validDrops = [];
            this.otherDrops = {};
            this._activeShims = [];
        },
        /**
        * @private
        * @method _activateTargets
        * @description Clear the cache and activate the shims of all the targets
        */
        _activateTargets: function() {
            this.clearCache();
            Y.each(this.targets, function(v, k) {
                v._activateShim.apply(v, []);
            }, this);
            this._handleTargetOver();
            
        },
        /**
        * @method getBestMatch
        * @description This method will gather the area for all potential targets and see which has the hightest covered area and return it.
        * @param {Array} drops An Array of drops to scan for the best match.
        * @param {Boolean} all If present, it returns an Array. First item is best match, second is an Array of the other items in the original Array.
        * @return {Object or Array} 
        */
        getBestMatch: function(drops, all) {
            var biggest = null, area = 0;

            Y.each(drops, function(v, k) {
                var inter = this.activeDrag.get('dragNode').intersect(v.get('node'));
                v.region.area = inter.area;

                if (inter.inRegion) {
                    if (inter.area > area) {
                        area = inter.area;
                        biggest = v;
                    }
                }
            }, this);
            if (all) {
                var out = [];
                //TODO Sort the others in numeric order by area covered..
                Y.each(drops, function(v, k) {
                    if (v !== biggest) {
                        out[out.length] = v;
                    }
                }, this);
                return [biggest, out];
            } else {
                return biggest;
            }
        },
        /**
        * @private
        * @method _deactivateTargets
        * @description This method fires the drop:hit, drag:drophit, drag:dropmiss methods and deactivates the shims..
        */
        _deactivateTargets: function() {
            var other = [],
                activeDrag = this.activeDrag;
            
            //TODO why is this check so hard??
            if (activeDrag && !Y.Lang.isNull(this.activeDrop) && this.otherDrops[this.activeDrop]) {
                if (!activeDrag.get('dragMode')) {
                    //TODO otherDrops -- private..
                    other = this.otherDrops;
                    delete other[this.activeDrop];
                } else {
                    var tmp = this.getBestMatch(this.otherDrops, true);
                    this.activeDrop = tmp[0];
                    other = tmp[1];
                }
                activeDrag.get('node').removeClass(this.CSS_PREFIX + '-drag-over')
                this.activeDrop.fire('drop:hit', { drag: activeDrag, drop: this.activeDrop, others: other });
                activeDrag.fire('drag:drophit', { drag: activeDrag,  drop: this.activeDrop, others: other });
            } else if (this.activeDrag) {
                activeDrag.get('node').removeClass(this.CSS_PREFIX + '-drag-over')
                activeDrag.fire('drag:dropmiss', { pageX: activeDrag.lastXY[0], pageY: activeDrag.lastXY[1] });
            } else {
                Y.log('No Active Drag', 'warn', 'dd-ddm');
            }
            
            this.activeDrop = null;

            Y.each(this.targets, function(v, k) {
                v._deactivateShim.apply(v, []);
            }, this);
        },
        /**
        * @private
        * @method _dropMove
        * @description This method is called when the move method is called on the Drag Object.
        */
        _dropMove: function() {
            if (this._hasActiveShim()) {
                //Y.log('We have an active shim, check targets', 'info', 'dd-ddm');
                this._handleTargetOver();
            } else {
                Y.each(this.otherDrops, function(v, k) {
                    v._handleOut.apply(v, []);
                });
            }
        },
        /**
        * @private
        * @method _lookup
        * @description Filters the list of Drops down to those in the viewport.
        * @return {Array} The valid Drop Targets that are in the viewport.
        */
        _lookup: function() {
            if (!this.useHash) {
                return this.validDrops;
            }
            var drops = [];
            //Only scan drop shims that are in the Viewport
            Y.each(this.validDrops, function(v, k) {
                if (v.shim && v.shim.inViewportRegion(false, v.region)) {
                    drops[drops.length] = v;
                }
            });
            return drops;
                
        },
        /**
        * @private
        * @method _handleTargetOver
        * @description This method execs _handleTargetOver on all valid Drop Targets
        * @param {Boolean} force Force it to run the first time.
        */
        _handleTargetOver: function() {
            var drops = this._lookup();
            Y.each(drops, function(v, k) {
                v._handleTargetOver.call(v);
            }, this);
        },
        /**
        * @private
        * @method _regTarget
        * @description Add the passed in Target to the targets collection
        * @param {Object} t The Target to add to the targets collection
        */
        _regTarget: function(t) {
            this.targets[this.targets.length] = t;
        },
        /**
        * @private
        * @method _unregTarget
        * @description Remove the passed in Target from the targets collection
        * @param {Object} drop The Target to remove from the targets collection
        */
        _unregTarget: function(drop) {
            var targets = [];
            Y.each(this.targets, function(v, k) {
                if (v != drop) {
                    targets[targets.length] = v;
                }
            }, this);
            this.targets = targets;

            var vdrops = [];
            Y.each(this.validDrops, function(v, k) {
                if (v !== drop) {
                    vdrops[vdrops.length] = v
                }
            });

            this.validDrops = vdrops;
        },
        /**
        * @method getDrop
        * @description Get a valid Drop instance back from a Node or a selector string, false otherwise
        * @param {String/Object} node The Node instance or Selector string to check for a valid Drop Object
        * @return {Object}
        */
        getDrop: function(node) {
            var drop = false,
                n = Y.Node.get(node);
            if (n instanceof Y.Node) {
                Y.each(this.targets, function(v, k) {
                    if (n.compareTo(v.get('node'))) {
                        drop = v;
                    }
                });
            }
            return drop;
        }
    }, true);
    




}, '@VERSION@' ,{requires:['dd-ddm'], skinnable:false});
YUI.add('dd-drop', function(Y) {

    /**
     * This class provides the ability to create a Drop Target.
     * <p>Module Name: <strong>dd-drop</strong></p>
     * @module dd
     */
    /**
     * This class provides the ability to create a Drop Target.
     * @class Drop
     * @extends Base
     * @constructor
     */

    var NODE = 'node',
        DDM = Y.DD.DDM,
        OFFSET_HEIGHT = 'offsetHeight',
        OFFSET_WIDTH = 'offsetWidth',
        /**
        * @event drop:over
        * @description Fires when a drag element is over this target.
        * @bubbles DD.DDM
        * @type Event.Custom
        */
        EV_DROP_OVER = 'drop:over',
        /**
        * @event drop:enter
        * @description Fires when a drag element enters this target.
        * @bubbles DD.DDM
        * @type Event.Custom
        */
        EV_DROP_ENTER = 'drop:enter',
        /**
        * @event drop:exit
        * @description Fires when a drag element exits this target.
        * @bubbles DD.DDM
        * @type Event.Custom
        */
        EV_DROP_EXIT = 'drop:exit';

        /**
        * @event drop:hit
        * @description Fires when a draggable node is dropped on this Drop Target. (Fired from dd-ddm-drop)
        * @bubbles DD.DDM
        * @type Event.Custom
        */
        

    var Drop = function() {
        Drop.superclass.constructor.apply(this, arguments);

        this._createShim();
        DDM._regTarget(this);
        /* TODO
        if (Dom.getStyle(this.el, 'position') == 'fixed') {
            Event.on(window, 'scroll', function() {
                this.activateShim();
            }, this, true);
        }
        */
    };

    Drop.NAME = 'drop';

    Drop.ATTRS = {
        /**
        * @attribute node
        * @description Y.Node instanace to use as the element to make a Drop Target
        * @type Node
        */        
        node: {
            set: function(node) {
                var n = Y.Node.get(node);
                if (!n) {
                    Y.fail('DD.Drop: Invalid Node Given: ' + node);
                }
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
            set: function(g) {
                this._groups = {};
                Y.each(g, function(v, k) {
                    this._groups[v] = true;
                }, this);
            }
        },   
        /**
        * @attribute padding
        * @description CSS style padding to make the Drop Target bigger than the node.
        * @type String
        */
        padding: {
            value: '0',
            set: function(p) {
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
            set: function(lock) {
                if (lock) {
                    this.get(NODE).addClass(DDM.CSS_PREFIX + '-drop-locked');
                } else {
                    this.get(NODE).removeClass(DDM.CSS_PREFIX + '-drop-locked');
                }
            }
        }
    };

    Y.extend(Drop, Y.Base, {
        /**
        * @private
        * @method _createEvents
        * @description This method creates all the events for this Event Target and publishes them so we get Event Bubbling.
        */
        _createEvents: function() {
            
            var ev = [
                EV_DROP_OVER,
                EV_DROP_ENTER,
                EV_DROP_EXIT,
                'drop:hit'
            ];

            Y.each(ev, function(v, k) {
                this.publish(v, {
                    type: v,
                    emitFacade: true,
                    preventable: false,
                    bubbles: true,
                    queuable: true
                });
            }, this);

            this.addTarget(DDM);
            
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
            this._valid = false;
            var ret = false;
            Y.each(groups, function(v, k) {
                if (this._groups[v]) {
                    ret = true;
                    this._valid = true;
                }
            }, this);
            return ret;
        },
        /**
        * @private
        * @method initializer
        * @description Private lifecycle method
        */
        initializer: function() {
            this._createEvents();
            var node = this.get(NODE);
            if (!node.get('id')) {
                var id = Y.stamp(node);
                node.set('id', id);
            }
            node.addClass(DDM.CSS_PREFIX + '-drop');
        },
        /**
        * @private
        * @method destructor
        * @description Lifecycle destructor, unreg the drag from the DDM and remove listeners
        */
        destructor: function() {
            DDM._unregTarget(this);
            if (this.shim) {
                this.shim.get('parentNode').removeChild(this.shim);
                this.shim = null;
            }
            this.get(NODE).removeClass(DDM.CSS_PREFIX + '-drop');
        },        
        /**
        * @private
        * @method _deactivateShim
        * @description Removes classes from the target, resets some flags and sets the shims deactive position [-999, -999]
        */
        _deactivateShim: function() {
            this.get(NODE).removeClass(DDM.CSS_PREFIX + '-drop-active-valid');
            this.get(NODE).removeClass(DDM.CSS_PREFIX + '-drop-active-invalid');
            this.get(NODE).removeClass(DDM.CSS_PREFIX + '-drop-over');
            this.shim.setStyles({
                top: '-999px',
                left: '-999px'
            });
            this.overTarget = false;
        },
        /**
        * @private
        * @method _activateShim
        * @description Activates the shim and adds some interaction CSS classes
        */
        _activateShim: function() {
            if (!DDM.activeDrag) {
                return false; //Nothing is dragging, no reason to activate.
            }
            if (this.get(NODE) === DDM.activeDrag.get(NODE)) {
                return false;
            }
            if (this.get('lock')) {
                return false;
            }
            var node = this.get(NODE);
            //TODO Visibility Check..
            //if (this.inGroup(DDM.activeDrag.get('groups')) && this.get(NODE).isVisible()) {
            if (this.inGroup(DDM.activeDrag.get('groups'))) {
                node.removeClass(DDM.CSS_PREFIX + '-drop-active-invalid');
                node.addClass(DDM.CSS_PREFIX + '-drop-active-valid');
                DDM._addValid(this);
                this.overTarget = false;
                this.sizeShim();
            } else {
                DDM._removeValid(this);
                node.removeClass(DDM.CSS_PREFIX + '-drop-active-valid');
                node.addClass(DDM.CSS_PREFIX + '-drop-active-invalid');
            }
        },
        /**
        * @method sizeShim
        * @description Positions and sizes the shim with the raw data from the node, this can be used to programatically adjust the Targets shim for Animation..
        */
        sizeShim: function() {
            var node = this.get(NODE),
                nh = node.get(OFFSET_HEIGHT),
                nw = node.get(OFFSET_WIDTH),
                xy = node.getXY(),
                p = this.get('padding');


            //Apply padding
            nw = nw + p.left + p.right;
            nh = nh + p.top + p.bottom;
            xy[0] = xy[0] - p.left;
            xy[1] = xy[1] - p.top;
            

            if (DDM.activeDrag.get('dragMode') === DDM.INTERSECT) {
                //Intersect Mode, make the shim bigger
                var dd = DDM.activeDrag,
                    dH = dd.get(NODE).get(OFFSET_HEIGHT),
                    dW = dd.get(NODE).get(OFFSET_WIDTH);
                
                nh = (nh + dH);
                nw = (nw + dW);
                xy[0] = xy[0] - (dW - dd.deltaXY[0]);
                xy[1] = xy[1] - (dH - dd.deltaXY[1]);

            }
            
            //Set the style on the shim
            this.shim.setStyles({
                height: nh + 'px',
                width: nw + 'px',
                top: xy[1] + 'px',
                left: xy[0] + 'px'
            });
            
            //Create the region to be used by intersect when a drag node is over us.
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
            //var s = Y.Node.create(['div', { id: this.get(NODE).get('id') + '_shim' }]);
            var s = Y.Node.create('<div id="' + this.get(NODE).get('id') + '_shim"></div>');
            s.setStyles({
                height: this.get(NODE).get(OFFSET_HEIGHT) + 'px',
                width: this.get(NODE).get(OFFSET_WIDTH) + 'px',
                backgroundColor: 'yellow',
                //opacity: '.5',
                zIndex: 999,
                overflow: 'hidden',
                top: '-900px',
                left: '-900px',
                position:  'absolute'
            });
            DDM._pg.appendChild(s);
            this.shim = s;

            s.on('mouseover', this._handleOverEvent, this, true);
            s.on('mouseout', this._handleOutEvent, this, true);
        },
        /**
        * @private
        * @method _handleOverTarget
        * @description This handles the over target call made from this object or from the DDM
        */
        _handleTargetOver: function() {
            if (DDM.isOverTarget(this)) {
                this.get(NODE).addClass(DDM.CSS_PREFIX + '-drop-over');
                DDM.activeDrop = this;
                DDM.otherDrops[this] = this;
                if (this.overTarget) {
                    DDM.activeDrag.fire('drag:over', { drop: this, drag: DDM.activeDrag });
                    this.fire(EV_DROP_OVER, { drop: this, drag: DDM.activeDrag });
                } else {
                    this.overTarget = true;
                    this.fire(EV_DROP_ENTER, { drop: this, drag: DDM.activeDrag });
                    DDM.activeDrag.fire('drag:enter', { drop: this, drag: DDM.activeDrag });
                    DDM.activeDrag.get(NODE).addClass(DDM.CSS_PREFIX + '-drag-over');
                    DDM._handleTargetOver();
                }
            } else {
                this._handleOut();
            }
            
        },
        /**
        * @private
        * @method _handleOverEvent
        * @description Handles the mouseover DOM event on the Target Shim
        */
        _handleOverEvent: function() {
            DDM._addActiveShim(this);
        },
        /**
        * @private
        * @method _handleOut
        * @description Handles the mouseout DOM event on the Target Shim
        */
        _handleOutEvent: function() {
            DDM._removeActiveShim(this);
        },
        /**
        * @private
        * @method _handleOut
        * @description Handles out of target calls/checks
        */
        _handleOut: function() {
            if (!DDM.isOverTarget(this)) {
                if (this.overTarget) {
                    this.overTarget = false;
                    DDM._removeActiveShim(this);
                    if (DDM.activeDrag) {
                        this.get(NODE).removeClass(DDM.CSS_PREFIX + '-drop-over');
                        DDM.activeDrag.get(NODE).removeClass(DDM.CSS_PREFIX + '-drag-over');
                        this.fire(EV_DROP_EXIT);
                        DDM.activeDrag.fire('drag:exit', { drop: this });
                        delete DDM.otherDrops[this];
                    }
                }
            }
        }
    });

    Y.DD.Drop = Drop;



}, '@VERSION@' ,{requires:['dd-ddm-drop', 'dd-drag'], skinnable:false});
YUI.add('dd-drop-plugin', function(Y) {

       /**
        * This is a simple Drop plugin that can be attached to a Node via the plug method.
        * <p>Module Name: <strong>dd-drop-plugin</strong></p>
        * @module dd-plugin
        */
       /**
        * This is a simple Drop plugin that can be attached to a Node via the plug method.
        * @class DropPlugin
        * @extends Drop
        * @constructor
        */

        Y.Plugin = Y.Plugin || {};

        var Drop = function(config) {
            config.node = config.owner;
            Drop.superclass.constructor.apply(this, arguments);
        };
        
        /**
        * @property NAME
        * @description dd-drop-plugin
        * @type {String}
        */
        Drop.NAME = "dd-drop-plugin";
        /**
        * @property NS
        * @description The Drop instance will be placed on the Node instance under the drop namespace. It can be accessed via Node.drop;
        * @type {String}
        */
        Drop.NS = "drop";


        Y.extend(Drop, Y.DD.Drop);
        Y.Plugin.Drop = Drop;



}, '@VERSION@' ,{requires:['dd-drop'], skinnable:false});


YUI.add('dd-drop-core', function(Y){}, '@VERSION@' ,{skinnable:false, use:['dd-ddm-drop', 'dd-drop', 'dd-drop-plugin']});

