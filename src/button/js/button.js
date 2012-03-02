/**
* A Button Widget
*
* @module button
* @since 3.5.0
*/

var CLASS_NAMES = Y.ButtonCore.CLASS_NAMES;

/**
* Creates a ButtonWidget
*
* @class ButtonWidget
* @extends Widget
* @param config {Object} Configuration object
* @constructor
*/
function ButtonWidget(config) {
    ButtonWidget.superclass.constructor.apply(this, arguments);
}

/* ButtonWidget extends Widget */
Y.extend(ButtonWidget, Y.Widget,  {

    BOUNDING_TEMPLATE: Y.ButtonCore.prototype.TEMPLATE,

    CONTENT_TEMPLATE: null,

    /**
    * @method initializer
    * @description Internal init() handler.
    * @param config {Object} Config object.
    * @private
    */
    initializer: function(config) {
        this._host = this.get('boundingBox');
    },

    /**
     * bindUI implementation
     *
     * @description Hooks up events for the widget
     * @method bindUI
     */
    bindUI: function() {
        var button = this;
        button.after('labelChange', button._afterLabelChange);
        button.after('disabledChange', button._afterDisabledChange);
    },

    /**
     * @method syncUI
     * @description Updates button attributes
     */
    syncUI: function() {
        var button = this;
        button._setLabel(button.get('label'));
        button._setDisabled(button.get('disabled'));
    },

    /**
    * @method _afterLabelChange
    * @private
    */
    _afterLabelChange: function(e) {
        this._setLabel(e.newVal);
    },

    /**
    * @method _afterDisabledChange
    * @private
    */
    _afterDisabledChange: function(e) {
        this._setDisabled(e.newVal);
    }

}, {
    // Y.Button static properties

    /**
     * The identity of the widget.
     *
     * @property NAME
     * @type String
     * @default 'button'
     * @readOnly
     * @protected
     * @static
     */
    NAME: 'button',

    /**
    * Static property used to define the default attribute configuration of
    * the Widget.
    *
    * @property ATTRS
    * @type {Object}
    * @protected
    * @static
    */
    ATTRS: {
        label: {
            value: Y.ButtonCore.ATTRS.label.value
        },

        disabled: {
            value: false
        }
    },

    /**
    * @property HTML_PARSER
    * @type {Object}
    * @protected
    * @static
    */
    HTML_PARSER: {
        label: function(node) {
            this._host = node; // TODO: remove
            return this._getLabel();
        },

        disabled: function(node) {
            return node.getDOMNode().disabled;
        }
    },

    /**
     * List of class names used in the ButtonGroup's DOM
     *
     * @property CLASS_NAMES
     * @type Object
     * @static
     */
    CLASS_NAMES: CLASS_NAMES
});

Y.mix(ButtonWidget.prototype, Y.ButtonCore.prototype);

/**
* Creates a ToggleButton
*
* @class ToggleButton
* @extends ButtonWidget
* @param config {Object} Configuration object
* @constructor
*/
function ToggleButton(config) {
    ButtonWidget.superclass.constructor.apply(this, arguments);
}

// TODO: move to ButtonCore subclass to enable toggle plugin, widget, etc.
/* ToggleButton extends ButtonWidget */
Y.extend(ToggleButton, ButtonWidget,  {
    trigger: 'click',

    /**
     * bindUI implementation
     *
     * Hooks up events for the widget
     * @method bindUI
     */
    bindUI: function() {
        var button = this,
            cb = button.get('contentBox'),
            type = this.get('type'),
            ROLES = ToggleButton.ARIA_ROLES,
            role = (type === 'checkbox' ? ROLES.CHECKBOX : ROLES.TOGGLE);
        
        ToggleButton.superclass.bindUI.call(button);
        
        cb.set('role', role);
        cb.on(button.trigger, button.toggle, button);
        button.after('selectedChange', button._afterSelectedChange);
    },

    /**
     * bindUI implementation
     *
     * Hooks up events for the widget
     * @method bindUI
     */
    syncUI: function(config) {
        var button = this,
            type = this.get('type');
            
        ToggleButton.superclass.syncUI.call(button);
        button._setSelected(button.get('selected'));
        button._setType(button.get('type'));
    },

    /**
    * @method _setType
    * @private
    */
    _setType: function(type) {
        var name = (type === "checkbox" ? 'checked' : 'pressed');
        this.addAttr(name, {
            value: false,
            setter: '_setSelected',
            getter: '_getSelected',
            validator: Y.Lang.isBoolean
        });
    },
    
    /**
    * @method _setSelected
    * @private
    */
    _setSelected: function(value) {
        var STATES = ToggleButton.ARIA_STATES;
        
        if (this.get('type') === 'checkbox') {
            ariaState = STATES.CHECKED;
        }
        else {
            ariaState = STATES.PRESSED;
        }
        
        this.get('contentBox').toggleClass(ButtonWidget.CLASS_NAMES.SELECTED, value).set(ariaState, value);
    },

    /**
    * @method _getSelected
    * @private
    */
    _getSelected: function(value) {
        return this.get('contentBox').hasClass(ButtonWidget.CLASS_NAMES.SELECTED);
    },

    /**
    * @method _afterSelectedChange
    * @private
    */
    _afterSelectedChange: function(e) {
        this._setSelected(e.newVal);
    },
    
    /**
    * @method toggle
    * @description
    * @public
    */
    toggle: function() {
        var button = this;
        button._set('selected', !button.get('selected'));
    }

}, {
    
    NAME: 'toggleButton',
    
    /**
    * Static property used to define the default attribute configuration of
    * the Widget.
    *
    * @property ATTRS
    * @type {Object}
    * @protected
    * @static
    */
    ATTRS: {
        type: {
            value: 'toggle',
            writeOnce: 'initOnly'
        },
        selected: {
            value: false,
            readOnly: true
        }
    },
    
    /**
    * @property HTML_PARSER
    * @type {Object}
    * @protected
    * @static
    */
    HTML_PARSER: {
        selected: function(node) {
            return node.hasClass(ButtonWidget.CLASS_NAMES.SELECTED);
        }
    },
    
    ARIA_STATES: Y.ButtonCore.ARIA_STATES,
    ARIA_ROLES: Y.ButtonCore.ARIA_ROLES
});

// Export
Y.Button = ButtonWidget;
Y.ToggleButton = ToggleButton;
