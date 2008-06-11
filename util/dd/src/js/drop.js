YUI.add('dd-drop', function(Y) {
    /**
     * Basic template for utilities that consume Nodes 
     * @class Sample
     */
    var Drop = function() {
        Drop.superclass.constructor.apply(this, arguments);

        this.createShim();
        Y.DD.DDM.regTarget(this);
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
                return Y.DD.DDM.cssSizestoObject(p);
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

            this.addTarget(Y.DD.DDM);
            
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
            this.addTarget(Y.DD.DDM);
        },
        /**
        * @private
        * @method deactivateShim
        * @description Removes classes from the target, resets some flags and sets the shims deactive position [-999, -999]
        */
        deactivateShim: function() {
            this.get('node').removeClass('dd-drop-active-valid');
            this.get('node').removeClass('dd-drop-active-invalid');
            this.get('node').removeClass('dd-drop-over');
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
            if (this.get('node') === Y.DD.DDM.activeDrag.get('node')) {
                return false;
            }
            
            if (this.inGroup(Y.DD.DDM.activeDrag.get('groups')) && this.get('node').isVisible()) {
                this.get('node').addClass('dd-drop-active-valid');
                Y.DD.DDM.addValid(this);
                this._active = false;
                this.overTarget = false;
                this.sizeShim();
            } else {
                this.get('node').addClass('dd-drop-active-invalid');
            }
        },
        /**
        * @method sizeShim
        * @description Positions and sizes the shim with the raw data from the node, this can be used to programatically adjust the Targets shim for Animation..
        */
        sizeShim: function() {
            var nh = this.get('node').get('offsetHeight'),
                nw = this.get('node').get('offsetWidth'),
                xy = this.get('node').getXY(),
                p = this.get('padding');

            //Apply padding
            nw = nw + p.left + p.right;
            nh = nh + p.top + p.bottom;
            xy[0] = xy[0] - p.left;
            xy[1] = xy[1] - p.top;
            

            if (Y.DD.DDM.mode) {
                //Intersect Mode, make the shim bigger
                var dd = Y.DD.DDM.activeDrag,
                    dH = dd.get('node').get('clientHeight'),
                    dW = dd.get('node').get('clientWidth');
                
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
            //Report position to DDM
            Y.DD.DDM.syncTarget(this, xy);
        },
        /**
        * @private
        * @method createShim
        * @description Creates the Target shim and adds it to the DDM's playground..
        */
        createShim: function() {
            var s = Y.Node.create(['div', { id: this.get('node').get('id') + '_shim' }]);
            s.setStyles({
                height: this.get('node').get('offsetHeight') + 'px',
                width: this.get('node').get('offsetWidth') + 'px',
                backgroundColor: 'yellow',
                opacity: '.5',
                zIndex: 10,
                position:  'absolute'
            });
            Y.DD.DDM.pg.appendChild(s);
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
            if (Y.DD.DDM.isCursorOverTarget(this)) {
                this.get('node').addClass('dd-drop-over');
                Y.DD.DDM.activeDrop = this;
                Y.DD.DDM.otherDrops[this] = this;
                if (this.overTarget) {
                    this.fire('drop:over');
                    Y.DD.DDM.activeDrag.fire('drag:over', { drop: this });
                } else {
                    this.overTarget = true;
                    this.fire('drop:enter');
                    Y.DD.DDM.activeDrag.fire('drag:enter', { drop: this });
                    Y.DD.DDM._handleTargetOver(this, force);
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
            Y.DD.DDM._activeShims[this] = true;
        },
        /**
        * @private
        * @method _handleOut
        * @description Handles the mouseout DOM event on the Target Shim
        */
        _handleOutEvent: function() {
            delete Y.DD.DDM._activeShims[this];
        },
        _handleOut: function() {
            if (!window.counter2) { window.counter2 = 0; };
            window.counter2++;
            //console.log('_handleOut', window.counter2);
            if (!Y.DD.DDM.isCursorOverTarget(this)) {
                if (this.overTarget) {
                    this.overTarget = false;
                    if (Y.DD.DDM.activeDrag) {
                        this.fire('drop:exit');
                        Y.DD.DDM.activeDrag.fire('drag:exit', { drop: this });
                        delete Y.DD.DDM.otherDrops[this];
                        this.get('node').removeClass('dd-drop-over');
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
            return 'Drop (#' + this.get('node').get('id') + ')';
        }
    });

    Y.DD.Drop = Drop;

}, '3.0.0', { requires: ['dd-ddm-drop', 'dd-drag'] });
