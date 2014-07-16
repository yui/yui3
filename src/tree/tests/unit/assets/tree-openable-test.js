YUI.add('tree-openable-test', function (Y) {

var Assert      = Y.Assert,
    ArrayAssert = Y.ArrayAssert,
    Mock        = Y.Mock,
    Tree        = Y.Base.create('testTree', Y.Tree, [Y.Tree.Openable]),

    suite = Y.TreeOpenableTestSuite = new Y.Test.Suite('Tree.Openable');

// -- Methods ------------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Methods',

    setUp: function () {
        this.tree = new Tree({nodes: [
            {label: 'one', children: [{label: 'one-one'}, {label: 'one-two'}, {label: 'one-three'}]},
            {label: 'two'},
            {label: 'three'}
        ]});
    },

    tearDown: function () {
        this.tree.destroy();
        delete this.tree;
    },

    "closeNode() should close the specified node": function () {
        var node = this.tree.children[0];

        this.tree.openNode(node);
        Assert.isTrue(node.isOpen(), 'sanity check');

        this.tree.closeNode(node);
        Assert.isFalse(node.isOpen(), 'node should be closed');
    },

    'closeNode() should be chainable': function () {
        Assert.areSame(this.tree, this.tree.closeNode(this.tree.children[0]));
    },

    'openNode() should open the specified node': function () {
        var node = this.tree.children[0];

        this.tree.closeNode(node);
        Assert.isFalse(node.isOpen(), 'sanity check');

        this.tree.openNode(node);
        Assert.isTrue(node.isOpen(), 'node should be open');
    },

    'openNode() should be chainable': function () {
        Assert.areSame(this.tree, this.tree.openNode(this.tree.children[0]));
    },

    'toggleOpenNode() should open a closed node': function () {
        var node = this.tree.children[0];

        Assert.isFalse(node.isOpen(), 'sanity check');

        this.tree.toggleOpenNode(node);
        Assert.isTrue(node.isOpen(), 'node should be open');
    },

    'toggleOpenNode() should close an open node': function () {
        var node = this.tree.children[0];

        this.tree.openNode(node);
        Assert.isTrue(node.isOpen(), 'sanity check');

        this.tree.toggleOpenNode(node);
        Assert.isFalse(node.isOpen(), 'node should be closed');
    },

    'toggleOpenNode() should be chainable': function () {
        Assert.areSame(this.tree, this.tree.toggleOpenNode(this.tree.children[0]));
    }
}));

// -- Events -------------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Events',

    setUp: function () {
        this.tree = new Tree({nodes: [
            {label: 'one', children: [{label: 'one-one'}, {label: 'one-two'}, {label: 'one-three'}]},
            {label: 'two'},
            {label: 'three'}
        ]});
    },

    tearDown: function () {
        this.tree.destroy();
        delete this.tree;
    },

    'closeNode() should fire a `close` event': function () {
        var node = this.tree.children[0],
            fired;

        this.tree.openNode(node);

        this.tree.once('close', function (e) {
            fired = true;
            Assert.areSame(node, e.node, 'node should be the node being closed');
        });

        this.tree.closeNode(node);
        Assert.isTrue(fired, 'event should fire');
    },

    'closeNode() should not fire a `close` event if options.silent is truthy': function () {
        var node = this.tree.children[0];

        this.tree.openNode(node);

        this.tree.once('close', function () {
            Assert.fail('close event should not fire');
        });

        this.tree.closeNode(node, {silent: true});
    },

    "closeNode() should not fire a `close` event if the specified node can't have children": function () {
        var node = this.tree.children[0];

        this.tree.openNode(node);
        node.canHaveChildren = false;

        this.tree.once('close', function () {
            Assert.fail('close event should not fire');
        });

        this.tree.closeNode(node);
    },

    'closeNode() should not fire a `close` event if the specified node is already closed': function () {
        var node = this.tree.children[0];

        this.tree.closeNode(node);

        this.tree.once('close', function () {
            Assert.fail('close event should not fire');
        });

        this.tree.closeNode(node);
    },

    'closeNode() should pass along a custom `src`': function () {
        var node = this.tree.children[0],
            fired;

        this.tree.openNode(node);

        this.tree.once('close', function (e) {
            fired = true;
            Assert.areSame('foo', e.src, 'src should be set');
        });

        this.tree.closeNode(node, {src: 'foo'});
        Assert.isTrue(fired, 'event should fire');
    },

    'openNode() should fire an `open` event': function () {
        var node = this.tree.children[0],
            fired;

        this.tree.closeNode(node);

        this.tree.once('open', function (e) {
            fired = true;
            Assert.areSame(node, e.node, 'node should be the node being opened');
        });

        this.tree.openNode(node);
        Assert.isTrue(fired, 'event should fire');
    },

    'openNode() should not fire an `open` event if options.silent is truthy': function () {
        var node = this.tree.children[0];

        this.tree.closeNode(node);

        this.tree.once('open', function () {
            Assert.fail('open event should not fire');
        });

        this.tree.openNode(node, {silent: true});
    },

    "openNode() should not fire an `open` event if the specified node can't have children": function () {
        var node = this.tree.children[0];

        this.tree.closeNode(node);
        node.canHaveChildren = false;

        this.tree.once('open', function () {
            Assert.fail('open event should not fire');
        });

        this.tree.openNode(node);
    },

    'openNode() should not fire an `open` event if the specified node is already open': function () {
        var node = this.tree.children[0];

        this.tree.openNode(node);

        this.tree.once('open', function () {
            Assert.fail('event should not fire');
        });

        this.tree.openNode(node);
    },

    'openNode() should pass along a custom `src`': function () {
        var node = this.tree.children[0],
            fired;

        this.tree.closeNode(node);

        this.tree.once('open', function (e) {
            fired = true;
            Assert.areSame('foo', e.src, 'src should be set');
        });

        this.tree.openNode(node, {src: 'foo'});
        Assert.isTrue(fired, 'event should fire');
    },

    'toggleOpenNode() should not fire any events if options.silent is truthy': function () {
        var node = this.tree.children[0];

        this.tree.once('close', function () {
            Assert.fail('close event should not fire');
        });

        this.tree.once('open', function () {
            Assert.fail('open event should not fire');
        });

        this.tree.toggleOpenNode(node, {silent: true});
        this.tree.toggleOpenNode(node, {silent: true});
    },

    'toggleOpenNode() should pass along a custom `src`': function () {
        var node = this.tree.children[0],
            fired;

        this.tree.once('open', function (e) {
            fired = true;
            Assert.areSame('foo', e.src, 'src should be set');
        });

        this.tree.toggleOpenNode(node, {src: 'foo'});
        Assert.isTrue(fired, 'event should fire');
    },

    '`close` event should be preventable': function () {
        var node = this.tree.children[0];

        this.tree.openNode(node);

        this.tree.once('close', function (e) {
            e.preventDefault();
        });

        this.tree.closeNode(node);
        Assert.isTrue(node.isOpen(), 'node should not be closed');
    },

    '`open` event should be preventable': function () {
        var node = this.tree.children[0];

        this.tree.closeNode(node);

        this.tree.once('open', function (e) {
            e.preventDefault();
        });

        this.tree.openNode(node);
        Assert.isFalse(node.isOpen(), 'node should not be open');
    }
}));

// -- Y.Tree.Node --------------------------------------------------------------
var nodeSuite = new Y.Test.Suite('Tree.Node.Selectable');
suite.add(nodeSuite);

// -- Methods ------------------------------------------------------------------
nodeSuite.add(new Y.Test.Case({
    name: 'Methods',

    setUp: function () {
        this.tree = new Tree();
        this.node = this.tree.rootNode.append({label: 'one'});
        this.unattachedNode = this.tree.createNode();
    },

    tearDown: function () {
        this.tree.destroy();

        delete this.tree;
        delete this.node;
        delete this.unattachedNode;
    },

    'close() should wrap Tree#closeNode()': function () {
        var mock    = Mock(),
            options = {};

        Mock.expect(mock, {
            method : 'closeNode',
            args   : [this.node, options],
            run    : Y.bind(this.tree.closeNode, this.tree)
        });

        this.node.tree = mock;
        this.node.close(options);

        Mock.verify(mock);
    },

    'close() should be chainable': function () {
        Assert.areSame(this.node, this.node.close());
    },

    'isOpen() should return `true` if this node is open, `false` otherwise': function () {
        Assert.isFalse(this.node.isOpen(), 'should return false if not open');

        this.node.append({});
        this.node.open();

        Assert.isTrue(this.node.isOpen(), 'should return true if open');
    },

    'isOpen() should always return `true` for a root node': function () {
        Assert.isTrue(this.tree.rootNode.isOpen());
        this.tree.rootNode.close();
        Assert.isTrue(this.tree.rootNode.isOpen());
    },

    'open() should wrap Tree#openNode()': function () {
        var mock    = Mock(),
            options = {};

        Mock.expect(mock, {
            method : 'openNode',
            args   : [this.node, options],
            run    : Y.bind(this.tree.openNode, this.tree)
        });

        this.node.tree = mock;
        this.node.open(options);

        Mock.verify(mock);
    },

    'open() should be chainable': function () {
        Assert.areSame(this.node, this.node.open());
    },

    'toggleOpen() should wrap Tree#toggleOpenNode()': function () {
        var mock    = Mock(),
            options = {};

        Mock.expect(mock, {
            method : 'toggleOpenNode',
            args   : [this.node, options],
            run    : Y.bind(this.tree.toggleOpenNode, this.tree)
        });

        this.node.tree = mock;
        this.node.toggleOpen(options);

        Mock.verify(mock);
    },

    'toggleOpen() should be chainable': function () {
        Assert.areSame(this.node, this.node.toggleOpen());
    }
}));

}, '@VERSION@', {
    requires: ['tree-openable', 'test']
});
