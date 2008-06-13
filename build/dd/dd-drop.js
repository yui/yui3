YUI.add('dd-drop', function(Y) {

    /**
     * 3.x DragDrop
     * @class Drop
     * @module dd-drop
     * @namespace DD
     * @extends base
     * @constructor
     */

    var NODE = 'node',
        DDM = Y.DD.DDM,
        OFFSET_HEIGHT = 'offsetHeight',
        OFFSET_WIDTH = 'offsetWidth';

    var Drop = function() {
        Drop.superclass.constructor.apply(this, arguments);

        this.createShim();
        DDM.regTarget(this);
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
        node: {
            set: function(node) {
                return Y.Node.get(node);
            }
        },
        groups: {
            value: ['default'],
            set: function(g) {
                this._groups = {};
                Y.each(g, function(v, k) {
                    this._groups[v] = true;
                }, this);
            }
        },        
        padding: {
            value: '0',
            set: function(p) {
                return DDM.cssSizestoObject(p);
            }
        },
        lock: {
            value: false,
            set: function(lock) {
                if (lock) {
                    this.get(NODE).addClass('yui-dd-drop-locked');
                } else {
                    this.get(NODE).removeClass('yui-dd-drop-locked');
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
                'drop:over',
                'drop:enter',
                'drop:exit'
            ];

            Y.each(ev, function(v, k) {
                this.publish(v, {
                    emitFacade: true,
                    preventable: false
                });
            }, this);

            this.addTarget(DDM);
            
        },
        /**
        * @private
        * @property _active
        * @description Is the target active and ready to be used..
        * @type Boolean
        */
        _active: null,
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
        },
        /**
        * @private
        * @method deactivateShim
        * @description Removes classes from the target, resets some flags and sets the shims deactive position [-999, -999]
        */
        deactivateShim: function() {
            this.get(NODE).removeClass('dd-drop-active-valid');
            this.get(NODE).removeClass('dd-drop-active-invalid');
            this.get(NODE).removeClass('dd-drop-over');
            this.shim.setXY([-999, -999]);
            this._active = false;
            this.overTarget = false;
        },
        /**
        * @private
        * @method activateShim
        * @description Activates the shim and adds some interaction CSS classes
        */
        activateShim: function() {
            if (this.get(NODE) === DDM.activeDrag.get(NODE)) {
                return false;
            }
            if (this.get('lock')) {
                return false;
            }
            
            if (this.inGroup(DDM.activeDrag.get('groups')) && this.get(NODE).isVisible()) {
                this.get(NODE).addClass('dd-drop-active-valid');
                DDM.addValid(this);
                this._active = false;
                this.overTarget = false;
                this.sizeShim();
            } else {
                this.get(NODE).addClass('dd-drop-active-invalid');
            }
        },
        /**
        * @method sizeShim
        * @description Positions and sizes the shim with the raw data from the node, this can be used to programatically adjust the Targets shim for Animation..
        */
        sizeShim: function() {
            var nh = this.get(NODE).get(OFFSET_HEIGHT),
                nw = this.get(NODE).get(OFFSET_WIDTH),
                xy = this.get(NODE).getXY(),
                p = this.get('padding');

            //Apply padding
            nw = nw + p.left + p.right;
            nh = nh + p.top + p.bottom;
            xy[0] = xy[0] - p.left;
            xy[1] = xy[1] - p.top;
            

            if (DDM.mode === DDM.INTERSECT) {
                //Intersect Mode, make the shim bigger
                var dd = DDM.activeDrag,
                    dH = dd.get(NODE).get(OFFSET_HEIGHT),
                    dW = dd.get(NODE).get(OFFSET_WIDTH);
                
                nh = (nh + dH);
                nw = (nw + dW);
                xy[0] = xy[0] - (dH - dd.deltaXY[0]);
                xy[1] = xy[1] - (dW - dd.deltaXY[1]);
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
        * @method createShim
        * @description Creates the Target shim and adds it to the DDM's playground..
        */
        createShim: function() {
            var s = Y.Node.create(['div', { id: this.get(NODE).get('id') + '_shim' }]);
            s.setStyles({
                height: this.get(NODE).get(OFFSET_HEIGHT) + 'px',
                width: this.get(NODE).get(OFFSET_WIDTH) + 'px',
                backgroundColor: 'yellow',
                opacity: '.5',
                zIndex: 10,
                position:  'absolute'
            });
            DDM.pg.appendChild(s);
            s.setXY([-900, -900]);
            this.shim = s;

            s.on('mouseover', this._handleOverEvent, this, true);
            s.on('mouseout', this._handleOutEvent, this, true);
        },
        /**
        * @private
        * @method _handleOverTarget
        * @description This handles the over target call made from this object or from the DDM
        * @param force Force a check on initialization
        */
        _handleTargetOver: function(force) {
            if (DDM.isOverTarget(this)) {
                this.get(NODE).addClass('dd-drop-over');
                DDM.activeDrop = this;
                DDM.otherDrops[this] = this;
                if (this.overTarget) {
                    this.fire('drop:over');
                    DDM.activeDrag.fire('drag:over', { drop: this });
                } else {
                    this.overTarget = true;
                    this.fire('drop:enter');
                    DDM.activeDrag.fire('drag:enter', { drop: this });
                    DDM._handleTargetOver(this, force);
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
            DDM._activeShims[this] = true;
        },
        /**
        * @private
        * @method _handleOut
        * @description Handles the mouseout DOM event on the Target Shim
        */
        _handleOutEvent: function() {
            delete DDM._activeShims[this];
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
                    if (DDM.activeDrag) {
                        this.fire('drop:exit');
                        DDM.activeDrag.fire('drag:exit', { drop: this });
                        delete DDM.otherDrops[this];
                        this.get(NODE).removeClass('dd-drop-over');
                    }
                }
            }
        },
        /**
        * @method toString
        * @description Simple toString method.
        * @return {String}
        */
        toString: function() {
            return 'Drop (#' + this.get(NODE).get('id') + ')';
        }
    });

    Y.DD.Drop = Drop;


}, '@VERSION@' ,{skinnable:false, requires:['dd-ddm-drop']});
