YUI.add('align-plugin', function(Y) {
    /**
     * Provides advanced positioning support for Node via a Plugin
     * for centering and alignment. 
     * @module shim-plugin
     */

    var OFFSET_WIDTH = 'offsetWidth',
        OFFSET_HEIGHT = 'offsetHeight',
        ie6 = (Y.UA.ie && Y.UA.ie < 7);

    /**
     * Node plugin which can be used to align a node with another node,
     * region, or the viewport.
     *
     * @class Plugin.Align
     * @param {Object} User configuration object
     */
    function Align(config) {
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
         * @parm region {String || Node || HTMLElement || Object} The node or
         * region to align with. Defaults to the viewport region.
         * @parm regionPoint {String} The point of the region to align with.
         * @parm point {String} The point of the node aligned to the region. 
         * @parm fixed {Boolean} Whether or not the node should re-align when
         * the window is resized. Defaults to false.
         */
        to: function(region, regionPoint, point, fixed) {
            // default align point is node's top left
            point = point || 'tl';
            // cache original args for syncing
            this._syncArgs = Y.Array(arguments);

            if (!region.top) {
                region = Y.one(region);
                region = region.get('region');
            }

            var top = region.top,
                right = region.right,
                bottom = region.bottom,
                left = region.left,
                x = left,
                y = top,
                node = this._host,
                xy;
                

            // align to region
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

            // align our node
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
                this._fix(fixed);
                node.setXY(xy);

            }
        },

        sync: function() {
            this.to.apply(this, this._syncArgs);
        },

        _setStyleFixed: function(add) {
            var pos = add ? 'fixed' : '';
            this._host.setStyle('position', pos);
            this._isStyleFixed = add;
        },

        _onresize: function() {
            this.sync();
        },
    
        _fix: function(fixed) {
            var prefix = Align.DETACH_PREFIX;

            if (fixed) {
                if (!this._fixing) {
                    Y.on(prefix + 'resize', this._onresize, window, this);
                    this._fixing = true;

                    // use scroll listener for IE6 and IE quirks
                    // otherwise use position :fixed
                    if (ie6 || (Y.UA.ie && Y.config.doc.compatMode === 'backCompat')) {
                        Y.on(prefix + 'scroll', this._onresize, window, this);
                    } else if (!this._isStyleFixed) {
                        this._setStyleFixed(true); 
                    }
                }
            } else { // "unfix"
                Y.detach(prefix);
                this._fixing = false;
                if (this._isStyleFixed) {
                    this._setStyleFixed(false); 
                }
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
        center: function(region, fixed) {
            this.to(region, 'cc', 'cc', fixed); 
        },

        /**
         * Removes the resize handler, if any. This is called automatically
         * when unplugged from the host node.
         * @method destroy 
         */
        destroy: function() {
            Y.detach('alignfixed');
        }
    };


    Align.NAME = 'Align';
    Align.NS = 'align';

    Align.DETACH_PREFIX = 'alignfixed|';

    Y.namespace('Plugin');
    Y.Plugin.Align = Align;

}, '@VERSION@' ,{requires:['node']});
