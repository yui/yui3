YUI.add('browser-tests', function(Y) {

    var suite = new Y.Test.Suite('YUI: Core Browser');

    suite.add(new Y.Test.Case({
        test_attach_after: function() {
            var Assert = Y.Assert;
            YUI.add('after-test', function(Y) {
                Y.afterTest = true; 
                Assert.isObject(Y.Node, 'Node not loaded before this module');
            }, '1.0.0', {
                after: [ 'node' ]
            });

            YUI().use('after-test', function(Y2) {
                Assert.isTrue(Y2.afterTest, 'after-test module was not loaded');
            });
        },
        test_rollup_false: function() {
            var Assert = Y.Assert;
            YUI().use('dd', function(Y) {
                Assert.isUndefined(Y.Env._attached.dd, 'DD Alias Module was attached');
            });
            YUI().use('node', function(Y) {
                Assert.isUndefined(Y.Env._attached.node, 'Node Alias Module was attached');
            });
        }
    });

    Y.Test.Runner.add(suite);

});
