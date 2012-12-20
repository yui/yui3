YUI.add('simpleyui-tests', function(Y) {

var suite = new Y.Test.Suite("SimpleYUI");

suite.add( new Y.Test.Case({
    name: "simpleyui",

    "test global Y": function () {
        var global = (function () { return this; })();

        Y.Assert.isInstanceOf(YUI, global.Y);
    },

    "test module inclusion": function () {
        var global = (function () { return this; })(),
            attached = global.Y.Env._attached,
            aliases = YUI.Env.aliases,
            modules = [
                'yui-base',
                'oop',
                'dom',
                'event-custom',
                'event-base',
                'event-base-ie',
                'pluginhost',
                'node',
                'event-delegate',
                'io-base',
                'json-parse',
                'transition',
                'selector-css3',
                'dom-style-ie'
            ], i;

        // Expand aliases
        for (i = modules.length - 1; i >= 0; --i) {
            if (aliases[modules[i]]) {
                modules.splice.apply(modules, [i, 1].concat(aliases[modules[i]]));
            }
        }

        for (i = modules.length - 1; i >= 0; --i) {
            Y.Assert.isTrue(attached[modules[i]], modules[i]);
        }
    }
}));

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['simpleyui', 'test']});
