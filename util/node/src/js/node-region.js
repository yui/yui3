/**
 * Extended Node interface for managing regions and screen positioning.
 * Adds support for positioning elements and normalizes window size and scroll detection. 
 * @module node
 * @submodule node-screen
 * @for Node
 */

var ATTR = [
        /**
         * Returns a region object for the node 
         * @property region
         * @type Node
         */
        'region',
        /**
         * Returns a region object for the node's viewport 
         * @property viewportRegion
         * @type Node
         */
        'viewportRegion'
    ],

    getNode = Y.Node.getDOMNode;

Y.each(ATTR, function(v, n) {
    Y.Node.getters(v, Y.Node.wrapDOMMethod(v));
});

Y.Node.addDOMMethods([
    /**
     * Determines whether or not the node is currently visible in the viewport. 
     * @method inViewportRegion         
     * @return {Boolean} Whether or not the node is currently positioned
     * within the viewport's region
     */
    'inViewportRegion'
]);

// these need special treatment to extract 2nd node arg
Y.Node.methods({
    /**
     * Compares the intersection of the node with another node or region 
     * @method intersect         
     * @param {Node|Object} node2 The node or region to compare with.
     * @param {Object} altRegion An alternate region to use (rather than this node's). 
     * @return {Object} An object representing the intersection of the regions. 
     */
    intersect: function(node1, node2, altRegion) {
        if (node2 instanceof Y.Node) { // might be a region object
            node2 = getNode(node2);
        }
        return Y.DOM.intersect(node1, node2, altRegion); 
    },

    /**
     * Determines whether or not the node is within the giving region.
     * @method inRegion         
     * @param {Node|Object} node2 The node or region to compare with.
     * @param {Boolean} all Whether or not all of the node must be in the region. 
     * @param {Object} altRegion An alternate region to use (rather than this node's). 
     * @return {Object} An object representing the intersection of the regions. 
     */
    inRegion: function(node1, node2, all, altRegion) {
        if (node2 instanceof Y.Node) { // might be a region object
            node2 = getNode(node2);
        }
        return Y.DOM.inRegion(node1, node2, all, altRegion); 
    }
});

