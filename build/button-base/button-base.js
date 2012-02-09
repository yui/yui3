YUI.add('button-base', function(Y) {

/**
* Provides an interface for working with button-like DOM nodes
*
* @module button
* @main button
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
    
    _initAttributes: function(config) {
        Y.AttributeCore.call(this, Button.ATTRS, config);
    },

    _initNode: function(config) {
        if (config.srcNode) {
            this._host = Y.one(config.srcNode);
        } else {
            this._host = Y.Node.create(this.TEMPLATE);
        }
    },

    getNode: function() {
        return this._host;
    },

    /**
    * @method initializer
    * @description Internal init() handler.
    * @param config {Object} Config object.
    * @private
    */
    initializer: function(config) {
        this._initNode(config);
        this._initAttributes(config);
        this.renderUI(config);
    },
    
    /**
    * @method renderUI
    * @description Renders any UI/DOM elements for Button instances
    * @private
    */
    renderUI: function(config) {
        var node = this._host;
        
        // Set some default node attributes
        node.addClass(Button.CLASS_NAMES.BUTTON);
        node.set('role', 'button');
    },

    /**
    * @method _labelSetter
    * @description A setter method for the label attribute
    * @protected
    */
    _labelSetter: function (value) {
        var node = this._host,
            attr = (node.get('tagName').toLowerCase() === 'input') ? 'value' : 'text';

        node.set(attr, value);
        return value;
    },

    /**
    * @method _disabledSetter
    * @description A setter method for the disabled attribute
    * @protected
    */
    _disabledSetter: function (value) {
        this._host.setAttribute('disabled', value)
            .toggleClass(Button.CLASS_NAMES.DISABLED, value);
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
        setter: '_labelSetter',
    },

    disabled: {
        setter: '_disabledSetter'
    }
};


// -- Static Properties ----------------------------------------------------------

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
    DISABLED: makeClassName('disabled')
};

Y.mix(Button.prototype, Y.AttributeCore.prototype);
// Export Button
Y.ButtonBase = Button;
function ButtonNode(config) {
    ButtonNode.superclass.constructor.call(this, config.srcNode);
    this.initializer(config);
}

Y.extend(ButtonNode, Y.Node, {
    // call with ButtonNode.ATTRS
    _initAttributes: function(config) {
        Y.AttributeCore.call(this, ButtonNode.ATTRS, config);
    },

    _initNode: function(config) {
        // enable Y.one() to return ButtonNode (for eventTarget, etc)
        Y.Node._instances[this._yuid] = this;
        this._host = this;
    }
});

// add ButtonBase API without clobbering Node/Attribute API
Y.mix(ButtonNode.prototype, Y.ButtonBase.prototype);
    
// merge Node and Button ATTRS
// TODO: protect existing? (what if Y.Node.ATTRS.disabled.getter)
ButtonNode.ATTRS = Y.merge(Y.Node.ATTRS, Y.ButtonBase.ATTRS);

Y.ButtonNode = ButtonNode;
function ButtonPlugin(config) {
    ButtonPlugin.superclass.constructor.apply(this, arguments);
}

Y.extend(ButtonPlugin, Y.ButtonBase, {
    _initNode: function(config) {
        this._host = config.host;
    },

}, {
    NAME: 'buttonPlugin',
    NS: 'button'
});

Y.Plugin.Button = ButtonPlugin;


}, '@VERSION@' ,{requires:['base', 'classnamemanager', 'node']});
