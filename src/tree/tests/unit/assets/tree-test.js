YUI.add('tree-test', function (Y) {

var Assert      = Y.Assert,
    ArrayAssert = Y.ArrayAssert,
    Mock        = Y.Mock,
    Tree        = Y.Tree,

    mainSuite = Y.TreeTestSuite = new Y.Test.Suite('Tree');

// -- Y.Tree -------------------------------------------------------------------
var treeSuite = new Y.Test.Suite('Tree');
mainSuite.add(treeSuite);

// -- Lifecycle ----------------------------------------------------------------
treeSuite.add(new Y.Test.Case({
    name: 'Lifecycle',

    'constructor should work without a config object': function () {
        var tree = new Tree();

        Assert.isInstanceOf(Tree, tree, 'tree should be an instance of Tree');
        Assert.isInstanceOf(Tree.Node, tree.rootNode, 'rootNode should be an instance of Tree.Node');
        Assert.isTrue(tree.rootNode.canHaveChildren, 'rootNode.canHaveChildren should be true');
        Assert.areSame(0, tree.rootNode.children.length, 'rootNode should have zero children');
    },

    'constructor: `nodes` config property should support an array of node configs to add to the tree': function () {
        var tree = new Tree({
                nodes: [
                    {label: 'one'},
                    {label: 'two'},
                    {label: 'three'}
                ]
            });

        Assert.areSame(3, tree.rootNode.children.length, 'rootNode should have three children');
        Assert.areSame('one', tree.rootNode.children[0].label, 'node one should be added');
        Assert.areSame('two', tree.rootNode.children[1].label, 'node two should be added');
        Assert.areSame('three', tree.rootNode.children[2].label, 'node three should be added');
    },

    'constructor: `nodes` config property should support an array of TreeNode.Node instances to add to the tree': function () {
        var treeA = new Tree({
                nodes: [
                    {label: 'one'},
                    {label: 'two'},
                    {label: 'three'}
                ]
            }),

            treeB = new Tree({
                nodes: treeA.rootNode.children
            });

        Assert.areSame(3, treeB.rootNode.children.length, 'rootNode should have three children');
        Assert.areSame('one', treeB.rootNode.children[0].label, 'node one should be added');
        Assert.areSame('two', treeB.rootNode.children[1].label, 'node two should be added');
        Assert.areSame('three', treeB.rootNode.children[2].label, 'node three should be added');
    },

    'constructor: `rootNode` config property should support a custom root node config': function () {
        var tree = new Tree({rootNode: {label: 'hi!'}});

        Assert.isInstanceOf(Tree.Node, tree.rootNode, 'rootNode should be an instance of Tree.Node');
        Assert.areSame('hi!', tree.rootNode.label, 'rootNode should have the custom label specified');
    },

    'constructor: `rootNode` config property should support a custom Tree.Node instance': function () {
        var treeA = new Tree(),
            node  = treeA.createNode({label: 'hi!'}),
            treeB = new Tree({rootNode: node});

        Assert.areSame(node, treeB.rootNode, 'rootNode should be the specified node');
        Assert.areSame('hi!', treeB.rootNode.label, 'rootNode should have the custom label specified');
        Assert.areSame(treeB, treeB.rootNode.tree, 'rootNode should have the correct tree reference');
    },

    'constructor: should allow both `nodes` and `rootNode` to be specified': function () {
        var tree = new Tree({
                nodes   : [{label: 'one'}, {label: 'two'}, {label: 'three'}],
                rootNode: {label: 'hi!'}
            });

        Assert.areSame('hi!', tree.rootNode.label, 'rootNode should have the custom label specified');
        Assert.areSame(3, tree.rootNode.children.length, 'rootNode should have three children');
        Assert.areSame('one', tree.rootNode.children[0].label, 'node one should be added');
        Assert.areSame('two', tree.rootNode.children[1].label, 'node two should be added');
        Assert.areSame('three', tree.rootNode.children[2].label, 'node three should be added');
    },

    'destructor should destroy the root node': function () {
        var tree = new Tree();
        tree.destroy();

        Assert.isUndefined(tree.rootNode, 'rootNode should be undefined');
    },

    'destructor should detach all tree events': function () {
        var tree = new Tree();

        Assert.isTrue(tree._treeEvents.length > 0);
        tree.destroy();
        Assert.areSame(0, tree._treeEvents.length);
    },

    'destructor should free references to allow garbage collection': function () {
        var tree = new Tree();
        tree.destroy();

        Assert.isUndefined(tree.rootNode, 'rootNode should be undefined');
        Assert.isUndefined(tree._nodeMap, '_nodeMap should be undefined');
        Assert.isUndefined(tree._published, '_published should be undefined');
        Assert.isUndefined(tree._selectedMap, '_selectedMap should be undefined');
    }
}));

// -- Properties and Attributes ------------------------------------------------
treeSuite.add(new Y.Test.Case({
    name: 'Properties & Attributes',

    setUp: function () {
        this.tree = new Tree({nodes: [
            {label: 'one'},
            {label: 'two'},
            {label: 'three'}
        ]});
    },

    tearDown: function () {
        this.tree.destroy();
        delete this.tree;
    },

    '_isYUITree should be true': function () {
        Assert.isTrue(this.tree._isYUITree);
    },

    'multiSelect attribute should be false by default': function () {
        Assert.isFalse(this.tree.get('multiSelect'));
    },

    'multiSelect property should mirror the multiSelect attribute for faster lookups': function () {
        Assert.isUndefined(this.tree.multiSelect, 'multiSelect property should be undefined by default');
        this.tree.set('multiSelect', true);
        Assert.isTrue(this.tree.multiSelect, 'multiSelect property should get updated');
    },

    'enabling multiSelect should allow selecting multiple nodes': function () {
        ArrayAssert.isEmpty(this.tree.getSelectedNodes(), 'zero nodes should be selected by default');

        this.tree.rootNode.children[0].select();
        this.tree.rootNode.children[1].select();
        Assert.areSame(1, this.tree.getSelectedNodes().length, 'one node should be selected when multiSelect is false');

        this.tree.set('multiSelect', true);
        this.tree.rootNode.children[0].select();
        this.tree.rootNode.children[1].select();
        Assert.areSame(2, this.tree.getSelectedNodes().length, 'two nodes should be selected after multiSelect is true');
    },

    'all selected nodes should be unselected when the multiSelect attribute is changed': function () {
        ArrayAssert.isEmpty(this.tree.getSelectedNodes(), 'zero nodes should be selected by default');

        this.tree.rootNode.children[0].select();
        Assert.areSame(1, this.tree.getSelectedNodes().length, 'one node should be selected');

        this.tree.set('multiSelect', true);
        ArrayAssert.isEmpty(this.tree.getSelectedNodes(), 'zero nodes should be selected after changing multiSelect');
    },

    'nodeClass property should allow the use of a custom node class': function () {
        var MyNode = Y.Base.create('myNode', Tree.Node, [], {
            _isMyNode: true
        });

        this.tree.nodeClass = MyNode;

        var node = this.tree.createNode({label: 'foo'});

        Assert.isTrue(node._isMyNode);
    },

    'nodeClass property should allow specifying a class as a string before init': function () {
        var MyTree = Y.Base.create('myTree', Tree, [], {
            nodeClass: 'Foo.Bar.MyNode'
        });

        Y.namespace('Foo.Bar').MyNode = Y.Base.create('myNode', Tree.Node, [], {
            _isMyNode: true
        });

        var tree = new MyTree();
        var node = tree.createNode({label: 'foo'});

        Assert.isTrue(node._isMyNode);
    },

    'rootNode attribute should be an alias for the rootNode property': function () {
        Assert.areSame(this.tree.rootNode, this.tree.get('rootNode'));
    },

    'rootNode attribute should be read-only': function () {
        var rootNode = this.tree.rootNode;

        this.tree.set('rootNode', this.tree.createNode());
        Assert.areSame(rootNode, this.tree.get('rootNode'));
    }
}));

// -- Methods ------------------------------------------------------------------
treeSuite.add(new Y.Test.Case({
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

    'appendNode() should append a node to the end of the specified parent node': function () {
        var parent = this.tree.rootNode,
            node   = this.tree.appendNode(parent, {label: 'appended'});

        Assert.isInstanceOf(Tree.Node, node, 'return value should be the appended node');
        Assert.areSame(node, parent.children[parent.children.length - 1], 'node should be the last child of the parent');
        Assert.areSame(parent, node.parent, "node's parent property should be set correctly");
    },

    'appendNode() should append an array of nodes to the end of the specified parent node': function () {
        var parent = this.tree.rootNode,
            nodes  = this.tree.appendNode(parent, [
                {label: 'appended one'},
                {label: 'appended two'},
                this.tree.createNode({label: 'appended three'})
            ]);

        Assert.isArray(nodes, 'return value should be an array');
        Assert.areSame(nodes[0], parent.children[parent.children.length - 3], 'first appended node should be third from the end');
        Assert.areSame(nodes[1], parent.children[parent.children.length - 2], 'second appended node should be second from the end');
        Assert.areSame(nodes[2], parent.children[parent.children.length - 1], 'third appended node should be last');
    },

    'appendNode() should adopt a node if it exists in another tree': function () {
        var otherTree = new Tree({nodes: [{label: 'adopted node'}]}),
            node      = otherTree.rootNode.children[0];

        this.tree.appendNode(this.tree.rootNode, node);

        ArrayAssert.isEmpty(otherTree.rootNode.children, 'node should no longer exist in the original tree');
        Assert.areSame(node, this.tree.rootNode.children[this.tree.rootNode.children.length - 1], 'node should now be in the new tree');
        Assert.areSame(this.tree, node.tree, "node's tree reference should point to the new tree");
    },

    'clear() should destroy the root node and create a new one': function () {
        var oldRoot = this.tree.rootNode;

        ArrayAssert.isNotEmpty(this.tree.rootNode.children, 'sanity check');

        this.tree.clear();

        Assert.areNotSame(oldRoot, this.tree.rootNode, 'tree should have a new root node');
        ArrayAssert.isEmpty(this.tree.rootNode.children, 'new root node should not have any children');
        Assert.isTrue(oldRoot.state.destroyed, 'old root node should be destroyed');
    },

    'clear() should support a custom root node argument': function () {
        this.tree.clear({label: 'new root'});
        Assert.areSame('new root', this.tree.rootNode.label);
    },

    'clear() should be chainable': function () {
        Assert.areSame(this.tree, this.tree.clear());
    },

    "closeNode() should close the specified node": function () {
        var node = this.tree.rootNode.children[0];

        this.tree.openNode(node);
        Assert.isTrue(node.isOpen(), 'sanity check');

        this.tree.closeNode(node);
        Assert.isFalse(node.isOpen(), 'node should be closed');
    },

    'closeNode() should be chainable': function () {
        Assert.areSame(this.tree, this.tree.closeNode(this.tree.rootNode.children[0]));
    },

    'createNode() should create a node and associate it with this tree': function () {
        var node = this.tree.createNode({
                label: 'new node',

                children: [
                    {label: 'one', children: [{label: 'one-one'}]},
                    {label: 'two'},
                    {label: 'three'}
                ]
            });

        Assert.isInstanceOf(Tree.Node, node, 'node should be a Tree.Node instance');

        Assert.areSame('new node', node.label, 'node should have the specified label');
        Assert.areSame(3, node.children.length, 'node should have three children');
        Assert.areSame(this.tree, node.tree, 'node should be associated with this tree');
        Assert.areSame(node, this.tree.getNodeById(node.id), "node should be in this tree's id map");

        Assert.isInstanceOf(Tree.Node, node.children[0], 'child one should be a Tree.Node instance');
        Assert.isInstanceOf(Tree.Node, node.children[1], 'child two should be a Tree.Node instance');
        Assert.isInstanceOf(Tree.Node, node.children[2], 'child three should be a Tree.Node instance');
        Assert.isInstanceOf(Tree.Node, node.children[0].children[0], "child one's child should be a Tree.Node instance");
    },

    "createNode() should adopt the specified node if it's from another tree": function () {
        var otherTree = new Tree({nodes: [{label: 'other node'}]}),
            node      = otherTree.rootNode.children[0];

        Assert.areSame(otherTree, node.tree, 'sanity check');
        Assert.areSame(node, otherTree.rootNode.children[0], 'sanity check');

        this.tree.createNode(node);

        Assert.areSame(this.tree, node.tree, 'node should be moved into this tree');
        ArrayAssert.isEmpty(otherTree.rootNode.children, 'node should no longer be in its original tree');
        Assert.isUndefined(otherTree.getNodeById(node.id), 'node should no longer be associated with its original tree');
        Assert.areSame(node, this.tree.getNodeById(node.id), 'node should be associated with this tree');
    },

    'destroyNode() should destroy the specified node': function () {
        var node = this.tree.rootNode.children[0];

        this.tree.destroyNode(node);

        Assert.isUndefined(node.children, 'node.children should be deleted');
        Assert.isUndefined(node.data, 'node.data should be deleted');
        Assert.isUndefined(node.parent, 'node.parent should be deleted');
        Assert.isUndefined(node.tree, 'node.tree should be deleted');
        Assert.isUndefined(node._htmlNode, 'node._htmlNode should be deleted');
        Assert.isUndefined(node._indexMap, 'node._indexMap should be deleted');

        Assert.isUndefined(this.tree.getNodeById(node.id), 'node should be removed from the id map');

        Assert.isTrue(node.state.destroyed, 'node.state.destroyed should be true');
    },

    'destroyNode() should be chainable': function () {
        Assert.areSame(this.tree, this.tree.destroyNode(this.tree.rootNode.children[0]));
    },

    'emptyNode() should remove all children from the given node and return them': function () {
        var nodes = this.tree.emptyNode(this.tree.rootNode);

        Assert.isArray(nodes, 'should return an array');

        Assert.areSame('one', nodes[0].label, 'first removed node should match');
        Assert.areSame('two', nodes[1].label, 'second removed node should match');
        Assert.areSame('three', nodes[2].label, 'third removed node should match');

        ArrayAssert.isEmpty(this.tree.rootNode.children, 'root node should now be empty');

        Assert.isUndefined(nodes[0].state.destroyed, 'first node should not be destroyed');
        Assert.isUndefined(nodes[1].state.destroyed, 'second node should not be destroyed');
        Assert.isUndefined(nodes[2].state.destroyed, 'third node should not be destroyed');
    },

    'emptyNode() should destroy children if options.destroy is truthy': function () {
        var nodes = this.tree.emptyNode(this.tree.rootNode, {destroy: true});

        Assert.isTrue(nodes[0].state.destroyed, 'first node should be destroyed');
        Assert.isTrue(nodes[1].state.destroyed, 'second node should be destroyed');
        Assert.isTrue(nodes[2].state.destroyed, 'third node should be destroyed');
    },

    'getNodeById() should return the node with the given id': function () {
        var node = this.tree.rootNode.children[0];
        Assert.areSame(node, this.tree.getNodeById(node.id));
    },

    'getNodeById() should return `undefined` if the given id is not found': function () {
        Assert.isUndefined(this.tree.getNodeById('bogus'));
    },

    'getSelectedNodes() should return an array of selected nodes': function () {
        this.tree.set('multiSelect', true);
        this.tree.rootNode.children[0].select();
        this.tree.rootNode.children[0].children[1].select();

        var selected = this.tree.getSelectedNodes();

        Assert.isArray(selected, 'return value should be an array');
        Assert.areSame('one', selected[0].label, 'node "one" should be selected');
        Assert.areSame('one-two', selected[1].label, 'node "one-two" should be selected');
    },

    'insertNode() should insert a node at the specified index': function () {
        var node = this.tree.insertNode(this.tree.rootNode, {label: 'inserted'}, {index: 1});

        Assert.isInstanceOf(Tree.Node, node, 'return value should be a Tree.Node instance');
        Assert.areSame('inserted', node.label, 'inserted node should be returned');
        Assert.areSame('one', this.tree.rootNode.children[0].label, '"one" should be at index 0');
        Assert.areSame('inserted', this.tree.rootNode.children[1].label, '"inserted" should be at index 1');
        Assert.areSame('two', this.tree.rootNode.children[2].label, '"two" should be at index 2');
    },

    'insertNode() should insert an array of nodes at the specified index': function () {
        var nodes = this.tree.insertNode(this.tree.rootNode, [
                {label: 'inserted one'},
                {label: 'inserted two'},
                this.tree.createNode({label: 'inserted three'})
            ], {index: 1});

        Assert.isArray(nodes, 'return value should be an array');
        Assert.areSame('one', this.tree.rootNode.children[0].label, '"one" should be at index 0');
        Assert.areSame('inserted one', this.tree.rootNode.children[1].label, '"inserted one" should be at index 1');
        Assert.areSame('inserted two', this.tree.rootNode.children[2].label, '"inserted two" should be at index 2');
        Assert.areSame('inserted three', this.tree.rootNode.children[3].label, '"inserted three" should be at index 3');
        Assert.areSame('two', this.tree.rootNode.children[4].label, '"two" should be at index 4');
    },

    'insertNode() should append if no index is specified': function () {
        this.tree.insertNode(this.tree.rootNode, {label: 'inserted'});
        Assert.areSame('inserted', this.tree.rootNode.children[this.tree.rootNode.children.length - 1].label);
    },

    'insertNode() should adopt a node if it exists in another tree': function () {
        var otherTree = new Tree({nodes: [{label: 'adopted'}]}),
            node      = otherTree.rootNode.children[0];

        this.tree.insertNode(this.tree.rootNode, node);

        ArrayAssert.isEmpty(otherTree.rootNode.children, 'node should no longer exist in the original tree');
        Assert.areSame(node, this.tree.rootNode.children[this.tree.rootNode.children.length - 1], 'node should now be in the new tree');
        Assert.areSame(this.tree, node.tree, "node's tree reference should point to the new tree");
    },

    'openNode() should open the specified node': function () {
        var node = this.tree.rootNode.children[0];

        this.tree.closeNode(node);
        Assert.isFalse(node.isOpen(), 'sanity check');

        this.tree.openNode(node);
        Assert.isTrue(node.isOpen(), 'node should be open');
    },

    'openNode() should be chainable': function () {
        Assert.areSame(this.tree, this.tree.openNode(this.tree.rootNode.children[0]));
    },

    'prependNode() should prepend a node to the beginning of the specified parent node': function () {
        var parent = this.tree.rootNode,
            node   = this.tree.prependNode(parent, {label: 'prepended'});

        Assert.isInstanceOf(Tree.Node, node, 'return value should be the prepended node');
        Assert.areSame(node, parent.children[0], 'node should be the first child of the parent');
        Assert.areSame(parent, node.parent, "node's parent property should be set correctly");
    },

    'prependNode() should prepend an array of nodes to the beginning of the specified parent node': function () {
        var parent = this.tree.rootNode,
            nodes  = this.tree.prependNode(parent, [
                {label: 'prepended one'},
                {label: 'prepended two'},
                this.tree.createNode({label: 'prepended three'})
            ]);

        Assert.isArray(nodes, 'return value should be an array');
        Assert.areSame(nodes[0], parent.children[0], 'first prepended node should be at index 0');
        Assert.areSame(nodes[1], parent.children[1], 'second prepended node should be at index 1');
        Assert.areSame(nodes[2], parent.children[2], 'third prepended node should be at index 2');
    },

    'prependNode() should adopt a node if it exists in another tree': function () {
        var otherTree = new Tree({nodes: [{label: 'adopted node'}]}),
            node      = otherTree.rootNode.children[0];

        this.tree.prependNode(this.tree.rootNode, node);

        ArrayAssert.isEmpty(otherTree.rootNode.children, 'node should no longer exist in the original tree');
        Assert.areSame(node, this.tree.rootNode.children[0], 'node should now be in the new tree');
        Assert.areSame(this.tree, node.tree, "node's tree reference should point to the new tree");
    },

    'removeNode() should remove the specified node from its parent': function () {
        var node = this.tree.prependNode(this.tree.rootNode, {label: 'remove me!'});

        Assert.isTrue(node.isInTree(), 'sanity check');
        Assert.areSame(this.tree.rootNode, node.parent, 'sanity check');

        var removed = this.tree.removeNode(node);

        Assert.areSame(node, removed, 'removed node should be returned');
        Assert.isFalse(node.isInTree(), 'node should no longer be in the tree');
        Assert.isUndefined(node.parent, 'node should no longer have a parent');
        Assert.areNotSame(node, this.tree.rootNode.children[0], 'node should no longer be a child of the root node');
        Assert.isUndefined(node.state.destroyed, 'node should not be destroyed');
    },

    'removeNode() should remove and destroy the specified node when options.destroy is truthy': function () {
        var node = this.tree.prependNode(this.tree.rootNode, {label: 'remove me!'});

        Assert.isTrue(node.isInTree(), 'sanity check');
        Assert.areSame(this.tree.rootNode, node.parent, 'sanity check');

        this.tree.removeNode(node, {destroy: true});
        Assert.isTrue(node.state.destroyed, 'node should be destroyed');
    },

    'selectNode() should select the specified node': function () {
        var node = this.tree.rootNode.children[0];

        Assert.isFalse(node.isSelected(), 'sanity check');

        this.tree.selectNode(node);
        Assert.isTrue(node.isSelected(), 'node should be selected');
    },

    'selectNode() should be chainable': function () {
        Assert.areSame(this.tree, this.tree.selectNode(this.tree.rootNode.children[0]));
    },

    'size() should return the total number of nodes in the tree': function () {
        Assert.areSame(6, this.tree.size());
    },

    'toggleNode() should open a closed node': function () {
        var node = this.tree.rootNode.children[0];

        Assert.isFalse(node.isOpen(), 'sanity check');

        this.tree.toggleNode(node);
        Assert.isTrue(node.isOpen(), 'node should be open');
    },

    'toggleNode() should close an open node': function () {
        var node = this.tree.rootNode.children[0];

        this.tree.openNode(node);
        Assert.isTrue(node.isOpen(), 'sanity check');

        this.tree.toggleNode(node);
        Assert.isFalse(node.isOpen(), 'node should be closed');
    },

    'toggleNode() should be chainable': function () {
        Assert.areSame(this.tree, this.tree.toggleNode(this.tree.rootNode.children[0]));
    },

    'toJSON() should return a serializable object representing the tree': function () {
        var obj = this.tree.toJSON();

        // Basic checks.
        Assert.isObject(obj, 'should be an object');
        Assert.isString(Y.JSON.stringify(obj), 'should be serializable (no cyclic structures, etc.)');

        // Now the tedious stuff.
        function verifyNode(node, jsonObj) {
            Assert.areSame(node.canHaveChildren, jsonObj.canHaveChildren, node.label + ': canHaveChildren should be serialized');
            Assert.isObject(jsonObj.data, node.label + ': data should be serialized');
            Assert.areSame(node.id, jsonObj.id, node.label + ': id should be serialized');
            Assert.areSame(node.label, jsonObj.label, node.label + ': label should be serialized');
            Assert.isObject(jsonObj.state, node.label + ': state should be serialized');

            if (node.hasChildren()) {
                Assert.isArray(jsonObj.children, node.label + ': children should be an array');

                for (var i = 0, len = node.children.length; i < len; i++) {
                    verifyNode(node.children[i], jsonObj.children[i]);
                }
            } else {
                Assert.isUndefined(jsonObj.children, node.label + ': children should not be defined for node without children');
            }
        }

        verifyNode(this.tree.rootNode, obj);
    },

    'unselect() should unselect all selected nodes in the tree': function () {
        this.tree.set('multiSelect', true);

        this.tree.rootNode.children[0].select();
        this.tree.rootNode.children[1].select();
        this.tree.rootNode.children[0].children[1].select();

        Assert.areSame(3, this.tree.getSelectedNodes().length, 'sanity check');

        this.tree.unselect();
        Assert.areSame(0, this.tree.getSelectedNodes().length, 'zero nodes should be selected');
    },

    'unselect() should be chainable': function () {
        Assert.areSame(this.tree, this.tree.unselect());
    },

    'unselectNode() should unselect the specified node': function () {
        var node = this.tree.rootNode.children[0];

        this.tree.selectNode(node);
        Assert.isTrue(node.isSelected(), 'sanity check');

        this.tree.unselectNode(node);
        Assert.isFalse(node.isSelected(), 'node should not be selected');
    },

    'unselectNode() should be chainable': function () {
        Assert.areSame(this.tree, this.tree.unselectNode(this.tree.rootNode.children[0]));
    }
}));

// -- Events -------------------------------------------------------------------
treeSuite.add(new Y.Test.Case({
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

    'appendNode() should fire an `add` event with src "append"': function () {
        var node = this.tree.createNode({label: 'appended'}),
            test = this,
            fired;

        this.tree.once('add', function (e) {
            fired = true;

            Assert.areSame('append', e.src, 'src should be "append"');
            Assert.areSame(3, e.index, 'index should be 3');
            Assert.areSame(node, e.node, 'node should be the added node');
            Assert.areSame(test.tree.rootNode, e.parent, 'parent should be the root node');
        });

        this.tree.appendNode(this.tree.rootNode, node);
        Assert.isTrue(fired, 'event should fire');
    },

    'appendNode() should not fire an `add` event if options.silent is truthy': function () {
        this.tree.once('add', function () {
            Assert.fail('add event should not fire');
        });

        this.tree.appendNode(this.tree.rootNode, {label: 'appended'}, {silent: true});
    },

    'clear() should fire a `clear` event': function () {
        var fired;

        this.tree.once('clear', function (e) {
            fired = true;
            Assert.isInstanceOf(Tree.Node, e.rootNode, 'rootNode should be a Tree.Node instance');
        });

        this.tree.clear();
        Assert.isTrue(fired, 'event should fire');
    },

    'clear() should not fire a `clear` event if options.silent is truthy': function () {
        this.tree.once('clear', function () {
            Assert.fail('clear event should not fire');
        });

        this.tree.clear(null, {silent: true});
    },

    'closeNode() should fire a `close` event': function () {
        var node = this.tree.rootNode.children[0],
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
        var node = this.tree.rootNode.children[0];

        this.tree.openNode(node);

        this.tree.once('close', function () {
            Assert.fail('close event should not fire');
        });

        this.tree.closeNode(node, {silent: true});
    },

    "closeNode() should not fire a `close` event if the specified node can't have children": function () {
        var node = this.tree.rootNode.children[0];

        this.tree.openNode(node);
        node.canHaveChildren = false;

        this.tree.once('close', function () {
            Assert.fail('close event should not fire');
        });

        this.tree.closeNode(node);
    },

    'closeNode() should not fire a `close` event if the specified node is already closed': function () {
        var node = this.tree.rootNode.children[0];

        this.tree.closeNode(node);

        this.tree.once('close', function () {
            Assert.fail('close event should not fire');
        });

        this.tree.closeNode(node);
    },

    'destroyNode() should fire a `remove` event': function () {
        var node = this.tree.rootNode.children[0],
            fired;

        this.tree.once('remove', function () {
            fired = true;
        });

        this.tree.destroyNode(node);
        Assert.isTrue(fired, 'event should fire');
    },

    'destroyNode() should not fire a `remove` event if options.silent is truthy': function () {
        var node = this.tree.rootNode.children[0];

        this.tree.once('remove', function () {
            Assert.fail('event should not fire');
        });

        this.tree.destroyNode(node, {silent: true});
    },

    'openNode() should fire an `open` event': function () {
        var node = this.tree.rootNode.children[0],
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
        var node = this.tree.rootNode.children[0];

        this.tree.closeNode(node);

        this.tree.once('open', function () {
            Assert.fail('open event should not fire');
        });

        this.tree.openNode(node, {silent: true});
    },

    "openNode() should not fire an `open` event if the specified node can't have children": function () {
        var node = this.tree.rootNode.children[0];

        this.tree.closeNode(node);
        node.canHaveChildren = false;

        this.tree.once('open', function () {
            Assert.fail('open event should not fire');
        });

        this.tree.openNode(node);
    },

    'openNode() should not fire an `open` event if the specified node is already open': function () {
        var node = this.tree.rootNode.children[0];

        this.tree.openNode(node);

        this.tree.once('open', function () {
            Assert.fail('event should not fire');
        });

        this.tree.openNode(node);
    },

    'prependNode() should fire an `add` event with src "prepend"': function () {
        var node = this.tree.createNode({label: 'prepended'}),
            test = this,
            fired;

        this.tree.once('add', function (e) {
            fired = true;

            Assert.areSame('prepend', e.src, 'src should be "prepend"');
            Assert.areSame(0, e.index, 'index should be 0');
            Assert.areSame(node, e.node, 'node should be the added node');
            Assert.areSame(test.tree.rootNode, e.parent, 'parent should be the root node');
        });

        this.tree.prependNode(this.tree.rootNode, node);
        Assert.isTrue(fired, 'event should fire');
    },

    'prependNode() should not fire an `add` event if options.silent is truthy': function () {
        this.tree.once('add', function () {
            Assert.fail('add event should not fire');
        });

        this.tree.prependNode(this.tree.rootNode, {label: 'prepended'}, {silent: true});
    },

    'insertNode() should fire an `add` event with src "insert"': function () {
        var node = this.tree.createNode({label: 'inserted'}),
            test = this,
            fired;

        this.tree.once('add', function (e) {
            fired = true;

            Assert.areSame('insert', e.src, 'src should be "insert"');
            Assert.areSame(3, e.index, 'index should be 0');
            Assert.areSame(node, e.node, 'node should be the added node');
            Assert.areSame(test.tree.rootNode, e.parent, 'parent should be the root node');
        });

        this.tree.insertNode(this.tree.rootNode, node);
        Assert.isTrue(fired, 'event should fire');
    },

    'insertNode() should fire an `add` event with a custom src': function () {
        var node = this.tree.createNode({label: 'inserted'}),
            test = this,
            fired;

        this.tree.once('add', function (e) {
            fired = true;
            Assert.areSame('kittens', e.src, 'src should be "kittens"');
        });

        this.tree.insertNode(this.tree.rootNode, node, {src: 'kittens'});
        Assert.isTrue(fired, 'event should fire');
    },

    'insertNode() should not fire an `add` event if options.silent is truthy': function () {
        this.tree.once('add', function () {
            Assert.fail('add event should not fire');
        });

        this.tree.insertNode(this.tree.rootNode, {label: 'inserted'}, {silent: true});
    },

    'removeNode() should fire a `remove` event': function () {
        var node = this.tree.rootNode.children[1],
            test = this,
            fired;

        this.tree.once('remove', function (e) {
            fired = true;

            Assert.isUndefined(e.destroyed, 'destroyed should be undefined');
            Assert.areSame(node, e.node, 'node should be the removed node');
            Assert.areSame(test.tree.rootNode, e.parent, 'parent should be the parent of the removed node');
        });

        this.tree.removeNode(node);
        Assert.isTrue(fired, 'event should fire');
    },

    'removeNode() should not fire a `remove` event if options.silent is truthy': function () {
        this.tree.once('remove', function () {
            Assert.fail('event should not fire');
        });

        this.tree.removeNode(this.tree.rootNode.children[1], {silent: true});
    },

    'selectNode() should fire a `select` event': function () {
        var node = this.tree.rootNode.children[0],
            fired;

        this.tree.once('select', function (e) {
            fired = true;
            Assert.areSame(node, e.node, 'node should be the selected node');
        });

        this.tree.selectNode(node);
        Assert.isTrue(fired, 'event should fire');
    },

    'selectNode() should not fire a `select` event if the specified node is already selected': function () {
        var node = this.tree.rootNode.children[0];

        this.tree.selectNode(node);

        this.tree.once('select', function (e) {
            Assert.fail('event should not fire');
        });

        this.tree.selectNode(node);
    },

    'selectNode() should not fire a `select` event if options.silent is truthy': function () {
        var node = this.tree.rootNode.children[0];

        this.tree.once('select', function () {
            Assert.fail('event should not fire');
        });

        this.tree.selectNode(node, {silent: true});
    },

    'toggleNode() should not fire any events if options.silent is truthy': function () {
        var node = this.tree.rootNode.children[0];

        this.tree.once('close', function () {
            Assert.fail('close event should not fire');
        });

        this.tree.once('open', function () {
            Assert.fail('open event should not fire');
        });

        this.tree.toggleNode(node, {silent: true});
        this.tree.toggleNode(node, {silent: true});
    },

    'unselectNode() should fire an `unselect` event': function () {
        var node = this.tree.rootNode.children[0],
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
        var node = this.tree.rootNode.children[0];

        this.tree.once('unselect', function () {
            Assert.fail('event should not fire');
        });

        this.tree.unselectNode(node);
    },

    'unselectNode() should not fire an `unselect` event if options.silent is truthy': function () {
        var node = this.tree.rootNode.children[0];

        this.tree.selectNode(node);

        this.tree.once('unselect', function () {
            Assert.fail('event should not fire');
        });

        this.tree.unselectNode(node, {silent: true});
    },

    '`add` event should be preventable': function () {
        this.tree.once('add', function (e) {
            e.preventDefault();
        });

        this.tree.insertNode(this.tree.rootNode, {label: 'added'});
        Assert.areSame(6, this.tree.size(), 'node should not have been added');
    },

    '`clear` event should be preventable': function () {
        this.tree.once('clear', function (e) {
            e.preventDefault();
        });

        this.tree.clear();
        Assert.areSame(6, this.tree.size(), 'tree should not have been cleared');
    },

    '`close` event should be preventable': function () {
        var node = this.tree.rootNode.children[0];

        this.tree.openNode(node);

        this.tree.once('close', function (e) {
            e.preventDefault();
        });

        this.tree.closeNode(node);
        Assert.isTrue(node.isOpen(), 'node should not be closed');
    },

    '`open` event should be preventable': function () {
        var node = this.tree.rootNode.children[0];

        this.tree.closeNode(node);

        this.tree.once('open', function (e) {
            e.preventDefault();
        });

        this.tree.openNode(node);
        Assert.isFalse(node.isOpen(), 'node should not be open');
    },

    '`remove` event should be preventable': function () {
        this.tree.once('remove', function (e) {
            e.preventDefault();
        });

        this.tree.removeNode(this.tree.rootNode.children[0]);
        Assert.areSame(6, this.tree.size(), 'node should not have been removed');
    },

    '`select` event should be preventable': function () {
        var node = this.tree.rootNode.children[0];

        this.tree.once('select', function (e) {
            e.preventDefault();
        });

        this.tree.selectNode(node);
        Assert.isFalse(node.isSelected(), 'node should not be selected');
    },

    '`unselect` event should be preventable': function () {
        var node = this.tree.rootNode.children[0];

        this.tree.selectNode(node);

        this.tree.once('unselect', function (e) {
            e.preventDefault();
        });

        this.tree.unselectNode(node);
        Assert.isTrue(node.isSelected(), 'node should be selected');
    }
}));

// -- Y.Tree.Node --------------------------------------------------------------
var nodeSuite = new Y.Test.Suite('Tree.Node');
mainSuite.add(nodeSuite);

// -- Lifecycle ----------------------------------------------------------------
nodeSuite.add(new Y.Test.Case({
    name: 'Lifecycle',

    setUp: function () {
        this.tree = new Tree();
    },

    tearDown: function () {
        this.tree.destroy();
        delete this.tree;
    },

    'constructor should accept a Tree instance as the first argument': function () {
        var node = new Tree.Node(this.tree);
        Assert.areSame(this.tree, node.tree);
    },

    'constructor should accept a config object as the second argument': function () {
        var child = new Tree.Node(this.tree),

            node = new Tree.Node(this.tree, {
                canHaveChildren: true,
                children       : [child],
                data           : {foo: 'bar'},
                id             : 'mynode',
                label          : 'pants',
                state          : {tested: true}
            });

        Assert.isTrue(node.canHaveChildren, 'canHaveChildren should be true');
        Assert.areSame(child, node.children[0], 'child 0 should exist');
        Assert.areSame('bar', node.data.foo, 'data should be set');
        Assert.areSame('mynode', node.id, 'custom id should be set');
        Assert.areSame('pants', node.label, 'custom label should be set');
        Assert.isTrue(node.state.tested, 'custom state should be set');
    }
}));

// -- Properties ---------------------------------------------------------------
nodeSuite.add(new Y.Test.Case({
    name: 'Properties',

    setUp: function () {
        this.tree = new Tree();
        this.node = this.tree.createNode();
    },

    tearDown: function () {
        this.tree.destroy();
        delete this.tree;
        delete this.node;
    },

    '_isYUITreeNode should be true': function () {
        Assert.isTrue(this.node._isYUITreeNode);
    },

    'canHaveChildren should be undefined by default': function () {
        Assert.isUndefined(this.node.canHaveChildren);
    },

    'canHaveChildren should be true if children are added at instantiation': function () {
        var node = this.tree.createNode({children: [{}]});
        Assert.isTrue(node.canHaveChildren);
    },

    'children should be an empty array by default': function () {
        Assert.isArray(this.node.children, 'should be an array');
        ArrayAssert.isEmpty(this.node.children, 'should be empty');
    },

    'data should be an empty object by default': function () {
        Assert.isObject(this.node.data, 'should be an object');
        Assert.areSame(0, Y.Object.size(this.node.data), 'should be empty');
    },

    'id should be a unique guid by default': function () {
        var otherNode = this.tree.createNode();

        Assert.isString(this.node.id, 'should be a string');
        Assert.isTrue(this.node.id.length > 0, 'should not be empty');
        Assert.areNotSame(this.node.id, otherNode.id, 'should be unique');
    },

    'label should be an empty string by default': function () {
        Assert.areSame('', this.node.label);
    },

    'parent should be the parent node of this node, if any': function () {
        this.tree.rootNode.append(this.node);

        Assert.areSame(this.tree.rootNode, this.node.parent, 'parent should be the root node');
        Assert.isUndefined(this.tree.rootNode.parent, 'root node should not have a parent');
    },

    'state should be an empty object by default': function () {
        Assert.isObject(this.node.state, 'should be an object');
        Assert.areSame(0, Y.Object.size(this.node.state), 'should be empty');
    },

    'tree should be the Tree that contains the node': function () {
        Assert.areSame(this.tree, this.node.tree);
    }
}));

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

    'append() should wrap Tree#appendNode()': function () {
        var child   = this.tree.createNode(),
            mock    = Mock(),
            options = {};

        Mock.expect(mock, {
            method : 'appendNode',
            args   : [this.node, child, options],
            run    : Y.bind(this.tree.appendNode, this.tree)
        });

        this.node.tree = mock;
        Assert.areSame(child, this.node.append(child, options), 'should return the child');

        Mock.verify(mock);
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

    'empty() should wrap Tree#emptyNode()': function () {
        var mock    = Mock(),
            options = {};

        Mock.expect(mock, {
            method : 'emptyNode',
            args   : [this.node, options],
            run    : Y.bind(this.tree.emptyNode, this.tree)
        });

        this.node.tree = mock;
        Assert.isArray(this.node.empty(options), 'should return an array');

        Mock.verify(mock);
    },

    'hasChildren() should return `true` if the node has children, `false` otherwise': function () {
        Assert.isFalse(this.node.hasChildren(), 'should be false when empty');

        this.node.append({});
        Assert.isTrue(this.node.hasChildren(), 'should be true when not empty');
    },

    'index() should return the numerical index of this node within its parent node': function () {
        Assert.areSame(0, this.node.index(), 'index should be 0')
    },

    'index() should return -1 if this node has no parent': function () {
        Assert.areSame(-1, this.unattachedNode.index());
    },

    'indexOf() should return the numerical index of the given child node': function () {
        var childZero = this.node.append({}),
            childOne  = this.node.append({});

        Assert.areSame(0, this.node.indexOf(childZero), 'index of childZero should be 0');
        Assert.areSame(1, this.node.indexOf(childOne), 'index of childOne should be 1');
    },

    'indexOf() should return -1 if the given node is not a direct child of this node': function () {
        Assert.areSame(-1, this.node.indexOf(this.unattachedNode));
    },

    'insert() should wrap Tree#insertNode()': function () {
        var child   = this.tree.createNode(),
            mock    = Mock(),
            options = {};

        Mock.expect(mock, {
            method : 'insertNode',
            args   : [this.node, child, options],
            run    : Y.bind(this.tree.insertNode, this.tree)
        });

        this.node.tree = mock;
        Assert.areSame(child, this.node.insert(child, options), 'should return the child');

        Mock.verify(mock);
    },

    'isInTree() should return `true` if this node has been inserted into a tree, `false` otherwise': function () {
        Assert.isTrue(this.node.isInTree(), 'should be true for an attached node');
        Assert.isFalse(this.unattachedNode.isInTree(), 'should be false for an unattached node');
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

    'isRoot() should return `true` if this node is the root of a tree, `false` otherwise': function () {
        Assert.isTrue(this.tree.rootNode.isRoot(), 'should be true for root node');
        Assert.isFalse(this.node.isRoot(), 'should be false for non-root node');
        Assert.isFalse(this.unattachedNode.isRoot(), 'should be false for an unattached node');
    },

    'isSelected() should return `true` if this node is selected, `false` otherwise': function () {
        Assert.isFalse(this.node.isSelected(), 'should be false if not selected');
        this.node.select();
        Assert.isTrue(this.node.isSelected(), 'should be true if selected');
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

    'prepend() should wrap Tree#prependNode()': function () {
        var child   = this.tree.createNode(),
            mock    = Mock(),
            options = {};

        Mock.expect(mock, {
            method : 'prependNode',
            args   : [this.node, child, options],
            run    : Y.bind(this.tree.prependNode, this.tree)
        });

        this.node.tree = mock;
        Assert.areSame(child, this.node.prepend(child, options), 'should return the child');

        Mock.verify(mock);
    },

    'remove() should wrap Tree#removeNode()': function () {
        var mock    = Mock(),
            options = {};

        Mock.expect(mock, {
            method : 'removeNode',
            args   : [this.node, options],
            run    : Y.bind(this.tree.removeNode, this.tree)
        });

        this.node.tree = mock;
        this.node.remove(options);

        Mock.verify(mock);
    },

    'remove() should be chainable': function () {
        Assert.areSame(this.node, this.node.remove());
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

    'size() should return the total number of descendants contained within this node': function () {
        Assert.areSame(0, this.node.size(), 'should be 0');

        this.node.append({});
        Assert.areSame(1, this.node.size(), 'should be 1');

        this.node.children[0].append([{}, {}, {}]);
        Assert.areSame(4, this.node.size(), 'should be 4');
    },

    'toggle() should wrap Tree#toggleNode()': function () {
        var mock    = Mock(),
            options = {};

        Mock.expect(mock, {
            method : 'toggleNode',
            args   : [this.node, options],
            run    : Y.bind(this.tree.toggleNode, this.tree)
        });

        this.node.tree = mock;
        this.node.toggle(options);

        Mock.verify(mock);
    },

    'toggle() should be chainable': function () {
        Assert.areSame(this.node, this.node.toggle());
    },

    'toJSON() should return a serializable object representing this node': function () {
        this.node.append([{label: 'child one'}, {label: 'child two'}, {label: 'child three'}]);

        var obj = this.node.toJSON();

        // Basic checks.
        Assert.isObject(obj, 'should be an object');
        Assert.isString(Y.JSON.stringify(obj), 'should be serializable (no cyclic structures, etc.)');

        // Now the tedious stuff.
        function verifyNode(node, jsonObj) {
            Assert.areSame(node.canHaveChildren, jsonObj.canHaveChildren, node.label + ': canHaveChildren should be serialized');
            Assert.isObject(jsonObj.data, node.label + ': data should be serialized');
            Assert.areSame(node.id, jsonObj.id, node.label + ': id should be serialized');
            Assert.areSame(node.label, jsonObj.label, node.label + ': label should be serialized');
            Assert.isObject(jsonObj.state, node.label + ': state should be serialized');

            if (node.hasChildren()) {
                Assert.isArray(jsonObj.children, node.label + ': children should be an array');

                for (var i = 0, len = node.children.length; i < len; i++) {
                    verifyNode(node.children[i], jsonObj.children[i]);
                }
            } else {
                Assert.isUndefined(jsonObj.children, node.label + ': children should not be defined for node without children');
            }
        }

        verifyNode(this.node, obj);
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

// -- Y.Plugin.Tree.Lazy -------------------------------------------------------
var lazySuite = new Y.Test.Suite('Plugin.Tree.Lazy');
mainSuite.add(lazySuite);

// -- Lifecycle ----------------------------------------------------------------
lazySuite.add(new Y.Test.Case({
    name: 'Lifecycle',

    setUp: function () {
        this.tree = new Tree();
    },

    tearDown: function () {
        this.tree.destroy();
        delete this.tree;
    },

    'plugin instance should be available in the `lazy` namespace': function () {
        this.tree.plug(Y.Plugin.Tree.Lazy);
        Assert.isInstanceOf(Y.Plugin.Tree.Lazy, this.tree.lazy);
    },

    'constructor should accept a custom `load()` function in `config.load`': function () {
        function load() {}

        this.tree.plug(Y.Plugin.Tree.Lazy, {
            load: load
        });

        Assert.areSame(load, this.tree.lazy.load);
    }
}));

// -- Methods ------------------------------------------------------------------
lazySuite.add(new Y.Test.Case({
    name: 'Methods',

    setUp: function () {
        this.tree = new Tree();
        this.tree.plug(Y.Plugin.Tree.Lazy);
    },

    tearDown: function () {
        this.tree.destroy();
        delete this.tree;
    },

    'default `load()` method should pass an error to the callback': function () {
        var called;

        this.tree.lazy.load(this.tree.rootNode, function (err) {
            called = true;
            Assert.isInstanceOf(Error, err, '`err` should be an instance of `Error`');
        });

        Assert.isTrue(called, 'load() method should be called');
    }
}));

// -- Events -------------------------------------------------------------------
lazySuite.add(new Y.Test.Case({
    name: 'Events',

    setUp: function () {
        this.tree = new Tree({
            nodes: [
                {
                    label: 'test node',
                    canHaveChildren: true
                }
            ]
        });

        this.tree.plug(Y.Plugin.Tree.Lazy, {
            load: function (node, callback) {
                if (node.data.error) {
                    callback(new Error('Oh noes!'));
                    return;
                }

                callback();
            }
        });

        this.lazy = this.tree.lazy;
        this.node = this.tree.rootNode.children[0];
    },

    tearDown: function () {
        this.tree.destroy();

        delete this.lazy;
        delete this.node;
        delete this.tree;
    },

    '`error` event should fire when an error is passed to the `load()` callback': function () {
        var fired;

        this.lazy.on('error', function (e) {
            fired = true;
            Assert.isInstanceOf(Error, e.error, 'error property should be an instance of Error');
            Assert.areSame('load', e.src, 'src should be "load"');
        });

        this.node.data.error = true;
        this.node.open();

        Assert.isTrue(fired, 'error event should fire');
    },

    '`loading` event should fire just before the `load()` callback is called': function () {
        var test = this,
            fired,
            loadCalled;

        this.lazy.on('loading', function (e) {
            fired = true;

            if (loadCalled) {
                Assert.fail('loading event should fire before the load() callback is called');
            }

            Assert.areSame(test.node, e.node, 'node should be the the node whose children are being loaded');
        });

        this.lazy.load = function (node, callback) {
            loadCalled = true;
            callback();
        };

        this.node.open();

        Assert.isTrue(fired, 'loading event should fire');
        Assert.isTrue(loadCalled, 'load() callback should be called');
    },

    '`loading` event should be preventable': function () {
        var test = this,
            fired,
            loadCalled;

        this.lazy.on('loading', function (e) {
            fired = true;
            e.preventDefault();
        });

        this.lazy.load = function (node, callback) {
            loadCalled = true;
            callback();
        };

        this.node.open();

        Assert.isTrue(fired, 'loading event should fire');
        Assert.isUndefined(loadCalled, 'load() callback should not be called');
    },

    '`loaded` event should fire after the `load()` callback is called without an error': function () {
        var test = this,
            fired;

        this.lazy.on('loaded', function (e) {
            fired = true;
            Assert.areSame(test.node, e.node, 'node should be the the node whose children were loaded');
        });

        this.node.open();

        Assert.isTrue(fired, 'loaded event should fire');
    }
}));

// -- General Functionality ----------------------------------------------------
lazySuite.add(new Y.Test.Case({
    name: 'Functionality',

    setUp: function () {
        this.tree = new Tree({
            nodes: [
                {
                    label: 'test node',
                    canHaveChildren: true
                }
            ]
        });

        this.tree.plug(Y.Plugin.Tree.Lazy, {
            load: function (node, callback) {
                if (node.data.error) {
                    callback(new Error('Oh noes!'));
                    return;
                }

                callback();
            }
        });

        this.lazy = this.tree.lazy;
        this.node = this.tree.rootNode.children[0];
    },

    tearDown: function () {
        this.tree.destroy();

        delete this.lazy;
        delete this.node;
        delete this.tree;
    },

    "node's `state.loading` property should be true while loading": function () {
        var called;

        this.lazy.load = function (node, callback) {
            called = true;
            Assert.isTrue(node.state.loading, 'node.state.loading should be true');
            callback();
        };

        this.node.open();

        Assert.isTrue(called, 'load() should be called');
    },

    "node's `state.loading` property should be removed after load success or failure": function () {
        Assert.isUndefined(this.node.state.loading, 'sanity check');

        this.node.data.error = true;
        this.node.open().close();

        Assert.isUndefined(this.node.state.loading, 'state.loading should be undefined after error');

        this.node.data.error = false;
        this.node.open();

        Assert.isUndefined(this.node.state.loading, 'state.loading should be undefined after success');
    },

    "node's `state.loaded` property should be true after successful load": function () {
        Assert.isUndefined(this.node.state.loaded, 'sanity check');

        this.node.open();
        Assert.isTrue(this.node.state.loaded, 'state.loaded should be true');
    }
}));

}, '@VERSION@', {
    requires: ['json', 'tree', 'tree-lazy', 'test']
});
