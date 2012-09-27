/**
Provides `Y.Property.Base`.

@module property
@submodule property-base
**/

/**
Basic ES5 property implementation without events.

@class Property.Base
@constructor
**/

function PropertyBase() {
    /**
    Fast-lookup hash of property names for properties that have been defined on
    this object through `Y.Property`.

    @property {Object} _definedProperties
    @protected
    **/
    this._definedProperties = {};
}

PropertyBase.prototype = {
    // -- Public Prototype Methods ---------------------------------------------

    /**
    Defines new properties (or modifies the definitions of existing properties)
    on this object.

    This method is a facade over ES5's [`Object.defineProperties()`][1] method.
    See its documentation for more details.

    [1]: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/defineProperties

    @method defineProperties
    @param {Object} properties Hash of property names to descriptor objects for
        properties to define on this object.
    @chainable
    **/
    defineProperties: function (properties) {
        for (var name in properties) {
            if (properties.hasOwnProperty(name)) {
                this._definedProperties[name] = true;
            }
        }

        return Object.defineProperties(this, properties);
    },

    /**
    Defines a new property or modifies the definition of an existing property on
    this object.

    This method is a facade over ES5's [`Object.defineProperty()`][1] method.
    See its documentation for more details.

    There are two types of property descriptors: data descriptors and accessor
    descriptors. A _data descriptor_ describes a property that has a value. An
    _accessor descriptor_ describes a property that has a getter and/or setter
    function.

    A property descriptor that contains the `value` or `writable` properties is
    a data descriptor. A property descriptor that contains the `get` or `set`
    properties is an accessor descriptor. They may not be mixed! So, for
    example, a property descriptor cannot contain both a `value` property and a
    `set` property.

    The `configurable` and `enumerable` properties are allowed on both data
    descriptors and accessor descriptors.

    [1]: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/defineProperty

    @method defineProperty
    @param {String} name Property name.
    @param {Object} descriptor Property descriptor.

        @param {Boolean} [descriptor.configurable=false] Whether the type of
            this property may be changed, and whether the property may be
            deleted from the host object.

        @param {Boolean} [descriptor.enumerable=false] Whether this property
            should be enumerable.

        @param {Function} [descriptor.get] Getter function for this property.
            The return value of this function will be used as the value of the
            property. **Accessor descriptors only.**

        @param {Function} [descriptor.set] Setter function for this property.
            This function will receive the new value being assigned as its only
            argument, and its return value will be used as the new value for the
            property. **Accessor descriptors only.**

        @param {Any} [descriptor.value] Value of this property. **Data
            descriptors only.**

        @param {Boolean} [descriptor.writable=false] Whether this property's
            value may be changed using the JavaScript assignment operator (`=`).
            **Data descriptors only.**

    @chainable
    **/
    defineProperty: function (name, descriptor) {
        this._definedProperties[name] = true;
        return Object.defineProperty(this, name, descriptor);
    },

    /**
    Returns the value of the specified property, or `undefined` if the property
    has not been defined.

    @method get
    @param {String} name Property name.
    @return {Any} Property value, or `undefined` if the property has not been
        defined.
    **/
    get: function (name) {
        return this[name];
    },

    /**
    Returns an object hash containing the values of multiple properties.

    The _names_ argument may be omitted and the _options_ argument used in its
    place if desired.

    @method getProperties
    @param {String[]} [names] Array of property names to retrieve. If not
        specified, all own properties of this object (including non-enumerable
        properties) will be returned.
    @param {Object} [options] Options.
        @param {Boolean} [options.definedOnly=false] If `true`, only properties
            defined on this object via this `Y.Property` instance will be
            returned.
    @return {Object} Hash of property names to property values for the requested
        properties. If a requested property has not been defined, its value will
        be `undefined`.
    **/
    getProperties: function (names, options) {
        // Allow options as only argument.
        if (names && !Y.Lang.isArray(names)) {
            options = names;
            names   = null;
        }

        var definedOnly = options && options.definedOnly,
            properties  = {},
            i, len, name;

        names || (names = Object.getOwnPropertyNames(this));

        for (i = 0, len = names.length; i < len; i++) {
            name = names[i];

            if (!definedOnly || this._definedProperties[name]) {
                properties[name] = this.get(name);
            }
        }

        return properties;
    },

    /**
    Gets the property descriptor for the specified property, or `undefined` if
    the property has not been defined.

    @method getPropertyDescriptor
    @param {String} name Property name.
    @return {Object} Property descriptor, or `undefined` if the property has not
        been defined.
    **/
    getPropertyDescriptor: function (name) {
        return Object.getOwnPropertyDescriptor(this, name);
    },

    /**
    Sets the value of the specified property and returns the value that was set.

    Note that the returned value may differ from the value passed in if the
    property has a setter function that alters the value.

    @method set
    @param {String} name Property name.
    @param {Any} value Value to set.
    @param {Object} [options] Options. No options are defined in
        `property-base`, but other modules may add support for options.
    @return {Any} The value that was set.
    **/
    set: function (name, value) {
        return this[name] = value;
    },

    /**
    Sets the values of multiple properties and returns an object hash containing
    the values that were set.

    @method setProperties
    @param {Object} properties Hash of property names to values that should be
        set.
    @param {Object} [options] Options. No options are defined in
        `property-base`, but other modules may add support for options.
    @return {Object} Hash of property names to the values that were set.
    **/
    setProperties: function (properties, options) {
        var results = {};

        for (var name in properties) {
            if (properties.hasOwnProperty(name)) {
                results[name] = this.set(name, properties[name], options);
            }
        }

        return results;
    }
};

Y.namespace('Property').Base = PropertyBase;
