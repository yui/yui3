var Y_Node = Y.Node;

Y_Node.SHOW_TRANSITION = null;
Y_Node.HIDE_TRANSITION = null;

Y.mix(Y_Node.prototype, {
    SHOW_TRANSITION: Y_Node.SHOW_TRANSITION,
    HIDE_TRANSITION: Y_Node.HIDE_TRANSITION,

    /**
     * Makes the node visible.
     * If the "transition" module is loaded, show optionally
     * animates the showing of the node using either the default
     * transition effect ('fadeIn'), or the given named effect.
     * @method show
     * @param {String} name A named Transition effect to use as the show effect. 
     * @param {Object} config Options to use with the transition. 
     * @param {Function} callback An optional function to run after the transition completes. 
     * @chainable
     */
    show: function(callback) {
        callback = arguments[arguments.length - 1];
        this.toggleView(true, callback);
        return this;
    },

    /**
     * The implementation for showing nodes.
     * Default is to toggle the style.display property.
     * @protected
     * @chainable
     */
    _show: function() {
        this.setStyle('display', '');

    },

    _isHidden: function() {
        return Y.DOM.getStyle(this._node, 'display') === 'none';
    },

    toggleView: function(on, callback) {
        this._toggleView.apply(this, arguments);
    },

    _toggleView: function(on, callback) {
        callback = arguments[arguments.length - 1];

        // base on current state if not forcing 
        if (typeof on != 'boolean') {
            on = (this._isHidden()) ? 1 : 0;
        }

        if (on) {
            this._show();
        }  else {
            this._hide();
        }

        if (typeof callback == 'function') {
            callback.call(this);
        }

        return this;
    },

    /**
     * Hides the node.
     * If the "transition" module is loaded, hide optionally
     * animates the hiding of the node using either the default
     * transition effect ('fadeOut'), or the given named effect.
     * @method hide
     * @param {String} name A named Transition effect to use as the show effect. 
     * @param {Object} config Options to use with the transition. 
     * @param {Function} callback An optional function to run after the transition completes. 
     * @chainable
     */
    hide: function(callback) {
        callback = arguments[arguments.length - 1];
        this.toggleView(false, callback);
        return this;
    },

    /**
     * The implementation for hiding nodes.
     * Default is to toggle the style.display property.
     * @protected
     * @chainable
     */
    _hide: function() {
        this.setStyle('display', 'none');
    }
});

Y.NodeList.importMethod(Y.Node.prototype, [
    /**
     * Makes each node visible.
     * If the "transition" module is loaded, show optionally
     * animates the showing of the node using either the default
     * transition effect ('fadeIn'), or the given named effect.
     * @method show
     * @param {String} name A named Transition effect to use as the show effect. 
     * @param {Object} config Options to use with the transition. 
     * @param {Function} callback An optional function to run after the transition completes. 
     * @chainable
     */
    'show',

    /**
     * Hides each node.
     * If the "transition" module is loaded, hide optionally
     * animates the hiding of the node using either the default
     * transition effect ('fadeOut'), or the given named effect.
     * @method hide
     * @param {String} name A named Transition effect to use as the show effect. 
     * @param {Object} config Options to use with the transition. 
     * @param {Function} callback An optional function to run after the transition completes. 
     * @chainable
     */
    'hide',

    'toggleView'
]);
