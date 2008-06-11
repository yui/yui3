/**
* 3.x DragDrop Manager
* @module dd-ddm-base
*/
YUI.add('dd-ddm-base', function(Y) {
    /**
     * 3.x DragDrop Manager - Base
     * @class DDM
     * @namespace DD
     * @extends base
     * @extends event-target
     * @constructor
     */
     //TODO Add Event Bubbling??
    
    var DDMBase = function() {
    };

    DDMBase.NAME = 'DragDropMgr';

    DDMBase.ATTRS = {
        /**
        * @attribute clickPixelThresh
        * @description The number of pixels to move to start a drag operation, default is 3.
        * @type Number
        */        
        clickPixelThresh: {
            value: 3,
            set: function(p) {
                this.clickPixelThresh = p;
            }
        },
        /**
        * @attribute clickPixelThresh
        * @description The number of milliseconds a mousedown has to pass to start a drag operation, default is 1000.
        * @type Number
        */        
        clickTimeThresh: {
            value: 1000,
            set: function(p) {
                this.clickTimeThresh = p;
            }
        }

    };

    Y.mix(DDMBase, {
        /**
        * @property clickPixelThresh
        * @description The number of pixels moved needed to start a drag operation, default 3.
        * @type {Number}
        */
        clickPixelThresh: 3,
        /**
        * @property clickTimeThresh
        * @description The number of milliseconds a mousedown needs to exceed to start a drag operation, default 1000.
        * @type {Number}
        */
        clickTimeThresh: 1000,
        /**
        * @private
        * @property drags
        * @description Holder for all registered drag elements.
        * @type {Array}
        */
        drags: [],
        /**
        * @property activeDrag
        * @description A reference to the currently active draggable object.
        * @type {Drag}
        */
        activeDrag: false,
        /**
        * @private
        * @method regDrag
        * @description Adds a reference to the drag object to the DDM.drags array, called in the constructor of Drag.
        * @param {Drag} d The Drag object
        */
        regDrag: function(d) {
            this.drags[this.drags.length] = d;
        },
        /**
        * @private
        * @method unregDrag
        * @description Remove this drag object from the DDM.drags array.
        * @param {Drag} d The drag object.
        */
        unregDrag: function(d) {
            var tmp = [];
            Y.each(this.drags, function(n, i) {
                if (n !== d) {
                    tmp[tmp.length] = n;
                }
            });
            this.drags = tmp;
        },
        /**
        * @private
        * @method init
        * @description DDM's init method
        */
        init: function() {
            Y.Node.get('document').on('mousemove', this.move, this, true);
            Y.Node.get('document').on('mouseup', this.end, this, true);
        },
        /**
        * @private
        * @method start
        * @description Internal method used by Drag to signal the start of a drag operation
        * @param {Number} x The x position of the drag element
        * @param {Number} y The y position of the drag element
        * @param {Number} w The width of the drag element
        * @param {Number} h The height of the drag element
        */
        start: function(x, y, w, h) {
            this.startDrag.apply(this, arguments);
        },
        /**
        * @private
        * @method startDrag
        * @description Factory method to be overwritten by other DDM's
        * @param {Number} x The x position of the drag element
        * @param {Number} y The y position of the drag element
        * @param {Number} w The width of the drag element
        * @param {Number} h The height of the drag element
        */
        startDrag: function() {},
        /**
        * @private
        * @method endDrag
        * @description Factory method to be overwritten by other DDM's
        */
        endDrag: function() {},
        dropMove: function() {},
        /**
        * @private
        * @method end
        * @description Internal method used by Drag to signal the end of a drag operation
        */
        end: function() {
            if (this.activeDrag) {
                this.endDrag();
                this.activeDrag.end.call(this.activeDrag);
                this.activeDrag = null;
            }
        },
        /**
        * @private
        * @method move
        * @description Internal listener for the mousemove DOM event to pass to the Drag's move method.
        */
        move: function() {
            if (this.activeDrag) {
                this.activeDrag.move.apply(this.activeDrag, arguments);
                this.dropMove();
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
                Y.each(this.drags, function(v, k) {
                    if (n.compareTo(v.get('node'))) {
                        drag = v;
                    }
                });
            }
            return drag;
        }
    });

    Y.mix(DDMBase, Y.Base.prototype);

    Y.namespace('DD');
    Y.DD.DDM = DDMBase;
    Y.DD.DDM.init();

}, '3.0.0', {requires: ['node', 'nodeextras', 'base']});
