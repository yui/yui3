/**
* Provides an interface for working with button-like DOM nodes
*
* @module button-core
* @since 3.5.0
*/

var getClassName = Y.ClassNameManager.getClassName;

/**
* Creates a button
*
* @class Button
* @param config {Object} Configuration object
* @constructor
*/
function Button(config) {
    this.initializer(config);
}

Button.prototype = {
    TEMPLATE: '<button/>',

    constructor: Button,

    /**
    * @method initializer
    * @description Internal init() handler.
    * @param config {Object} Config object.
    * @private
    */
    initializer: function(config) {
        this._initNode(config);
        this._initAttributes(config);
        this._renderUI(config);
    },

    /**
    * @method _initNode
    * @description
    * @param config {Object} Config object.
    * @private
    */
    _initNode: function(config) {
        if (config.host) {
            this._host = Y.one(config.host);
        } else {
            this._host = Y.Node.create(this.TEMPLATE);
        }
    },

    /**
    * @method _initAttributes
    * @description
    * @param config {Object} Config object.
    * @private
    */
    _initAttributes: function(config) {
        var host = this._host,
            node = this._getLabelNode(host);
            
        config.label = config.label || this._getLabel(node);
        Y.AttributeCore.call(this, Button.ATTRS, config);
    },

    /**
    * @method renderUI
    * @description Renders any UI/DOM elements for Button instances
    * @private
    */
    _renderUI: function(config) {
        var node = this.getNode(),
            tagName = node.get('tagName').toLowerCase();

        // Set some default node attributes
        node.addClass(Button.CLASS_NAMES.BUTTON);
        
        if (tagName !== 'button' && tagName !== 'input') {
            node.set('role', 'button');   
        }
    },

    /**
    * @method enable
    * @description
    * @public
    */
    enable: function() {
        this.set('disabled', false);
    },

    /**
    * @method disable
    * @public
    */
    disable: function() {
        this.set('disabled', true);
    },

    /**
    * @method getNode
    * @description Gets the host node
    * @public
    */
    getNode: function() {
        return this._host;
    },
    
    /**
    * @method _getLabel
    * @description Getter for a button's 'label' ATTR
    * @private
    */
    _getLabel: function () {
        var node    = this.getNode(),
            tagName = node.get('tagName').toLowerCase();

        if (tagName === 'input') {
            return node.get('value');
        }

        return (node.one('.' + Button.CLASS_NAMES.LABEL) || node).get('text');
    },
    
    /**
    * @method _uiSetLabel
    * @description Setter for a button's 'label' ATTR
    * @private
    */
    _setLabel: function(value) {
        var parent = this.getNode(),
            node = this._getLabelNode(parent),
            attr = (node.get('tagName').toLowerCase() === 'input') ? 'value' : 'innerHTML';
            
        node.set(attr, value);
        
        return value;
    },

    /**
    * @method _setDisabled
    * @description Setter for the 'disabled' ATTR
    * @private
    */
    _setDisabled: function(value) {
        var node = this.getNode();
        
        node.getDOMNode().disabled = value; // avoid rerunning setter when this === node
        node.toggleClass(Button.CLASS_NAMES.DISABLED, value);
        
        return value;
    },
    
    /**
    * @method _getLabelNode
    * @description Utility method to obtain a button's label node
    * @private
    */
    _getLabelNode: function(node) {
        return node.one('.' + Button.CLASS_NAMES.LABEL) || node;
    }
};

/**
* Attribute configuration.
*
* @property ATTRS
* @type {Object}
* @private
* @static
*/
Button.ATTRS = {
    label: {
        setter: '_setLabel',
        getter: '_getLabel',
        lazyAdd: false
    },

    disabled: {
        value: false,
        setter: '_setDisabled',
        lazyAdd: false
    }
};

/**
* Name of this component.
*
* @property NAME
* @type String
* @static
*/
Button.NAME = "button";

/**
* Array of static constants used to identify the classnames applied to the Button DOM objects
*
* @property CLASS_NAMES
* @type {Array}
* @static
*/
Button.CLASS_NAMES = {
    BUTTON  : getClassName('button'),
    DISABLED: getClassName('button', 'disabled'),
    SELECTED: getClassName('button', 'selected'),
    LABEL: getClassName('button', 'label')
};

Y.mix(Button.prototype, Y.AttributeCore.prototype);

// Export Button
Y.ButtonCore = Button;
