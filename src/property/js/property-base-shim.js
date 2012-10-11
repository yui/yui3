/**
Provides compatibility shims for browsers like IE6-8 that don't support
`Object.defineProperty()`.

@module property
@submodule property-base-shim
**/

var hasOwn = Object.prototype.hasOwnProperty;

function PropertyBase() {
    this._definedProperties = {};
}

PropertyBase.prototype = {
    // -- Public Prototype Methods ---------------------------------------------

    // No doc comments here since we're just shimming methods that are already
    // documented in property.js.

    defineProperties: function (properties) {
        for (var name in properties) {
            if (properties.hasOwnProperty(name)) {
                this.defineProperty(name, properties[name]);
            }
        }

        return this;
    },

    // Not striving for full ES5 compliance here, just graceful degradation. If
    // IE6-8 basically work and don't explode when given sane inputs, then we're
    // happy.
    defineProperty: function (name, descriptor) {
        var current = this.getPropertyDescriptor(name),

            isAccessorDescriptor = hasOwn.call(descriptor, 'get') ||
                hasOwn.call(descriptor, 'set'),

            isDataDescriptor = hasOwn.call(descriptor, 'value') ||
                hasOwn.call(descriptor, 'writable');

        // Throw if the descriptor is a mix of data descriptor and accessor
        // descriptor properties.
        if (isAccessorDescriptor && isDataDescriptor) {
            throw new TypeError('Invalid property: ' + name + '. A property cannot both have accessors and be writable or have a value.');
        }

        // Throw if the property has already been defined and cannot be
        // redefined. This is a partial implementation of the checks in
        // http://es5.github.com/#x8.12.9
        if (current && !current.configurable) {
            if (descriptor.configurable // 7a.
                    || (isDataDescriptor && (!current.writable && (descriptor.writable || descriptor.value !== current.value))) // 10a.
                    || (isAccessorDescriptor && (current.get !== descriptor.get || current.set !== descriptor.set))) { // 11a.

                throw new TypeError('Cannot redefine property: ' + name);
            }
        }

        this._definedProperties[name] = Y.merge({
            configurable: false,
            enumerable  : false
        }, descriptor);

        this[name] = descriptor.value;

        return this;
    },

    getProperties: function (names, options) {
        // Allow options as only argument.
        if (names && !Y.Lang.isArray(names)) {
            options = names;
            names   = null;
        }

        var definedOnly = options && options.definedOnly,
            properties  = {},
            i, len, name;

        // Y.Object.keys() only returns enumerable properties, but it's the best
        // we can do.
        names || (names = Y.Object.keys(this));

        for (i = 0, len = names.length; i < len; i++) {
            name = names[i];

            if (!definedOnly || this._definedProperties[name]) {
                properties[name] = this.property(name);
            }
        }

        return properties;
    },

    getPropertyDescriptor: function (name) {
        var descriptor = this._definedProperties[name];

        // If we don't have a descriptor but the property exists on this object,
        // assume a default descriptor.
        if (!descriptor && this.hasOwnProperty(name)) {
            descriptor = {
                configurable: true,
                enumerable  : this.propertyIsEnumerable(name),
                value       : this[name],
                writable    : true
            };
        }

        return descriptor;
    },

    property: function (name, value) {
        var descriptor = this.getPropertyDescriptor(name);

        if (typeof value === 'undefined') { // Get
            if (descriptor && descriptor.get) {
                return descriptor.get(name);
            }

            return this[name];

        } else { // Set

            if (descriptor) {
                if (descriptor.set) {
                    return this[name] = descriptor.set(value);
                } else if (!descriptor.writable) {
                    return;
                }
            }

            return this[name] = value;
        }
    },

    setProperties: function (properties, options) {
        var results = {};

        for (var name in properties) {
            if (properties.hasOwnProperty(name)) {
                results[name] = this.property(name, properties[name], options);
            }
        }

        return results;
    }
};

Y.namespace('Property').Base = PropertyBase;
