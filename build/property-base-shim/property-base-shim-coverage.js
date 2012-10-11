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
_yuitest_coverage["build/property-base-shim/property-base-shim.js"].code=["YUI.add('property-base-shim', function (Y, NAME) {","","/**","Provides compatibility shims for browsers like IE6-8 that don't support","`Object.defineProperty()`.","","@module property","@submodule property-base-shim","**/","","var hasOwn = Object.prototype.hasOwnProperty;","","function PropertyBase() {","    this._definedProperties = {};","}","","PropertyBase.prototype = {","    // -- Public Prototype Methods ---------------------------------------------","","    // No doc comments here since we're just shimming methods that are already","    // documented in property.js.","","    defineProperties: function (properties) {","        for (var name in properties) {","            if (properties.hasOwnProperty(name)) {","                this.defineProperty(name, properties[name]);","            }","        }","","        return this;","    },","","    // Not striving for full ES5 compliance here, just graceful degradation. If","    // IE6-8 basically work and don't explode when given sane inputs, then we're","    // happy.","    defineProperty: function (name, descriptor) {","        var current = this.getPropertyDescriptor(name),","","            isAccessorDescriptor = hasOwn.call(descriptor, 'get') ||","                hasOwn.call(descriptor, 'set'),","","            isDataDescriptor = hasOwn.call(descriptor, 'value') ||","                hasOwn.call(descriptor, 'writable');","","        // Throw if the descriptor is a mix of data descriptor and accessor","        // descriptor properties.","        if (isAccessorDescriptor && isDataDescriptor) {","            throw new TypeError('Invalid property: ' + name + '. A property cannot both have accessors and be writable or have a value.');","        }","","        // Throw if the property has already been defined and cannot be","        // redefined. This is a partial implementation of the checks in","        // http://es5.github.com/#x8.12.9","        if (current && !current.configurable) {","            if (descriptor.configurable // 7a.","                    || (isDataDescriptor && (!current.writable && (descriptor.writable || descriptor.value !== current.value))) // 10a.","                    || (isAccessorDescriptor && (current.get !== descriptor.get || current.set !== descriptor.set))) { // 11a.","","                throw new TypeError('Cannot redefine property: ' + name);","            }","        }","","        this._definedProperties[name] = Y.merge({","            configurable: false,","            enumerable  : false","        }, descriptor);","","        this[name] = descriptor.value;","","        return this;","    },","","    getPropertyDescriptor: function (name) {","        var descriptor = this._definedProperties[name];","","        // If we don't have a descriptor but the property exists on this object,","        // assume a default descriptor.","        if (!descriptor && this.hasOwnProperty(name)) {","            descriptor = {","                configurable: true,","                enumerable  : this.propertyIsEnumerable(name),","                value       : this[name],","                writable    : true","            };","        }","","        return descriptor;","    },","","    prop: function (name, value) {","        var descriptor = this.getPropertyDescriptor(name);","","        if (typeof value === 'undefined') { // Get.","            if (descriptor && descriptor.get) {","                return descriptor.get(name);","            }","","            return this[name];","        } else { // Set.","            if (descriptor) {","                if (descriptor.set) {","                    return this[name] = descriptor.set(value);","                } else if (!descriptor.writable) {","                    return;","                }","            }","","            return this[name] = value;","        }","    },","","    props: function (properties, options) {","        var results = {},","            name;","","        if (!properties || Y.Lang.isArray(properties)) { // Get.","            var definedOnly = options && options.definedOnly,","                i, len;","","            // Y.Object.keys() only returns enumerable properties, but it's the","            // best we can do.","            properties || (properties = Y.Object.keys(this));","","            for (i = 0, len = properties.length; i < len; i++) {","                name = properties[i];","","                if (!definedOnly || this._definedProperties[name]) {","                    results[name] = this.prop(name);","                }","            }","        } else { // Set.","            for (name in properties) {","                if (properties.hasOwnProperty(name)) {","                    results[name] = this.prop(name, properties[name], options);","                }","            }","        }","","        return results;","    }","};","","Y.namespace('Property').Base = PropertyBase;","","","}, '@VERSION@');"];
_yuitest_coverage["build/property-base-shim/property-base-shim.js"].lines = {"1":0,"11":0,"13":0,"14":0,"17":0,"24":0,"25":0,"26":0,"30":0,"37":0,"47":0,"48":0,"54":0,"55":0,"59":0,"63":0,"68":0,"70":0,"74":0,"78":0,"79":0,"87":0,"91":0,"93":0,"94":0,"95":0,"98":0,"100":0,"101":0,"102":0,"103":0,"104":0,"108":0,"113":0,"116":0,"117":0,"122":0,"124":0,"125":0,"127":0,"128":0,"132":0,"133":0,"134":0,"139":0,"143":0};
_yuitest_coverage["build/property-base-shim/property-base-shim.js"].functions = {"PropertyBase:13":0,"defineProperties:23":0,"defineProperty:36":0,"getPropertyDescriptor:73":0,"prop:90":0,"props:112":0,"(anonymous 1):1":0};
_yuitest_coverage["build/property-base-shim/property-base-shim.js"].coveredLines = 46;
_yuitest_coverage["build/property-base-shim/property-base-shim.js"].coveredFunctions = 7;
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

    // No doc comments here since we're just shimming methods that are already
    // documented in property.js.

    defineProperties: function (properties) {
        _yuitest_coverfunc("build/property-base-shim/property-base-shim.js", "defineProperties", 23);
_yuitest_coverline("build/property-base-shim/property-base-shim.js", 24);
for (var name in properties) {
            _yuitest_coverline("build/property-base-shim/property-base-shim.js", 25);
if (properties.hasOwnProperty(name)) {
                _yuitest_coverline("build/property-base-shim/property-base-shim.js", 26);
this.defineProperty(name, properties[name]);
            }
        }

        _yuitest_coverline("build/property-base-shim/property-base-shim.js", 30);
return this;
    },

    // Not striving for full ES5 compliance here, just graceful degradation. If
    // IE6-8 basically work and don't explode when given sane inputs, then we're
    // happy.
    defineProperty: function (name, descriptor) {
        _yuitest_coverfunc("build/property-base-shim/property-base-shim.js", "defineProperty", 36);
_yuitest_coverline("build/property-base-shim/property-base-shim.js", 37);
var current = this.getPropertyDescriptor(name),

            isAccessorDescriptor = hasOwn.call(descriptor, 'get') ||
                hasOwn.call(descriptor, 'set'),

            isDataDescriptor = hasOwn.call(descriptor, 'value') ||
                hasOwn.call(descriptor, 'writable');

        // Throw if the descriptor is a mix of data descriptor and accessor
        // descriptor properties.
        _yuitest_coverline("build/property-base-shim/property-base-shim.js", 47);
if (isAccessorDescriptor && isDataDescriptor) {
            _yuitest_coverline("build/property-base-shim/property-base-shim.js", 48);
throw new TypeError('Invalid property: ' + name + '. A property cannot both have accessors and be writable or have a value.');
        }

        // Throw if the property has already been defined and cannot be
        // redefined. This is a partial implementation of the checks in
        // http://es5.github.com/#x8.12.9
        _yuitest_coverline("build/property-base-shim/property-base-shim.js", 54);
if (current && !current.configurable) {
            _yuitest_coverline("build/property-base-shim/property-base-shim.js", 55);
if (descriptor.configurable // 7a.
                    || (isDataDescriptor && (!current.writable && (descriptor.writable || descriptor.value !== current.value))) // 10a.
                    || (isAccessorDescriptor && (current.get !== descriptor.get || current.set !== descriptor.set))) { // 11a.

                _yuitest_coverline("build/property-base-shim/property-base-shim.js", 59);
throw new TypeError('Cannot redefine property: ' + name);
            }
        }

        _yuitest_coverline("build/property-base-shim/property-base-shim.js", 63);
this._definedProperties[name] = Y.merge({
            configurable: false,
            enumerable  : false
        }, descriptor);

        _yuitest_coverline("build/property-base-shim/property-base-shim.js", 68);
this[name] = descriptor.value;

        _yuitest_coverline("build/property-base-shim/property-base-shim.js", 70);
return this;
    },

    getPropertyDescriptor: function (name) {
        _yuitest_coverfunc("build/property-base-shim/property-base-shim.js", "getPropertyDescriptor", 73);
_yuitest_coverline("build/property-base-shim/property-base-shim.js", 74);
var descriptor = this._definedProperties[name];

        // If we don't have a descriptor but the property exists on this object,
        // assume a default descriptor.
        _yuitest_coverline("build/property-base-shim/property-base-shim.js", 78);
if (!descriptor && this.hasOwnProperty(name)) {
            _yuitest_coverline("build/property-base-shim/property-base-shim.js", 79);
descriptor = {
                configurable: true,
                enumerable  : this.propertyIsEnumerable(name),
                value       : this[name],
                writable    : true
            };
        }

        _yuitest_coverline("build/property-base-shim/property-base-shim.js", 87);
return descriptor;
    },

    prop: function (name, value) {
        _yuitest_coverfunc("build/property-base-shim/property-base-shim.js", "prop", 90);
_yuitest_coverline("build/property-base-shim/property-base-shim.js", 91);
var descriptor = this.getPropertyDescriptor(name);

        _yuitest_coverline("build/property-base-shim/property-base-shim.js", 93);
if (typeof value === 'undefined') { // Get.
            _yuitest_coverline("build/property-base-shim/property-base-shim.js", 94);
if (descriptor && descriptor.get) {
                _yuitest_coverline("build/property-base-shim/property-base-shim.js", 95);
return descriptor.get(name);
            }

            _yuitest_coverline("build/property-base-shim/property-base-shim.js", 98);
return this[name];
        } else { // Set.
            _yuitest_coverline("build/property-base-shim/property-base-shim.js", 100);
if (descriptor) {
                _yuitest_coverline("build/property-base-shim/property-base-shim.js", 101);
if (descriptor.set) {
                    _yuitest_coverline("build/property-base-shim/property-base-shim.js", 102);
return this[name] = descriptor.set(value);
                } else {_yuitest_coverline("build/property-base-shim/property-base-shim.js", 103);
if (!descriptor.writable) {
                    _yuitest_coverline("build/property-base-shim/property-base-shim.js", 104);
return;
                }}
            }

            _yuitest_coverline("build/property-base-shim/property-base-shim.js", 108);
return this[name] = value;
        }
    },

    props: function (properties, options) {
        _yuitest_coverfunc("build/property-base-shim/property-base-shim.js", "props", 112);
_yuitest_coverline("build/property-base-shim/property-base-shim.js", 113);
var results = {},
            name;

        _yuitest_coverline("build/property-base-shim/property-base-shim.js", 116);
if (!properties || Y.Lang.isArray(properties)) { // Get.
            _yuitest_coverline("build/property-base-shim/property-base-shim.js", 117);
var definedOnly = options && options.definedOnly,
                i, len;

            // Y.Object.keys() only returns enumerable properties, but it's the
            // best we can do.
            _yuitest_coverline("build/property-base-shim/property-base-shim.js", 122);
properties || (properties = Y.Object.keys(this));

            _yuitest_coverline("build/property-base-shim/property-base-shim.js", 124);
for (i = 0, len = properties.length; i < len; i++) {
                _yuitest_coverline("build/property-base-shim/property-base-shim.js", 125);
name = properties[i];

                _yuitest_coverline("build/property-base-shim/property-base-shim.js", 127);
if (!definedOnly || this._definedProperties[name]) {
                    _yuitest_coverline("build/property-base-shim/property-base-shim.js", 128);
results[name] = this.prop(name);
                }
            }
        } else { // Set.
            _yuitest_coverline("build/property-base-shim/property-base-shim.js", 132);
for (name in properties) {
                _yuitest_coverline("build/property-base-shim/property-base-shim.js", 133);
if (properties.hasOwnProperty(name)) {
                    _yuitest_coverline("build/property-base-shim/property-base-shim.js", 134);
results[name] = this.prop(name, properties[name], options);
                }
            }
        }

        _yuitest_coverline("build/property-base-shim/property-base-shim.js", 139);
return results;
    }
};

_yuitest_coverline("build/property-base-shim/property-base-shim.js", 143);
Y.namespace('Property').Base = PropertyBase;


}, '@VERSION@');
