YUI.add('property-test', function (Y) {

var Assert       = Y.Assert,
    PropertyBase = Y.Property.Base,

    mainSuite    = Y.PropertyTestSuite = new Y.Test.Suite('Property');

// -- property-base ------------------------------------------------------------
var baseSuite = new Y.Test.Suite('PropertyBase');
mainSuite.add(baseSuite);

// -- Methods ------------------------------------------------------------------
baseSuite.add(new Y.Test.Case({
    name: 'Methods',

    setUp: function () {
        this.Klass = function () {
            this.defineProperties({
                a: {value: 'a value', writable: true},
                b: {value: 'b value', writable: true}
            });
        };

        Y.augment(this.Klass, PropertyBase);

        this.instance = new this.Klass();
    },

    tearDown: function () {
        delete this.Klass;
        delete this.instance;
    },

    '#defineProperties() should define multiple properties on this instance': function () {
        this.instance.defineProperties({
            foo: {value: 'bar'},
            baz: {value: 'quux'}
        });

        Assert.areSame('bar', this.instance.prop('foo'), 'prop() should return the value of foo');
        Assert.areSame('quux', this.instance.prop('baz'), 'prop() should return the value of baz');

        Assert.areSame('bar', this.instance.foo, 'foo should be a real property');
        Assert.areSame('quux', this.instance.baz, 'baz should be a real property');
    },

    '#defineProperty() should define a new property on this instance': function () {
        this.instance.defineProperty('test', {value: 'foo'});

        Assert.areSame('foo', this.instance.prop('test'), 'prop() should return the new property');
        Assert.areSame('foo', this.instance.test, 'test should be a real property');
    },

    '#getPropertyDescriptor() should return the descriptor for a property': function () {
        var descriptor = this.instance.getPropertyDescriptor('a');

        Assert.isObject(descriptor, 'descriptor should be an object');
        Assert.isFalse(descriptor.configurable, 'configurable should be false');
        Assert.isFalse(descriptor.enumerable, 'enumerable should be false');
        Assert.areSame('a value', descriptor.value, 'value should be "a value"');
        Assert.isTrue(descriptor.writable, 'writable should be true');
    },

    '#getPropertyDescriptor() should return undefined if the specified property has not been defined': function () {
        Assert.isUndefined(this.instance.getPropertyDescriptor('bogus'));
    },

    '#prop(name) should return the value of the named property': function () {
        Assert.areSame('a value', this.instance.prop('a'));
    },

    '#prop(name) should return `undefined` for a nonexistent property': function () {
        Assert.isUndefined(this.instance.prop('bogus'));
    },

    '#prop(name, value) should set the given property to the given value': function () {
        this.instance.prop('a', 'modified a value');
        Assert.areSame('modified a value', this.instance.prop('a'), 'should modify the value of `a`');

        this.instance.prop('c', 'new property');
        Assert.areSame('new property', this.instance.prop('c'), 'should create a new `c` property');
    },

    '#props() should return values of all properties when no names are specified': function () {
        var result = this.instance.props();

        Assert.isObject(result, 'should return an object');
        Assert.isTrue(Y.Object.size(result) > 2, 'returned object should have lots of properties');
        Assert.areSame('a value', result.a, 'should have the correct value for `a`');
        Assert.areSame('b value', result.b, 'should have the correct value for `b`');
    },

    '#props() should include non-enumerable properties when no names are specified': function () {
        this.instance.defineProperty('noenum', {enumerable: false, value: 'hello'});

        var result = this.instance.props();
        Assert.areSame('hello', result.noenum);
    },

    '#props() should return undefined values for nonexistent properties': function () {
        var result = this.instance.props(['bogus']);
        Assert.isUndefined(result.bogus);
    },

    '#props() should only return properties defined via Y.Property when `options.definedOnly` is truthy': function () {
        var result = this.instance.props(null, {definedOnly: true});

        Assert.isObject(result, 'should return an object');
        Assert.areSame(2, Y.Object.size(result), 'returned object should have two properties');
        Assert.areSame('a value', result.a, 'should have the correct value for `a`');
        Assert.areSame('b value', result.b, 'should have the correct value for `b`');
    },

    '#props(names) should return a hash containing the values of the specified properties': function () {
        var result = this.instance.props(['a', 'b']);

        Assert.isObject(result, 'should return an object');
        Assert.areSame(2, Y.Object.size(result), 'returned object should have two properties');
        Assert.areSame('a value', result.a, 'should have the correct value for `a`');
        Assert.areSame('b value', result.b, 'should have the correct value for `b`');
    },

    '#props(hash) should set multiple properties': function () {
        this.instance.props({
            a: 'modified a value',
            b: 'modified b value',
            c: 'new property'
        });

        Assert.areSame('modified a value', this.instance.prop('a'), '`a` value should be set');
        Assert.areSame('modified b value', this.instance.prop('b'), '`b` value should be set');
        Assert.areSame('new property', this.instance.prop('c'), '`c` value should be set');
    },

    '#props(hash) should return a hash of the property values that were set': function () {
        var result = this.instance.props({
            a: 'modified a value',
            b: 'modified b value',
            c: 'new property'
        });

        Assert.isObject(result, 'should return an object');
        Assert.areSame(3, Y.Object.size(result), 'returned object should have three properties');
        Assert.areSame('modified a value', result.a, '`a` value should be set');
        Assert.areSame('modified b value', result.b, '`b` value should be set');
        Assert.areSame('new property', result.c, '`c` value should be set');
    }
}));

// -- Sanity checks for ES5 compat and property-base-shim ----------------------
mainSuite.add(new Y.Test.Case({
    name: 'Sanity',

    setUp: function () {
        this.Klass = function () {
            this.defineProperties({
                a: {value: 'a value', writable: true},
                b: {value: 'b value', writable: true, configurable: true},
                readOnly: {value: 'original value'}
            });
        };

        Y.augment(this.Klass, PropertyBase);

        this.instance = new this.Klass();
    },

    tearDown: function () {
        delete this.Klass;
        delete this.instance;
    },

    _should: {
        error: {
            '#defineProperty() should throw a TypeError when attempting to redefine a non-configurable property to configurable': TypeError,
            '#defineProperty() should throw a TypeError when attempting to change the value of a non-configurable, non-writable property': TypeError,
            '#defineProperty() should throw a TypeError when mixing data descriptor and accessor descriptor properties': TypeError
        }
    },

    '#defineProperty() should allow redefining a configurable property': function () {
        // No assertions in this test, but all we care about is that nothing
        // should throw.
        this.instance.defineProperty('b', {value: 'test', configurable: false});
    },

    '#defineProperty() should allow redefining a non-configurable property in certain cases': function () {
        // No assertions in this test, but all we care about is that nothing
        // should throw.
        this.instance.defineProperty('a', {value: 'test'});
        this.instance.defineProperty('a', {});
        this.instance.defineProperty('a', {writable: false});
    },

    '#defineProperty() should throw a TypeError when attempting to redefine a non-configurable property to configurable': function () {
        this.instance.defineProperty('a', {configurable: true});
    },

    '#defineProperty() should throw a TypeError when attempting to change the value of a non-configurable, non-writable property': function () {
        this.instance.defineProperty('readOnly', {value: 'hello'});
    },

    '#defineProperty() should throw a TypeError when mixing data descriptor and accessor descriptor properties': function () {
        this.instance.defineProperty('test', {value: 'testing', get: function () {}});
    },

    '#prop(name, value) should do nothing if the property is not writable': function () {
        this.instance.prop('readOnly', 'new value');
        Assert.areSame('original value', this.instance.prop('readOnly'), 'property should not change');
    }
}));

}, '@VERSION@', {
    requires: ['property', 'test']
});
