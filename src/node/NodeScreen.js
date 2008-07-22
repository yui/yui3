/**
 * Extended interface for Node
 * @interface nodescreen
 */

    /**
     * An interface for Node positioning.
     * @interface nodescreen
     */

    var ATTR = ['winWidth', 'winHeight', 'docWidth', 'docHeight', 'docScrollX', 'docScrollY'];

    Y.each(ATTR, function(v, n) {
        Y.Node.getters(v, Y.Node.wrapDOMMethod(v));
    });

    Y.Node.addDOMMethods([
    /**
     * Gets the current position of the node in page coordinates. 
     * Nodes must be part of the DOM tree to have page coordinates
     * (display:none or nodes not appended return false).
     * @method getXY
     * @return {Array} The XY position of the node
    */
        'getXY',

    /**
     * Set the position of a node in page coordinates, regardless of how the node is positioned.
     * The node must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
     * @method setXY
     * @param {Array} xy Contains X & Y values for new position (coordinates are page-based)
     */
        'setXY'
    ]);

