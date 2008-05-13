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
     * @extends Base
     * @constructor
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
        /**
        * @private
        * @property _clickTimeout
        * @description Holder for the setTimeout call
        * @type {Boolean}
        */
        _clickTimeout: null,
        /**
        * @property deltaXY
        * @description The offset of the mouse position to the element's position
        * @type {Array}
        */
        deltaXY: null,
        /**
        * @property startXY
        * @description The initial mouse position
        * @type {Array}
        */
        startXY: null,
        /**
        * @property currentXY
        * @description The initial element position
        * @type {Array}
        */
        currentXY: null,
        /**
        * @property lastXY
        * @description The position of the element as it's moving (for offset calculations)
        * @type {Array}
        */
        lastXY: null,
        /**
        * @private
        * @method _handleMouseUp
        * @description Handler for the mouseup DOM event
        * @param {Event}
        */
        _handleMouseUp: function(ev) {
            if (Y.DD.DDM.activeDrag) {
                Y.DD.DDM.end();
            }
        },
        /**
        * @private
        * @method _handleMouseDown
        * @description Handler for the mousedown DOM event
        * @param {Event}
        */
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

                var self = this;
                this._clickTimeout = setTimeout(function() {
                    self._timeoutCheck.call(self);
                }, this.get('clickTimeThresh'));
            }

        },
        /**
        * @method validClick
        * @description Method first checks to see if we have handles, if so it validates the click against the handle. Then if it finds a valid handle, it checks it against the invalid handles list. Returns true if a good handle was used, false otherwise.
        * @param {Event}
        * @return {Boolean}
        */
        validClick: function(ev) {
            var r = false,
            tar = ev.target,
            hTest = null;
            if (this._handles) {
                Y.log('validClick: We have handles', 'info', 'dd-drag');
                Y.each(this._handles, function(i, n) {
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
                    Y.each(this._invalids, function(i, n) {
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
        /**
        * @private
        * @method _setStartPosition
        * @description Sets the current position of the Element and calculates the offset
        * @param {Event}
        */
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
        /**
        * @private
        * @method _timeoutCheck
        * @description The method passed to setTimeout to determine if the clickTimeThreshold was met.
        */
        _timeoutCheck: function() {
            if (!this.get('lock')) {
                Y.log("timeout threshold met", "info", "dd-drag");
                this._fromTimeout = true;
                this._dragThreshMet = true;
                this.start();
            }
        },
        /**
        * @method removeHandle
        * @description Remove a Selector added by addHandle
        * @param {String} str The selector for the handle to be removed. 
        * @return {Self}
        */
        removeHandle: function(str) {
            if (this._handles[str]) {
                delete this._handles[str];
            }
            return this;
        },
        /**
        * @method addHandle
        * @description Add a handle to a drag element. Drag only initiates when a mousedown happens on this element.
        * @param {String} str The selector to test for a valid handle. Must be a child of the element.
        * @return {Self}
        */
        addHandle: function(str) {
            if (!this._handles) {
                this._handles = {};
            }
            if (Y.lang.isString(str)) {
                this._handles[str] = true;
            }
            return this;
        },
        /**
        * @method removeInvalid
        * @description Remove an invalid handle added by addInvalid
        * @param {String} str The invalid handle to remove from the internal list.
        * @return {Self}
        */
        removeInvalid: function(str) {
            if (this._invalids[str]) {
                delete this._handles[str];
            }
            return this;
        },
        /**
        * @method addInvalid
        * @description Add a selector string to test the handle against. If the test passes the drag operation will not continue.
        * @param {String} str The selector to test against to determine if this is an invalid drag handle.
        * @return {Self}
        */
        addInvalid: function(str) {
            if (Y.lang.isString(str)) {
                this._invalids[str] = true;
            } else {
                Y.log('Selector needs to be a string..');
            }
            return this;
        },
        /**
        * @private
        * @method initializer
        * @description Internal init handler
        */
        initializer: function() {
            this._invalids = {};
            
            this.set('dragEl', this.get('node'));

            this.get('node').on('mousedown', this._handleMouseDown, this, true);
            this.get('node').on('mouseup', this._handleMouseUp, this, true);
            this._dragThreshMet = false;
        },
        /**
        * @private
        * @method start
        * @description Starts the drag operation
        */
        start: function() {
            if (!this.get('lock')) {
                this._dragging = true;
                Y.DD.DDM.start(this.deltaXY, [this.get('node').get('offsetHeight'), this.get('node').get('offsetWidth')]);
                Y.log('startDrag', 'info', 'dd-drag');
                this.get('node').addClass('yui-dd-dragging');
                this.fire('drag:start');
            }
        },
        /**
        * @private
        * @method end
        * @description Ends the drag operation
        */
        end: function() {
            clearTimeout(this._clickTimeout);
            this._dragThreshMet = false;
            this._fromTimeout = false;
            if (!this.get('lock') && this._dragging) {
                Y.log('endDrag', 'info', 'dd-drag');
                this.fire('drag:end');
            }
            this.get('node').removeClass('yui-dd-dragging');
            this._dragging = false;
            this.deltaXY = [0, 0];
        },
        /**
        * @private
        * @method _align
        * @description Calculates the offsets and set's the XY that the element will move to.
        * @param {Event} ev The mousemove DOM event.
        * @return Array
        * @type {Array}
        */
        _align: function(ev) {
            var eXY = [ev.clientX, ev.clientY],
                xy = [eXY[0] - this.deltaXY[0], eXY[1] - this.deltaXY[1]];
            return xy;
        },
        /**
        * @private
        * @method move
        * @description This method performs the actual element move.
        * @param {Event} ev The mousemove Event
        */
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
        /**
        * @private
        * @method move
        * @description Fired from DragDropMgr (DDM) on mousemove.
        * @param {Event} ev The mousemove DOM event
        */
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
        },
        /**
        * @private
        * @method destructor
        * @description Lifecycle destructor, unreg the drag from the DDM and remove listeners
        * @return {Self}
        */
        destructor: function() {
            Y.DD.DDM.unregDrag(this);
            this.get('node').detach('mousedown', this._handleMouseDown, this, true);
            this.get('node').detach('mouseup', this._handleMouseUp, this, true);
        },
        /**
        * @method toString
        * @description General toString method for logging
        * @return String name for the object
        */
        toString: function() {
            return Drag.NAME + ' #' + this.get('node').get('id');
        }
    });
    Y.namespace('DD');    
    Y.DD.Drag = Drag;

}, '3.0.0', { requires: ['node', 'nodeextras', 'base', 'dd-ddm-base'] });
