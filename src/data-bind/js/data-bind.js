/**
DataBind provides the `Y.DataBind` class to bind attributes to form elements.

The class may be used standalone, or as a class extension, and provides the
methods `_bindAttr`, `_bindAttrs`, `_unbindAttr`, and `_unbindAttrs`. When used
as a standalone class, these methods are mirrored as public versions without
the leading underscore (e.g. `bindAttr`).

@module data-bind
@class DataBind
@since 3.9.0
**/
Y.DataBind = function () {
    this._bindMap = {};

    if (!Y.Base || !(this instanceof Y.Base)) {
        // alias methods for convenience
        this.destroy     = this.destructor;
        this.bindAttr    = this._bindAttr;
        this.bindAttrs   = this._bindAttrs;
        this.unbindAttr  = this._unbindAttr;
        this.unbindAttrs = this._unbindAttrs;
    }
};

/**
Map of user events to subscribe to for specific types of inputs. If not in this
map, the 'change' event will be used.

@property FIELD_EVENTS
@type {Object}
@static
**/
Y.DataBind.FIELD_EVENTS = {
    radio: 'click',
    checkbox: 'click'
};

/**
Build configuration to migrate the FIELD_EVENTS static property to the host
class when used as a class extension.

@property _buildCfg
@type {Object}
@protected
@static
**/
Y.DataBind._buildCfg = { aggregate: ['FIELD_EVENTS'] };

Y.mix(Y.DataBind.prototype, {
    /**
    Gets the value from the DOM element representing the provided attribute. If
    the binding is configured with a `parser`, the value returned will be the
    parsed value.

    @method getUIValue
    @param {String} attr Attribute name corresponding to the DOM element
    @return {Any} Usually a string, but parsers can return anything
    **/
    getUIValue: function (attr) {
        var config = this._bindMap[attr],
            value;

        if (config) {
            value = config.getter.call(this, config.field);

            // e.g. this._getRadioValue(field)
            return config.parser ? config.parser.call(this, value) : value;
        }

        // TODO: Better default return value?
        return null;
    },

    /**
    Sets the value in the DOM element for the provided attribute. *This does
    not update the attribute value*. If the binding is configured with a
    formatter, the value assigned to the DOM element will be the formatted
    value.

    @method setUIValue
    @param {String} attr Attribute name corresponding to the DOM element
    @param {Any} value The value to assign to the DOM element
    @return {DataBind} this instance
    @chainable
    **/
    setUIValue: function (attr, value) {
        var config = this._bindMap[attr];

        if (config) {
            if (config.formatter) {
                value = config.formatter.call(this, value);
            }

            // e.g. this._setRadioValue(field, value)
            config.setter.call(this, config.field, value);
        }

        return this;
    },

    /**
    Pushes current Attribute values to the UI.

    @method syncToUI
    @return {DataBind} this instance
    @chainable
    **/
    syncToUI: function () {
        var map = this._bindMap,
            attr;

        for (attr in map) {
            if (map.hasOwnProperty(attr)) {
                this.setUIValue(attr, map[attr].host.get(attr));
            }
        }

        return this;
    },

    /**
    Pushes current DOM element values to the bound attributes.

    @method syncToModel
    @return {DataBind} this instance
    @chainable
    **/
    syncToModel: function () {
        var map = this._bindMap,
            attr;

        for (attr in map) {
            if (map.hasOwnProperty(attr)) {
                map[attr].host.set(attr, this.getUIValue(attr), {
                    src: 'UI'
                });
            }
        }

        return this;
    },

    /**
    Sets up multiple attribute bindings. Accepts a map of attribute name to
    bind configuration objects or selector strings. See `_bindAttr` for bind
    configuration options.

    @method _bindAttrs
    @param {Object} bindings map of attr->selector/bind config
    @param {Object} [host] The object hosting the attributes to bind
    **/
    _bindAttrs: function (bindings, host) {
        if (bindings) {
            for (var attr in bindings) {
                if (bindings.hasOwnProperty(attr)) {
                    this._bindAttr(attr, bindings[attr], host);
                }
            }
        }
    },

    /**
    Binds an attribute to a DOM element or set of DOM elements. When the
    attribute is changed, the DOM element(s) will be updated, and when the DOM
    element is changed _by user action_, the attribute will be updated.
    
    The basic form of this method is `binder._bindAttr('foo', '#fooField');`,
    but a configuration object can be passed as a second argument for more
    control.

    Extracting and assigning values from and to an element is automatically
    determined by the type of DOM element, but can be overridden by configuring
    the binding with `getter` and `setter` functions. If the value itself
    should be represented in the DOM differently than in the attribute,
    configure the binding with `parser` and `formatter` functions.

    Available bind configurations are:

    ```
    {
        field: <selector string, Node, or NodeList>,
        getter: function (node) { <code to get a value from node> },
        setter: function (node, value) { <... to set a value in node> },
        formatter: function (value) { <massage value for display in DOM> },
        parser: function (value) { <extract raw value from DOM value> }
    }
    ```

    @method _bindAttr
    @param {String} attr Name of the attribute to bind
    @param {Object|Node|String} config Bind configuration object, Node, or
                selector string
    @param {Object} [host] Object hosting the attribute to bind
    @protected
    **/
    _bindAttr: function (attr, config, host) {
        // Can't bind the same attribute multiple times
        if (this._bindMap[attr]) { return; }

        var eventMap = this.constructor.FIELD_EVENTS || Y.DataBind.FIELD_EVENTS,
            selector = typeof config       === 'string' ? config :
                       typeof config.field === 'string' ? config.field : null,
            field, event;

        if (selector) {
            if (config === selector) {
                config = {};
            }
            config.field = Y.all(selector);

            if (config.field.size() === 1) {
                config.field = config.field.item(0);
            }
        } else if (config instanceof Y.Node || config instanceof Y.NodeList) {
            config = { field: config };
        }

        // Copy, since we'll be adding properties
        config = Y.merge(config);

        config.host = host || this;

        field = config.field;
        
        if (field instanceof Y.NodeList) {
            field = field.item(0);
        }

        config.type = field.get('nodeName').toLowerCase();

        if (config.type === 'input') {
            config.type = field.get('type').toLowerCase();
        }

        if (!config.getter) {
            config.getter = this['_get' + config.type.charAt(0).toUpperCase() +
                                      config.type.slice(1) +
                                      'Value'] ||
                            this._getSimpleValue;
        }

        if (!config.setter) {
            config.setter = this['_set' + config.type.charAt(0).toUpperCase() +
                                      config.type.slice(1) +
                                      'Value'] ||
                            this._setSimpleValue;
        }

        event = eventMap[config.type] || 'change';

        config.handle = new Y.EventHandle([
            config.host.after(attr+'Change', this._afterBoundAttrChange, this),
            config.field.on(event, this._onUIChange, this, attr)
        ]);

        this._bindMap[attr] = config;
    },

    /**
    Unbinds an attribute from its UI representation.

    @method _unbindAttr
    @param {String} attr Name of the attribute to unbind
    @protected
    **/
    _unbindAttr: function (attr) {
        var binding = this._bindMap[attr];

        if (binding) {
            binding.handle.detach();
            this._bindMap[attr] = null;
        }
    },

    /**
    Unbinds an array of attributes.

    @method _unbindAttrs
    @param {String[]} attrs Array of attribute names to unbind
    @protected
    **/
    _unbindAttrs: function (attrs) {
        for (var i = 0, len = attrs.length; i < len; ++i) {
            this._unbindAttr(attrs[i]);
        }
    },

    /**
    Detaches the events binding the attributes and DOM elements.

    @method destructor
    @protected
    **/
    destructor: function () {
        for (var attr in this._bindMap) {
            if (this._bindMap.hasOwnProperty(attr)) {
                this._bindMap[attr].handle.detach();
            }
        }
        this._bindMap = null;
    },

    /**
    Relays new attribute values to the appropriate DOM element setter.

    @method _afterBoundAttrChange
    @param {EventFacade} e Attribute change event
    @protected
    **/
    _afterBoundAttrChange: function (e) {
        if (!e.src) {
            this.setUIValue(e.attrName, e.newVal);
        }
    },

    /**
    Relays field changes from user input to the bound attribute.

    @method _onUIChange
    @param {DOMEventFacade} e DOM event originating the change
    @param {String} the name of the bound attribute for this field
    @protected
    **/
    _onUIChange: function (e, attr) {
        var config = this._bindMap[attr];

        if (config) {
            config.host.set(attr, this.getUIValue(attr), { src: 'UI' });
        }
    },

    /**
    Setter for radio input values. Assigns the 'checked' property of the radio
    in the radio group with the corresponding value. If the provided value
    doesn't match any of the DOM values, the current DOM value is not changed.

    @method _setRadioValue
    @param {NodeList} radioGroup The radio input nodes in the radio group
    @param {Any} value The value to set in the UI
    @protected
    **/
    _setRadioValue: function (radioGroup, value) {
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

    @method _setCheckboxValue
    @param {Node} checkbox The checkbox input Node
    @param {Any} value The value to trigger checking or unchecking the box
    @protected
    **/
    _setCheckboxValue: function (checkbox, value) {
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
    @protected
    **/
    _setSelectValue: function (select, value) {
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
    The default value setter for elements. Assigns the 'value' property of the
    provided Node.

    @method _setSimpleValue
    @param {Node} field The bound Node
    @param {Any} value The value to set in the UI
    @protected
    **/
    _setSimpleValue: function (field, value) {
        field.set('value', value);
    },

    /**
    Gets the value of the currently checked radio button in the group.

    @method _getRadioValue
    @param {NodeList} radioGroup The input Nodes in the radio group
    @return {String|null} The value of the checked radio or null if none
    @protected
    **/
    _getRadioValue: function (radioGroup) {
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
    @return {String|null} The value of the checkbox or null if unchecked
    @protected
    **/
    _getCheckboxValue: function (checkbox) {
        // TODO: better default value for unchecked box?
        return checkbox.get('checked') ? checkbox.get('value') : null;
    },

    /**
    Gets the value of the currently selected option in the select.

    @method _getSelectValue
    @param {Node} select The select Node
    @return {String|null} The value of the selected option or null if none
    @protected
    **/
    _getSelectValue: function (select) {
        select = select.getDOMNode();
        return (select.selectedIndex >= 0) ?
            select.options[select.selectedIndex].value :
            null;
    },

    /**
    Default value getter. Returns the value of the Node's 'value' property.

    @method _getSimpleValue
    @param {Node} field The bound Node
    @return {String} The value of the field's 'value' property
    @protected
    **/
    _getSimpleValue: function (field) {
        return field.get('value');
    }
}, true);
