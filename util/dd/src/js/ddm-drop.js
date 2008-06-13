YUI.add('dd-ddm-drop', function(Y) {
    /**
     * 3.x DragDrop Manager - Drop support
     * @class DDM
     * @module dd-ddm-drop
     * @namespace DD
     * @extends Base
     * @constructor
     */    
    Y.mix(Y.DD.DDM, {
        _activeShims: {},
        _hasActiveShim: function() {
            var ret = false;
            Y.each(this._activeShims, function(v, k) {
                if (k) {
                    ret = true;
                }
            }, this);

            return ret;
        },
        /**
        * @private
        * @property oldMode
        * @description Placeholder for the mode when the drag object changes it..
        * @type Number
        */
        oldMode: 0,
        /**
        * @property mode
        * @description The mode that the drag operations will run in 0 for Point, 1 for Intersect, 2 for Strict
        * @type Number
        */
        mode: 0,
        /**
        * @property POINT
        * @description In point mode, a Drop is targeted by the cursor being over the Target
        * @type Number
        */
        POINT: 0,
        /**
        * @property INTERSECT
        * @description In intersect mode, a Drop is targeted by "part" of the drag node being over the Target
        * @type Number
        */
        INTERSECT: 1,
        /**
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
        validDrops: [],
        /**
        * @property otherDrops
        * @description An object literal of Other Drop Targets that we encountered during this interaction (in the case of overlapping Drop Targets)
        * @type {Object}
        */
        otherDrops: {},
        /**
        * @property tars
        * @description All of the Targets
        * @type {Array}
        */
        tars: [],
        /**
        * @method addValid
        * @description Add a Drop Target to the list of Valid Targets. This list get's regenerated on each new drag operation.
        * @param {Object} drop
        * @return {Self}
        */
        addValid: function(drop) {
            this.validDrops[this.validDrops.length] = drop;
            return this;
        },
        /**
        * @method isOverTarget
        * @description Check to see if the Drag element is over the target, method varies on current mode
        * @param {Object} drop The drop to check against
        * @return {Boolean}
        */
        isOverTarget: function(drop) {
            if (Y.Lang.isObject(this.activeDrag) && drop) {
                var xy = this.activeDrag.mouseXY;
                if (xy) {
                    if (this.mode == this.STRICT) {
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
        * @private
        * @method clearCache
        * @description Clears the cache data used for this interaction.
        */
        clearCache: function() {
            this.validDrops = [];
            this.otherDrops = {};
        },
        /**
        * @private
        * @method _setMode
        * @description Private method to set the interaction mode based on the activeDrag's config
        */
        _setMode: function() {
            this._oldMode = this.mode;
            if (this.activeDrag && (this.activeDrag.get('dragMode') !== -1)) {
                this.mode = this.activeDrag.get('dragMode');
            }
        },
        /**
        * @private
        * @method _resetMode
        * @description Private method to reset the interaction mode to the default after a drag operation
        */
        _resetMode: function() {
            this.mode = this._oldMode;
        },

        /**
        * @private
        * @method _activateTargets
        * @description Clear the cache and activate the shims of all the targets
        */
        _activateTargets: function() {
            this._setMode();
            this.clearCache();
            Y.each(this.tars, function(v, k) {
                v.activateShim.apply(v, []);
                
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
            var other = [];
            
            if (this.activeDrag && !Y.Lang.isNull(this.activeDrop) && this.otherDrops[this.activeDrop]) {
                if (!this.mode) {
                    other = this.otherDrops;
                    delete other[this.activeDrop];
                } else {
                    var tmp = this.getBestMatch(this.otherDrops, true);
                    this.activeDrop = tmp[0];
                    other = tmp[1];
                }
                this.activeDrop.fire('drop:hit', { drag: this.activeDrag, drop: this.activeDrop, others: other });
                this.activeDrag.fire('drag:drophit', { drag: this.activeDrag,  drop: this.activeDrop, others: other });
            } else if (this.activeDrag) {
                this.activeDrag.fire('drag:dropmiss');
            } else {
                Y.log('No Active Drag', 'warn', 'dd-ddm');
            }
            
            this.activeDrop = null;

            Y.each(this.tars, function(v, k) {
                v.deactivateShim.apply(v, []);
            }, this);
            this._resetMode();
        },
        /**
        * @private
        * @method dropMove
        * @description This method is called when the move method is called on the Drag Object.
        * @param {Boolean} force Optional force at start.
        */
        dropMove: function(force) {
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
        * @method lookup
        * @description Filters the list of Drops down to those in the viewport.
        * @return {Array} The valid Drop Targets that are in the viewport.
        */
        lookup: function() {
            if (!this.useHash) {
                return this.validDrops;
            }
            var drops = [];
            //Only scan drop shims that are in the Viewport
            Y.each(this.validDrops, function(v, k) {
                if (v.shim.inViewportRegion(false, v.region)) {
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
            var drops = this.lookup();
            Y.each(drops, function(v, k) {
                v._handleTargetOver.call(v);
            }, this);
        },
        /**
        * @private
        * @method regTarget
        * @description Add the passed in Target to the tars collection
        * @param {Object} t The Target to add to the tars collection
        */
        regTarget: function(t) {
            this.tars[this.tars.length] = t;
        },
        /**
        * @private
        * @method unregTarget
        * @description Remove the passed in Target from the tars collection
        * @param {Object} t The Target to remove from the tars collection
        */
        unregTarget: function(t) {
            var tars = [];
            Y.each(this.tars, function(v, k) {
                if (v != t) {
                    tars[tars.length] = v;
                }
            }, this);
            this.tars = tars;
        },
        /**
        * @method rnd
        * @description Round a number to the nearest 100th.
        * @param {Number} The number to round
        * @return {Number} The rounded number
        */
        rnd: function(n) {
            return (Math.round(n / 100) * 100);
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
                Y.each(this.tars, function(v, k) {
                    if (n.compareTo(v.get('node'))) {
                        drop = v;
                    }
                });
            }
            return drop;
        }
    }, true);
    


}, '3.0.0', {requires: ['dd-ddm']});
