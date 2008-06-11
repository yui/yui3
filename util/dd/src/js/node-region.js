YUI.add('node-region', function(Y) {
    
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

    Y.Node.methods({
        /**
         * Returns an Object literal containing the following about this node: (top, right, bottom, left) positions, height and width
         * @method getRegion
         @return {Object} Object literal containing the following about this node: (top, right, bottom, left) positions, height and width
         */
        getRegion: function(node) {
            var x = node.getXY();
            return {
                '0': x[0],
                '1': x[1],
                top: x[1],
                right: x[0] + node.get('offsetWidth'),
                bottom: x[1] + node.get('offsetHeight'),
                left: x[0],
                height: node.get('offsetHeight'),
                width: node.get('offsetWidth')
            };
            
        },

        /**
         * Find the intersect information for this node and the node passed in.
         * @method intersect
         * @param {Object} node2 The node to check the interect with
         * @param {Object} altRegion An object literal containing the region for this node if we already have the data (for performance i.e. DragDrop)
         * @return {Object} Returns an Object literal with the intersect information for the nodes
         */
        intersect: function(node, node2, altRegion) {
            var r = altRegion || node.getRegion(), region = {};

            var n = Y.Node.get(node2);
            if (n instanceof Y.Node) {
                region = n.getRegion();
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
                inRegion: node.inRegion(region, false, altRegion)
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
                r = altRegion || node.getRegion();

            var n = Y.Node.get(node2);
            if (n instanceof Y.Node) {
                region = n.getRegion();
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
         * @return {Boolean} True if in region, false if not.
         */
        inViewportRegion: function(node, all) {
            return node.inRegion(node.get('viewportRegion'), all);
                
        }

    });

});
