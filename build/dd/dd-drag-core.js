YUI.add('dd-ddm-base', function(Y) {

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



}, '@VERSION@' ,{requires:['node', 'base'], skinnable:false});
YUI.add('dd-ddm', function(Y) {

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



}, '@VERSION@' ,{requires:['dd-ddm-base'], skinnable:false});
YUI.add('dd-drag', function(Y) {

    /**
     * This class provides the ability to drag a Node.
     * <p>Module Name: <strong>dd-drag</strong></p>
     * @module dd
     */
    /**
     * This class provides the ability to drag a Node.
     * @class Drag
     * @extends Base
     * @constructor
     */

    var DDM = Y.DD.DDM,
        NODE = 'node',
        DRAG_NODE = 'dragNode',
        OFFSET_HEIGHT = 'offsetHeight',
        OFFSET_WIDTH = 'offsetWidth',        
        MOUSE_UP = 'mouseup',
        MOUSE_DOWN = 'mousedown',
        /**
        * @event drag:mouseDown
        * @description Handles the mousedown DOM event, checks to see if you have a valid handle then starts the drag timers.
        * @preventable
        * @param {Event} ev The mousedown event.
        * @bubbles DD.DDM
        * @defaultFn _handleMouseDown
        * @type Event.Custom
        */
        EV_MOUSE_DOWN = 'drag:mouseDown',
        /**
        * @event drag:afterMouseDown
        * @description Fires after the mousedown event has been cleared.
        * @param {Event} ev The mousedown event.
        * @bubbles DD.DDM
        * @type Event.Custom
        */
        EV_AFTER_MOUSE_DOWN = 'drag:afterMouseDown',
        /**
        * @event drag:removeHandle
        * @description Fires after a handle is removed.
        * @bubbles DD.DDM
        * @type Event.Custom
        */
        EV_REMOVE_HANDLE = 'drag:removeHandle',
        /**
        * @event drag:addHandle
        * @description Fires after a handle is added.
        * @bubbles DD.DDM
        * @type Event.Custom
        */
        EV_ADD_HANDLE = 'drag:addHandle',
        /**
        * @event drag:removeInvalid
        * @description Fires after an invalid selector is removed.
        * @bubbles DD.DDM
        * @type Event.Custom
        */
        EV_REMOVE_INVALID = 'drag:removeInvalid',
        /**
        * @event drag:addInvalid
        * @description Fires after an invalid selector is added.
        * @bubbles DD.DDM
        * @type Event.Custom
        */
        EV_ADD_INVALID = 'drag:addInvalid',
        /**
        * @event drag:start
        * @description Fires at the start of a drag operation.
        * @bubbles DD.DDM
        * @type Event.Custom
        */
        EV_START = 'drag:start',
        /**
        * @event drag:end
        * @description Fires at the end of a drag operation.
        * @bubbles DD.DDM
        * @type Event.Custom
        */
        EV_END = 'drag:end',
        /**
        * @event drag:drag
        * @description Fires every mousemove during a drag operation.
        * @bubbles DD.DDM
        * @type Event.Custom
        */
        EV_DRAG = 'drag:drag';


        /**
        * @event drag:over
        * @description Fires when this node is over a Drop Target. (Fired from dd-drop)
        * @bubbles DD.DDM
        * @type Event.Custom
        */
        /**
        * @event drag:enter
        * @description Fires when this node enters a Drop Target. (Fired from dd-drop)
        * @bubbles DD.DDM
        * @type Event.Custom
        */
        /**
        * @event drag:exit
        * @description Fires when this node exits a Drop Target. (Fired from dd-drop)
        * @bubbles DD.DDM
        * @type Event.Custom
        */
        /**
        * @event drag:drophit
        * @description Fires when this node is dropped on a valid Drop Target. (Fired from dd-ddm-drop)
        * @bubbles DD.DDM
        * @type Event.Custom
        */
        /**
        * @event drag:dropmiss
        * @description Fires when this node is dropped on an invalid Drop Target. (Fired from dd-ddm-drop)
        * @bubbles DD.DDM
        * @type Event.Custom
        */
    
    var Drag = function() {
        Drag.superclass.constructor.apply(this, arguments);

        DDM._regDrag(this);
    };
    Drag.NAME = 'drag';

    Drag.ATTRS = {
        /**
        * @attribute node
        * @description Y.Node instanace to use as the element to initiate a drag operation
        * @type Node
        */
        node: {
            set: function(node) {
                var n = Y.Node.get(node);
                if (!n) {
                    Y.fail('DD.Drag: Invalid Node Given: ' + node);
                }
                return n;
            }
        },
        /**
        * @attribute dragNode
        * @description Y.Node instanace to use as the draggable element, defaults to node
        * @type Node
        */
        dragNode: {
            set: function(node) {
                var n = Y.Node.get(node);
                if (!n) {
                    Y.fail('DD.Drag: Invalid dragNode Given: ' + node);
                }
                return n;
            }
        },
        /**
        * @attribute offsetNode
        * @description Offset the drag element by the difference in cursor position: default true
        * @type Boolean
        */
        offsetNode: {
            value: true
        },
        /**
        * @attribute clickPixelThresh
        * @description The number of pixels to move to start a drag operation, default is 3.
        * @type Number
        */
        clickPixelThresh: {
            value: DDM.get('clickPixelThresh')
        },
        /**
        * @attribute clickTimeThresh
        * @description The number of milliseconds a mousedown has to pass to start a drag operation, default is 1000.
        * @type Number
        */
        clickTimeThresh: {
            value: DDM.get('clickTimeThresh')
        },
        /**
        * @attribute lock
        * @description Set to lock this drag element so that it can't be dragged: default false.
        * @type Boolean
        */
        lock: {
            value: false,
            set: function(lock) {
                if (lock) {
                    this.get(NODE).addClass(DDM.CSS_PREFIX + '-locked');
                } else {
                    this.get(NODE).removeClass(DDM.CSS_PREFIX + '-locked');
                }
            }
        },
        /**
        * @attribute data
        * @description A payload holder to store arbitrary data about this drag object, can be used to store any value.
        * @type Mixed
        */
        data: {
            value: false
        },
        /**
        * @attribute move
        * @description If this is false, the drag element will not move with the cursor: default true. Can be used to "resize" the element.
        * @type Boolean
        */
        move: {
            value: true
        },
        /**
        * @attribute useShim
        * @description Use the protective shim on all drag operations: default true. Only works with dd-ddm, not dd-ddm-base.
        * @type Boolean
        */
        useShim: {
            value: true
        },
        /**
        * @attribute activeHandle
        * @description This config option is set by Drag to inform you of which handle fired the drag event (in the case that there are several handles): default false.
        * @type Node
        */
        activeHandle: {
            value: false
        },
        /**
        * @attribute primaryButtonOnly
        * @description By default a drag operation will only begin if the mousedown occurred with the primary mouse button. Setting this to false will allow for all mousedown events to trigger a drag.
        * @type Boolean
        */
        primaryButtonOnly: {
            value: true
        },
        /**
        * @attribute dragging
        * @description This attribute is not meant to be used by the implementor, it is meant to be used as an Event tracker so you can listen for it to change.
        * @type Boolean
        */
        dragging: {
            value: false
        },
        /**
        * @attribute target
        * @description This attribute only works if the dd-drop module has been loaded. It will make this node a drop target as well as draggable.
        * @type Boolean
        */
        target: {
            value: false,
            set: function(config) {
                this._handleTarget(config);
            }
        },
        /**
        * @attribute dragMode
        * @description This attribute only works if the dd-drop module is active. It will set the dragMode (point, intersect, strict) of this Drag instance.
        * @type String
        */
        dragMode: {
            value: null,
            set: function(mode) {
                return DDM._setDragMode(mode);
            }
        },
        /**
        * @attribute groups
        * @description Array of groups to add this drag into.
        * @type Array
        */
        groups: {
            value: ['default'],
            get: function() {
                if (!this._groups) {
                    this._groups = {};
                }
                var ret = [];
                Y.each(this._groups, function(v, k) {
                    ret[ret.length] = k;
                });
                return ret;
            },
            set: function(g) {
                this._groups = {};
                Y.each(g, function(v, k) {
                    this._groups[v] = true;
                }, this);
            }
        }
    };

    Y.extend(Drag, Y.Base, {
        /**
        * @method addToGroup
        * @description Add this Drag instance to a group, this should be used for on-the-fly group additions.
        * @param {String} g The group to add this Drag Instance to.
        * @return {Self}
        */
        addToGroup: function(g) {
            this._groups[g] = true;
            DDM._activateTargets();
            return this;
        },
        /**
        * @method removeFromGroup
        * @description Remove this Drag instance from a group, this should be used for on-the-fly group removals.
        * @param {String} g The group to remove this Drag Instance from.
        * @return {Self}
        */
        removeFromGroup: function(g) {
            delete this._groups[g];
            DDM._activateTargets();
            return this;
        },
        /**
        * @property target
        * @description This will be a reference to the Drop instance associated with this drag if the target: true config attribute is set..
        * @type {Object}
        */
        target: null,
        /**
        * @private
        * @method _handleTarget
        * @description Attribute handler for the target config attribute.
        * @param {Boolean/Object}
        * @return {Boolean/Object}
        */
        _handleTarget: function(config) {
            if (Y.DD.Drop) {
                if (config === false) {
                    if (this.target) {
                        DDM._unregTarget(this.target);
                        this.target = null;
                    }
                    return false;
                } else {
                    if (!Y.Lang.isObject(config)) {
                        config = {};
                    }
                    config.node = this.get(NODE);
                    this.target = new Y.DD.Drop(config);
                }
            } else {
                return false;
            }
        },
        /**
        * @private
        * @property _groups
        * @description Storage Array for the groups this drag belongs to.
        * @type {Array}
        */
        _groups: null,
        /**
        * @private
        * @method _createEvents
        * @description This method creates all the events for this Event Target and publishes them so we get Event Bubbling.
        */
        _createEvents: function() {
            
            this.publish(EV_MOUSE_DOWN, {
                defaultFn: this._handleMouseDown,
                queuable: true,
                emitFacade: true,
                bubbles: true
            });
            
            var ev = [
                EV_AFTER_MOUSE_DOWN,
                EV_REMOVE_HANDLE,
                EV_ADD_HANDLE,
                EV_REMOVE_INVALID,
                EV_ADD_INVALID,
                EV_START,
                EV_END,
                EV_DRAG,
                'drag:drophit',
                'drag:dropmiss',
                'drag:over',
                'drag:enter',
                'drag:exit'
            ];
            
            Y.each(ev, function(v, k) {
                this.publish(v, {
                    type: v,
                    emitFacade: true,
                    bubbles: true,
                    preventable: false,
                    queuable: true
                });
            }, this);
            this.addTarget(DDM);
            
           
        },
        /**
        * @private
        * @property _ev_md
        * @description A private reference to the mousedown DOM event
        * @type {Event}
        */
        _ev_md: null,
        __ev_md: null,
        __ev_mu: null,
        /**
        * @private
        * @property _startTime
        * @description The getTime of the mousedown event. Not used, just here in case someone wants/needs to use it.
        * @type Date
        */
        _startTime: null,
        /**
        * @private
        * @property _endTime
        * @description The getTime of the mouseup event. Not used, just here in case someone wants/needs to use it.
        * @type Date
        */
        _endTime: null,
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
        * @type {Object}
        */
        _invalids: null,
        /**
        * @private
        * @property _invalidsDefault
        * @description A private hash of the default invalid selector strings: {'textarea': true, 'input': true, 'a': true, 'button': true}
        * @type {Object}
        */
        _invalidsDefault: {'textarea': true, 'input': true, 'a': true, 'button': true},
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
        * @property nodeXY
        * @description The initial element position
        * @type {Array}
        */
        nodeXY: null,
        /**
        * @property lastXY
        * @description The position of the element as it's moving (for offset calculations)
        * @type {Array}
        */
        lastXY: null,
        /**
        * @property mouseXY
        * @description The XY coords of the mousemove
        * @type {Array}
        */
        mouseXY: null,
        /**
        * @property region
        * @description A region object associated with this drag, used for checking regions while dragging.
        * @type Object
        */
        region: null,       
        /**
        * @private
        * @method _handleMouseUp
        * @description Handler for the mouseup DOM event
        * @param {Event}
        */
        _handleMouseUp: function(ev) {
            this._fixIEMouseUp();
            if (DDM.activeDrag) {
                DDM._end();
            }
        },
        /** 
        * @private
        * @method _ieSelectFix
        * @description The function we use as the onselectstart handler when we start a drag in Internet Explorer
        */
        _ieSelectFix: function() {
            return false;
        },
        /** 
        * @private
        * @property _ieSelectBack
        * @description We will hold a copy of the current "onselectstart" method on this property, and reset it after we are done using it.
        */
        _ieSelectBack: null,
        /**
        * @private
        * @method _fixIEMouseDown
        * @description This method copies the onselectstart listner on the document to the _ieSelectFix property
        */
        _fixIEMouseDown: function() {
            if (Y.UA.ie) {
                this._ieSelectBack = Y.config.doc.body.onselectstart;
                Y.config.doc.body.onselectstart = this._ieSelectFix;
            }           
        },
        /**
        * @private
        * @method _fixIEMouseUp
        * @description This method copies the _ieSelectFix property back to the onselectstart listner on the document.
        */
        _fixIEMouseUp: function() {
            if (Y.UA.ie) {
                Y.config.doc.body.onselectstart = this._ieSelectBack;
            }           
        },
        /**
        * @private
        * @method _handleMouseDownEvent
        * @description Handler for the mousedown DOM event
        * @param {Event}
        */
        _handleMouseDownEvent: function(ev) {
            this.fire(EV_MOUSE_DOWN, { ev: ev });
        },
        /**
        * @private
        * @method _handleMouseDown
        * @description Handler for the mousedown DOM event
        * @param {Event}
        */
        _handleMouseDown: function(e) {
            var ev = e.ev;
            this._dragThreshMet = false;
            this._ev_md = ev;
            
            if (this.get('primaryButtonOnly') && ev.button > 1) {
                return false;
            }
            if (this.validClick(ev)) {
                this._fixIEMouseDown();
                ev.halt();
                this._setStartPosition([ev.pageX, ev.pageY]);

                DDM.activeDrag = this;

                var self = this;
                this._clickTimeout = setTimeout(function() {
                    self._timeoutCheck.call(self);
                }, this.get('clickTimeThresh'));
            }
            this.fire(EV_AFTER_MOUSE_DOWN, { ev: ev });
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
                Y.each(this._handles, function(i, n) {
                    if (Y.Lang.isString(n)) {
                        //Am I this or am I inside this
                        if (tar.test(n + ', ' + n + ' *')) {
                            hTest = n;
                            r = true;
                        }
                    }
                });
            } else {
                if (this.get(NODE).contains(tar) || this.get(NODE).compareTo(tar)) {
                    r = true;
                }
            }
            if (r) {
                if (this._invalids) {
                    Y.each(this._invalids, function(i, n) {
                        if (Y.Lang.isString(n)) {
                            //Am I this or am I inside this
                            if (tar.test(n + ', ' + n + ' *')) {
                                r = false;
                            }
                        }
                    });
                }
            }
            if (r) {
                if (hTest) {
                    var els = ev.currentTarget.queryAll(hTest);
                    els.each(function(n, i) {
                        if (n.contains(tar) || n.compareTo(tar)) {
                            this.set('activeHandle', els.item(i));
                        }
                    }, this);
                } else {
                    this.set('activeHandle', this.get(NODE));
                }
            }
            return r;
        },
        /**
        * @private
        * @method _setStartPosition
        * @description Sets the current position of the Element and calculates the offset
        * @param {Array} xy The XY coords to set the position to.
        */
        _setStartPosition: function(xy) {
            this.startXY = xy;
            
            this.nodeXY = this.get(NODE).getXY();
            this.lastXY = this.nodeXY;

            if (this.get('offsetNode')) {
                this.deltaXY = [(this.startXY[0] - this.nodeXY[0]), (this.startXY[1] - this.nodeXY[1])];
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
                this._fromTimeout = true;
                this._dragThreshMet = true;
                this.start();
                this._moveNode([this._ev_md.pageX, this._ev_md.pageY], true);
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
                this.fire(EV_REMOVE_HANDLE, { handle: str });
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
            if (Y.Lang.isString(str)) {
                this._handles[str] = true;
                this.fire(EV_ADD_HANDLE, { handle: str });
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
                this.fire(EV_REMOVE_INVALID, { handle: str });
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
            if (Y.Lang.isString(str)) {
                this._invalids[str] = true;
                this.fire(EV_ADD_INVALID, { handle: str });
            } else {
            }
            return this;
        },
        /**
        * @private
        * @method initializer
        * @description Internal init handler
        */
        initializer: function() {
            //TODO give the node instance a copy of this object
            //Not supported in PR1 due to Y.Node.get calling a new under the hood.
            //this.get(NODE).dd = this;

            if (!this.get(NODE).get('id')) {
                var id = Y.stamp(this.get(NODE));
                this.get(NODE).set('id', id);
            }
            

            this._invalids = this._invalidsDefault;

            this._createEvents();
            
            if (!this.get(DRAG_NODE)) {
                this.set(DRAG_NODE, this.get(NODE));
            }
            
            this.get(NODE).addClass(DDM.CSS_PREFIX + '-draggable');
            this.__ev_md = this.get(NODE).on(MOUSE_DOWN, this._handleMouseDownEvent, this, true);
            this.__ev_mu = this.get(NODE).on(MOUSE_UP, this._handleMouseUp, this, true);
            this._dragThreshMet = false;
        },
        /**
        * @method start
        * @description Starts the drag operation
        * @return {Self}
        */
        start: function() {
            if (!this.get('lock') && !this.get('dragging')) {
                this.set('dragging', true);
                DDM._start(this.deltaXY, [this.get(NODE).get(OFFSET_HEIGHT), this.get(NODE).get(OFFSET_WIDTH)]);
                this.get(NODE).addClass(DDM.CSS_PREFIX + '-dragging');
                this.fire(EV_START, { pageX: this.nodeXY[0], pageY: this.nodeXY[1] });
                this.get(DRAG_NODE).on(MOUSE_UP, this._handleMouseUp, this, true);
                var xy = this.nodeXY;

                this._startTime = (new Date()).getTime();
                
                this.region = {
                    '0': xy[0], 
                    '1': xy[1],
                    area: 0,
                    top: xy[1],
                    right: xy[0] + this.get(NODE).get(OFFSET_WIDTH),
                    bottom: xy[1] + this.get(NODE).get(OFFSET_HEIGHT),
                    left: xy[0]
                };
                
            }
            return this;
        },
        /**
        * @method end
        * @description Ends the drag operation
        * @return {Self}
        */
        end: function() {
            this._endTime = (new Date()).getTime();
            clearTimeout(this._clickTimeout);
            this._dragThreshMet = false;
            this._fromTimeout = false;
            if (!this.get('lock') && this.get('dragging')) {
                this.fire(EV_END, { pageX: this.lastXY[0], pageY: this.lastXY[1] });
            }
            this.get(NODE).removeClass(DDM.CSS_PREFIX + '-dragging');
            this.set('dragging', false);
            this.deltaXY = [0, 0];
            this.get(DRAG_NODE).detach(MOUSE_UP, this._handleMouseUp, this, true);

            return this;
        },
        /**
        * @private
        * @method _align
        * @description Calculates the offsets and set's the XY that the element will move to.
        * @param {Array} xy The xy coords to align with.
        * @return Array
        * @type {Array}
        */
        _align: function(xy) {
            return [xy[0] - this.deltaXY[0], xy[1] - this.deltaXY[1]];
        },
        /**
        * @private
        * @method _moveNode
        * @description This method performs the actual element move.
        * @param {Array} eXY The XY to move the element to, usually comes from the mousemove DOM event.
        * @param {Boolean} noFire If true, the drag:drag event will not fire.
        */
        _moveNode: function(eXY, noFire) {
            var xy = this._align(eXY), diffXY = [], diffXY2 = [];

            diffXY[0] = (xy[0] - this.lastXY[0]);
            diffXY[1] = (xy[1] - this.lastXY[1]);

            diffXY2[0] = (xy[0] - this.nodeXY[0]);
            diffXY2[1] = (xy[1] - this.nodeXY[1]);

            if (this.get('move')) {
                if (Y.UA.opera) {
                    this.get(DRAG_NODE).setXY(xy);
                } else {
                    DDM.setXY(this.get(DRAG_NODE), diffXY);
                }
            }

            this.region = {
                '0': xy[0], 
                '1': xy[1],
                area: 0,
                top: xy[1],
                right: xy[0] + this.get(NODE).get(OFFSET_WIDTH),
                bottom: xy[1] + this.get(NODE).get(OFFSET_HEIGHT),
                left: xy[0]
            };

            var startXY = this.nodeXY;
            if (!noFire) {
                this.fire(EV_DRAG, {
                    pageX: xy[0],
                    pageY: xy[1],
                    info: {
                        start: startXY,
                        xy: xy,
                        delta: diffXY,
                        offset: diffXY2
                    } 
                });
            }
            
            this.lastXY = xy;
        },
        /**
        * @private
        * @method _move
        * @description Fired from DragDropMgr (DDM) on mousemove.
        * @param {Event} ev The mousemove DOM event
        */
        _move: function(ev) {
            if (this.get('lock')) {
                return false;
            } else {
                this.mouseXY = [ev.pageX, ev.pageY];
                if (!this._dragThreshMet) {
                    var diffX = Math.abs(this.startXY[0] - ev.pageX);
                    var diffY = Math.abs(this.startXY[1] - ev.pageY);
                    if (diffX > this.get('clickPixelThresh') || diffY > this.get('clickPixelThresh')) {
                        this._dragThreshMet = true;
                        this.start();
                        this._moveNode([ev.pageX, ev.pageY]);
                    }
                
                } else {
                    clearTimeout(this._clickTimeout);
                    this._moveNode([ev.pageX, ev.pageY]);
                }
            }
        },
        /**
        * @method stopDrag
        * @description Method will forcefully stop a drag operation. For example calling this from inside an ESC keypress handler will stop this drag.
        * @return {Self}
        */
        stopDrag: function() {
            if (this.get('dragging')) {
                DDM._end();
            }
            return this;
        },
        /**
        * @private
        * @method destructor
        * @description Lifecycle destructor, unreg the drag from the DDM and remove listeners
        */
        destructor: function() {
            DDM._unregDrag(this);

            this.get(NODE).removeClass(DDM.CSS_PREFIX + '-draggable');
            //TODO this doesn't work properly!!
            //this.get(NODE).detach(MOUSE_DOWN, this._handleMouseDownEvent, this, true);
            //this.get(NODE).detach(MOUSE_UP, this._handleMouseUp, this, true);
            this.__ev_mu.detach();
            this.__ev_md.detach();
            if (this.target) {
                this.target.destroy();
            }
        }
    });
    Y.namespace('DD');    
    Y.DD.Drag = Drag;



}, '@VERSION@' ,{requires:['dd-ddm-base'], skinnable:false});
YUI.add('dd-plugin', function(Y) {

       /**
        * This is a simple Drag plugin that can be attached to a Node via the plug method.
        * <p>Module Name: <strong>dd-plugin</strong></p>
        * @module dd-plugin
        */
       /**
        * This is a simple Drag plugin that can be attached to a Node via the plug method.
        * @class DragPlugin
        * @extends Drag
        * @constructor
        */

        Y.Plugin = Y.Plugin || {};

        var Drag = function(config) {
            config.node = config.owner;
            Drag.superclass.constructor.apply(this, arguments);
        };
        
        /**
        * @property NAME
        * @description dd-plugin
        * @type {String}
        */
        Drag.NAME = "dd-plugin";
        /**
        * @property NS
        * @description The Drag instance will be placed on the Node instance under the dd namespace. It can be accessed via Node.dd;
        * @type {String}
        */
        Drag.NS = "dd";


        Y.extend(Drag, Y.DD.Drag);
        Y.Plugin.Drag = Drag;



}, '@VERSION@' ,{skinnable:false, requires:['dd-drag'], optional:['dd-constrain', 'dd-proxy']});


YUI.add('dd-drag-core', function(Y){}, '@VERSION@' ,{skinnable:false, use:['dd-ddm-base', 'dd-ddm', 'dd-drag', 'dd-plugin']});

