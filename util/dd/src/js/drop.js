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
                return this._setPadding(p);
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
        _setPadding: function(padding) {
            var p = padding.split(' '),
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
        _active: null,
        _valid: null,
        _groups: null,
        shim: null,
        region: null,
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
        initializer: function() {
            this._createEvents();
            this.addTarget(Y.DD.DDM);
        },
        deactivateShim: function() {
            this.get('node').removeClass('dd-drop-active-valid');
            this.get('node').removeClass('dd-drop-active-invalid');
            this.get('node').removeClass('dd-drop-over');
            this.shim.setXY([-999, -999]);
            this._active = false;
            this.overTarget = false;
        },
        activateShim: function(xy, hw) {
            if (this.get('node') === Y.DD.DDM.activeDrag.get('node')) {
                return false;
            }
            
            if (this.inGroup(Y.DD.DDM.activeDrag.get('groups')) && this.get('node').isVisible()) {
                this.get('node').addClass('dd-drop-active-valid');
                Y.DD.DDM.addValid(this);
                this._activateShim();
            } else {
                this.get('node').addClass('dd-drop-active-invalid');
            }
        },
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
        _activateShim: function() {
            this._active = false;
            this.overTarget = false;
            this.sizeShim();
        },
        move: function(force) {
            this._active = true;
            this._handleTargetOver(force);
        },
        overTarget: null,
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

            s.on('mouseover', this._handleOver, this, true);
            s.on('mouseout', this._handleOut, this, true);
        },
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
        _handleOver: function() {
            if (!this.overTarget && this._active) {
                Y.DD.DDM._handleTargetOver(this);
            } else {
                this._active = true;
            }
        },
        _handleOut: function() {
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
        toString: function() {
            return 'Drop (#' + this.get('node').get('id') + ')';
        }
    });

    Y.DD.Drop = Drop;

}, '3.0.0', { requires: ['dd-ddm-drop', 'dd-drag'] });
