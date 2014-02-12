YUI.add('node-pluginhost-test', function(Y) {

    var Assert = Y.Assert,
        ArrayAssert = Y.ArrayAssert;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.Node get() method',

        setUp: function () {
            this._Y = YUI();
        },

        tearDown: function () {
            delete this._Y;
        },

        'Loading node-pluginhost should not update cached Node instances': function () {
            var Y = this._Y,
                someNode;

            Y.use('node-core');
            someNode = Y.one('div');

            Y.use('node-pluginhost');
            Assert.isFalse(someNode.hasOwnProperty('_plugins'));

            Y.use('shim-plugin');
            someNode.plug(Y.Plugin.Shim);
            Assert.isTrue(someNode.hasOwnProperty('_plugins'));
        }
    }));
}, '@VERSION@', {requires:['node-core', 'node-pluginhost']});
