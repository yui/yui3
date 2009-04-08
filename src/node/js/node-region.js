/**
 * Extended Node interface for managing regions and screen positioning.
 * Adds support for positioning elements and normalizes window size and scroll detection. 
 * @module node
 * @submodule node-screen
 * @for Node
 */

/**
 * Returns a region object for the node 
 * @property region
 * @type Node
 */
Y.Node.ATTRS.region = {
    getter: function() {
        return Y.DOM.region(Y.Node.getDOMNode(this));
    }
};
    
/**
 * Returns a region object for the node's viewport 
 * @property viewportRegion
 * @type Node
 */
Y.Node.ATTRS.viewportRegion = {
    getter: function() {
        return Y.DOM.region(Y.Node.getDOMNode(this));
    }
};

Y.Node.importMethod(Y.DOM, 'inViewportRegion');

// these need special treatment to extract 2nd node arg
/**
 * Compares the intersection of the node with another node or region 
 * @method intersect         
 * @param {Node|Object} node2 The node or region to compare with.
 * @param {Object} altRegion An alternate region to use (rather than this node's). 
 * @return {Object} An object representing the intersection of the regions. 
 */
Y.Node.prototype.intersect = function(node2, altRegion) {
    var node1 = Y.Node.getDOMNode(this);
    if (node2 instanceof Y.Node) { // might be a region object
        node2 = Y.Node.getDOMNode(node2);
    }
    return Y.DOM.intersect(node1, node2, altRegion); 
};

/**
 * Determines whether or not the node is within the giving region.
 * @method inRegion         
 * @param {Node|Object} node2 The node or region to compare with.
 * @param {Boolean} all Whether or not all of the node must be in the region. 
 * @param {Object} altRegion An alternate region to use (rather than this node's). 
 * @return {Object} An object representing the intersection of the regions. 
 */
Y.Node.prototype.inRegion = function(node2, all, altRegion) {
    var node1 = Y.Node.getDOMNode(this);
    if (node2 instanceof Y.Node) { // might be a region object
        node2 = Y.Node.getDOMNode(node2);
    }
    return Y.DOM.inRegion(node1, node2, all, altRegion); 
};
