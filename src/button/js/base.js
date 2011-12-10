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
function Button(config) {
    Button.superclass.constructor.apply(this, arguments);
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
        return Y.ClassNameManager.getClassName(Button.NAME, str);
    }
    else {
        return Y.ClassNameManager.getClassName(Button.NAME); 
    }
}



// -- Private Methods ----------------------------------------------------------
 
/**
* Name of this component.
*
* @property NAME
* @type String
* @static
*/
Button.NAME = "button";




/* Button extends the Base class */
Y.extend(Button, Y.Base, {
    
    /**
    * @method initializer
    * @description Internal init() handler.
    * @param config {Object} Config object.
    * @private
    */
    initializer: function(config){
        this.renderUI();
        this.bindUI();
    },
    
    /**
    * @method renderUI
    * @description Renders any UI/DOM elements for Button instances
    * @private
    */
    renderUI: function() {
        var node = this.getNode();
        
        node.addClass(Button.CLASS_NAMES.button);
        node.setAttribute('role', 'button');
    },
    
    /**
    * @method bindUI
    * @description Assigns any events listeners to Button instances
    * @private
    */
    bindUI: function() {
        var button = this;
        var node = button.getNode();
        
        node.on('click', this._onClick, button);
        node.on('mousedown', this._onMouseDown, button);
        node.on('mouseup', this._onMouseUp, button);
        node.on('focus', this._onFocus, button);
        node.on('blur', this._onBlur, button);
        
        button.on('selectedChange', function(e){
            if (e.propagate === false) {
                e.stopImmediatePropagation();
            }
        });            
    },

    /**
    * @method getNode
    * @description Returns the Button instance's Y.Node instance
    * @return {Object} A node instance
    */
    getNode: function() {
        return this.get('srcNode');
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
    _labelSetter: function (value) {
        var node = this.getNode();
        node.set(node.test('input') ? 'value' : 'text', value)
    },

    /**
    * @method _disabledSetter
    * @description A setter method for the disabled attribute
    * @protected
    */
    _disabledSetter: function (value) {
        this.getNode().set('disabled', value)
            .toggleClass(Button.CLASS_NAMES.disabled, value);
    },
    
    /**
    * @method _selectedSetter
    * @description A setter method for the selected attribute
    * @protected
    */
    _selectedSetter: function(value) {
        this.getNode().set('aria-selected', value)
            .toggleClass(Button.CLASS_NAMES.selected, value);
    },

    /**
    * @method _typeSetter
    * @description A setter method for the type attribute
    * @protected
    */
    _typeSetter: function(value) {
        var button = this;
        if (value === "toggle") {
            var node = button.getNode();
            button._clickHandler = node.on('click', function(){
                button.set('selected', !button.get('selected'));
            }, button);
        }
        else {
            if (button._clickHandler) {
                button._clickHandler.detach();
                button._clickHandler = false;
            }
        }
    }
    
}, {
    /** 
    * Array of attributes
    *
    * @property ATTRS
    * @type {Array}
    * @private
    * @static
    */
    ATTRS: {
        srcNode: {
            setter: Y.one,
            lazyAdd: false,
            valueFn: function () {
                return Y.Node.create('<button></button>');
            }
        },
        label: {
            lazyAdd: false,
            setter: '_labelSetter'
        },
        type: {
            value: 'push',
            lazyAdd: false,
            setter: '_typeSetter'
        },
        disabled: {
            value: false,
            lazyAdd: false,
            setter: '_disabledSetter'
        },
        selected: {
            value: false,
            lazyAdd: false,
            setter: '_selectedSetter'
        }
    },
    
    /** 
    * Array of static constants used to identify the classnames applied to the Button DOM objects
    *
    * @property CLASS_NAMES
    * @type {Array}
    * @private
    * @static
    */
    CLASS_NAMES: {
        button  : makeClassName(),
        selected: makeClassName('selected'),
        focused : makeClassName('focused'),
        disabled: makeClassName('disabled')
    }
});

/**
* @method _onClick
* @description An event handler for 'click' events
* @param e {DOMEvent} the event object
* @protected
*/
Button.prototype._onClick = function(e){
    this.fire('click', e);
};

/**
* @method _onBlur
* @description An event handler for 'blur' events
* @param e {DOMEvent} the event object
* @protected
*/
Button.prototype._onBlur = function(e){
    e.target.removeClass(Button.CLASS_NAMES.focused);
};

/**
* @method _onFocus
* @description An event handler for 'focus' events
* @param e {DOMEvent} the event object
* @protected
*/
Button.prototype._onFocus = function(e){
    e.target.addClass(Button.CLASS_NAMES.focused);
};

/**
* @method _onMouseUp
* @description An event handler for 'mouseup' events
* @param e {DOMEvent} the event object
* @protected
*/
Button.prototype._onMouseUp = function(e){
    e.target.setAttribute('aria-pressed', 'false');
};

/**
* @method _onMouseDown
* @description An event handler for 'mousedown' events
* @param e {DOMEvent} the event object
* @protected
*/
Button.prototype._onMouseDown = function(e){
    e.target.setAttribute('aria-pressed', 'true');
};

Y.Button = Button;