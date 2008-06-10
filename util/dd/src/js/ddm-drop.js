/**
* 3.x DragDrop Manager
* @module dd-ddm-drop
*/
YUI.add('dd-ddm-drop', function(Y) {
    /**
     * 3.x DragDrop Manager - Drop support
     * @class DDM
     * @namespace DD
     * @extends Base
     * @constructor
     */    
    Y.mix(Y.DD.DDM, {
        oldMode: 0,
        mode: 0,
        POINT: 0,
        INTERSECT: 1,
        /**
        * @private
        * @property _start
        * @description Flag to tell us we are good to start targeting nodes
        * @type {Booelan}
        */
        _start: false,
        /**
        * @property activeDrop
        * @description A reference to the active Drop Target
        * @type {Object}
        */
        activeDrop: null,
        /**
        * @property deltaDrop
        * @description A reference to the first Drop Target we encounter
        * @type {Object}
        */
        deltaDrop: null,
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
        * @property hash
        * @description A lookup hash to limit our searches for overlapping Drop Targets
        * @type {Object}
        */
        hash: {
            x: {},
            y: {}
        },
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
        * @private
        * @method _handleTargetOver
        * @description If there is a deltaDrop, this method execs _handleTargetOver on all valid Drop Targets
        * @param {Object} drop A Drop Target
        * @param {Boolean} force Force it to run the first time.
        */
        _handleTargetOver: function(drop, force) {
            if (!this.deltaDrop) {
                this.deltaDrop = drop;
                Y.each(this.validDrops, function(v, k) {
                    v._handleTargetOver.call(v, force);
                }, this);
            }
        },
        /**
        * @method isCursorOverTarget
        * @description Check to see if the mouseXY is in the region of the shim of the Drop Target
        * @param {Object} drop The drop to check against
        * @return {Boolean}
        */
        isCursorOverTarget: function(drop) {
            if (Y.Lang.isObject(this.activeDrag) && drop) {
                var xy = this.activeDrag.mouseXY;
                if (xy) {
                    return drop.shim.intersect({
                        top: xy[1],
                        bottom: xy[1],
                        left: xy[0], 
                        right: xy[0]
                    }, drop.region).inRegion;
                    
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },
        /*
        lookup: function(xy) {
            var oX = this.rnd(xy[0]),
                oY = this.rnd(xy[1]),
                out = [], ids = {};

            if (this.hash.x[oX]) {
                for (var i in this.hash.x[oX]) {
                    if (!ids[this.hash.x[oX][i]]) {
                        out[out.length] = this.hash.x[oX][i];
                        ids[this.hash.x[oX][i]] = true;
                    }
                }
            }
            if (this.hash.y[oY]) {
                for (var i in this.hash.y[oY]) {
                    if (!ids[this.hash.y[oY][i]]) {
                        out[out.length] = this.hash.y[oY][i];
                        ids[this.hash.y[oY][i]] = true;
                    }
                }
            }
            return this.validDrops;
                
        },
        */
        /**
        * @private
        * @method clearCache
        * @description Clears the cache data used for this interaction.
        */
        clearCache: function() {
            this.validDrops = [];
            this.otherDrops = {};
            this.deltaDrop = null;
            this.hash.x = {};
            this.hash.y = {};
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
            this.dropMove(true);
            
        },
        /**
        * @method getBestMatch
        * @description This method will gather the area for all potential targets and see which has the hightest covered area and return it.
        * @param {Array} drops An Array of drops to scan for the best match.
        * @param {Boolean} all If present, it returns an Array. First item is best match, second is an Array of the other items in the original Array.
        * @return {Object or Array} 
        */
        getBestMatch: function(drops, all) {
            var biggest = null, area = 0, out = [];

            Y.each(drops, function(v, k) {
                var inter = this.activeDrag.get('dragNode').intersect(v.get('node'));
                v.region.area = inter.area;

                if (inter.inRegion) {
                    if (inter.area > area) {
                        area = inter.area;
                        biggest = v;
                    } else {
                        out[out.length] = v;
                    }
                }
            }, this);
            if (all) {
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
            this._start = false;
            if (this.activeDrag && this.activeDrop && this.otherDrops[this.activeDrop]) {
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
            if (this.deltaDrop || force) {
                this._start = false;
                Y.each(this.validDrops, function(v, k) {
                    v.move.call(v, force);
                }, this);
            } else {
                if (!this._start) {
                    this._start = true;
                    Y.each(this.validDrops, function(v, k) {
                        v._active = true;
                        v._handleOver.call(v, force);
                    }, this);
                    this.deltaDrop = null;
                }
            }
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
            this.tars = v;
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
        * @private
        * @method syncTarget
        * @description This method addes a hash to the lookup hash table
        * @param {Object} The node to place into the hash
        * @param {Array} An Array of XY coords to place in to the hash table.
        */
        syncTarget: function(tar, xy) {
            var rx = this.rnd(xy[0]),
                ry = this.rnd(xy[1]);
            if (!Y.Lang.isArray(this.hash.x[rx])) {
                this.hash.x[rx] = [];
            }
            if (!Y.Lang.isArray(this.hash.y[ry])) {
                this.hash.y[ry] = [];
            }
            this.hash.x[rx][this.hash.x[rx].length] = tar;
            this.hash.y[ry][this.hash.y[ry].length] = tar;
        }
    }, true);
    


}, '3.0.0', {requires: ['dd-ddm']});
