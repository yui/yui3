var isArray  = Y.Lang.isArray,
    isObject = Y.Lang.isObject;

/**
Provides the `Y.Attribute.Bindable` class extension to allow binding attribute
state to the state of other objects such as DOM elements.

Bindings are established using the `bindAttrs` method, which takes a bind type
and configuration to customize the binding relationship if needed.

@module attribute-bind
@class Attribute.Bindable
@since @SINCE@
**/
Y.Attribute.Bindable = function (config) {
    this._bindMap   = {};
    this._bindModel = config.model;

    // Used as a class extension on something with a 'model' attribute
    if (this.attrAdded && this.attrAdded('model')) {
        this.after('modelChange', this._afterBindModelChange);
    } else if (!this._bindModel) {
        this._bindModel = this;
    }
};

/**
Method for standalone DataBind instances to relay `instance.get(attr)` to the
bound attribute's host's `get(attr)` method. If no binding for the provided
attribute is found, `undefined` is returned.

This is a static method on `DataBind` rather than on the prototype to avoid
collisions and API bloat when used as a class extension.

@method _getAttrValue
@param {String} attr Attribute name to get value from host
@return {Any} Whatever is stored in the attribute, or `undefined` if the
              provided attribute is not bound
@static
@protected
**/
Y.DataBind.getAttrValue = function (attr) {
    var binding = this._bindMap[attr],
        host    = binding && binding.host;

    // TODO: return null? The value is actually not defined, so undefined
    // seems appropriate.
    return host ? host.get.apply(host, arguments) : undefined;
};

/**
Method for standalone DataBind instances to relay `instance.set(attr, val)` to
the bound attribute's host's `set(attr, val)` method.

This is a static method on `DataBind` rather than on the prototype to avoid
collisions and API bloat when used as a class extension.

@method _setAttrValue
@param {String} attr Attribute name to get value from host
@param {Any} value Attribute name to get value from host
@param {Any} [args]* Additional arguments to relay to host's `set()` method
@static
@protected
**/
Y.DataBind.setAttrValue = function (attr) {
    var binding = this._bindMap[attr],
        host    = binding && binding.host;

    if (host) {
        host.set.apply(host, arguments);
    }
};

/**
Map of binding types. Other binding related modules should contribute to this
map.

@property BIND_TYPE
@type {Object}
@static
**/
Y.Attribute.Bindable.BIND_TYPES = {
    _default: {
        bind    : '_bindUnknownType',
        getter  : '_getBound',
        setter  : '_setBound',
        getAttr : 'get',
        setAttr : 'set'
        // attrError - for attr <- bound errors (e.g. validator failure)
        // boundError - for attr -> bound errors (e.g. missing select option)
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
Y.DataBind._buildCfg = { aggregate: ['BIND_TYPES'] };

function camelize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

Y.mix(Y.Attribute.Bindable.prototype, {
    /**
    Gets the value from the bound object representing the provided attribute
    using the configured or defaulted `getBound` method for the binding. If the
    binding is configured with a `parser`, the value returned will be the
    parsed value.

    @method getBoundValue
    @param {String} attr Attribute name to get bound value for
    @return {Any} Usually a string, but parsers can return anything.
    **/
    getBoundValue: function (attr) {
        var config = this._bindMap[attr],
            value, method;

        if (config) {
            method = config.getBound;
            // support function or string values for getter, late bound
            value  = (this[method] || method).call(this, config);

            method = config.parser;

            if (method) {
                // support function or string values for parser, late bound
                value = (this[method] || method).call(this, value, config);
            }
        }

        return value;
    },

    /**
    Sends the attribute value to the bound object using the configured or
    defaulted `setter` method of the binding.
    
    *This does not update the attribute value*.
    
    If the binding is configured with a formatter, the value assigned to the
    bound object will be the formatted value.

    @method setBoundValue
    @param {String} attr Bound attribute name
    @param {Any} value The value to set in the bound object
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
            (this[method] || method).call(this, value, config);
        }

        return this;
    },

    /**
    Gets the values from the bound object representing the provided attributes
    using the configured or defaulted `getBound` method for each binding. If the
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
        var values = {},
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
    configured or defaulted `setter` method of each binding.
    
    *This does not update the attribute values*.
    
    If the bindings are configured with formatters, the value assigned to the
    respective bound object will be the formatted value.

    If _attrs_ is not provided, all bindings are updated with their current
    attribute values.

    @method setBoundValues
    @param {Object} [attrs] Map of bound attribute names to new values
    @chainable
    **/
    setBoundValues: function (attrs) {
        var attr, map, binding, method;

        if (!attrs) {
            attrs = {};
            map   = this._bindMap;

            for (attr in map) {
                if (map.hasOwnProperty(attr)) {
                    binding = map[attr];
                    method  = this[binding.getAttr] || binding.getAttr;
                    attrs[attr] = method.call(this, attr, binding);
                }
            }
        }

        for (attr in attrs) {
            if (attrs.hasOwnProperty(attr)) {
                this.setUIValue(attr, attrs[attr]);
            }
        }

        return this;
    },

    /**
    Pushes current bound objects' values to the attributes.

    If an array of attribute names is provided, only those will be updated from
    the bound objects.

    @method syncBoundAttrs
    @param {String[]} [attrs] Array of attribute names
    @chainable
    **/
    syncBoundAttrs: function (attrs) {
        var map = this._bindMap,
            i, len, attr, binding, value, method;

        if (!attrs) {
            attrs = Y.Object.keys(map);
        }

        for (i = 0, len = attrs.length; i < len; ++i) {
            attr    = attrs[i];
            binding = map[attr];
            value   = this.getBoundValue(attr);
            method  = binding.setAttr;

            (this[method] || method).call(this, attr, value, binding);
        }

        return this;
    },

    /**
    Sets up multiple attribute bindings. Accepts a map of attribute name to
    bind configuration objects or type string. See `bindAttr` for bind
    configuration options.

    @method bindAttrs
    @param {Object} bindings map of attr->type/bind config
    **/
    bindAttrs: function (bindings) {
        if (bindings) {
            for (var attr in bindings) {
                if (bindings.hasOwnProperty(attr)) {
                    this.bindAttr(attr, bindings[attr], host);
                }
            }
        }
    },

    /**
    Binds an attribute to an object (e.g. a DOM element). When the attribute is
    changed, the bound object is updated.
    
    Core bind configurations are:

    ```
    {
        type: string,
            // map defaults from static BIND_TYPES entry
        getter: function name or function (attr, binding)
            // gets value from bound object
        setter: function name or function (attr, value, binding)
            // sets value in bound object
        formatter: function name or function (attr, value, binding)
            // formats attribute value en route to setter
        parser: function name or function (attr, value, binding)
            // parses pure data from value extracted by getter
        attrError: function name or function (attr, error, binding)
            // validation error, setter error, or on() + preventDefault()
        boundError: function name or function (attr, error, binding)
            // can't set attr value in bound object for some reason
        getAttr: function name or function (attr, binding)
            // get attribute value
        setAttr: function name or function (attr, value, binding)
            // set attribute value
    }
    ```

    Any additional bind properties can be added for reference by these methods.

    Configurations can be either functions or the names of methods on the
    instance. It is recommended to use strings for subclass flexibility.

    The _type_ config can be used to reference a set of configurations in the
    static `BIND_TYPES` map, which will provide defaults for many or all of the
    other configurations. You can add your own types there as well.

    The means to read or write content from or to a bound object is determined
    by the bind configuration's `getter` and `setter` functions.
    
    If the raw value in the attribute should be formatted for the UI, a
    `formatter` can be configured instead of a `setter`, assuming what needs to
    be customized is _what_ is pushed to the DOM, not _how_ it's pushed.

    Though only relevant to bidirectional bindings and progressive enhancement,
    the reverse is true for the `parser` configuration. Parsers extract the raw
    value that should be assigned to the attribute from the value as it is
    retrieved from the bound object (i.e. values as strings from the DOM).

    @method bindAttr
    @param {String} attr Name of the attribute to bind
    @param {Object} config Bind configuration object
    @protected
    **/
    bindAttr: function (attr, config) {
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
    Unbinds an attribute.

    @method unbindAttr
    @param {String} attr Name of the attribute to unbind
    @protected
    **/
    unbindAttr: function (attr) {
        var binding = this._bindMap[attr];

        if (binding) {
            binding.handle.detach();
            this._bindMap[attr] = null;
        }
    },

    /**
    Unbinds an array of attributes.

    @method unbindAttrs
    @param {String[]} attrs Array of attribute names to unbind
    @protected
    **/
    unbindAttrs: function (attrs) {
        for (var i = 0, len = attrs && attrs.length; i < len; ++i) {
            this._unbindAttr(attrs[i]);
        }
    },

    /**
    Detaches the events binding the attributes and DOM elements.

    @method destructor
    @protected
    **/
    destructor: function () {
        this.unbindAttrs(Y.Object.keys(this._bindMap));
    },

    /**
    Relays new attribute values to the appropriate DOM element setter.

    @method _afterBoundAttrChange
    @param {EventFacade} e Attribute change event
    @protected
    **/
    _afterBoundAttrChange: function (e) {
        if (!e.src) {
            this.setBoundValue(e.attrName, e.newVal);
        }
    },

    /**
    Default value getter. Fetches the _config.property_ property from the
    _config.object_ object.

    @method _getBound
    @param {String} attr The bound attribute name
    @param {Object} config The bind config
    @return {Any}
    @protected
    **/
    _getBound: function (attr, binding) {
        var obj      = binding.object || this,
            property = binding.property || attr;

        return obj[property];
    },

    /**
    The default value setter. Assigns the _config.property_ on _config.object_.

    @method _setBound
    @param {String} attr The bound attribute name
    @param {Any} value The value to set on the bound object
    @param {Object} config The bind config
    @protected
    **/
    _setBound: function (attr, value, binding) {
        var obj      = binding.object || this,
            property = binding.property || attr;

        obj[property] = value;
    },

    /**

    @method _bindUnknownType
    @param {String} attr The attribute name
    @param {Object} config The bind configuration
    @protected
    **/
    _bindUnknownType: function (attr, config) {
    },

    /**
    Updates the attribute on the associated bind target.

    @method _afterBindModelChange
    @param {EventFacade} e The `modelChange` event
    @protected
    **/
    _afterBindModelChange: function (e) {
        this._bindModel = e.newVal;
    }
}, true);
