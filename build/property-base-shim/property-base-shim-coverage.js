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
_yuitest_coverage["build/property-base-shim/property-base-shim.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/property-base-shim/property-base-shim.js",
    code: []
};
_yuitest_coverage["build/property-base-shim/property-base-shim.js"].code=["YUI.add('property-base-shim', function (Y, NAME) {","","/**","Provides compatibility shims for browsers like IE6-8 that don't support","`Object.defineProperty()`.","","@module property","@submodule property-base-shim","**/","","var hasOwn = Object.prototype.hasOwnProperty;","","function PropertyBase() {","    this._definedProperties = {};","}","","PropertyBase.prototype = {","    // -- Public Prototype Methods ---------------------------------------------","","    defineProperties: function (properties) {","        for (var name in properties) {","            if (properties.hasOwnProperty(name)) {","                this.defineProperty(name, properties[name]);","            }","        }","","        return this;","    },","","    // Not striving for full ES5 compliance here, just graceful degradation. If","    // IE6-8 basically work and don't explode when given sane inputs, then we're","    // happy.","    defineProperty: function (name, descriptor) {","        var current = this.getPropertyDescriptor(name),","","            isAccessorDescriptor = hasOwn.call(descriptor, 'get') ||","                hasOwn.call(descriptor, 'set'),","","            isDataDescriptor = hasOwn.call(descriptor, 'value') ||","                hasOwn.call(descriptor, 'writable');","","        // Throw if the descriptor is a mix of data descriptor and accessor","        // descriptor properties.","        if (isAccessorDescriptor && isDataDescriptor) {","            throw new TypeError('Invalid property: ' + name + '. A property cannot both have accessors and be writable or have a value.');","        }","","        // Throw if the property has already been defined and cannot be","        // redefined. This is a partial implementation of the checks in","        // http://es5.github.com/#x8.12.9","        if (current && !current.configurable) {","            if (descriptor.configurable // 7a.","                    || (isDataDescriptor && (!current.writable && (descriptor.writable || descriptor.value !== current.value))) // 10a.","                    || (isAccessorDescriptor && (current.get !== descriptor.get || current.set !== descriptor.set))) { // 11a.","","                throw new TypeError('Cannot redefine property: ' + name);","            }","        }","","        this._definedProperties[name] = Y.merge({","            configurable: false,","            enumerable  : false","        }, descriptor);","","        this[name] = descriptor.value;","","        return this;","    },","","    get: function (name) {","        var descriptor = this.getPropertyDescriptor(name);","","        if (descriptor && descriptor.get) {","            return descriptor.get(name);","        }","","        return this[name];","    },","","    getProperties: function (names, options) {","        // Allow options as only argument.","        if (names && !Y.Lang.isArray(names)) {","            options = names;","            names   = null;","        }","","        var definedOnly = options && options.definedOnly,","            properties  = {},","            i, len, name;","","        // Y.Object.keys() only returns enumerable properties, but it's the best","        // we can do.","        names || (names = Y.Object.keys(this));","","        for (i = 0, len = names.length; i < len; i++) {","            name = names[i];","","            if (!definedOnly || this._definedProperties[name]) {","                properties[name] = this.get(name);","            }","        }","","        return properties;","    },","","    getPropertyDescriptor: function (name) {","        var descriptor = this._definedProperties[name];","","        // If we don't have a descriptor but the property exists on this object,","        // assume a default descriptor.","        if (!descriptor && this.hasOwnProperty(name)) {","            descriptor = {","                configurable: true,","                enumerable  : this.propertyIsEnumerable(name),","                value       : this[name],","                writable    : true","            };","        }","","        return descriptor;","    },","","    set: function (name, value) {","        var descriptor = this.getPropertyDescriptor(name);","","        if (descriptor) {","            if (descriptor.set) {","                return this[name] = descriptor.set(value);","            } else if (!descriptor.writable) {","                return;","            }","        }","","        return this[name] = value;","    },","","    setProperties: function (properties, options) {","        var results = {};","","        for (var name in properties) {","            if (properties.hasOwnProperty(name)) {","                results[name] = this.set(name, properties[name], options);","            }","        }","","        return results;","    }","};","","Y.namespace('Property').Base = PropertyBase;","","","}, '@VERSION@');"];
_yuitest_coverage["build/property-base-shim/property-base-shim.js"].lines = {"1":0,"11":0,"13":0,"14":0,"17":0,"21":0,"22":0,"23":0,"27":0,"34":0,"44":0,"45":0,"51":0,"52":0,"56":0,"60":0,"65":0,"67":0,"71":0,"73":0,"74":0,"77":0,"82":0,"83":0,"84":0,"87":0,"93":0,"95":0,"96":0,"98":0,"99":0,"103":0,"107":0,"111":0,"112":0,"120":0,"124":0,"126":0,"127":0,"128":0,"129":0,"130":0,"134":0,"138":0,"140":0,"141":0,"142":0,"146":0,"150":0};
_yuitest_coverage["build/property-base-shim/property-base-shim.js"].functions = {"PropertyBase:13":0,"defineProperties:20":0,"defineProperty:33":0,"get:70":0,"getProperties:80":0,"getPropertyDescriptor:106":0,"set:123":0,"setProperties:137":0,"(anonymous 1):1":0};
_yuitest_coverage["build/property-base-shim/property-base-shim.js"].coveredLines = 49;
_yuitest_coverage["build/property-base-shim/property-base-shim.js"].coveredFunctions = 9;
_yuitest_coverline("build/property-base-shim/property-base-shim.js", 1);
YUI.add('property-base-shim', function (Y, NAME) {

/**
Provides compatibility shims for browsers like IE6-8 that don't support
`Object.defineProperty()`.

@module property
@submodule property-base-shim
**/

_yuitest_coverfunc("build/property-base-shim/property-base-shim.js", "(anonymous 1)", 1);
_yuitest_coverline("build/property-base-shim/property-base-shim.js", 11);
var hasOwn = Object.prototype.hasOwnProperty;

_yuitest_coverline("build/property-base-shim/property-base-shim.js", 13);
function PropertyBase() {
    _yuitest_coverfunc("build/property-base-shim/property-base-shim.js", "PropertyBase", 13);
_yuitest_coverline("build/property-base-shim/property-base-shim.js", 14);
this._definedProperties = {};
}

_yuitest_coverline("build/property-base-shim/property-base-shim.js", 17);
PropertyBase.prototype = {
    // -- Public Prototype Methods ---------------------------------------------

    defineProperties: function (properties) {
        _yuitest_coverfunc("build/property-base-shim/property-base-shim.js", "defineProperties", 20);
_yuitest_coverline("build/property-base-shim/property-base-shim.js", 21);
for (var name in properties) {
            _yuitest_coverline("build/property-base-shim/property-base-shim.js", 22);
if (properties.hasOwnProperty(name)) {
                _yuitest_coverline("build/property-base-shim/property-base-shim.js", 23);
this.defineProperty(name, properties[name]);
            }
        }

        _yuitest_coverline("build/property-base-shim/property-base-shim.js", 27);
return this;
    },

    // Not striving for full ES5 compliance here, just graceful degradation. If
    // IE6-8 basically work and don't explode when given sane inputs, then we're
    // happy.
    defineProperty: function (name, descriptor) {
        _yuitest_coverfunc("build/property-base-shim/property-base-shim.js", "defineProperty", 33);
_yuitest_coverline("build/property-base-shim/property-base-shim.js", 34);
var current = this.getPropertyDescriptor(name),

            isAccessorDescriptor = hasOwn.call(descriptor, 'get') ||
                hasOwn.call(descriptor, 'set'),

            isDataDescriptor = hasOwn.call(descriptor, 'value') ||
                hasOwn.call(descriptor, 'writable');

        // Throw if the descriptor is a mix of data descriptor and accessor
        // descriptor properties.
        _yuitest_coverline("build/property-base-shim/property-base-shim.js", 44);
if (isAccessorDescriptor && isDataDescriptor) {
            _yuitest_coverline("build/property-base-shim/property-base-shim.js", 45);
throw new TypeError('Invalid property: ' + name + '. A property cannot both have accessors and be writable or have a value.');
        }

        // Throw if the property has already been defined and cannot be
        // redefined. This is a partial implementation of the checks in
        // http://es5.github.com/#x8.12.9
        _yuitest_coverline("build/property-base-shim/property-base-shim.js", 51);
if (current && !current.configurable) {
            _yuitest_coverline("build/property-base-shim/property-base-shim.js", 52);
if (descriptor.configurable // 7a.
                    || (isDataDescriptor && (!current.writable && (descriptor.writable || descriptor.value !== current.value))) // 10a.
                    || (isAccessorDescriptor && (current.get !== descriptor.get || current.set !== descriptor.set))) { // 11a.

                _yuitest_coverline("build/property-base-shim/property-base-shim.js", 56);
throw new TypeError('Cannot redefine property: ' + name);
            }
        }

        _yuitest_coverline("build/property-base-shim/property-base-shim.js", 60);
this._definedProperties[name] = Y.merge({
            configurable: false,
            enumerable  : false
        }, descriptor);

        _yuitest_coverline("build/property-base-shim/property-base-shim.js", 65);
this[name] = descriptor.value;

        _yuitest_coverline("build/property-base-shim/property-base-shim.js", 67);
return this;
    },

    get: function (name) {
        _yuitest_coverfunc("build/property-base-shim/property-base-shim.js", "get", 70);
_yuitest_coverline("build/property-base-shim/property-base-shim.js", 71);
var descriptor = this.getPropertyDescriptor(name);

        _yuitest_coverline("build/property-base-shim/property-base-shim.js", 73);
if (descriptor && descriptor.get) {
            _yuitest_coverline("build/property-base-shim/property-base-shim.js", 74);
return descriptor.get(name);
        }

        _yuitest_coverline("build/property-base-shim/property-base-shim.js", 77);
return this[name];
    },

    getProperties: function (names, options) {
        // Allow options as only argument.
        _yuitest_coverfunc("build/property-base-shim/property-base-shim.js", "getProperties", 80);
_yuitest_coverline("build/property-base-shim/property-base-shim.js", 82);
if (names && !Y.Lang.isArray(names)) {
            _yuitest_coverline("build/property-base-shim/property-base-shim.js", 83);
options = names;
            _yuitest_coverline("build/property-base-shim/property-base-shim.js", 84);
names   = null;
        }

        _yuitest_coverline("build/property-base-shim/property-base-shim.js", 87);
var definedOnly = options && options.definedOnly,
            properties  = {},
            i, len, name;

        // Y.Object.keys() only returns enumerable properties, but it's the best
        // we can do.
        _yuitest_coverline("build/property-base-shim/property-base-shim.js", 93);
names || (names = Y.Object.keys(this));

        _yuitest_coverline("build/property-base-shim/property-base-shim.js", 95);
for (i = 0, len = names.length; i < len; i++) {
            _yuitest_coverline("build/property-base-shim/property-base-shim.js", 96);
name = names[i];

            _yuitest_coverline("build/property-base-shim/property-base-shim.js", 98);
if (!definedOnly || this._definedProperties[name]) {
                _yuitest_coverline("build/property-base-shim/property-base-shim.js", 99);
properties[name] = this.get(name);
            }
        }

        _yuitest_coverline("build/property-base-shim/property-base-shim.js", 103);
return properties;
    },

    getPropertyDescriptor: function (name) {
        _yuitest_coverfunc("build/property-base-shim/property-base-shim.js", "getPropertyDescriptor", 106);
_yuitest_coverline("build/property-base-shim/property-base-shim.js", 107);
var descriptor = this._definedProperties[name];

        // If we don't have a descriptor but the property exists on this object,
        // assume a default descriptor.
        _yuitest_coverline("build/property-base-shim/property-base-shim.js", 111);
if (!descriptor && this.hasOwnProperty(name)) {
            _yuitest_coverline("build/property-base-shim/property-base-shim.js", 112);
descriptor = {
                configurable: true,
                enumerable  : this.propertyIsEnumerable(name),
                value       : this[name],
                writable    : true
            };
        }

        _yuitest_coverline("build/property-base-shim/property-base-shim.js", 120);
return descriptor;
    },

    set: function (name, value) {
        _yuitest_coverfunc("build/property-base-shim/property-base-shim.js", "set", 123);
_yuitest_coverline("build/property-base-shim/property-base-shim.js", 124);
var descriptor = this.getPropertyDescriptor(name);

        _yuitest_coverline("build/property-base-shim/property-base-shim.js", 126);
if (descriptor) {
            _yuitest_coverline("build/property-base-shim/property-base-shim.js", 127);
if (descriptor.set) {
                _yuitest_coverline("build/property-base-shim/property-base-shim.js", 128);
return this[name] = descriptor.set(value);
            } else {_yuitest_coverline("build/property-base-shim/property-base-shim.js", 129);
if (!descriptor.writable) {
                _yuitest_coverline("build/property-base-shim/property-base-shim.js", 130);
return;
            }}
        }

        _yuitest_coverline("build/property-base-shim/property-base-shim.js", 134);
return this[name] = value;
    },

    setProperties: function (properties, options) {
        _yuitest_coverfunc("build/property-base-shim/property-base-shim.js", "setProperties", 137);
_yuitest_coverline("build/property-base-shim/property-base-shim.js", 138);
var results = {};

        _yuitest_coverline("build/property-base-shim/property-base-shim.js", 140);
for (var name in properties) {
            _yuitest_coverline("build/property-base-shim/property-base-shim.js", 141);
if (properties.hasOwnProperty(name)) {
                _yuitest_coverline("build/property-base-shim/property-base-shim.js", 142);
results[name] = this.set(name, properties[name], options);
            }
        }

        _yuitest_coverline("build/property-base-shim/property-base-shim.js", 146);
return results;
    }
};

_yuitest_coverline("build/property-base-shim/property-base-shim.js", 150);
Y.namespace('Property').Base = PropertyBase;


}, '@VERSION@');
