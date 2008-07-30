YUI.add('node-style', function(Y) {

/**
 * Extended Node interface for managing regions.
 * @module node-region
 */

Y.Node.addDOMMethods([
    /**
     * Retrieves a style attribute from the node.
     * @method getStyle
     * @param {String} attr The style attribute to retrieve. 
     * @return {String} The current value of the style property for the element.
     */
    'getStyle',

    /**
     * Retrieves the computed value for the given style attribute.
     * @method getComputedStyle
     * @param {String} attr The style attribute to retrieve. 
     * @return {String} The computed value of the style property for the element.
     */
    'getComputedStyle',

    /**
     * Applies a CSS style to thes node.
     * @method setStyle
     * @param {String} attr The style attribute to set. 
     * @param {String|Number} val The value. 
     */
    'setStyle',

    /**
     * Sets multiple style properties on the node.
     * @method setStyles
     * @param {Object} hash An object literal of property:value pairs. 
     */
    'setStyles'
]);



}, '@VERSION@' ,{requires:['dom-style', 'node-base']});
