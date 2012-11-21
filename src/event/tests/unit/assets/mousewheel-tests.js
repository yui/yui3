YUI.add('mousewheel-tests', function(Y) {

    var suite = new Y.Test.Suite('Event: mousewheel'),
    Assert = Y.Assert,
    noop = function() {},
    node = Y.one(document);

    suite.add(new Y.Test.Case({
        name: 'Mousewheel',
        'test: attach': function() {
            var handle = node.on('mousewheel', noop);
            Assert.isObject(handle.evt);
        }
    }));

    Y.Test.Runner.add(suite);

});
