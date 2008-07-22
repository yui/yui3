    /**
     * Provides the base Drag Drop Manger required for making a Node draggable.
     * <p>Module Name: <strong>dd-ddm-base</strong></p>
     * @module dd
     */

     /**
     * Provides the base Drag Drop Manger required for making a Node draggable.
     * @class DDM
     * @extends Base
     * @constructor
     */
    
    var DDMBase = function() {
        //debugger;
        DDMBase.superclass.constructor.apply(this, arguments);
    };

    DDMBase.NAME = 'DragDropMgr';

    DDMBase.ATTRS = {
        /**
        * @attribute clickPixelThresh
        * @description The number of pixels to move to start a drag operation, default is 3.
        * @type Number
        */
        clickPixelThresh: {
            value: 3
        },
        /**
        * @attribute clickTimeThresh
        * @description The number of milliseconds a mousedown has to pass to start a drag operation, default is 1000.
        * @type Number
        */        
        clickTimeThresh: {
            value: 1000
        },
        /**
        * @attribute dragMode
        * @description This attribute only works if the dd-drop module is active. It will set the dragMode (point, intersect, strict) of all future Drag instances. 
        * @type String
        */        
        dragMode: {
            value: 'point',
            set: function(mode) {
                this._setDragMode(mode);
            }           
        }

    };

    Y.extend(DDMBase, Y.Base, {
        /**
        * @private
        * @method _setDragMode
        * @description Handler for dragMode attribute setter.
        * @param String/Number The Number value or the String for the DragMode to default all future drag instances to.
        * @return Number The Mode to be set
        */
        _setDragMode: function(mode) {
            if (mode === null) {
                mode = Y.DD.DDM.get('dragMode');
            }
            switch (mode) {
                case 1:
                case 'intersect':
                    return 1;
                case 2:
                case 'strict':
                    return 2;
                case 0:
                case 'point':
                    return 0;
            }
            return 0;       
        },
        /**
        * @property CSS_PREFIX
        * @description The PREFIX to attach to all DD CSS class names
        * @type {String}
        */
        CSS_PREFIX: 'yui-dd',
        _activateTargets: function() {},        
        /**
        * @private
        * @property _drags
        * @description Holder for all registered drag elements.
        * @type {Array}
        */
        _drags: [],
        /**
        * @property activeDrag
        * @description A reference to the currently active draggable object.
        * @type {Drag}
        */
        activeDrag: false,
        /**
        * @private
        * @method _regDrag
        * @description Adds a reference to the drag object to the DDM._drags array, called in the constructor of Drag.
        * @param {Drag} d The Drag object
        */
        _regDrag: function(d) {
            this._drags[this._drags.length] = d;
        },
        /**
        * @private
        * @method _unregDrag
        * @description Remove this drag object from the DDM._drags array.
        * @param {Drag} d The drag object.
        */
        _unregDrag: function(d) {
            var tmp = [];
            Y.each(this._drags, function(n, i) {
                if (n !== d) {
                    tmp[tmp.length] = n;
                }
            });
            this._drags = tmp;
        },
        /**
        * @private
        * @method _init
        * @description DDM's init method
        */
        initializer: function() {
            Y.Node.get('document').on('mousemove', this._move, this, true);
            Y.Node.get('document').on('mouseup', this._end, this, true);
            //Y.Event.Target.apply(this);
        },
        /**
        * @private
        * @method _start
        * @description Internal method used by Drag to signal the start of a drag operation
        * @param {Number} x The x position of the drag element
        * @param {Number} y The y position of the drag element
        * @param {Number} w The width of the drag element
        * @param {Number} h The height of the drag element
        */
        _start: function(x, y, w, h) {
            this._startDrag.apply(this, arguments);
        },
        /**
        * @private
        * @method _startDrag
        * @description Factory method to be overwritten by other DDM's
        * @param {Number} x The x position of the drag element
        * @param {Number} y The y position of the drag element
        * @param {Number} w The width of the drag element
        * @param {Number} h The height of the drag element
        */
        _startDrag: function() {},
        /**
        * @private
        * @method _endDrag
        * @description Factory method to be overwritten by other DDM's
        */
        _endDrag: function() {},
        _dropMove: function() {},
        /**
        * @private
        * @method _end
        * @description Internal method used by Drag to signal the end of a drag operation
        */
        _end: function() {
            //@TODO - Here we can get a (click - drag - click - release) interaction instead of a (mousedown - drag - mouseup - release) interaction
            //Add as a config option??
            if (this.activeDrag) {
                this._endDrag();
                this.activeDrag.end.call(this.activeDrag);
                this.activeDrag = null;
            }
        },
        /**
        * @method stopDrag
        * @description Method will forcefully stop a drag operation. For example calling this from inside an ESC keypress handler will stop this drag.
        * @return {Self}
        */       
        stopDrag: function() {
            if (this.activeDrag) {
                this._end();
            }
            return this;
        },
        /**
        * @private
        * @method _move
        * @description Internal listener for the mousemove DOM event to pass to the Drag's move method.
        * @param {Event} ev The Dom mousemove Event
        */
        _move: function(ev) {
            if (this.activeDrag) {
                this.activeDrag._move.apply(this.activeDrag, arguments);
                this._dropMove();
            }
        },
        /**
        * @method setXY
        * @description A simple method to set the top and left position from offsets instead of page coordinates
        * @param {Object} node The node to set the position of 
        * @param {Array} xy The Array of left/top position to be set.
        */
        setXY: function(node, xy) {
            var t = parseInt(node.getStyle('top'), 10),
            l = parseInt(node.getStyle('left'), 10),
            pos = node.getStyle('position');

            if (pos === 'static') {
                node.setStyle('position', 'relative');
            }

            // in case of 'auto'
            if (isNaN(t)) { t = 0; }
            if (isNaN(l)) { l = 0; }
            
            node.setStyle('top', (xy[1] + t) + 'px');
            node.setStyle('left', (xy[0] + l) + 'px');
            
        },
        /**
        * //TODO Private, rename??...
        * @private
        * @method cssSizestoObject
        * @description Helper method to use to set the gutter from the attribute setter.
        * @param {String} gutter CSS style string for gutter: '5 0' (sets top and bottom to 5px, left and right to 0px), '1 2 3 4' (top 1px, right 2px, bottom 3px, left 4px)
        * @return {Object} The gutter Object Literal.
        */
        cssSizestoObject: function(gutter) {
            var p = gutter.split(' '),
            g = {
                top: 0,
                bottom: 0,
                right: 0,
                left: 0
            };
            if (p.length) {
                g.top = parseInt(p[0], 10);
                if (p[1]) {
                    g.right = parseInt(p[1], 10);
                } else {
                    g.right = g.top;
                }
                if (p[2]) {
                    g.bottom = parseInt(p[2], 10);
                } else {
                    g.bottom = g.top;
                }
                if (p[3]) {
                    g.left = parseInt(p[3], 10);
                } else if (p[1]) {
                    g.left = g.right;
                } else {
                    g.left = g.top;
                }
            }
            return g;
        },
        /**
        * @method getDrag
        * @description Get a valid Drag instance back from a Node or a selector string, false otherwise
        * @param {String/Object} node The Node instance or Selector string to check for a valid Drag Object
        * @return {Object}
        */
        getDrag: function(node) {
            var drag = false,
                n = Y.Node.get(node);
            if (n instanceof Y.Node) {
                Y.each(this._drags, function(v, k) {
                    if (n.compareTo(v.get('node'))) {
                        drag = v;
                    }
                });
            }
            return drag;
        }
    });

    Y.namespace('DD');
    Y.DD.DDM = new DDMBase();

    /**
     * Extends the dd-ddm-base Class to add support for the viewport shim to allow a draggable node to drag to be dragged over an iframe or any other node that traps mousemove events.
     * It is also required to have Drop Targets enabled, as the viewport shim will contain the shims for the Drop Targets.
     * <p>Module Name: <strong>dd-ddm</strong></p>
     */

     /**
     * Extends the dd-ddm-base Class to add support for the viewport shim to allow a draggable node to drag to be dragged over an iframe or any other node that traps mousemove events.
     * It is also required to have Drop Targets enabled, as the viewport shim will contain the shims for the Drop Targets.
     */

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
        _activateTargets: function() {},
        _deactivateTargets: function() {},
        _startDrag: function() {
            if (this.activeDrag.get('useShim')) {
                this._pg_activate();
                this._activateTargets();
            }
        },
        _endDrag: function() {
            this._pg_deactivate();
            this._deactivateTargets();
        },
        /**
        * @private
        * @method _pg_deactivate
        * @description Deactivates the shim
        */
        _pg_deactivate: function() {
            this._pg.setStyle('display', 'none');
        },
        /**
        * @private
        * @method _pg_activate
        * @description Activates the shim
        */
        _pg_activate: function() {
            this._pg_size();
            this._pg.setStyles({
                top: 0,
                left: 0,
                display: 'block',
                opacity: ((this._debugShim) ? '.5' : '0')
            });
        },
        /**
        * @private
        * @method _pg_size
        * @description Sizes the shim on: activatation, window:scroll, window:resize
        */
        _pg_size: function() {
            if (this.activeDrag) {
                var b = Y.Node.get('body'),
                h = b.get('docHeight'),
                w = b.get('docWidth');
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
            //var pg = Y.Node.create(['div']),
            var pg = Y.Node.create('<div></div>'),
            bd = Y.Node.get('body');
            pg.setStyles({
                top: '0',
                left: '0',
                position: 'absolute',
                zIndex: '9999',
                overflow: 'hidden',
                //opacity: '0',
                backgroundColor: 'red',
                display: 'none',
                height: '5px',
                width: '5px'
            });
            if (bd.get('firstChild')) {
                bd.insertBefore(pg, bd.get('firstChild'));
            } else {
                bd.appendChild(pg);
            }
            this._pg = pg;
            this._pg.on('mouseup', this._end, this, true);
            this._pg.on('mousemove', this._move, this, true);
            
            
            //TODO
            Y.Event.addListener(window, 'resize', this._pg_size, this, true);
            Y.Event.addListener(window, 'scroll', this._pg_size, this, true);
        }   
    }, true);

    Y.DD.DDM._createPG();    

    /**
     * Extends the dd-ddm Class to add support for the placement of Drop Target shims inside the viewport shim. It also handles all Drop Target related events and interactions.
     * <p>Module Name: <strong>dd-ddm-drop</strong></p>
     */
    /**
     * Extends the dd-ddm Class to add support for the placement of Drop Target shims inside the viewport shim. It also handles all Drop Target related events and interactions.
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
    


    /**
     * Extends the dd-ddm-base Class to add support for the viewport shim to allow a draggable node to drag to be dragged over an iframe or any other node that traps mousemove events.
     * It is also required to have Drop Targets enabled, as the viewport shim will contain the shims for the Drop Targets.
     * <p>Module Name: <strong>dd-ddm</strong></p>
     */

     /**
     * Extends the dd-ddm-base Class to add support for the viewport shim to allow a draggable node to drag to be dragged over an iframe or any other node that traps mousemove events.
     * It is also required to have Drop Targets enabled, as the viewport shim will contain the shims for the Drop Targets.
     */

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
        _activateTargets: function() {},
        _deactivateTargets: function() {},
        _startDrag: function() {
            if (this.activeDrag.get('useShim')) {
                this._pg_activate();
                this._activateTargets();
            }
        },
        _endDrag: function() {
            this._pg_deactivate();
            this._deactivateTargets();
        },
        /**
        * @private
        * @method _pg_deactivate
        * @description Deactivates the shim
        */
        _pg_deactivate: function() {
            this._pg.setStyle('display', 'none');
        },
        /**
        * @private
        * @method _pg_activate
        * @description Activates the shim
        */
        _pg_activate: function() {
            this._pg_size();
            this._pg.setStyles({
                top: 0,
                left: 0,
                display: 'block',
                opacity: ((this._debugShim) ? '.5' : '0')
            });
        },
        /**
        * @private
        * @method _pg_size
        * @description Sizes the shim on: activatation, window:scroll, window:resize
        */
        _pg_size: function() {
            if (this.activeDrag) {
                var b = Y.Node.get('body'),
                h = b.get('docHeight'),
                w = b.get('docWidth');
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
            //var pg = Y.Node.create(['div']),
            var pg = Y.Node.create('<div></div>'),
            bd = Y.Node.get('body');
            pg.setStyles({
                top: '0',
                left: '0',
                position: 'absolute',
                zIndex: '9999',
                overflow: 'hidden',
                //opacity: '0',
                backgroundColor: 'red',
                display: 'none',
                height: '5px',
                width: '5px'
            });
            if (bd.get('firstChild')) {
                bd.insertBefore(pg, bd.get('firstChild'));
            } else {
                bd.appendChild(pg);
            }
            this._pg = pg;
            this._pg.on('mouseup', this._end, this, true);
            this._pg.on('mousemove', this._move, this, true);
            
            
            //TODO
            Y.Event.addListener(window, 'resize', this._pg_size, this, true);
            Y.Event.addListener(window, 'scroll', this._pg_size, this, true);
        }   
    }, true);

    Y.DD.DDM._createPG();    

    /**
     * Extends the dd-ddm Class to add support for the placement of Drop Target shims inside the viewport shim. It also handles all Drop Target related events and interactions.
     * <p>Module Name: <strong>dd-ddm-drop</strong></p>
     */
    /**
     * Extends the dd-ddm Class to add support for the placement of Drop Target shims inside the viewport shim. It also handles all Drop Target related events and interactions.
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
    


