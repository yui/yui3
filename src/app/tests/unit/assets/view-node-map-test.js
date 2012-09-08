YUI.add('view-node-map-test', function (Y) {

var ArrayAssert  = Y.ArrayAssert,
    Assert       = Y.Assert,
    ObjectAssert = Y.ObjectAssert,

    suite,
    nodeMapSuite,
    MappedView;

suite        = Y.AppTestSuite || (Y.AppTestSuite = new Y.Test.Suite('App'));
nodeMapSuite = new Y.Test.Suite('View.NodeMap');

MappedView = Y.Base.create('mappedView', Y.View, [Y.View.NodeMap]);

nodeMapSuite.add(new Y.Test.Case({
    name: 'General',

    setUp: function () {
        this.container = Y.Node.create('<div id="node-map-container"><div id="node-map-child"></div></div>');

        Y.one('#test').append(this.container);
        this.view = new MappedView({container: this.container});
    },

    tearDown: function () {
        this.view && this.view.destroy({remove: true});
    },

    'getByNode() should return a View instance associated with the given Node': function () {
        Assert.areSame(this.view, MappedView.getByNode(this.container), 'Node ref to the container should work.');
        Assert.areSame(this.view, MappedView.getByNode('#node-map-container'), 'Id selector for the container should work.');
        Assert.areSame(this.view, MappedView.getByNode('#node-map-child'), 'Id selector for a child of the container should work.');
    },

    'getByNode() should return the nearest View instance': function () {
        var subView = new MappedView({container: '#node-map-child'});

        Assert.areSame(subView, MappedView.getByNode('#node-map-child'));
        Assert.areSame(this.view, MappedView.getByNode('#node-map-container'));

        subView.destroy();
    },

    'getByNode() should return null when no View is found': function () {
        var div = Y.Node.create('<div/>');

        Y.one('#test').append(div);
        Assert.isNull(MappedView.getByNode(div));
        div.remove(true);
    },

    'View should be removed from the instances map when destroy() is called': function () {
        var key = Y.stamp(this.container, true);

        ObjectAssert.ownsKey(key, Y.View.NodeMap._instances, 'Node stamp should exist in the instances map.');
        this.view.destroy();
        Assert.isFalse(key in Y.View.NodeMap._instances, 'Node stamp should not exist in the instances map after the instance is destroyed.');
        this.view = null;
    }
}));

suite.add(nodeMapSuite);

}, '@VERSION@', {
    requires: ['view-node-map', 'test']
});
