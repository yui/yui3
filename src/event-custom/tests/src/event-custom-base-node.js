suite = new Y.Test.Suite("Node as EventTarget, and NodeList API");

suite.add(new Y.Test.Case({
    name: "node as EventTarget"

    // custom events
    // synth events

}));

suite.add(new Y.Test.Case({
    name: "nodelist.on once, onceAfter, detach, detachAll, etc"

}));

suite.add(new Y.Test.Case({
    name: "node.publish",

    test_node_publish: function() {
        var node = Y.one('#adiv');

        var preventCount = 0, heard = 0;
        node.publish('foo1', {
            emitFacade: true,
            // should only be called once
            preventedFn: function() {
                preventCount++;
                Y.Assert.isTrue(this instanceof Y.Node);
            }
        });

        node.on('foo1', function(e) {
            Y.Assert.areEqual('faking foo', e.type);
            Y.Assert.areEqual('foo1', e._type);
            heard++;
            e.preventDefault();
        });

        node.on('foo1', function(e) {
            heard++;
            e.preventDefault();
        });

        node.fire('foo1', {
            type: 'faking foo'
        });

        Y.Assert.areEqual(1, preventCount);
        Y.Assert.areEqual(2, heard);
    }
}));

Y.Test.Runner.add(suite);
