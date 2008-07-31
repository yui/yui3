/**
 * Adds position and region management functionality to DOM.
 * @module dom
 * @submodule dom-screen
 * @for DOM
 */

var OFFSET_WIDTH = 'offsetWidth',
    OFFSET_HEIGHT = 'offsetHeight',
    TAG_NAME = 'tagName';

var getOffsets = function(r1, r2) {

    var t = Math.max(r1.top,    r2.top   ),
        r = Math.min(r1.right,  r2.right ),
        b = Math.min(r1.bottom, r2.bottom),
        l = Math.max(r1.left,   r2.left  );
    
    return {
        top: t,
        bottom: b,
        left: l,
        right: r
    };
};

Y.mix(Y.DOM, {
    /**
     * Returns an Object literal containing the following about this node: (top, right, bottom, left) positions, height and width
     * @method region
     @return {Object} Object literal containing the following about this node: (top, right, bottom, left) positions, height and width
     */
    region: function(node) {
        var x = Y.DOM.getXY(node),
            ret = false;
        
        if (x) {
            ret = {
                '0': x[0],
                '1': x[1],
                top: x[1],
                right: x[0] + node[OFFSET_WIDTH],
                bottom: x[1] + node[OFFSET_HEIGHT],
                left: x[0],
                height: node[OFFSET_HEIGHT],
                width: node[OFFSET_WIDTH]
            };
        }

        return ret;
    },

    /**
     * Find the intersect information for the passes nodes.
     * @method intersect
     * @param {Object} node The first node 
     * @param {Object} node2 The other node to check the interect with
     * @param {Object} altRegion An object literal containing the region for the first node if we already have the data (for performance i.e. DragDrop)
     * @return {Object} Returns an Object literal with the intersect information for the nodes
     */
    intersect: function(node, node2, altRegion) {
        var r = altRegion || Y.DOM.region(node), region = {};

        var n = node2;
        if (n[TAG_NAME]) {
            region = Y.DOM.region(n);
        } else if (Y.Lang.isObject(node2)) {
            region = node2;
        } else {
            return false;
        }
        
        var off = getOffsets(region, r);
        return {
            top: off.top,
            right: off.right,
            bottom: off.bottom,
            left: off.left,
            area: ((off.bottom - off.top) * (off.right - off.left)),
            yoff: ((off.bottom - off.top)),
            xoff: (off.right - off.left),
            inRegion: Y.DOM.inRegion(node, node2, false, altRegion)
        };
        
    },
    /**
     * Check if any part of this node is in the passed region
     * @method inRegion
     * @param {Object} node2 The node to get the region from or an Object literal of the region
     * $param {Boolean} all Should all of the node be inside the region
     * @param {Object} altRegion An object literal containing the region for this node if we already have the data (for performance i.e. DragDrop)
     * @return {Boolean} True if in region, false if not.
     */
    inRegion: function(node, node2, all, altRegion) {
        var region = {},
            r = altRegion || Y.DOM.region(node);

        var n = node2;
        if (n[TAG_NAME]) {
            region = Y.DOM.region(n);
        } else if (Y.Lang.isObject(node2)) {
            region = node2;
        } else {
            return false;
        }
            
        if (all) {
            return ( r.left   >= region.left   &&
                r.right  <= region.right  && 
                r.top    >= region.top    && 
                r.bottom <= region.bottom    );
        } else {
            var off = getOffsets(region, r);
            if (off.bottom >= off.top && off.right >= off.left) {
                return true;
            } else {
                return false;
            }
            
        }
    },

    /**
     * Check if any part of this node is in the viewport
     * @method inViewportRegion
     * $param {Boolean} all Should all of the node be inside the region
     * @param {Object} altRegion An object literal containing the region for this node if we already have the data (for performance i.e. DragDrop)
     * @return {Boolean} True if in region, false if not.
     */
    inViewportRegion: function(node, all, altRegion) {
        return Y.DOM.inRegion(node, Y.DOM.viewportRegion(node), all, altRegion);
            
    },

    viewportRegion: function(node) {
        node = node || Y.config.doc.documentElement;
        var r = {
            top: Y.DOM.docScrollY(node),
            right: Y.DOM.winWidth(node) + Y.DOM.docScrollX(node),
            bottom: (Y.DOM.docScrollY(node) + Y.DOM.winHeight(node)),
            left: Y.DOM.docScrollX(node)
        };

        return r;
    }
});
