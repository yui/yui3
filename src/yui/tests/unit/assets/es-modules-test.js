YUI.add('es-modules-test', function (Y) {

var Assert = Y.Assert,
    suite = new Y.Test.Suite('YUI: ES Modules Compat Test');

YUI.add('mod1-legacy', function (Y, NAME) {
    Y[NAME] = arguments;
}, '', { requires: ['yui'] });

YUI.add('mod2-es-legacy', function (Y, NAME, __imports__, __exports__) {
    Y[NAME] = __imports__;
    __exports__["default"] = 2;
    return __exports__;
}, '', { es: true, requires: ['yui'] });

YUI.add('mod3-es-mix', function (Y, NAME, __imports__, __exports__) {
    Y[NAME] = __imports__;
    __exports__["default"] = 3;
    return __exports__;
}, '', { es: true, requires: ['yui', 'mod2-es-legacy'] });

YUI.add('mod4-es-without-export', function (Y, NAME, __imports__, __exports__) {
    Y[NAME] = __imports__;
}, '', { es: true });

YUI.add('mod5-es', function (Y, NAME, __imports__, __exports__) {
    Y[NAME] = __imports__;
    return __exports__;
}, '', { es: true, requires: ['mod2-es-legacy', 'mod3-es-mix', 'mod4-es-without-export'] });

suite.add(new Y.Test.Case({
    name: 'ES Modules Compat tests',

    _should: {
        ignore: {
            'context in module definition functions in sloppy mode': (function () {
                return this !== Y.config.global;
            }()),
            'context in module definition functions in strict mode': (function () {
                'use strict';
                return this !== undefined;
            }())
        }
    },

    "test legacy module": function () {
        // no need to go async in these tests since all modules are available
        Y.use('mod1-legacy');
        Assert.areSame(2, Y['mod1-legacy'].length, "legacy yui modules should not receive __imports__ and __exports__");
    },

    "test es module using a legacy module": function () {
        Y.use('mod2-es-legacy');
        Assert.isObject(Y['mod2-es-legacy'], "es modules should receive __imports__");
        Assert.areSame(1, Y.Object.keys(Y['mod2-es-legacy']).length, "__imports__ should receive one member per requires");
        Assert.areSame(Y, Y['mod2-es-legacy']['yui'], "__imports__ should be an object with the requires even for legacy requires");
    },

    "test es module mixing a legacy module and an es module": function () {
        Y.use('mod3-es-mix');
        Assert.isObject(Y['mod3-es-mix'], "es modules should receive __imports__");
        Assert.areSame(2, Y.Object.keys(Y['mod3-es-mix']).length, "__imports__ should receive one member per requires");
        Assert.areSame(Y, Y['mod3-es-mix']['yui'], "__imports__ should contain an object with the requires even for legacy requires");
        Assert.areSame(2, Y['mod3-es-mix']['mod2-es-legacy']['default'], "__imports__ should contain a reference to the exports of required es modules");
    },

    "test es modules": function () {
        Y.use('mod5-es');
        var imp = Y['mod5-es'];
        Assert.isObject(imp, "es modules should receive __imports__");
        Assert.areSame(3, Y.Object.keys(imp).length, "__imports__ should receive one member per requires");
        Assert.areSame(2, imp['mod2-es-legacy']['default'], "__imports__ should contain a reference to the exports of required es modules");
        Assert.areSame(3, imp['mod3-es-mix']['default'], "__imports__ should contain a reference to the exports of required es modules");
        Assert.isUndefined(imp['mod4-es-without-export'], "__imports__ should contain a reference to undefined if the es module exports nothing");
    },

    "context in module definition functions in sloppy mode": function () {
        var test = this;

        YUI.add('mod10-es-sloppy', function (Y, NAME, __imports__, __exports__) {
            var that = this;
            test.resume(function () {
                Assert.areSame(Y.config.global, that, '`this` inside modules should point to the global object in sloppy mode');
            });
        }, '', {es: true});

        setTimeout(function () {
            YUI().use('mod10-es-sloppy');
        }, 0);
        test.wait();
    },

    "context in module definition functions in strict mode": function () {
        'use strict';

        var test = this;

        YUI.add('mod10-es-strict', function (Y, NAME, __imports__, __exports__) {
            var that = this;
            test.resume(function () {
                Assert.isUndefined(that, '`this` inside modules should be undefined in strict mode');
            });
        }, '', {es: true});

        setTimeout(function () {
            YUI().use('mod10-es-strict');
        }, 0);
        test.wait();
    }

}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {requires: ['test']});
