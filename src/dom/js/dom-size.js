Y.mix(Y.DOM, {
    /**
     * Sets the width of the element to the given size, regardless
     * of box model, border, padding, etc.
     * @method setWidth
     * @param {HTMLElement} element The DOM element. 
     * @param {String|Int} size The pixel height to size to
     */

    setWidth: function(node, size) {
        Y.DOM._setSize(node, 'width', size);
    },

    /**
     * Sets the height of the element to the given size, regardless
     * of box model, border, padding, etc.
     * @method setHeight
     * @param {HTMLElement} element The DOM element. 
     * @param {String|Int} size The pixel height to size to
     */

    setHeight: function(node, size) {
        Y.DOM._setSize(node, 'height', size);
    },

    _getOffsetProp: function(node, prop) {
        return 'offset' + prop.charAt(0).toUpperCase() + prop.substr(1);
    },

    _setSize: function(node, prop, val) {
        var offset;

        Y.DOM.setStyle(node, prop, val + 'px');
        offset = node[Y.DOM._getOffsetProp(node, prop)];
        val = val - (offset - val);

        // TODO: handle size less than border/padding (add class?)
        if (val < 0) {
            val = 0; // no negative sizes
        }
        Y.DOM.setStyle(node, prop, val + 'px');
    }
});
