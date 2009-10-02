YUI.add('align-plugin', function(Y) {
    /**
     * Provides advanced positioning support for Node via a Plugin
     * for centering and alignment. 
     * @module shim-plugin
     */

    var OFFSET_WIDTH = 'offsetWidth',
        OFFSET_HEIGHT = 'offsetHeight',

    _resolveRegion = function(region) {
        region = region || this._host.get('viewportRegion');
        if (region instanceof Y.Node || region.nodeType) {
            region = Y.DOM.region(Y.Node.getDOMNode(region));
        }
        return region;
    };

    /**
     * Node plugin which can be used to align a node with another node,
     * region, or the viewport.
     *
     * @class Plugin.Align
     * @param {Object} User configuration object
     */
    var Align = function(config) {
        // TODO: allow for boundingBox
        this._host = config.host;
    };

        
    Align.prototype = {
        /**
         * Aligns node with a point on another node or region.
         * Possible alignment points are:
         * <dl>
         *      <dt>tl</dt>
         *      <dd>top left</dd>
         *      <dt>tr</dt>
         *      <dd>top right</dd>
         *      <dt>bl</dt>
         *      <dd>bottom left</dd>
         *      <dt>br</dt>
         *      <dd>bottom right</dd>
         *      <dt>tc</dt>
         *      <dd>top center</dd>
         *      <dt>bc</dt>
         *      <dd>bottom center</dd>
         *      <dt>rc</dt>
         *      <dd>right center</dd>
         *      <dt>lc</dt>
         *      <dd>left center</dd>
         * </dl>
         * @method to 
         * @parm region {Node || HTMLElement || Object} optional The node or
         * region to align with. Defaults to the viewport region.
         * @parm regionPoint {String} The point of the region to align with.
         * @parm point {String} The point of the node aligned to the region. 
         * @parm fixed {Boolean} Whether or not the node should re-align when
         * the window is resized. Defaults to false.
         */
        to: function(region, regionPoint, point, fixed) {
            var args = Y.Array(arguments);

            if (Y.Lang.isString(region)) { // default region to viewport
                fixed = point;
                point = regionPoint;
                regionPoint = region;
                region = null;
            }

            point = point || 'tl';
            region = _resolveRegion.call(this, region);

            var top = region.top,
                right = region.right,
                bottom = region.bottom,
                left = region.left,
                x = left,
                y = top,
                node = this._host,
                xy;
                

            switch(regionPoint) {
                case 'tl':
                    break;
                case 'tr':
                    x = right;
                    break;
                case 'bl':
                    y = bottom;  
                    break;
                case 'br':
                    x = right;
                    y = bottom;  
                    break;
                case 'tc':
                    x += (right - left) / 2;
                    break;
                case 'bc':
                    x += (right - left) / 2;
                    y = bottom;  
                    break;
                case 'lc':
                    y += (bottom - top) / 2;
                    break;
                case 'rc':
                    x = right;
                    y += (bottom - top) / 2;
                    break;
                case 'cc':
                    x += (right - left) / 2;
                    y += (bottom - top) / 2;
                    break;
            }

            switch (point) {
                case 'tl':
                    xy = [x, y];
                    break;
                case 'tr':
                    xy = [x - node.get(OFFSET_WIDTH), y];
                    break;
                case 'bl':
                    xy = [x, y - node.get(OFFSET_HEIGHT)];
                    break;
                case 'br':
                    xy = [x - node.get(OFFSET_WIDTH), y - node.get(OFFSET_HEIGHT)];
                    break;
                case 'tc':
                    xy = [x - (node.get(OFFSET_WIDTH)/2), y];
                    break;
                case 'bc':
                    xy = [x - (node.get(OFFSET_WIDTH)/2), y - node.get(OFFSET_HEIGHT)];
                    break;
                case 'lc':
                    xy = [x, y - (node.get(OFFSET_HEIGHT)/2)];
                    break;
                case 'rc':
                    xy = [(x - node.get(OFFSET_WIDTH)), y - (node.get(OFFSET_HEIGHT)/2)];
                    break;
                case 'cc':
                    xy = [x - (node.get(OFFSET_WIDTH)/2), y - (node.get(OFFSET_HEIGHT)/2)];
                    break;
                default:
                    Y.log("align: Invalid Points Argument", "info", "node-align");
            }

            if (xy && node) {
                if (fixed) {
                    this._attachResize(args);
                } else {
                    this._detachResize();
                }

                node.setXY(xy);

            }
        },

        _attachResize: function(args) {
            var align = this;
            this._resizeHandle = this._resizeHandle ||
            Y.on('resize', function() {
                setTimeout(function() {
                    align.to.apply(align, args);
                });
            }, window); 

        },        

        _detachResize: function(args) {
            if (this._resizeHandle) {
                this._resizeHandle.detach();
                this._resizeHandle = null;
            }
        },        


        /**
         * Aligns the center of a node to the center of another node or region.
         * @method center 
         * @parm region {Node || HTMLElement || Object} optional The node or
         * region to align with. Defaults to the viewport region.
         * @parm fixed {Boolean} Whether or not the node should re-align when
         * the window is resized. If centering to viewport, this defaults
         * to true, otherwise default is false.
         */
        center: function(node, fixed) {
            if (!node && fixed === undefined) {
                fixed = true; // default to true when centering to viewport 
            }
            this.to(node, 'cc', 'cc', fixed); 

        },

        /**
         * Removes the resize handler, if any. This is called automatically
         * when unplugged from the host node.
         * @method destroy 
         */
        destroy: function() {
            if (this._resizeHandle) {
                this._resizeHandle.detach();
            }
        }
    };


    Align.NAME = 'Align';
    Align.NS = 'align';

    Y.namespace('Plugin');
    Y.Plugin.Align = Align;

}, '@VERSION@' ,{requires:['node']});
