YUI.add('dd-drag', function(Y) {
    var Event = Y.Event;
    /**
     * Basic template for utilities that consume Nodes 
     * @class Sample
     */
    var Drag = function() {
        Drag.superclass.constructor.apply(this, arguments);

        Y.DD.DDM.regDrag(this);
    };

    Drag.NAME = 'Drag';

    Drag.ATTRS = {
        node: {
            set: function(node) {
                return Y.Node.get(node);
            }
        },
        dragEl: {
            set: function(node) {
                return Y.Node.get(node);
            }
        },
        offsetEl: {
            value: true
        },
        clickPixelThresh: {
            value: Y.DD.DDM.clickPixelThresh
        },
        clickTimeThresh: {
            value: Y.DD.DDM.clickTimeThresh
        },
        lock: {
            value: false
        }
    };

    Y.extend(Drag, Y.Base, {
        _handles: null,
        _dragging: null,
        dragThreshMet: null,
        fromTimeout: null,
        clickTimeout: null,
        deltaX: null,
        deltaY: null,
        startX: null,
        startY: null,
        currentX: null,
        currentY: null,
        _handleMouseUp: function(ev) {
            if (Y.DD.DDM.activeDrag) {
                Y.DD.DDM.end();
            }
        },
        validClick: function(ev) {
            var r = false,
            //TODO Event Target
            tar = Y.Node.get(ev.target);

            if (this._handles) {
                Y.log('validClick: We have handles', 'info', 'Drag');
                Y.each(this._handles, function(n, i) {
                    if (n.contains(tar) || n.compareTo(tar)) {
                        Y.log('validClick: We have a valid handle', 'info', 'Drag');
                        r = true;
                    }
                });
            } else {
                if (this.get('node').contains(tar) || this.get('node').compareTo(tar)) {
                    Y.log('validClick: We have a valid click', 'info', 'Drag');
                    r = true;
                }
            }
            if (!r) {
                Y.log('validClick: No valid handles found.', 'info', 'Drag');
            }
            return r;
        },
        _handleMouseDown: function(ev) {
            Y.log('_handleMouseDown', 'info', 'dd-drag');
            this.dragThreshMet = false;
            ev.halt();
            if (this.validClick(ev)) {
                this._setStartPosition(ev);
                Y.DD.DDM.activeDrag = this;
                Y.DD.DDM.start(this.deltaX, this.deltaY, this.get('node').get('offsetWidth'), this.get('node').get('offsetHeight'));

                var self = this;
                this.clickTimeout = setTimeout(function() {
                    self._timeoutCheck.call(self);
                }, this.get('clickTimeThresh'));
            }

        },
        _setStartPosition: function(ev) {
            this.startX = ev.clientX;
            this.startY = ev.clientY;

            var xy = this.get('node').getXY();

            this.currentX = xy[0];
            this.currentY = xy[1];
            console.warn(this.get('offsetEl'));

            if (this.get('offsetEl')) {
                this.deltaX = this.startX - this.currentX;
                this.deltaY = this.startY - this.currentY;
            } else {
                this.deltaX = 0;
                this.deltaY = 0;
            }
        },
        _timeoutCheck: function() {
            if (!this.get('lock')) {
                Y.log("timeout threshold met", "info", "dd-drag");
                this.fromTimeout = true;
                this.dragThreshMet = true;
                this.start();
            }
        },
        removeHandle: function(node) {
            var rn = Y.Node.get(node);
            Y.each(this._handles, function(i, n) {
                if (this._handles[n] && rn.compareTo(this._handles[n])) {
                    delete this._handles[n];
                }
            }, this);
            return this;
        },
        addHandle: function(node, outer) {
            var n = Y.Node.get(node);
            if (!this._handles) {
                this._handles = [];
            }
            this._handles[this._handles.length] = n;
            //TODO Outer Handles
            /*
            if (outer) {
                n.on('mousedown', this._handleMouseDown, this, true);
                n.on('mouseup', this._handleMouseUp, this, true);
            }
            */
            return this;
        },
        init: function() {
            Drag.superclass.init.apply(this, arguments);

            if (!this.get('dragEl')) {
                this.set('dragEl', this.get('node'));
            }

            this.get('node').on('mousedown', this._handleMouseDown, this, true);
            this.get('node').on('mouseup', this._handleMouseUp, this, true);
            this.dragThreshMet = false;
        },
        start: function() {
            if (!this.get('lock')) {
                this._dragging = true;
                Y.log('startDrag', 'info', 'dd-drag');
                this.get('node').addClass('yui-dd-dragging');
            }
        },
        end: function() {
            clearTimeout(this.clickTimeout);
            this.dragThreshMet = false;
            this.fromTimeout = false;
            if (!this.get('lock') && this._dragging) {
                Y.log('endDrag', 'info', 'dd-drag');
            }
            this.get('node').removeClass('yui-dd-dragging');
            this._dragging = false;
        },
        move: function(ev) {
            if (this.get('lock')) {
                Y.log('Drag Locked', 'warn', 'dd-drag');
                return false;
            } else {
                var eXY = [ev.clientX, ev.clientY],
                    xy = [eXY[0] - this.deltaX, eXY[1] - this.deltaY];

                if (!this.dragThreshMet) {
                        var diffX = Math.abs(this.startX - ev.clientX);
                        var diffY = Math.abs(this.startY - ev.clientY);
                        //Y.log("diffX: " + diffX + "diffY: " + diffY, 'info', 'dd-drag');
                        if (diffX > this.get('clickPixelThresh') || diffY > this.get('clickPixelThresh')) {
                            Y.log("pixel threshold met", "info", "dd-drag");
                            this.dragThreshMet = true;
                            this.start();
                        }
                
                } else {
                    clearTimeout(this.clickTimeout);
                    //Y.log('drag', 'info', 'dd-drag');
                    this.get('dragEl').setXY(xy);
                }
            }
        }
    });
    Y.DD.Drag = Drag;

}, '3.0.0', {requires: ['base', 'dd-ddm']});
