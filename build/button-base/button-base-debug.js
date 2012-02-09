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
        var node = this.getNode();
        
        // Set some default node attributes
        node.addClass(Button.CLASS_NAMES.BUTTON);
        node.set('role', 'button');
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
        setter: function (value) {
            var node = this._host,
                attr = (node.get('tagName').toLowerCase() === 'input') ? 'value' : 'text';

            node.set(attr, value);
            return value;
        },

        getter: function () {
            var node = this._host,
                attr = (node.get('tagName').toLowerCase() === 'input') ? 'value' : 'text',
                value;

            value = node.get(attr);
            return value;
        },

        _lazyAdd: false
    },

    disabled: {
        setter: function (value) {
            var node = this.getNode();
            node.getDOMNode().disabled = value; // avoid rerunning setter when this === node
            node.toggleClass(Button.CLASS_NAMES.DISABLED, value);
            return value;
        },

        _lazyAdd: false
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
ButtonNode.ATTRS.label._bypassProxy = true;

Y.ButtonNode = ButtonNode;
function ButtonPlugin(config) {
    ButtonPlugin.superclass.constructor.apply(this, arguments);
}

Y.extend(ButtonPlugin, Y.ButtonBase, {
    _initNode: function(config) {
        this._host = config.host;
    },

    enable: function() {
        this.set('disabled', false);
    },

    disable: function() {
        this.set('disabled', true);
    }
}, {
    NAME: 'buttonPlugin',
    NS: 'button'
});

Y.Plugin.Button = ButtonPlugin;
function ButtonWidget(config) {
    ButtonWidget.superclass.constructor.apply(this, arguments);
}

Y.extend(ButtonWidget, Y.Widget,  {
    initializer: function(config) {
        this._host = this.get('contentBox');
    },

    CONTENT_TEMPLATE: Y.ButtonBase.prototype.TEMPLATE
}, {
    NAME: 'button',
    ATTRS: Y.merge(Y.Widget.ATTRS, Y.ButtonBase.ATTRS, {
        selected: {
            setter: function(val) {
                this.get('contentBox').toggleClass('yui3-button-selected', val); 
                // aria
            },

            value: false
        }
    })
});

Y.mix(ButtonWidget.prototype, Y.ButtonBase.prototype);

Y.Button = ButtonWidget;

function ToggleButton(config) {
    ButtonWidget.superclass.constructor.apply(this, arguments);
}

Y.extend(ToggleButton, Y.Button,  {
    bindUI: function() {
        var button = this;
        this.get('contentBox').on('click', function() {
            button.set('selected', !button.get('selected'));
        });
    },

    syncUI: function() {
        this.set('selected', this.get('selected'));
        this.set('label', this.get('label'));
    }
}, {
    NAME: 'toggleButton'
});

Y.ToggleButton = ToggleButton;


}, '@VERSION@' ,{requires:['base', 'classnamemanager', 'node']});
