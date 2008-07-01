    /**
     * This class provides the ability to create a Drop Target.
     * @module dd-drop
     */
    /**
     * This class provides the ability to create a Drop Target.
     * @class Drop
     * @namespace DD
     * @extends base
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
        /**
        * @attribute node
        * @description Y.Node instanace to use as the element to make a Drop Target
        * @type Node
        */        
        node: {
            set: function(node) {
                return Y.Node.get(node);
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
                EV_DROP_OVER,
                EV_DROP_ENTER,
                EV_DROP_EXIT,
                'drop:hit'
            ];

            Y.each(ev, function(v, k) {
                this.publish(v, {
                    emitFacade: true,
                    preventable: false,
                    bubbles: true
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
            if (!this.get(NODE).get('id')) {
                var id = Y.stamp(this.get(NODE));
                this.get(NODE).set('id', id);
            }
        },
        /**
        * @private
        * @method _deactivateShim
        * @description Removes classes from the target, resets some flags and sets the shims deactive position [-999, -999]
        */
        _deactivateShim: function() {
            this.get(NODE).removeClass('dd-drop-active-valid');
            this.get(NODE).removeClass('dd-drop-active-invalid');
            this.get(NODE).removeClass('dd-drop-over');
            this.shim.setXY([-999, -999]);
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
            //TODO Visibility Check..
            //if (this.inGroup(DDM.activeDrag.get('groups')) && this.get(NODE).isVisible()) {
            if (this.inGroup(DDM.activeDrag.get('groups'))) {
                this.get(NODE).removeClass('dd-drop-active-invalid');
                this.get(NODE).addClass('dd-drop-active-valid');
                DDM.addValid(this);
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
            var s = Y.Node.create(['div', { id: this.get(NODE).get('id') + '_shim' }]);
            s.setStyles({
                height: this.get(NODE).get(OFFSET_HEIGHT) + 'px',
                width: this.get(NODE).get(OFFSET_WIDTH) + 'px',
                backgroundColor: 'yellow',
                opacity: '.5',
                zIndex: 10,
                position:  'absolute'
            });
            DDM._pg.appendChild(s);
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
                    DDM.activeDrag.fire('drag:over', { drop: this, drag: DDM.activeDrag });
                    this.fire(EV_DROP_OVER, { drop: this, drag: DDM.activeDrag });
                } else {
                    this.overTarget = true;
                    this.fire(EV_DROP_ENTER, { drop: this, drag: DDM.activeDrag });
                    DDM.activeDrag.fire('drag:enter', { drop: this, drag: DDM.activeDrag });
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
                        this.get(NODE).removeClass('dd-drop-over');
                        this.fire(EV_DROP_EXIT);
                        DDM.activeDrag.fire('drag:exit', { drop: this });
                        delete DDM.otherDrops[this];
                    }
                }
            }
        }
    });

    Y.DD.Drop = Drop;

