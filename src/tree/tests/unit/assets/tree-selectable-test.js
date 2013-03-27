YUI.add('tree-selectable-test', function (Y) {

var Assert      = Y.Assert,
    ArrayAssert = Y.ArrayAssert,
    Mock        = Y.Mock,
    Tree        = Y.Base.create('testTree', Y.Tree, [Y.Tree.Selectable]),

    suite = Y.TreeSelectableTestSuite = new Y.Test.Suite('Tree.Selectable');

// -- Lifecycle ----------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Lifecycle',

    'destructor should detach all tree events': function () {
        var tree = new Tree();

        Assert.isTrue(tree._selectableEvents.length > 0);
        tree.destroy();
        Assert.isNull(tree._selectableEvents);
    },

    'destructor should free references to allow garbage collection': function () {
        var tree = new Tree();
        tree.destroy();

        Assert.isNull(tree._selectedMap, '_selectedMap should be null');
    }
}));

// -- Properties and Attributes ------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Properties & Attributes',

    setUp: function () {
        this.tree = new Tree({nodes: [
            {id: 'one'},
            {id: 'two'},
            {id: 'three'}
        ]});
    },

    tearDown: function () {
        this.tree.destroy();
        delete this.tree;
    },

    'multiSelect attribute should be false by default': function () {
        Assert.isFalse(this.tree.get('multiSelect'));
    },

    'enabling multiSelect should allow selecting multiple nodes': function () {
        ArrayAssert.isEmpty(this.tree.getSelectedNodes(), 'zero nodes should be selected by default');

        this.tree.children[0].select();
        this.tree.children[1].select();
        Assert.areSame(1, this.tree.getSelectedNodes().length, 'one node should be selected when multiSelect is false');

        this.tree.set('multiSelect', true);
        this.tree.children[0].select();
        this.tree.children[1].select();
        Assert.areSame(2, this.tree.getSelectedNodes().length, 'two nodes should be selected after multiSelect is true');
    },

    'all selected nodes should be unselected when the multiSelect attribute is changed': function () {
        ArrayAssert.isEmpty(this.tree.getSelectedNodes(), 'zero nodes should be selected by default');

        this.tree.children[0].select();
        Assert.areSame(1, this.tree.getSelectedNodes().length, 'one node should be selected');

        this.tree.set('multiSelect', true);
        ArrayAssert.isEmpty(this.tree.getSelectedNodes(), 'zero nodes should be selected after changing multiSelect');
    }
}));

// -- Methods ------------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Methods',

    setUp: function () {
        this.tree = new Tree({nodes: [
            {id: 'one', children: [{id: 'one-one'}, {id: 'one-two'}, {id: 'one-three'}]},
            {id: 'two'},
            {id: 'three'}
        ]});
    },

    tearDown: function () {
        this.tree.destroy();
        delete this.tree;
    },

    'getSelectedNodes() should return an array of selected nodes': function () {
        this.tree.set('multiSelect', true);
        this.tree.children[0].select();
        this.tree.children[0].children[1].select();

        var selected = this.tree.getSelectedNodes();

        Assert.isArray(selected, 'return value should be an array');
        Assert.areSame('one', selected[0].id, 'node "one" should be selected');
        Assert.areSame('one-two', selected[1].id, 'node "one-two" should be selected');
    },

    'selectNode() should select the specified node': function () {
        var node = this.tree.children[0];

        Assert.isFalse(node.isSelected(), 'sanity check');

        this.tree.selectNode(node);
        Assert.isTrue(node.isSelected(), 'node should be selected');
    },

    'selectNode() should be chainable': function () {
        Assert.areSame(this.tree, this.tree.selectNode(this.tree.children[0]));
    },

    'unselect() should unselect all selected nodes in the tree': function () {
        this.tree.set('multiSelect', true);

        this.tree.children[0].select();
        this.tree.children[1].select();
        this.tree.children[0].children[1].select();

        Assert.areSame(3, this.tree.getSelectedNodes().length, 'sanity check');

        this.tree.unselect();
        Assert.areSame(0, this.tree.getSelectedNodes().length, 'zero nodes should be selected');
    },

    'unselect() should be chainable': function () {
        Assert.areSame(this.tree, this.tree.unselect());
    },

    'unselectNode() should unselect the specified node': function () {
        var node = this.tree.children[0];

        this.tree.selectNode(node);
        Assert.isTrue(node.isSelected(), 'sanity check');

        this.tree.unselectNode(node);
        Assert.isFalse(node.isSelected(), 'node should not be selected');
    },

    'unselectNode() should be chainable': function () {
        Assert.areSame(this.tree, this.tree.unselectNode(this.tree.children[0]));
    }
}));

// -- Events -------------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Events',

    setUp: function () {
        this.tree = new Tree({nodes: [
            {id: 'one', children: [{id: 'one-one'}, {id: 'one-two'}, {id: 'one-three'}]},
            {id: 'two'},
            {id: 'three'}
        ]});
    },

    tearDown: function () {
        this.tree.destroy();
        delete this.tree;
    },

    'selectNode() should fire a `select` event': function () {
        var node = this.tree.children[0],
            fired;

        this.tree.once('select', function (e) {
            fired = true;
            Assert.areSame(node, e.node, 'node should be the selected node');
        });

        this.tree.selectNode(node);
        Assert.isTrue(fired, 'event should fire');
    },

    'selectNode() should not fire a `select` event if the specified node is already selected': function () {
        var node = this.tree.children[0];

        this.tree.selectNode(node);

        this.tree.once('select', function (e) {
            Assert.fail('event should not fire');
        });

        this.tree.selectNode(node);
    },

    'selectNode() should not fire a `select` event if options.silent is truthy': function () {
        var node = this.tree.children[0];

        this.tree.once('select', function () {
            Assert.fail('event should not fire');
        });

        this.tree.selectNode(node, {silent: true});
    },

    'selectNode() should pass along a `src`': function () {
        var node = this.tree.children[0],
            fired;

        this.tree.once('select', function (e) {
            fired = true;
            Assert.areSame('foo', e.src, 'src should be set');
        });

        this.tree.selectNode(node, {src: 'foo'});
        Assert.isTrue(fired, 'event should fire');
    },

    'unselectNode() should fire an `unselect` event': function () {
        var node = this.tree.children[0],
            fired;

        this.tree.selectNode(node);

        this.tree.once('unselect', function (e) {
            fired = true;
            Assert.areSame(node, e.node, 'node should be the unselected node');
        });

        this.tree.unselectNode(node);
        Assert.isTrue(fired, 'event should fire');
    },

    'unselectNode() should not fire an `unselect` event if the specified node is not selected': function () {
        var node = this.tree.children[0];

        this.tree.once('unselect', function () {
            Assert.fail('event should not fire');
        });

        this.tree.unselectNode(node);
    },

    'unselectNode() should not fire an `unselect` event if options.silent is truthy': function () {
        var node = this.tree.children[0];

        this.tree.selectNode(node);

        this.tree.once('unselect', function () {
            Assert.fail('event should not fire');
        });

        this.tree.unselectNode(node, {silent: true});
    },

    'unselectNode() should pass along a `src`': function () {
        var node = this.tree.children[0],
            fired;

        this.tree.selectNode(node);

        this.tree.once('unselect', function (e) {
            fired = true;
            Assert.areSame('foo', e.src, 'src should be set');
        });

        this.tree.unselectNode(node, {src: 'foo'});
        Assert.isTrue(fired, 'event should fire');
    },

    '`select` event should be preventable': function () {
        var node = this.tree.children[0];

        this.tree.once('select', function (e) {
            e.preventDefault();
        });

        this.tree.selectNode(node);
        Assert.isFalse(node.isSelected(), 'node should not be selected');
    },

    '`unselect` event should be preventable': function () {
        var node = this.tree.children[0];

        this.tree.selectNode(node);

        this.tree.once('unselect', function (e) {
            e.preventDefault();
        });

        this.tree.unselectNode(node);
        Assert.isTrue(node.isSelected(), 'node should be selected');
    }
}));

// -- Miscellaneous ------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Miscellaneous',

    setUp: function () {
        this.tree = new Tree({nodes: [
            {id: 'one', children: [{id: 'one-one'}, {id: 'one-two'}, {id: 'one-three'}]},
            {id: 'two'},
            {id: 'three'}
        ]});
    },

    tearDown: function () {
        this.tree.destroy();
        delete this.tree;
    },

    'should handle a node being added in a selected state': function () {
        var node = this.tree.createNode({state: {selected: true}});

        this.tree.children[0].select();

        Assert.isTrue(this.tree.children[0].isSelected(), 'sanity');

        this.tree.rootNode.append(node);
        Assert.isFalse(this.tree.children[0].isSelected(), 'first node should no longer be selected');
        Assert.isTrue(node.isSelected(), 'newly appended node should be selected');
    },

    'selection should be cleared when the tree is cleared': function () {
        this.tree.children[0].select();
        Assert.areSame(1, this.tree.getSelectedNodes().length, 'one node should be selected');

        this.tree.clear();
        Assert.areSame(0, this.tree.getSelectedNodes().length, 'zero nodes should be selected');
    },

    'selection should be updated when a selected node is removed from the tree': function () {
        this.tree.children[0].select();
        Assert.areSame(1, this.tree.getSelectedNodes().length, 'one node should be selected');

        this.tree.children[0].remove();
        Assert.areSame(0, this.tree.getSelectedNodes().length, 'zero nodes should be selected');
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
        this.node = this.tree.rootNode.append({id: 'one'});
        this.unattachedNode = this.tree.createNode();
    },

    tearDown: function () {
        this.tree.destroy();

        delete this.tree;
        delete this.node;
        delete this.unattachedNode;
    },

    'isSelected() should return `true` if this node is selected, `false` otherwise': function () {
        Assert.isFalse(this.node.isSelected(), 'should be false if not selected');
        this.node.select();
        Assert.isTrue(this.node.isSelected(), 'should be true if selected');
    },

    'select() should wrap Tree#selectNode()': function () {
        var mock    = Mock(),
            options = {};

        Mock.expect(mock, {
            method : 'selectNode',
            args   : [this.node, options],
            run    : Y.bind(this.tree.selectNode, this.tree)
        });

        this.node.tree = mock;
        this.node.select(options);

        Mock.verify(mock);
    },

    'select() should be chainable': function () {
        Assert.areSame(this.node, this.node.select());
    },

    'unselect() should wrap Tree#unselectNode()': function () {
        var mock    = Mock(),
            options = {};

        Mock.expect(mock, {
            method : 'unselectNode',
            args   : [this.node, options],
            run    : Y.bind(this.tree.unselectNode, this.tree)
        });

        this.node.tree = mock;
        this.node.unselect(options);

        Mock.verify(mock);
    },

    'unselect() should be chainable': function () {
        Assert.areSame(this.node, this.node.unselect());
    }
}));

}, '@VERSION@', {
    requires: ['tree-selectable', 'test']
});
