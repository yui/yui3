YUI.add('pluginattr-tests', function(Y) {

var suite = new Y.Test.Suite("Y.Plugin");

suite.add(new Y.Test.Case({
    name: "Y.Plugin.addHostAttr",

    setUp: function () {
        this.Host = Y.Base.create('testHost', Y.Base, [], {}, {
            ATTRS: {
                baz: {
                    value: 'baz'
                }
            }
        });

        this.Plugin = Y.Base.create('testPlugin', Y.Plugin.Base, [], {}, {
            NS: 'foo',
            ATTRS: {
                bar: {
                    value: 'bar'
                }
            }
        });
    },

    "test addHostAttr(name, class, class)": function () {
        Y.Plugin.addHostAttr('foo', this.Host, this.Plugin);

        var attr = this.Host.ATTRS.foo;

        Y.Assert.isNotUndefined(attr);
        Y.Assert.isFalse(attr.lazyAdd);
        Y.Assert.isFunction(attr.setter);
    },

    "test addHostAttr(name, instance, class)": function () {
        var instance = new this.Host();

        Y.Plugin.addHostAttr('foo', instance, this.Plugin);

        var state = instance._state;
        
        Y.Assert.isTrue(state.get('foo','added'));
        Y.Assert.isFunction(state.get('foo', 'setter'));
    },

    "test addHostAttr(name, class, class, setter)": function () {
        var setterCalled = false,
            test = this,
            Plugin, configVal, attr, instance;

        Plugin = Y.Base.create('testPlugin', Y.Plugin.Base, [], {
            initializer: function () {
                configVal = this.get('bar');
            }
        }, {
            NS: 'foo',
            ATTRS: {
                bar: {
                    value: 'bar'
                }
            }
        });

        Y.Plugin.addHostAttr('foo', this.Host, Plugin,
            function (val) {
                setterCalled = true;

                return { bar: "PASS" };
            });

        attr = this.Host.ATTRS.foo;

        Y.Assert.isNotUndefined(attr);
        Y.Assert.isFalse(attr.lazyAdd);
        Y.Assert.isFunction(attr.setter, "setter");

        instance = new this.Host({ foo: true });

        Y.Assert.isTrue(setterCalled);
        Y.Assert.areSame("PASS", configVal);
    },

    "test addHostAttr(name, class, class, setterThatReturnsFalse)": function () {
        var setterCalled = false,
            test = this,
            Plugin, configVal, attr, instance;

        Plugin = Y.Base.create('testPlugin', Y.Plugin.Base, [], {
            initializer: function () {
                configVal = this.get('bar');
            }
        }, {
            NS: 'foo',
            ATTRS: {
                bar: {
                    value: 'bar'
                }
            }
        });

        Y.Plugin.addHostAttr('foo', this.Host, Plugin,
            function (val) {
                setterCalled = true;

                if (typeof val === 'boolean') {
                    val = { bar: ''+val };
                } else if (val === 'unplug') {
                    val = false;
                } else {
                    val = { bar: "PASS" };
                }

                return val;
            });

        attr = this.Host.ATTRS.foo;

        Y.Assert.isNotUndefined(attr);
        Y.Assert.isFalse(attr.lazyAdd);
        Y.Assert.isFunction(attr.setter, "setter");

        instance = new this.Host({ foo: true });

        Y.Assert.isTrue(setterCalled);
        Y.Assert.areSame("true", configVal);

        instance = new this.Host({ foo: "PASS" });

        Y.Assert.isTrue(setterCalled);
        Y.Assert.areSame("PASS", configVal);

        instance.set("foo", false);

        Y.Assert.isNotUndefined(instance.foo);

        instance.set("foo", "unplug");

        Y.Assert.isUndefined(instance.foo);
    },

    "test new Host({ trigger: true }) plugs Plugin": function () {
        Y.Plugin.addHostAttr('foo', this.Host, this.Plugin);

        var instance = new this.Host();

        Y.Assert.isUndefined(instance[this.Plugin.NS]);

        instance = new this.Host({ foo: true });

        Y.Assert.isObject(instance[this.Plugin.NS]);
        Y.Assert.isInstanceOf(this.Plugin, instance[this.Plugin.NS]);
    },

    "test new Host({ trigger: obj }) plugs Plugin with config": function () {
        Y.Plugin.addHostAttr('foo', this.Host, this.Plugin);

        var instance = new this.Host({ foo: true });

        Y.Assert.areSame('bar', instance[this.Plugin.NS].get('bar'));

        instance = new this.Host({ foo: { bar: 'testing 1 2 3' } });

        Y.Assert.areSame('testing 1 2 3', instance[this.Plugin.NS].get('bar'));
    },

    "test new Host({ trigger: false }) does nothing": function () {
        Y.Plugin.addHostAttr('foo', this.Host, this.Plugin);

        var instance = new this.Host({ foo: false });

        Y.Assert.isUndefined(instance[this.Plugin.NS]);
    },

    "test instance.set('trigger', true) plugs Plugin": function () {
        Y.Plugin.addHostAttr('foo', this.Host, this.Plugin);

        var instance = new this.Host();

        Y.Assert.isUndefined(instance[this.Plugin.NS]);

        instance.set('foo', true);

        Y.Assert.isObject(instance[this.Plugin.NS]);
        Y.Assert.isInstanceOf(this.Plugin, instance[this.Plugin.NS]);
    },

    "test instance.set('trigger', obj) plugs Plugin with config": function () {
        Y.Plugin.addHostAttr('foo', this.Host, this.Plugin);

        var instance = new this.Host();

        Y.Assert.isUndefined(instance[this.Plugin.NS]);

        instance.set('foo', { bar: 'testing 1 2 3' });

        Y.Assert.isObject(instance[this.Plugin.NS]);
        Y.Assert.isInstanceOf(this.Plugin, instance[this.Plugin.NS]);
        Y.Assert.areSame('testing 1 2 3', instance[this.Plugin.NS].get('bar'));
    },

    "test instance.set('trigger', false) does nothing": function () {
        Y.Plugin.addHostAttr('foo', this.Host, this.Plugin);

        var instance = new this.Host();

        Y.Assert.isUndefined(instance[this.Plugin.NS]);

        instance.set('foo', false);

        Y.Assert.isUndefined(instance[this.Plugin.NS]);
    },

    "test new Host({ trigger: true }) + instance.set('trigger', false) unplugs": function () {
        Y.Plugin.addHostAttr('foo', this.Host, this.Plugin);

        var instance = new this.Host();

        Y.Assert.isUndefined(instance[this.Plugin.NS]);

        instance = new this.Host({ foo: true });

        Y.Assert.isObject(instance[this.Plugin.NS]);
        Y.Assert.isInstanceOf(this.Plugin, instance[this.Plugin.NS]);

        instance.set('foo', false);

        Y.Assert.isUndefined(instance[this.Plugin.NS]);
    }

}));

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['pluginattr', 'base-build', 'test']});
