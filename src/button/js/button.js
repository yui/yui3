function ButtonWidget(config) {
    ButtonWidget.superclass.constructor.apply(this, arguments);
}

Y.extend(ButtonWidget, Y.Widget,  {
    initializer: function(config) {
        this._host = this.get('boundingBox');
    },

    BOUNDING_TEMPLATE: Y.ButtonBase.prototype.TEMPLATE,
    CONTENT_TEMPLATE: null,

    bindUI: function() {
        var button = this;
        this.after('labelChange', this._afterLabelChange);
        this.after('disabledChange', this._afterDisabledChange);
        this.after('selectedChange', this._afterSelectedChange);
    },

    _uiSetSelected: function(value) {
        this.get('contentBox').toggleClass('yui3-button-selected', value).set('aria-pressed', value); // TODO should support aria-checked (if applicable)
    },
    _afterLabelChange: function(e) {
        this._uiSetLabel(e.newVal);
    },

    _afterDisabledChange: function(e) {
        this._uiSetDisabled(e.newVal);
    },

    _afterSelectedChange: function(e) {
        this._uiSetSelected(e.newVal);
    },

    syncUI: function() {
        this._uiSetLabel(this.get('label'));
        this._uiSetDisabled(this.get('disabled'));
        this._uiSetSelected(this.get('selected'));
    },

}, {
    NAME: 'button',
});

ButtonWidget.ATTRS = {
    label: {
        value: Y.ButtonBase.ATTRS.label.value
    },

    disabled: {
        value: false
    },

    selected: {
        value: false
    }
};

ButtonWidget.HTML_PARSER = {
    label: function(node) {
        this._host = node; // TODO: remove
        return this._uiGetLabel();
    },

    disabled: function(node) {
        return node.getDOMNode().disabled;
    },

    selected: function(node) {
        return node.hasClass('yui3-button-selected');
    }
};

Y.mix(ButtonWidget.prototype, Y.ButtonBase.prototype);

Y.Button = ButtonWidget;





function ToggleButton(config) {
    ButtonWidget.superclass.constructor.apply(this, arguments);
}

// TODO: move to ButtonBase subclass to enable toggle plugin, widget, etc.
Y.extend(ToggleButton, Y.Button,  {
    trigger: 'click',

    select: function() {
        this.set('selected', true);
    },

    unselect: function() {
        this.set('selected', false);
    },

    toggle: function() {
        var button = this;
        button.set('selected', !button.get('selected'));
    },

    bindUI: function() {
        var button = this;
        ToggleButton.superclass.bindUI.call(button);
        button.get('contentBox').set('role', 'toggle');
        button.get('contentBox').on(button.trigger, button.toggle, button);
    }
}, {
    NAME: 'toggleButton'
});

Y.ToggleButton = ToggleButton;
