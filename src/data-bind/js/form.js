/**
Adds bidirectional form element support for attribute binding to `Y.DataBind`.

@module data-bind
@submodule data-bind-form
@since 3.9.0
**/
function bindChange(attr, config) {
    config.handle = new Y.EventHandle([
        config.handle,
        config.field.on('change', this._onBoundUIChange, this, attr)
    ]);
}
function bindClick(attr, config) {
    config.handle = new Y.EventHandle([
        config.handle,
        config.field.on('click', this._onBoundUIChange, this, attr)
    ]);
}

Y.mix(Y.DataBind.BIND_CONFIGS, {
    checkbox: {
        getter: '_getBoundCheckboxValue',
        setter: '_setBoundCheckboxValue'
    },
    radio: {
        getter: '_getBoundRadioValue',
        setter: '_setBoundRadioValue'
    },
    select: {
        getter: '_getBoundSelectValue',
        setter: '_setBoundSelectValue'
    },
    textarea: {
        getter: '_getBoundNodeValue',
        setter: '_setBoundNodeValue'
    }
}, true);

Y.mix(Y.DataBind.prototype, {
    /**
    Binds select input changes to update the bound attribute.

    @method _bindSelect
    @param {String} attr Attribute name
    @param {Object} config Bind configuration
    **/
    _bindSelect: bindChange,

    /**
    Binds textarea changes to update the bound attribute.

    @method _bindTextarea
    @param {String} attr Attribute name
    @param {Object} config Bind configuration
    **/
    _bindTextarea: bindChange,

    /**
    Binds input elements according to their type. See the relevant
    `_bindRadio`, etc methods.

    @method _bindInput
    @param {String} attr Attribute name
    @param {Object} config Bind configuration
    **/
    _bindInput: function (attr, config) {
        var field = config.field.item ? config.field.item(0) : config.field,
            type, method;

        config.type = type = field.get('type').toLowerCase();

        method = '_bind' + type.charAt(0).toUpperCase() + type.slice(1);

        if (!this[method]) {
            config.type = 'textarea';
        }

        // e.g. this._bindRadio(attr, config);
        (this[method] || this._bindNodeValue).call(this, attr, config);
    },

    /**
    Binds radio group input changes to update the bound attribute.

    @method _bindRadio
    @param {String} attr Attribute name
    @param {Object} config Bind configuration
    **/
    _bindRadio: bindClick,

    /**
    Binds checkbox input changes to update the bound attribute.

    @method _bindCheckbox
    @param {String} attr Attribute name
    @param {Object} config Bind configuration
    **/
    _bindCheckbox: bindClick,

    /**
    Binds `node.value` changes to update the bound attribute.

    @method _bindNodeValue
    @param {String} attr Attribute name
    @param {Object} config Bind configuration
    **/
    _bindNodeValue: bindChange,

    /**
    Relays field changes from user input to the bound attribute.

    @method _onUIChange
    @param {DOMEventFacade} e DOM event originating the change
    @param {String} the name of the bound attribute for this field
    @protected
    **/
    _onBoundUIChange: function (e, attr) {
        var config = this._bindMap[attr];

        if (config) {
            config.host.set(attr, this.getUIValue(attr), { src: 'UI' });
        }
    },

    /**
    Setter for radio input values. Assigns the 'checked' property of the radio
    in the radio group with the corresponding value. If the provided value
    doesn't match any of the DOM values, the current DOM value is not changed.

    @method _setBoundRadioValue
    @param {NodeList} radioGroup The radio input nodes in the radio group
    @param {Any} value The value to set in the UI
    @param {Object} config The bind config
    @protected
    **/
    _setBoundRadioValue: function (radioGroup, value) {
        var radios = radioGroup.getDOMNodes(),
            i, len;

        for (i = 0, len = radios.length; i < len; ++i) {
            // allowing for type coercion on purpose
            if (radios[i].value == value) {
                break;
            }
        }

        if (i < len) {
            radios[i].checked = true;
        }
    },

    /**
    Setter for checkbox input values. Assigns the 'checked' property of the
    input if the provided value is `true` or is equal to the 'value' property
    of the checkbox element. Otherwise, it unchecks it.

    @method _setBoundCheckboxValue
    @param {Node} checkbox The checkbox input Node
    @param {Any} value The value to trigger checking or unchecking the box
    @param {Object} config The bind config
    @protected
    **/
    _setBoundCheckboxValue: function (checkbox, value) {
        checkbox.set('checked',
            (value === true || value === checkbox.get('value')));
    },

    /**
    Setter for select fields. Assigns the 'selected' property of the option
    in the select with the corresponding value. If the provided value
    doesn't match any of the DOM values, the current DOM value is not changed.

    @method _setSelectValue
    @param {Node} select The select Node
    @param {Any} value The value to set in the UI
    @param {Object} config The bind config
    @protected
    **/
    _setBoundSelectValue: function (select, value) {
        var options = select.getDOMNode().options,
            i, len;

        for (i = 0, len = options.length; i < len; ++i) {
            // allowing for type coercion on purpose
            if (options[i].value == value) {
                break;
            }
        }

        if (i < len) {
            options[i].selected = true;
        }
    },

    /**
    The default value setter for form elements. Assigns the 'value' property of
    the provided Node.

    @method _setBoundNodeValue
    @param {Node} field The bound Node
    @param {Any} value The value to set in the UI
    @param {Object} config The bind config
    @param {Object} config The bind config
    @protected
    **/
    _setBoundNodeValue: function (field, value) {
        field.set('value', value);
    },

    /**
    Gets the value of the currently checked radio button in the group.

    @method _getBoundRadioValue
    @param {NodeList} radioGroup The input Nodes in the radio group
    @param {Object} config The bind config
    @return {String|null} The value of the checked radio or null if none
    @protected
    **/
    _getBoundRadioValue: function (radioGroup) {
        var radios = radioGroup.getDOMNodes(),
            i, len, radio;

        for (i = 0, len = radios.length; i < len; ++i) {
            radio = radios[i];
            if (radio.checked) {
                return radio.value;
            }
        }

        // TODO: better default return value?
        return null;
    },

    /**
    Returns the value of the checkbox if its checked, or `null` otherwise.

    @method _getCheckboxValue
    @param {Node} checkbox The checkbox input Node
    @param {Object} config The bind config
    @return {String|null} The value of the checkbox or null if unchecked
    @protected
    **/
    _getBoundCheckboxValue: function (checkbox) {
        // TODO: better default value for unchecked box?
        return checkbox.get('checked') ? checkbox.get('value') : null;
    },

    /**
    Gets the value of the currently selected option in the select.

    @method _getBoundSelectValue
    @param {Node} select The select Node
    @param {Object} config The bind config
    @return {String|null} The value of the selected option or null if none
    @protected
    **/
    _getBoundSelectValue: function (select) {
        select = select.getDOMNode();
        return (select.selectedIndex >= 0) ?
            select.options[select.selectedIndex].value :
            null;
    },

    /**
    Default value getter for form elements. Returns the value of the Node's
    'value' property.

    @method _getBoundNodeValue
    @param {Node} field The bound Node
    @param {Object} config The bind config
    @return {String} The value of the field's 'value' property
    @protected
    **/
    _getBoundNodeValue: function (field) {
        return field.get('value');
    }
}, true);
