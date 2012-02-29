YUI.add('button', function(Y) {

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
        button.after('selectedChange', button._afterSelectedChange);
    },

    /**
     * @method syncUI
     * @description
     */
    syncUI: function() {
        var button = this;
        button._uiSetLabel(button.get('label'));
        button._uiSetDisabled(button.get('disabled'));
        button._uiSetSelected(button.get('selected'));
    },

    /**
    * @method _uiSetSelected
    * @description
    * @private
    */
    _uiSetSelected: function(value) {
        this.get('contentBox').toggleClass(ButtonWidget.CLASS_NAMES.SELECTED, value).set('aria-pressed', value); // TODO should support aria-checked (if applicable)
    },

    /**
    * @method _afterLabelChange
    * @description
    * @private
    */
    _afterLabelChange: function(e) {
        this._uiSetLabel(e.newVal);
    },

    /**
    * @method _afterDisabledChange
    * @description
    * @private
    */
    _afterDisabledChange: function(e) {
        this._uiSetDisabled(e.newVal);
    },

    /**
    * @method _afterSelectedChange
    * @description
    * @private
    */
    _afterSelectedChange: function(e) {
        this._uiSetSelected(e.newVal);
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
        },

        selected: {
            value: false
        }
    },

    /**
    * TODO
    *
    * @property HTML_PARSER
    * @type {Object}
    * @protected
    * @static
    */
    HTML_PARSER: {
        label: function(node) {
            this._host = node; // TODO: remove
            return this._uiGetLabel();
        },

        disabled: function(node) {
            return node.getDOMNode().disabled;
        },

        selected: function(node) {
            return node.hasClass(ButtonWidget.CLASS_NAMES.SELECTED);
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
/* ButtonWidget extends ButtonWidget */
Y.extend(ToggleButton, ButtonWidget,  {
    trigger: 'click',

    /**
     * bindUI implementation
     *
     * Hooks up events for the widget
     * @method bindUI
     */
    bindUI: function() {
        var button = this;
        ToggleButton.superclass.bindUI.call(button);
        button.get('contentBox').set('role', 'toggle');
        button.get('contentBox').on(button.trigger, button.toggle, button);
    },

    /**
    * @method select
    * @description
    * @public
    */
    select: function() {
        this.set('selected', true);
    },

    /**
    * @method unselect
    * @description
    * @public
    */
    unselect: function() {
        this.set('selected', false);
    },

    /**
    * @method toggle
    * @description
    * @public
    */
    toggle: function() {
        var button = this;
        button.set('selected', !button.get('selected'));
    }

}, {
    NAME: 'toggleButton'
});

// Export
Y.Button = ButtonWidget;
Y.ToggleButton = ToggleButton;


}, '@VERSION@' ,{requires:['button-core', 'cssbutton', 'widget']});
