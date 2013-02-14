'use strict';

var Bindable      = Y.Attribute.Bindable,
    bindableProto = Bindable.prototype;
/**
DataBind provides the `Y.DataBind` class to automate binding attribute state
to the state of other objects via configuration, obviating the need to manually
subscribe to change events or, in the event of bidirectional binding,
transfering data from the other object back to the attribute.

@module attr-bindable
@submodule data-bind
@class DataBind
@since 3.9.0
**/
Y.DataBind = Y.extend(
    function (host) {
        Y.Attribute.Bindable.call(this, { model: host });
    },
    Y.Attribute.Bindable,
    {
        destroy: bindableProto.destructor,


        /**
        Relays `instance.get(attr)` to the bound attribute's host's `get(attr)`
        method. If no binding for the provided attribute is found, `undefined`
        is returned.

        @method get
        @param {String} attr Attribute name to get value from host
        @return {Any} Whatever is stored in the attribute, or `undefined` if the
                      provided attribute is not bound
        **/
        get: function (attr) {
            var binding = this._bindMap[attr],
                host    = binding && binding.host;

            // Returning `undefined` because the binding isn't defined, so
            // there's no value associated, not even `null`.
            return host ? host.get.apply(host, arguments) : undefined;
        },

        /**
        Relays `instance.set(attr, val)` to the bound attribute's host's
        `set(attr, val)` method.

        @method set
        @param {String} attr Attribute name to get value from host
        @param {Any} value Attribute name to get value from host
        @param {Any} [args]* Additional arguments to relay to host's `set()` method
        @chainable
        **/
        set: function (attr) {
            var binding = this._bindMap[attr],
                host    = binding && binding.host;

            if (host) {
                host.get.apply(host, arguments);
            }

            return this;
        }
    }, {
        BIND_TYPES: Bindable.BIND_TYPES
    });

/**
Map of binding types. Other binding related modules should contribute to this
map.

@property BIND_TYPE
@type {Object}
@static
**/
Y.DataBind.BIND_TYPE = {
    _default: {
        bind    : '_bindUnknownType',
        getAttr : 'get',
        setAttr : 'set',
        getBound: '_getBoundNodeContent',
        setBound: '_setBoundNodeContent'
    }
};

/**
Build configuration to migrate the BIND_TYPE static property to the host
class when used as a class extension.

@property _buildCfg
@type {Object}
@protected
@static
**/
Y.DataBind._buildCfg = { aggregate: ['BIND_TYPE'] };

function camelize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

Y.mix(Y.DataBind.prototype, {
    /**
    Gets the value from the bound object representing the provided attribute
    using the configured or defaulted `get` method for the binding. If the
    binding is configured with a `parser`, the value returned will be the
    parsed value.

    If an array of attribute names is passed, an object map of names to values
    will be returned.

    If no arguments are passed, an object map of all bound values is returned.

    @method getBoundValue
    @param {String|String[]} [attr] Attribute name(s) to get bound values for
    @return {Any} Usually a string for single attributes, but parsers can
        return anything. Otherwise, an object with individual values.
    **/
    getBoundValue: function (attr) {
        var config = this._bindMap[attr],
            // TODO: Better default return value?
            value  = null,
            method;

        if (config) {
            method = config.get;
            // support function or string values for getter, late bound
            value  = (this[method] || method).call(this, config.field, config);

            method = config.parser;

            if (method) {
                // support function or string values for parser, late bound
                value = (this[method] || method).call(this, value, config);
            }
        }

        return value;
    },

    /**
    Sends the value to the bound object for the provided attribute using the
    configured or defaulted `set` method of the binding.
    
    *This does not update the attribute value*.
    
    If the binding is configured with a formatter, the value assigned to the
    bound object will be the formatted value.

    Also accepts an object with a map of attribute names to values for setting
    multiple bindings at once.

    If no value is passed, sets all bound attribute values according to their
    current values.

    @method setBoundValue
    @param {String} [attr] Bound attribute name
    @param {Any} [value] The value to set in the bound object
    @chainable
    **/
    setBoundValue: function (attr, value) {
        var config = this._bindMap[attr],
            method, name;

        if (config) {
            if (config.formatter) {
                method = config.formatter;
                // support function or string values for formatter, late bound
                value = (this[method] || method).call(this, value, config);
            }

            method = config.setter;
            // support function or string values for setter, late bound
            (this[method] || method).call(this, config.field, value, config);
        } else if (isObject(attr, true)) {
            for (name in attr) {
                if (attr.hasOwnProperty(name)) {
                    this.setBoundValue(name, attr[name]);
                }
            }
        }

        return this;
    },

    /**
    Gets the values from the bound object representing the provided attributes
    using the configured or defaulted `get` method for each binding. If the
    bindings are configured with a `parser`, the values returned will be the
    parsed value.

    If an array of attribute names is passed, an object map of names to values
    will be returned. If no arguments are passed, an object map of all bound
    values is returned.

    @method getBoundValues
    @param {String[]} [attrs] Attribute names to get bound values for
    @return {Object}
    **/
    getBoundValues: function (attrs) {
        var map    = this._bindMap,
            values = {},
            i, len;

        if (!attrs) {
            attrs = Y.Object.keys(this._bindMap);
        } 

        for (i = 0, len = attrs.length; i < len; ++i) {
            values[attr[i]] = this.getBoundValue(attr[i]);
        }

        return values;
    },

    /**
    Sends the values to the bound object for the provided attributes using the
    configured or defaulted `set` method of each binding.
    
    *This does not update the attribute values*.
    
    If the bindings are configured with formatters, the value assigned to the
    respective bound object will be the formatted value.

    If an object map of attribute names to values is passed, only those
    bindings will be assigned. If no argument is passed, all bindings will be
    updated with the current bound attribute value.

    @method setBoundValues
    @param {Object} [attrs] Bound attribute name
    @chainable
    **/
    setBoundValues: function (attrs) {
        var map = this._bindMap,
            attr, binding, getAttr;

        if (!attrs) {
            attrs = {};

            for (attr in map) {
                if (map.hasOwnProperty(attr)) {
                    binding = map[attr];
                    getAttr = binding.host[binding.getAttr] || binding.getAttr;

                    attrs[attr] = getAttr.apply(binding.host,
                }
            }
        }

        for (attr in map) {
            if (map.hasOwnProperty(attr)) {
                this.setUIValue(attr, map[attr].host.get(attr));
            }
        }

        return this;
    },

    /**
    Pushes current DOM element values to the bound attributes.

    @method setBoundAttrs
    @chainable
    **/
    setBoundAttrs: function () {
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
