/**
* Provides an interface for working with button-like DOM nodes
*
* @module button
* @main button
* @since 3.5.0
*/

/**
* Creates a button
*
* @class Button
* @extends Base
* @param config {Object} Configuration object
* @constructor
*/
function ButtonBase(config) {
    this.initializer(config);
}


// -- Private Methods ----------------------------------------------------------

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
        return Y.ClassNameManager.getClassName(ButtonBase.NAME, str);
    } else {
        return Y.ClassNameManager.getClassName(ButtonBase.NAME);
    }
}


/* Button extends the Base class */
ButtonBase.prototype = {
    constructor: ButtonBase,
    
    initNode: function(config) {
        this._host = Y.one(config.srcNode || Y.DOM.create('<button/>'));
    },

    renderAttrs: function(config) {
        //this._initAttrHost(ButtonBase.ATTRS, config);
        Y.AttributeCore.call(this, ButtonBase.ATTRS, config);
        Y.AttributeEvents.apply(this, arguments);
        Y.AttributeExtras.apply(this, arguments);
    },

    /**
    * @method initializer
    * @description Internal init() handler.
    * @param config {Object} Config object.
    * @private
    */
    initializer: function(config){
        this.initNode(config);
        this.renderAttrs(config);
        this.renderUI(config);
        this.bindUI();
    },
    
    /**
    * @method renderUI
    * @description Renders any UI/DOM elements for Button instances
    * @private
    */
    renderUI: function(config) {
        var button = this;
        var node = button.getNode();
        
        // Set some default node attributes
        node.addClass(ButtonBase.CLASS_NAMES.BUTTON);
        
        
        // Apply any config attributes that may have been passed in.
        
        // These should always be run
        this._renderType(this.get('type'));
        this._renderSelected(this.get('selected'));
        
        // These are optional
        if (config.label) {
            this._renderLabel(this.get('label'));
        }
        
        if (config.disabled) {
            this._renderDisabled(this.get('disabled'));
        }
    },
    
    /**
    * @method bindUI
    * @description Assigns any events listeners to Button instances
    * @private
    */
    bindUI: function() {
        var button = this;
        var node = button.getNode();
        
        // Listen on some events to handle ARIA & class management
        node.on('focus', button._onFocus);
        node.on('blur', button._onBlur);
        
        // TODO: hack to make 'click' a Y.Button event until support is built for DOM events.  
        // You should not use this.  Use button.getNode().on() instead.
        node.on('click', function(){
            this.fire('click');
        }, button);
        
        // Listen for attribute changes to handle UI updates
        button.after('labelChange', function(e){
             button._renderLabel(button.get('label'));
        });
        
        button.after('typeChange', function(e){
            button._renderType(button.get('type'));
        });
        
        button.after('disabledChange', function(e){
            button._renderDisabled(button.get('disabled'));
        });
        
        button.after('selectedChange', function(e){
            button._renderSelected(button.get('selected'));
        });
    },

    /**
    * @method getNode
    * @description Returns the Button instance's Y.Node instance
    * @return {Object} A node instance
    */
    getNode: function() {
        return this._host;
    },

    /**
    * @method select
    * @description Sets a Button's 'selected' attribute to true
    */
    select: function() {
        this.set('selected', true);
    },

    /**
    * @method unselect
    * @description Sets a Button's 'selected' attribute to false
    */
    unselect: function() {
        this.set('selected', false);
    },

    /**
    * @method enable
    * @description Sets a Button's 'disabled' attribute to false
    */
    enable: function() {
        this.set('disabled', false);
    },

    /**
    * @method disable
    * @description Sets a Button's 'disabled' attribute to true
    */
    disable: function() {
        this.set('disabled', true);
    },
    
    /**
    * @method _labelSetter
    * @description A setter method for the label attribute
    * @protected
    */
    _renderLabel: function (value) {
        var node = this.getNode();
        node.set(node.test('input') ? 'value' : 'text', value);
    },

    /**
    * @method _disabledSetter
    * @description A setter method for the disabled attribute
    * @protected
    */
    _renderDisabled: function (value) {
        this.getNode().set('disabled', value)
            .toggleClass(ButtonBase.CLASS_NAMES.DISABLED, value);
    },
    
    /**
    * @method _selectedSetter
    * @description A setter method for the selected attribute
    * @protected
    */
    _renderSelected: function(value) {
        this.getNode().set(this.ARIASelectedState, value)
            .toggleClass(ButtonBase.CLASS_NAMES.SELECTED, value);
    },

    /**
    * @method _typeSetter
    * @description A setter method for the type attribute
    * @protected
    */
    _renderType: function(value) {
        var button = this;
        var node = button.getNode();
        var role = value;
        
        if (value === 'checkbox') {
            this.ARIASelectedState = ButtonBase.ARIA.CHECKED;
        }
        else {
            this.ARIASelectedState = ButtonBase.ARIA.PRESSED;
        }
            
        if (value === 'toggle' || value === 'checkbox') {
            button._clickHandler = node.on('click', function(){
                button.set('selected', !button.get('selected'));
            }, button);
        }
        else if (value === 'radio') {
            // TODO: nothing ?
        }
        else {
            if (!node.test('input') && !node.test('button')) {
                role = 'button';
            }
            
            // This probably shouldn't be set, but if it is.
            if (button._clickHandler) {
                button._clickHandler.detach();
                button._clickHandler = false;
            }
        }

        node.set('role', role);
    }
};

/** 
* Array of attributes
*
* @property ATTRS
* @type {Array}
* @private
* @static
*/
ButtonBase.ATTRS = {
    label: { },
    type: {
        _bypassProxy: true,
        value: 'push'
    },
    disabled: {
        _bypassProxy: true,
        value: false
    },
    selected: {
        _bypassProxy: true,
        value: false
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
ButtonBase.NAME = "button";

/** 
* Array of static constants used to identify the classnames applied to the Button DOM objects
*
* @property CLASS_NAMES
* @type {Array}
* @static
*/
ButtonBase.CLASS_NAMES = {
    BUTTON  : makeClassName(),
    SELECTED: makeClassName('selected'),
    FOCUSED : makeClassName('focused'),
    DISABLED: makeClassName('disabled')
};

ButtonBase.ARIA = {
    CHECKED: 'aria-checked',
    PRESSED: 'aria-pressed'
};


// -- Protected Methods ----------------------------------------------------------

/**
* @method _onBlur
* @description An event handler for 'blur' events
* @param e {DOMEvent} the event object
* @protected
*/
ButtonBase.prototype._onBlur = function(e){
    e.target.removeClass(ButtonBase.CLASS_NAMES.FOCUSED);
};

/**
* @method _onFocus
* @description An event handler for 'focus' events
* @param e {DOMEvent} the event object
* @protected
*/
ButtonBase.prototype._onFocus = function(e){
    e.target.addClass(ButtonBase.CLASS_NAMES.FOCUSED);
};

Y.mix(ButtonBase.prototype, Y.Attribute.prototype);
// Export Button
Y.ButtonBase = ButtonBase;
