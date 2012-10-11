if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/property-base/property-base.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/property-base/property-base.js",
    code: []
};
_yuitest_coverage["build/property-base/property-base.js"].code=["YUI.add('property-base', function (Y, NAME) {","","/**","Provides `Y.Property.Base`.","","@module property","@submodule property-base","**/","","/**","Basic ES5 property implementation without events.","","@class Property.Base","@constructor","**/","","function PropertyBase() {","    /**","    Fast-lookup hash of property names for properties that have been defined on","    this object through `Property.Base`.","","    @property {Object} _definedProperties","    @protected","    **/","    this._definedProperties = {};","}","","PropertyBase.prototype = {","    // -- Public Prototype Methods ---------------------------------------------","","    /**","    Defines new properties or modifies the definitions of existing properties on","    this object.","","    This method is a facade over ES5's [`Object.defineProperties()`][1] method.","    See its documentation for more details.","","    [1]: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/defineProperties","","    @method defineProperties","    @param {Object} properties Hash of property names to descriptor objects for","        properties to define on this object.","    @chainable","    **/","    defineProperties: function (properties) {","        for (var name in properties) {","            if (properties.hasOwnProperty(name)) {","                this._definedProperties[name] = true;","            }","        }","","        return Object.defineProperties(this, properties);","    },","","    /**","    Defines a new property or modifies the definition of an existing property on","    this object.","","    This method is a facade over ES5's [`Object.defineProperty()`][1] method.","    See its documentation for more details.","","    There are two types of property descriptors: data descriptors and accessor","    descriptors. A _data descriptor_ describes a property that has a value. An","    _accessor descriptor_ describes a property that has a getter and/or setter","    function.","","    A property descriptor that contains the `value` or `writable` properties is","    a data descriptor. A property descriptor that contains the `get` or `set`","    properties is an accessor descriptor. They may not be mixed! So, for","    example, a property descriptor cannot contain both a `value` property and a","    `set` property.","","    The `configurable` and `enumerable` properties are allowed on both data","    descriptors and accessor descriptors.","","    [1]: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/defineProperty","","    @method defineProperty","    @param {String} name Property name.","    @param {Object} descriptor Property descriptor.","","        @param {Boolean} [descriptor.configurable=false] Whether the type of","            this property may be changed, and whether the property may be","            deleted from the host object.","","        @param {Boolean} [descriptor.enumerable=false] Whether this property","            should be enumerable.","","        @param {Function} [descriptor.get] Getter function for this property.","            The return value of this function will be used as the value of the","            property. **Accessor descriptors only.**","","        @param {Function} [descriptor.set] Setter function for this property.","            This function will receive the new value being assigned as its only","            argument, and its return value will be used as the new value for the","            property. **Accessor descriptors only.**","","        @param {Any} [descriptor.value] Value of this property. **Data","            descriptors only.**","","        @param {Boolean} [descriptor.writable=false] Whether this property's","            value may be changed using the JavaScript assignment operator (`=`).","            **Data descriptors only.**","","    @chainable","    **/","    defineProperty: function (name, descriptor) {","        this._definedProperties[name] = true;","        return Object.defineProperty(this, name, descriptor);","    },","","    /**","    Gets the property descriptor for the specified property, or `undefined` if","    the property has not been defined.","","    @method getPropertyDescriptor","    @param {String} name Property name.","    @return {Object} Property descriptor, or `undefined` if the property has not","        been defined.","    **/","    getPropertyDescriptor: function (name) {","        return Object.getOwnPropertyDescriptor(this, name);","    },","","    /**","    Gets or sets the value of a property.","","    If only a _name_ is given, returns the value of the property with that name,","    or `undefined` if the property has not yet been defined.","","    If both a _name_ and a _value_ are given, sets the named property to the","    given value and returns the value that was set.","","    Note that when setting a property, the returned value may differ from the","    value passed in if the property has a setter function that alters the value.","","    @example","","        thing.prop('foo'); // Returns the value of thing.foo.","        thing.prop('foo', 'bar'); // Sets thing.foo to 'bar'.","","    @method prop","    @param {String} name Property name.","    @param {Any} [value] Value to set.","    @return {Any} Property value, or `undefined` if the property has not yet","        been defined and no value was set.","    **/","    prop: function (name, value) {","        return typeof value === 'undefined' ? this[name] : this[name] = value;","    },","","    /**","    Gets or sets the values of multiple properties.","","    If _props_ is `null` or `undefined`, returns an object containing the","    names and values of all own properties of this object, including","    non-enumerable properties.","","    If _props_ is an array of property names, returns an object containing the","    names and values of the specified properties.","","    If _props_ is an object, sets the properties named in the object to the","    associated values and returns an object containing the names and the values","    that were set. Note that the returned values may differ from the values","    passed in if the properties being set have setter functions that alter the","    values.","","    @example","","        thing.props(); // Returns all own properties of thing.","","        thing.props(null, {definedOnly: true}); // Returns all own properties that were","                                                // defined via this object's defineProperty()","                                                // or defineProperties() methods.","","        thing.props(['a', 'b', 'c']); // Returns thing.a, thing.b, and thing.c.","","        thing.props({","            a: 'foo',","            b: 'bar',","            c: 'baz'","        }); // Sets the values of thing.a, thing.b, and thing.c and returns them.","","    @method props","    @param {String[]|Object} properties Array of property names to get, or a","        hash of property names and values to set.","    @param {Object} [options] Options.","        @param {Boolean} [options.definedOnly=false] If `true`, only properties","            that were defined on this object via this object's","            `defineProperty()` or `defineProperties()` methods will be returned.","            This is useful when you want to exclude native properties and","            functions.","    @return {Object} Hash of property names and values.","    **/","    props: function (properties, options) {","        var results = {},","            name;","","        if (!properties || Y.Lang.isArray(properties)) { // Get.","            var definedOnly = options && options.definedOnly,","                i, len;","","            properties || (properties = Object.getOwnPropertyNames(this));","","            for (i = 0, len = properties.length; i < len; i++) {","                name = properties[i];","","                if (!definedOnly || this._definedProperties[name]) {","                    results[name] = this.prop(name);","                }","            }","        } else { // Set.","            for (name in properties) {","                if (properties.hasOwnProperty(name)) {","                    results[name] = this.prop(name, properties[name], options);","                }","            }","        }","","        return results;","    }","};","","Y.namespace('Property').Base = PropertyBase;","","","}, '@VERSION@');"];
_yuitest_coverage["build/property-base/property-base.js"].lines = {"1":0,"17":0,"25":0,"28":0,"46":0,"47":0,"48":0,"52":0,"108":0,"109":0,"122":0,"149":0,"196":0,"199":0,"200":0,"203":0,"205":0,"206":0,"208":0,"209":0,"213":0,"214":0,"215":0,"220":0,"224":0};
_yuitest_coverage["build/property-base/property-base.js"].functions = {"PropertyBase:17":0,"defineProperties:45":0,"defineProperty:107":0,"getPropertyDescriptor:121":0,"prop:148":0,"props:195":0,"(anonymous 1):1":0};
_yuitest_coverage["build/property-base/property-base.js"].coveredLines = 25;
_yuitest_coverage["build/property-base/property-base.js"].coveredFunctions = 7;
_yuitest_coverline("build/property-base/property-base.js", 1);
YUI.add('property-base', function (Y, NAME) {

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

_yuitest_coverfunc("build/property-base/property-base.js", "(anonymous 1)", 1);
_yuitest_coverline("build/property-base/property-base.js", 17);
function PropertyBase() {
    /**
    Fast-lookup hash of property names for properties that have been defined on
    this object through `Property.Base`.

    @property {Object} _definedProperties
    @protected
    **/
    _yuitest_coverfunc("build/property-base/property-base.js", "PropertyBase", 17);
_yuitest_coverline("build/property-base/property-base.js", 25);
this._definedProperties = {};
}

_yuitest_coverline("build/property-base/property-base.js", 28);
PropertyBase.prototype = {
    // -- Public Prototype Methods ---------------------------------------------

    /**
    Defines new properties or modifies the definitions of existing properties on
    this object.

    This method is a facade over ES5's [`Object.defineProperties()`][1] method.
    See its documentation for more details.

    [1]: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/defineProperties

    @method defineProperties
    @param {Object} properties Hash of property names to descriptor objects for
        properties to define on this object.
    @chainable
    **/
    defineProperties: function (properties) {
        _yuitest_coverfunc("build/property-base/property-base.js", "defineProperties", 45);
_yuitest_coverline("build/property-base/property-base.js", 46);
for (var name in properties) {
            _yuitest_coverline("build/property-base/property-base.js", 47);
if (properties.hasOwnProperty(name)) {
                _yuitest_coverline("build/property-base/property-base.js", 48);
this._definedProperties[name] = true;
            }
        }

        _yuitest_coverline("build/property-base/property-base.js", 52);
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
        _yuitest_coverfunc("build/property-base/property-base.js", "defineProperty", 107);
_yuitest_coverline("build/property-base/property-base.js", 108);
this._definedProperties[name] = true;
        _yuitest_coverline("build/property-base/property-base.js", 109);
return Object.defineProperty(this, name, descriptor);
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
        _yuitest_coverfunc("build/property-base/property-base.js", "getPropertyDescriptor", 121);
_yuitest_coverline("build/property-base/property-base.js", 122);
return Object.getOwnPropertyDescriptor(this, name);
    },

    /**
    Gets or sets the value of a property.

    If only a _name_ is given, returns the value of the property with that name,
    or `undefined` if the property has not yet been defined.

    If both a _name_ and a _value_ are given, sets the named property to the
    given value and returns the value that was set.

    Note that when setting a property, the returned value may differ from the
    value passed in if the property has a setter function that alters the value.

    @example

        thing.prop('foo'); // Returns the value of thing.foo.
        thing.prop('foo', 'bar'); // Sets thing.foo to 'bar'.

    @method prop
    @param {String} name Property name.
    @param {Any} [value] Value to set.
    @return {Any} Property value, or `undefined` if the property has not yet
        been defined and no value was set.
    **/
    prop: function (name, value) {
        _yuitest_coverfunc("build/property-base/property-base.js", "prop", 148);
_yuitest_coverline("build/property-base/property-base.js", 149);
return typeof value === 'undefined' ? this[name] : this[name] = value;
    },

    /**
    Gets or sets the values of multiple properties.

    If _props_ is `null` or `undefined`, returns an object containing the
    names and values of all own properties of this object, including
    non-enumerable properties.

    If _props_ is an array of property names, returns an object containing the
    names and values of the specified properties.

    If _props_ is an object, sets the properties named in the object to the
    associated values and returns an object containing the names and the values
    that were set. Note that the returned values may differ from the values
    passed in if the properties being set have setter functions that alter the
    values.

    @example

        thing.props(); // Returns all own properties of thing.

        thing.props(null, {definedOnly: true}); // Returns all own properties that were
                                                // defined via this object's defineProperty()
                                                // or defineProperties() methods.

        thing.props(['a', 'b', 'c']); // Returns thing.a, thing.b, and thing.c.

        thing.props({
            a: 'foo',
            b: 'bar',
            c: 'baz'
        }); // Sets the values of thing.a, thing.b, and thing.c and returns them.

    @method props
    @param {String[]|Object} properties Array of property names to get, or a
        hash of property names and values to set.
    @param {Object} [options] Options.
        @param {Boolean} [options.definedOnly=false] If `true`, only properties
            that were defined on this object via this object's
            `defineProperty()` or `defineProperties()` methods will be returned.
            This is useful when you want to exclude native properties and
            functions.
    @return {Object} Hash of property names and values.
    **/
    props: function (properties, options) {
        _yuitest_coverfunc("build/property-base/property-base.js", "props", 195);
_yuitest_coverline("build/property-base/property-base.js", 196);
var results = {},
            name;

        _yuitest_coverline("build/property-base/property-base.js", 199);
if (!properties || Y.Lang.isArray(properties)) { // Get.
            _yuitest_coverline("build/property-base/property-base.js", 200);
var definedOnly = options && options.definedOnly,
                i, len;

            _yuitest_coverline("build/property-base/property-base.js", 203);
properties || (properties = Object.getOwnPropertyNames(this));

            _yuitest_coverline("build/property-base/property-base.js", 205);
for (i = 0, len = properties.length; i < len; i++) {
                _yuitest_coverline("build/property-base/property-base.js", 206);
name = properties[i];

                _yuitest_coverline("build/property-base/property-base.js", 208);
if (!definedOnly || this._definedProperties[name]) {
                    _yuitest_coverline("build/property-base/property-base.js", 209);
results[name] = this.prop(name);
                }
            }
        } else { // Set.
            _yuitest_coverline("build/property-base/property-base.js", 213);
for (name in properties) {
                _yuitest_coverline("build/property-base/property-base.js", 214);
if (properties.hasOwnProperty(name)) {
                    _yuitest_coverline("build/property-base/property-base.js", 215);
results[name] = this.prop(name, properties[name], options);
                }
            }
        }

        _yuitest_coverline("build/property-base/property-base.js", 220);
return results;
    }
};

_yuitest_coverline("build/property-base/property-base.js", 224);
Y.namespace('Property').Base = PropertyBase;


}, '@VERSION@');
