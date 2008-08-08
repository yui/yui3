/**
 * Extended Node interface for managing regions and screen positioning.
 * Adds support for positioning elements and normalizes window size and scroll detection. 
 * @module node
 * @submodule node-screen
 * @for Node
 */

    Y.each([
        /**
         * Returns the inner width of the viewport (exludes scrollbar). 
         * @property winWidth
         * @type {Int}
         */
        'winWidth',

        /**
         * Returns the inner height of the viewport (exludes scrollbar). 
         * @property winHeight
         * @type {Int}
         */
        'winHeight',

        /**
         * Document width 
         * @property winHeight
         * @type {Int}
         */
        'docWidth',

        /**
         * Document height 
         * @property docHeight
         * @type {Int}
         */
        'docHeight',

        /**
         * Amount page has been scroll vertically 
         * @property docScrollX
         * @type {Int}
         */
        'docScrollX',

        /**
         * Amount page has been scroll horizontally 
         * @property docScrollY
         * @type {Int}
         */
        'docScrollY'
        ],
        function(v, n) {
            Y.Node.getters(v, Y.Node.wrapDOMMethod(v));
        }
    );

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
     * Set the position of the node in page coordinates, regardless of how the node is positioned.
     * The node must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
     * @method setXY
     * @param {Array} xy Contains X & Y values for new position (coordinates are page-based)
     * @chainable
     */
        'setXY',

    /**
     * Gets the current position of the node in page coordinates. 
     * Nodes must be part of the DOM tree to have page coordinates
     * (display:none or nodes not appended return false).
     * @method getX
     * @return {Int} The X position of the node
    */
        'getX',

    /**
     * Set the position of the node in page coordinates, regardless of how the node is positioned.
     * The node must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
     * @method setX
     * @param {Int} x X value for new position (coordinates are page-based)
     * @chainable
     */
        'setX',

    /**
     * Gets the current position of the node in page coordinates. 
     * Nodes must be part of the DOM tree to have page coordinates
     * (display:none or nodes not appended return false).
     * @method getY
     * @return {Int} The Y position of the node
    */
        'getY',

    /**
     * Set the position of the node in page coordinates, regardless of how the node is positioned.
     * The node must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
     * @method setY
     * @param {Int} y Y value for new position (coordinates are page-based)
     * @chainable
     */
        'setY'
    ]);
