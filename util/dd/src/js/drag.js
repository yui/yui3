/**
* 3.x DragDrop
* @module dd-drag
*/
YUI.add('dd-drag', function(Y) {
    var Event = Y.Event;
    /**
     * 3.x DragDrop
     * @class Drag
     * @namespace DD
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
        },
        data: {
            value: false
        },
        move: {
            value: true
        },
        activeHandle: {
            value: false
        },
        lastHandle: {
            value: false
        },
        primaryButtonOnly: {
            value: true
        }
    };

    Y.extend(Drag, Y.Base, {
        /**
        * @private
        * @property _handles
        * @description A private hash of the valid drag handles
        * @type {Array}
        */
        _handles: null,
        /**
        * @private
        * @property _invalids
        * @description A private hash of the invalid selector strings
        * @type {Array}
        */
        _invalids: null,
        /**
        * @private
        * @property _dragging
        * @description Private flag to determine if we are currently dragging this element
        * @type {Boolean}
        */
        _dragging: null,
        /**
        * @private
        * @property _dragThreshMet
        * @description Private flag to see if the drag threshhold was met
        * @type {Boolean}
        */
        _dragThreshMet: null,
        /**
        * @private
        * @property _fromTimeout
        * @description Flag to determine if the drag operation came from a timeout
        * @type {Boolean}
        */
        _fromTimeout: null,
        _clickTimeout: null,
        deltaXY: null,
        startXY: null,
        currentXY: null,
        lastXY: null,
        
        _handleMouseUp: function(ev) {
            if (Y.DD.DDM.activeDrag) {
                Y.DD.DDM.end();
            }
        },
        _handleMouseDown: function(ev) {
            Y.log('_handleMouseDown', 'info', 'dd-drag');
            this._dragThreshMet = false;

            var button = ev.which || ev.button;
            
            if (this.get('primaryButtonOnly') && button > 1) {
                Y.log('Mousedown was not produced by the primary button', 'warn', 'dd-drag');
                return false;
            }
            if (this.validClick(ev)) {
                ev.halt();
                this._setStartPosition(ev);

                Y.DD.DDM.activeDrag = this;
                Y.DD.DDM.start(this.deltaXY, [this.get('node').get('offsetHeight'), this.get('node').get('offsetWidth')]);

                var self = this;
                this._clickTimeout = setTimeout(function() {
                    self._timeoutCheck.call(self);
                }, this.get('clickTimeThresh'));
            }

        },
        validClick: function(ev) {
            var r = false,
            tar = ev.target,
            hTest = null;
            if (this._handles) {
                Y.log('validClick: We have handles', 'info', 'dd-drag');
                Y.each(this._handles, function(n, i) {
                    if (Y.lang.isString(n)) {
                        //Am I this or am I inside this
                        if (tar.test(n + ', ' + n + ' *')) {
                            Y.log('Valid Selector found: ' + n, 'info', 'dd-drag');
                            hTest = n;
                            r = true;
                        }
                    }
                });
            } else {
                if (this.get('node').contains(tar) || this.get('node').compareTo(tar)) {
                    Y.log('validClick: We have a valid click', 'info', 'dd-drag');
                    r = true;
                }
            }
            if (r) {
                Y.log('validClick: Check invalid selectors', 'info', 'dd-drag');
                if (this._invalids) {
                    Y.each(this._invalids, function(n, i) {
                        if (Y.lang.isString(n)) {
                            //Am I this or am I inside this
                            if (tar.test(n + ', ' + n + ' *')) {
                                Y.log('Invalid Selector found: (' + (n + ', ' + n + ' *') + ')', 'warn', 'dd-drag');
                                r = false;
                            }
                        }
                    });
                }
            }
            if (r) {
                if (hTest) {
                    var els = ev.originalTarget.queryAll(hTest);
                    els.each(function(n, i) {
                        if (n.contains(tar) || n.compareTo(tar)) {
                            this.set('activeHandle', els.item(i));
                        }
                    }, this);
                } else {
                    this.set('activeHandle', this.get('node'));
                }
            }
            return r;
        },
        _setStartPosition: function(ev) {
            this.startXY = [ev.clientX, ev.clientY];

            this.currentXY = this.get('node').getXY();
            this.lastXY = this.currentXY;

            if (this.get('offsetEl')) {
                this.deltaXY = [(this.startXY[0] - this.currentXY[0]), (this.startXY[1] - this.currentXY[1])];
            } else {
                this.deltaXY = [0, 0];
            }
        },
        _timeoutCheck: function() {
            if (!this.get('lock')) {
                Y.log("timeout threshold met", "info", "dd-drag");
                this._fromTimeout = true;
                this._dragThreshMet = true;
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
        addHandle: function(node) {
            var n = Y.Node.get(node);
            if (!this._handles) {
                this._handles = [];
            }
            if (n) {
                this._handles[this._handles.length] = node;
            }
            return this;
        },
        removeInvalid: function(str) {
            var tmp = [];
            Y.each(this._invalids, function(i, n) {
                if (this._invalids[n] !== str) {
                    tmp[tmp.length] = this._invalids[n];
                }
            }, this);
            this._invalids = tmp;
            return this;
        },
        addInvalid: function(str) {
            if (Y.lang.isString(str)) {
                this._invalids[this._invalids.length] = str;
            } else {
                Y.log('Selector needs to be a string..');
            }
            return this;
        },
        init: function() {
            Drag.superclass.init.apply(this, arguments);

            this._invalids = [];
            
            this.set('dragEl', this.get('node'));

            this.get('node').on('mousedown', this._handleMouseDown, this, true);
            this.get('node').on('mouseup', this._handleMouseUp, this, true);
            this._dragThreshMet = false;
        },
        start: function() {
            if (!this.get('lock')) {
                this._dragging = true;
                Y.log('startDrag', 'info', 'dd-drag');
                this.get('node').addClass('yui-dd-dragging');
                this.fire('drag:start');
            }
        },
        end: function() {
            clearTimeout(this._clickTimeout);
            this._dragThreshMet = false;
            this._fromTimeout = false;
            if (!this.get('lock') && this._dragging) {
                Y.log('endDrag', 'info', 'dd-drag');
                this.fire('drag:end');
            }
            this.get('node').removeClass('yui-dd-dragging');
            this.set('lastHandle', this.get('activeHandle'));
            this.set('activeHandle', false);
            this._dragging = false;
            this.deltaXY = [0, 0];
        },
        _align: function(ev) {
            var eXY = [ev.clientX, ev.clientY],
                xy = [eXY[0] - this.deltaXY[0], eXY[1] - this.deltaXY[1]];
            return xy;
        },
        moveEl: function(ev) {
            var xy = this._align(ev), diffXY = [], diffXY2 = [];
            if (this.get('move')) {
                this.get('dragEl').setXY(xy);
            }
            diffXY[0] = (xy[0] - this.lastXY[0]);
            diffXY[1] = (xy[1] - this.lastXY[1]);

            diffXY2[0] = (xy[0] - this.currentXY[0]);
            diffXY2[1] = (xy[1] - this.currentXY[1]);
            //TODO
            var startXY = this.currentXY;
            this.fire('drag:drag', {
                info: {
                    start: startXY,
                    xy: xy,
                    delta: diffXY,
                    offset: diffXY2
                } 
            });
            
            this.lastXY = xy;
        },
        move: function(ev) {
            if (this.get('lock')) {
                Y.log('Drag Locked', 'warn', 'dd-drag');
                return false;
            } else {

                if (!this._dragThreshMet) {
                        var diffX = Math.abs(this.startXY[0] - ev.clientX);
                        var diffY = Math.abs(this.startXY[1] - ev.clientY);
                        //Y.log("diffX: " + diffX + "diffY: " + diffY, 'info', 'dd-drag');
                        if (diffX > this.get('clickPixelThresh') || diffY > this.get('clickPixelThresh')) {
                            Y.log("pixel threshold met", "info", "dd-drag");
                            this._dragThreshMet = true;
                            this.start();
                            this.moveEl(ev);
                        }
                
                } else {
                    clearTimeout(this._clickTimeout);
                    //Y.log('drag', 'info', 'dd-drag');
                    this.moveEl(ev);
                }
            }
        }
    });
    Y.DD.Drag = Drag;

}, '3.0.0', {requires: ['base', 'dd-ddm']});
