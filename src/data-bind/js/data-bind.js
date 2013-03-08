/**
DataBind provides the `Y.DataBind` class to bind attributes to form elements.

The class may be used standalone, or as a class extension, and provides the
methods `_bindAttr`, `_bindAttrs`, `_unbindAttr`, and `_unbindAttrs`. When used
as a standalone class, these methods are mirrored as public versions without
the leading underscore (e.g. `bindAttr`).

The base module focuses on binding attributes to non-form related elements by
writing to the DOM when the attribute changes. However, it is possible to set
up bidirectional and custom DOM<->attribute relationships. See the
`data-bind-form` module to add support for binding to form elements.

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
Y.DataBind.BIND_CONFIGS = {
    _default: {
        getter: '_getBoundNodeContent',
        setter: '_setBoundNodeContent'
    }
};

/**
Build configuration to migrate the FIELD_EVENTS static property to the host
class when used as a class extension.

@property _buildCfg
@type {Object}
@protected
@static
**/
Y.DataBind._buildCfg = { aggregate: ['BIND_CONFIGS'] };

function camelize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

Y.mix(Y.DataBind.prototype, {
    /**
    Gets the value from the DOM element representing the provided attribute
    using the configured or defaulted `getter`. If the binding is configured
    with a `parser`, the value returned will be the parsed value.

    @method getUIValue
    @param {String} attr Attribute name corresponding to the DOM element
    @return {Any} Usually a string, but parsers can return anything
    **/
    getUIValue: function (attr) {
        var config = this._bindMap[attr],
            method, value;

        if (config) {
            method = config.getter;
            // support function or string values for getter, late bound
            value  = (this[method] || method).call(this, config.field, config);

            method = config.parser;
            return method ?
                // support function or string values for parser, late bound
                (this[method] || method).call(this, value, config) :
                value;
        }

        // TODO: Better default return value?
        return null;
    },

    /**
    Sets the value in the DOM element for the provided attribute using the
    configured or defaulted `setter`. *This does not update the attribute
    value*. If the binding is configured with a formatter, the value assigned
    to the DOM element will be the formatted value.

    @method setUIValue
    @param {String} attr Attribute name corresponding to the DOM element
    @param {Any} value The value to assign to the DOM element
    @return {DataBind} this instance
    @chainable
    **/
    setUIValue: function (attr, value) {
        var config = this._bindMap[attr],
            method;

        if (config) {
            if (config.formatter) {
                method = config.formatter;
                // support function or string values for formatter, late bound
                value = (this[method] || method).call(this, value, config);
            }

            method = config.setter;
            // support function or string values for setter, late bound
            (this[method] || method).call(this, config.field, value, config);
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
    attribute is changed, the DOM element(s) will be updated.
    
    The basic form of this method is `instance._bindAttr('foo', '#fooNode');`,
    but a Node, NodeList, or configuration object can be passed as a second
    argument for more control.

    Available bind configurations are:

    ```
    {
        field: <selector string, Node, or NodeList>,
        type: string,
        getter: string or function (node) { <code to get value> },
        setter: string or function (node, value) { <... to set value> },
        formatter: string or function (value) { <massage value for display> },
        parser: string or function (value) { <extract value from DOM value> }
    }
    ```

    The means to read or write content from or to an element is determined by
    the bind configuration's `getter` and `setter` functions. If a bind
    configuration is not passed or doesn't contain `getter` or `setter`, an
    appropriate `getter` and `setter` will be guessed based on the DOM
    element. The default `getter` and `setter` read and write the bound
    element's `innerHTML`.
    
    To register a `getter`/`setter` pair for a custom type, add an entry to
    the `BIND_CONFIGS` static, and include that type in the bind configuration.

    If the raw value in the attribute should be formatted for the UI, a
    `formatter` can be configured instead of a `setter`, assuming what needs to
    be customized is _what_ is pushed to the DOM, not _how_ it's pushed.

    Though only relevant to bidirectional bindings and progressive enhancement,
    the reverse is true for the `parser` configuration. Parsers extract the raw
    value that should be assigned to the attribute from the value as it exists
    in the DOM (i.e. a string).

    You can provide either a function or a string to any function configuration.
    String values are considered method names on the instance.

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

        var selector = typeof config       === 'string' ? config :
                       typeof config.field === 'string' ? config.field : null,
            bindTypes = this.constructor.BIND_CONFIGS ||
                        Y.DataBind.BIND_CONFIGS,
            field, method, typeConfig;

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
        this._bindMap[attr] = config = Y.merge(config);

        config.host = host || this;
        config.handle =
            config.host.after(attr+'Change', this._afterBoundAttrChange, this);

        if (!config.type) {
            field = config.field;
        
            if (field instanceof Y.NodeList) {
                field = field.item(0);
            }

            config.type = field.get('nodeName').toLowerCase();
        }

        method = '_bind' + camelize(config.type);

        // _bindFoo must be called before typeConfig is resolved because
        // binders may override the config.type (e.g. type=input is
        // overridden with type=input.type in data-bind-form)
        this[method] && this[method](attr, config);

        typeConfig = bindTypes[config.type] || bindTypes._default;

        config.getter || (config.getter = typeConfig.getter);
        config.setter || (config.setter = typeConfig.setter);
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
    The default value setter. Assigns the `innerHTML` of the provided Node.

    @method _setBoundNodeContent
    @param {Node} field The bound Node
    @param {Any} value The value to set in the UI
    @param {Object} config The bind config
    @protected
    **/
    _setBoundNodeContent: function (field, value) {
        field.setHTML(value);
    },

    /**
    Default value getter for non-form elements. Returns the `innerHTML` of the
    Node.

    @method _getBoundNodeContent
    @param {Node} field The bound Node
    @param {Object} config The bind config
    @return {String} The value of the field's 'value' property
    @protected
    **/
    _getBoundNodeContent: function (field) {
        return field.getHTML();
    }
}, true);
