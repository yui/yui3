YUI.add('button-core', function(Y) {

/**
* Provides an interface for working with button-like DOM nodes
*
* @module button-core
* @since 3.5.0
*/

/**
* returns a properly formed yui class name
*
* @method
* @param str {String} string to be appended at the end of class name
* @return
* @private
*/
function makeClassName(str) {
    if (str) {
        return Y.ClassNameManager.getClassName(Button.NAME, str);
    } else {
        return Y.ClassNameManager.getClassName(Button.NAME);
    }
}

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
        if (config.srcNode) {
            this._host = Y.one(config.srcNode);
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
        config.label = config.label || config.host.getContent() || config.host.get('value'); //Todo: Is this the right place?
        Y.AttributeCore.call(this, Button.ATTRS, config);
    },
    
    /**
    * @method renderUI
    * @description Renders any UI/DOM elements for Button instances
    * @private
    */
    _renderUI: function(config) {
        var node = this.getNode();

        // Set some default node attributes
        node.addClass(Button.CLASS_NAMES.BUTTON);
        
        node.set('role', 'button'); //TODO: Only if it actually needs role='button'
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
    * @description 
    * @public
    */
    disable: function() {
        this.set('disabled', true);
    },
    
    /**
    * @method getNode
    * @description 
    * @public
    */
    getNode: function() {
        return this._host;
    },

    /**
    * @method _uiSetLabel
    * @description 
    * @private
    */
    _uiSetLabel: function(value) {
        var node = this.getNode(),
            attr = (node.get('tagName').toLowerCase() === 'input') ? 'value' : 'text';
        node.set(attr, value);
        return value;
    },

    /**
    * @method _uiSetDisabled
    * @description 
    * @private
    */
    _uiSetDisabled: function(value) {
        var node = this.getNode();
        node.getDOMNode().disabled = value; // avoid rerunning setter when this === node
        node.toggleClass(Button.CLASS_NAMES.DISABLED, value);
        return value;
    },

    /**
    * @method _uiGetLabel
    * @description 
    * @private
    */
    _uiGetLabel: function() {
        var node = this.getNode(),
            attr = (node.get('tagName').toLowerCase() === 'input') ? 'value' : 'text',
            value;

        value = node.get(attr);
        return value;
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
        setter: '_uiSetLabel',
        getter: '_uiGetLabel',
        lazyAdd: false
    },

    disabled: {
        value: false,
        setter: '_uiSetDisabled',
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
    BUTTON  : makeClassName(),
    DISABLED: makeClassName('disabled'),
    SELECTED: makeClassName('selected')
};

Y.mix(Button.prototype, Y.AttributeCore.prototype);

// Export Button
Y.ButtonCore = Button;


}, '@VERSION@' ,{requires:['node']});
