/* jshint newcap:false */

YUI.add('tree-test', function (Y) {

var Assert       = Y.Assert,
    ArrayAssert  = Y.ArrayAssert,
    ObjectAssert = Y.ObjectAssert,
    Mock         = Y.Mock,

    Tree     = Y.Tree,
    LazyTree = Y.Base.create('lazyTree', Tree, [Tree.Openable]),

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
        Assert.areSame(0, tree.children.length, 'rootNode should have zero children');
    },

    'constructor: `nodes` config property should support an array of node configs to add to the tree': function () {
        var tree = new Tree({
                nodes: [
                    {id: 'one'},
                    {id: 'two'},
                    {id: 'three'}
                ]
            });

        Assert.areSame(3, tree.children.length, 'rootNode should have three children');
        Assert.areSame('one', tree.children[0].id, 'node one should be added');
        Assert.areSame('two', tree.children[1].id, 'node two should be added');
        Assert.areSame('three', tree.children[2].id, 'node three should be added');
    },

    'constructor: `nodes` config property should support an array of TreeNode.Node instances to add to the tree': function () {
        var treeA = new Tree({
                nodes: [
                    {id: 'one'},
                    {id: 'two'},
                    {id: 'three'}
                ]
            }),

            treeB = new Tree({
                nodes: treeA.children.concat()
            });

        Assert.areSame(3, treeB.children.length, 'rootNode should have three children');
        Assert.areSame('one', treeB.children[0].id, 'node one should be added');
        Assert.areSame('two', treeB.children[1].id, 'node two should be added');
        Assert.areSame('three', treeB.children[2].id, 'node three should be added');
    },

    'constructor: `rootNode` config property should support a custom root node config': function () {
        var tree = new Tree({rootNode: {id: 'hi!'}});

        Assert.isInstanceOf(Tree.Node, tree.rootNode, 'rootNode should be an instance of Tree.Node');
        Assert.areSame('hi!', tree.rootNode.id, 'rootNode should have the custom id specified');
    },

    'constructor: `rootNode` config property should support a custom Tree.Node instance': function () {
        var treeA = new Tree(),
            node  = treeA.createNode({id: 'hi!'}),
            treeB = new Tree({rootNode: node});

        Assert.areSame(node, treeB.rootNode, 'rootNode should be the specified node');
        Assert.areSame('hi!', treeB.rootNode.id, 'rootNode should have the custom id specified');
        Assert.areSame(treeB, treeB.rootNode.tree, 'rootNode should have the correct tree reference');
    },

    'constructor: should allow both `nodes` and `rootNode` to be specified': function () {
        var tree = new Tree({
                nodes   : [{id: 'one'}, {id: 'two'}, {id: 'three'}],
                rootNode: {id: 'hi!'}
            });

        Assert.areSame('hi!', tree.rootNode.id, 'rootNode should have the custom id specified');
        Assert.areSame(3, tree.children.length, 'rootNode should have three children');
        Assert.areSame('one', tree.children[0].id, 'node one should be added');
        Assert.areSame('two', tree.children[1].id, 'node two should be added');
        Assert.areSame('three', tree.children[2].id, 'node three should be added');
    },

    'destructor should destroy the root node': function () {
        var tree = new Tree();
        tree.destroy();

        Assert.isNull(tree.rootNode, 'rootNode should be null');
    },

    'destructor should free references to allow garbage collection': function () {
        var tree = new Tree();
        tree.destroy();

        Assert.isNull(tree.rootNode, 'rootNode should be null');
        Assert.isNull(tree._nodeClass, '_nodeClass should be null');
        Assert.isNull(tree._nodeMap, '_nodeMap should be null');
        Assert.isNull(tree._published, '_published should be null');
    }
}));

// -- Properties and Attributes ------------------------------------------------
treeSuite.add(new Y.Test.Case({
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

    '_isYUITree should be true': function () {
        Assert.isTrue(this.tree._isYUITree);
    },

    'children property should be a reference to the rootNode\'s children property': function () {
        Assert.areSame(this.tree.children, this.tree.rootNode.children);
    },

    'nodeClass property should allow the use of a custom node class': function () {
        var MyNode = Y.Base.create('myNode', Tree.Node, [], {
            _isMyNode: true
        });

        var tree = new Tree({nodeClass: MyNode});
        var node = tree.createNode();

        Assert.isTrue(node._isMyNode);
    },

    'nodeClass property should allow specifying a class as a string': function () {
        Y.namespace('Foo.Bar').MyNode = Y.Base.create('myNode', Tree.Node, [], {
            _isMyNode: true
        });

        var tree = new Tree({
            nodeClass: 'Foo.Bar.MyNode'
        });

        var node = tree.createNode();

        Assert.isTrue(node._isMyNode);
    },

    'nodeExtensions property should mix extensions into the nodeClass at instantiation': function () {
        var extensionOneCalled, extensionTwoCalled, tree;

        function ExtensionOne(innerTree, config) {
            extensionOneCalled = true;

            Assert.isTrue(innerTree._isYUITree, 'tree should be passed to the extension constructor');
            Assert.isObject(config, 'node config should be passed to the extension constructor');
        }

        ExtensionOne.prototype = {
            extensionOneProp: 'foo',
            overWriteMe: 'hello'
        };

        function ExtensionTwo() {
            extensionTwoCalled = true;
        }

        ExtensionTwo.prototype = {
            extensionTwoProp: 'bar',
            overWriteMe: 'goodbye'
        };

        tree = new Tree({
            nodeExtensions: [ExtensionOne, ExtensionTwo]
        });

        var node = tree.rootNode.append({id: 'Hello!'});

        Assert.areSame('Hello!', node.id, 'id should be set');
        Assert.isTrue(extensionOneCalled, "extension one's constructor should be called");
        Assert.isTrue(extensionTwoCalled, "extension two's constructor should be called");
        Assert.areSame('foo', node.extensionOneProp, 'node should have mixed in prototype properties from extension one');
        Assert.areSame('bar', node.extensionTwoProp, 'node should have mixed in prototype properties from extension two');
        Assert.areSame('goodbye', node.overWriteMe, "extension two should be able to overwrite extension one's properties");
    }
}));

// -- Methods ------------------------------------------------------------------
treeSuite.add(new Y.Test.Case({
    name: 'Methods',

    _should: {
        error: {
            'createNode() should throw when given a destroyed node': true,
            'traverseNode() should throw when given a destroyed node': true
        }
    },

    setUp: function () {
        this.tree = new Tree({nodes: [
            {id: 'one', children: [{id: 'one-one'}, {id: 'one-two'}, {id: 'one-three'}]},
            {id: 'two'},
            {id: 'three'}
        ]});

        // Save the errorFn config so we can restore it later.
        this._configErrorFn = Y.config.errorFn;
    },

    tearDown: function () {
        Y.config.errorFn = this._configErrorFn;

        this.tree.destroy();
        delete this.tree;
    },

    'appendNode() should append a node to the end of the specified parent node': function () {
        var parent = this.tree.rootNode,
            node   = this.tree.appendNode(parent, {id: 'appended'});

        Assert.isInstanceOf(Tree.Node, node, 'return value should be the appended node');
        Assert.areSame(node, parent.children[parent.children.length - 1], 'node should be the last child of the parent');
        Assert.areSame(parent, node.parent, "node's parent property should be set correctly");
    },

    'appendNode() should append an array of nodes to the end of the specified parent node': function () {
        var parent = this.tree.rootNode,
            nodes  = this.tree.appendNode(parent, [
                {id: 'appended one'},
                {id: 'appended two'},
                this.tree.createNode({id: 'appended three'})
            ]);

        Assert.isArray(nodes, 'return value should be an array');
        Assert.areSame(nodes[0], parent.children[parent.children.length - 3], 'first appended node should be third from the end');
        Assert.areSame(nodes[1], parent.children[parent.children.length - 2], 'second appended node should be second from the end');
        Assert.areSame(nodes[2], parent.children[parent.children.length - 1], 'third appended node should be last');
    },

    'appendNode() should adopt a node if it exists in another tree': function () {
        var otherTree = new Tree({nodes: [{id: 'adopted node'}]}),
            node      = otherTree.children[0];

        this.tree.appendNode(this.tree.rootNode, node);

        ArrayAssert.isEmpty(otherTree.children, 'node should no longer exist in the original tree');
        Assert.areSame(node, this.tree.children[this.tree.children.length - 1], 'node should now be in the new tree');
        Assert.areSame(this.tree, node.tree, "node's tree reference should point to the new tree");
    },

    'clear() should destroy the root node and create a new one': function () {
        var oldRoot = this.tree.rootNode;

        ArrayAssert.isNotEmpty(this.tree.children, 'sanity check');

        this.tree.clear();

        Assert.areNotSame(oldRoot, this.tree.rootNode, 'tree should have a new root node');
        ArrayAssert.isEmpty(this.tree.children, 'new root node should not have any children');
        Assert.isTrue(oldRoot.state.destroyed, 'old root node should be destroyed');
    },

    'clear() should support a custom root node argument': function () {
        this.tree.clear({id: 'new root'});
        Assert.areSame('new root', this.tree.rootNode.id);
    },

    'clear() should be chainable': function () {
        Assert.areSame(this.tree, this.tree.clear());
    },

    'createNode() should create a node and associate it with this tree': function () {
        var node = this.tree.createNode({
                id: 'new node',

                children: [
                    {id: 'one', children: [{id: 'one-one'}]},
                    {id: 'two'},
                    {id: 'three'}
                ]
            });

        Assert.isInstanceOf(Tree.Node, node, 'node should be a Tree.Node instance');

        Assert.areSame('new node', node.id, 'node should have the specified id');
        Assert.areSame(3, node.children.length, 'node should have three children');
        Assert.areSame(this.tree, node.tree, 'node should be associated with this tree');
        Assert.areSame(node, this.tree.getNodeById(node.id), "node should be in this tree's id map");

        Assert.isInstanceOf(Tree.Node, node.children[0], 'child one should be a Tree.Node instance');
        Assert.isInstanceOf(Tree.Node, node.children[1], 'child two should be a Tree.Node instance');
        Assert.isInstanceOf(Tree.Node, node.children[2], 'child three should be a Tree.Node instance');
        Assert.isInstanceOf(Tree.Node, node.children[0].children[0], "child one's child should be a Tree.Node instance");
    },

    "createNode() should adopt the specified node if it's from another tree": function () {
        var otherTree = new Tree({nodes: [{id: 'other node'}]}),
            node      = otherTree.children[0];

        Assert.areSame(otherTree, node.tree, 'sanity check');
        Assert.areSame(node, otherTree.children[0], 'sanity check');

        this.tree.createNode(node);

        Assert.areSame(this.tree, node.tree, 'node should be moved into this tree');
        ArrayAssert.isEmpty(otherTree.children, 'node should no longer be in its original tree');
        Assert.isUndefined(otherTree.getNodeById(node.id), 'node should no longer be associated with its original tree');
        Assert.areSame(node, this.tree.getNodeById(node.id), 'node should be associated with this tree');
    },

    'createNode() should throw when given a destroyed node': function () {
        var node = this.tree.createNode();

        this.tree.destroyNode(node);
        this.tree.createNode(node);
    },

    'createNode() should return `null` when given a destroyed node if an errorFn handles the error': function () {

        Y.config.errorFn = function () {
            return true;
        };

        var node = this.tree.createNode();

        this.tree.destroyNode(node);
        Assert.isNull(this.tree.createNode(node));
    },

    'destroyNode() should destroy the specified node': function () {
        var node = this.tree.children[0];

        this.tree.destroyNode(node);

        ArrayAssert.isEmpty(node.children, 'node.children should be an empty array');
        ObjectAssert.ownsNoKeys(node.data, 'node.data should be an empty object');
        Assert.isNull(node.parent, 'node.parent should be null');
        Assert.isNull(node.tree, 'node.tree should be null');
        ObjectAssert.ownsNoKeys(node._indexMap, 'node._indexMap should be an empty object');

        Assert.isUndefined(this.tree.getNodeById(node.id), 'node should be removed from the id map');

        Assert.isTrue(node.state.destroyed, 'node.state.destroyed should be true');
    },

    'destroyNode() should be chainable': function () {
        Assert.areSame(this.tree, this.tree.destroyNode(this.tree.children[0]));
    },

    'emptyNode() should remove all children from the given node and return them': function () {
        var nodes = this.tree.emptyNode(this.tree.rootNode);

        Assert.isArray(nodes, 'should return an array');

        Assert.areSame('one', nodes[0].id, 'first removed node should match');
        Assert.areSame('two', nodes[1].id, 'second removed node should match');
        Assert.areSame('three', nodes[2].id, 'third removed node should match');

        ArrayAssert.isEmpty(this.tree.children, 'root node should now be empty');

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

    'findNode() should return the first node for which the callback returns a truthy value': function () {
        var calls = 0,
            result;

        result = this.tree.findNode(this.tree.rootNode, function (node) {
            calls += 1;
            Assert.areSame(Y.config.global, this, '`this` should be the global object');
            return node.id === 'two';
        });

        Assert.areSame(this.tree.children[1], result, 'should find node "two"');
        Assert.areSame(6, calls, 'should traverse 6 nodes');
    },

    'findNode() should return `null` when it doesn\'t find anything': function () {
        var calls = 0,
            result;

        result = this.tree.findNode(this.tree.rootNode, function () {
            calls += 1;
            return false;
        });

        Assert.isNull(result, 'result should be null');
        Assert.areSame(7, calls, 'should traverse all nodes');
    },

    'findNode() should pass options along to traverseNode()': function () {
        var calls = 0,
            result;

        result = this.tree.findNode(this.tree.rootNode, {depth: 1}, function (node) {
            calls += 1;
            Assert.areSame(Y.config.global, this, '`this` should be the global object');
            return node.id === 'one-one';
        });

        Assert.isNull(result, 'should not find anything');
        Assert.areSame(4, calls, 'should traverse 4 nodes');
    },

    'findNode() should support a custom `this` object': function () {
        var thisObj = {},
            called;

        this.tree.findNode(this.tree.rootNode, function () {
            called = true;
            Assert.areSame(thisObj, this, 'should have a custom `this` object');
        }, thisObj);

        Assert.isTrue(called, 'callback should be called');
    },

    'getNodeById() should return the node with the given id': function () {
        var node = this.tree.children[0];
        Assert.areSame(node, this.tree.getNodeById(node.id));
    },

    'getNodeById() should return `undefined` if the given id is not found': function () {
        Assert.isUndefined(this.tree.getNodeById('bogus'));
    },

    'insertNode() should insert a node at the specified index': function () {
        var node = this.tree.insertNode(this.tree.rootNode, {id: 'inserted'}, {index: 1});

        Assert.isInstanceOf(Tree.Node, node, 'return value should be a Tree.Node instance');
        Assert.areSame('inserted', node.id, 'inserted node should be returned');
        Assert.areSame('one', this.tree.children[0].id, '"one" should be at index 0');
        Assert.areSame('inserted', this.tree.children[1].id, '"inserted" should be at index 1');
        Assert.areSame('two', this.tree.children[2].id, '"two" should be at index 2');
    },

    'insertNode() should insert an array of nodes at the specified index': function () {
        var nodes = this.tree.insertNode(this.tree.rootNode, [
                {id: 'inserted one'},
                {id: 'inserted two'},
                this.tree.createNode({id: 'inserted three'})
            ], {index: 1});

        Assert.isArray(nodes, 'return value should be an array');
        Assert.areSame('one', this.tree.children[0].id, '"one" should be at index 0');
        Assert.areSame('inserted one', this.tree.children[1].id, '"inserted one" should be at index 1');
        Assert.areSame('inserted two', this.tree.children[2].id, '"inserted two" should be at index 2');
        Assert.areSame('inserted three', this.tree.children[3].id, '"inserted three" should be at index 3');
        Assert.areSame('two', this.tree.children[4].id, '"two" should be at index 4');
    },

    'insertNode() should append if no index is specified': function () {
        this.tree.insertNode(this.tree.rootNode, {id: 'inserted'});
        Assert.areSame('inserted', this.tree.children[this.tree.children.length - 1].id);
    },

    'insertNode() should adopt a node if it exists in another tree': function () {
        var otherTree = new Tree({nodes: [{id: 'adopted'}]}),
            node      = otherTree.children[0];

        this.tree.insertNode(this.tree.rootNode, node);

        ArrayAssert.isEmpty(otherTree.children, 'node should no longer exist in the original tree');
        Assert.areSame(node, this.tree.children[this.tree.children.length - 1], 'node should now be in the new tree');
        Assert.areSame(this.tree, node.tree, "node's tree reference should point to the new tree");
    },

    "insertNode() should adopt an entire node hierarchy if it exists in another tree": function () {
        var otherTree;

        otherTree = new Y.Tree({
            nodes: [
                {id: 'node1', label: 'Node 1', children: [
                    {id: 'node1.1', label: 'Node 1.1'},
                    {id: 'node1.2', label: 'Node 1.2'}
                ]},
                {id: 'node2', label: 'Node 2'}
            ]
        });

        var node = otherTree.children[0];

        this.tree.insertNode(this.tree.rootNode, node, {index: 0});

        Assert.areSame(node, this.tree.children[0], 'parent should be in the new tree');
        Assert.areSame(this.tree, node.tree, "parent's tree reference should point to the new tree");
        Assert.areSame(this.tree.rootNode, node.parent, 'parent should have the right parent');
        Assert.areSame(2, node.children.length, 'parent should have two children');

        Assert.areSame('node1.1', node.children[0].id, 'first child should have the right id');
        Assert.areSame('node1.2', node.children[1].id, 'second child should have the right id');
        Assert.areSame(node, node.children[0].parent, 'first child should have the right parent');
        Assert.areSame(node, node.children[1].parent, 'second child should have the right parent');
        Assert.areSame(this.tree, node.children[0].tree, 'first child should be in the new tree');
        Assert.areSame(this.tree, node.children[1].tree, 'second child should be in the new tree');

        Assert.areSame(0, node.indexOf(node.children[0]), 'parent index should contain child 0');
        Assert.areSame(1, node.indexOf(node.children[1]), 'parent index should contain child 1');
    },

    'insertNode() should remove the inserted node from its current parent if necessary': function () {
        var node      = this.tree.children[0],
            newParent = this.tree.children[1];

        Assert.areSame(this.tree.rootNode, node.parent, 'sanity check');
        Assert.areSame(3, this.tree.children.length, 'root node should have three children');

        this.tree.insertNode(newParent, node);

        Assert.areSame(newParent, node.parent, 'node should have a new parent');
        Assert.areSame(0, newParent.indexOf(node), 'node should actually be a child of its new parent');
        Assert.areSame(2, this.tree.children.length, 'root node should have two children');
        Assert.areSame(-1, this.tree.rootNode.indexOf(node), 'node should no longer be a child of the root node');
    },

    'insertNode() should reinsert at the correct position relative to other nodes even when the inserted node already exists in the same parent': function () {

        var one   = this.tree.children[0],
            two   = this.tree.children[1],
            three = this.tree.children[2];

        this.tree.insertNode(this.tree.rootNode, one, {index: 2});

        Assert.areSame(0, two.index(), 'node two should now be at index 0');
        Assert.areSame(1, one.index(), 'node one should now be at index 1');
        Assert.areSame(2, three.index(), 'node three should still be at index 2');
        Assert.areSame(two, this.tree.children[0], 'node two should now be first');
        Assert.areSame(one, this.tree.children[1], 'node one should now be second');
        Assert.areSame(three, this.tree.children[2], 'node three should still be third');
    },

    'insertNode() should return `null` if a destroyed node is inserted and an errorFn handles the error': function () {
        Y.config.errorFn = function () {
            return true;
        };

        var node = this.tree.createNode();

        this.tree.destroyNode(node);
        Assert.isNull(this.tree.insertNode(this.tree.rootNode, node));
    },

    'insertNode() should only return actual inserted nodes if a destroyed node is inserted as part of an array and an errorFn handles the error': function () {
        Y.config.errorFn = function () {
            return true;
        };

        var nodes = [
            this.tree.createNode(),
            this.tree.createNode(),
            this.tree.createNode()
        ];

        this.tree.destroyNode(nodes[1]);

        var inserted = this.tree.insertNode(this.tree.rootNode, nodes);

        Assert.isArray(inserted, 'should return an array of inserted nodes');
        Assert.areSame(2, inserted.length, 'only two nodes should have been inserted');
        Assert.areSame(nodes[0], inserted[0], 'node 0 should be inserted');
        Assert.areSame(nodes[2], inserted[1], 'node 2 should be inserted');
    },

    'prependNode() should prepend a node to the beginning of the specified parent node': function () {
        var parent = this.tree.rootNode,
            node   = this.tree.prependNode(parent, {id: 'prepended'});

        Assert.isInstanceOf(Tree.Node, node, 'return value should be the prepended node');
        Assert.areSame(node, parent.children[0], 'node should be the first child of the parent');
        Assert.areSame(parent, node.parent, "node's parent property should be set correctly");
    },

    'prependNode() should prepend an array of nodes to the beginning of the specified parent node': function () {
        var parent = this.tree.rootNode,
            nodes  = this.tree.prependNode(parent, [
                {id: 'prepended one'},
                {id: 'prepended two'},
                this.tree.createNode({id: 'prepended three'})
            ]);

        Assert.isArray(nodes, 'return value should be an array');
        Assert.areSame(nodes[0], parent.children[0], 'first prepended node should be at index 0');
        Assert.areSame(nodes[1], parent.children[1], 'second prepended node should be at index 1');
        Assert.areSame(nodes[2], parent.children[2], 'third prepended node should be at index 2');
    },

    'prependNode() should adopt a node if it exists in another tree': function () {
        var otherTree = new Tree({nodes: [{id: 'adopted node'}]}),
            node      = otherTree.children[0];

        this.tree.prependNode(this.tree.rootNode, node);

        ArrayAssert.isEmpty(otherTree.children, 'node should no longer exist in the original tree');
        Assert.areSame(node, this.tree.children[0], 'node should now be in the new tree');
        Assert.areSame(this.tree, node.tree, "node's tree reference should point to the new tree");
    },

    'removeNode() should remove the specified node from its parent': function () {
        var node = this.tree.prependNode(this.tree.rootNode, {id: 'remove me!'});

        Assert.isTrue(node.isInTree(), 'sanity check');
        Assert.areSame(this.tree.rootNode, node.parent, 'sanity check');

        var removed = this.tree.removeNode(node);

        Assert.areSame(node, removed, 'removed node should be returned');
        Assert.isFalse(node.isInTree(), 'node should no longer be in the tree');
        Assert.isNull(node.parent, 'node should no longer have a parent');
        Assert.areNotSame(node, this.tree.children[0], 'node should no longer be a child of the root node');
        Assert.isUndefined(node.state.destroyed, 'node should not be destroyed');
    },

    'removeNode() should remove and destroy the specified node when options.destroy is truthy': function () {
        var node = this.tree.prependNode(this.tree.rootNode, {id: 'remove me!'});

        Assert.isTrue(node.isInTree(), 'sanity check');
        Assert.areSame(this.tree.rootNode, node.parent, 'sanity check');

        this.tree.removeNode(node, {destroy: true});
        Assert.isTrue(node.state.destroyed, 'node should be destroyed');
    },

    'size() should return the total number of nodes in the tree, including the root node': function () {
        Assert.areSame(7, this.tree.size());
    },

    'toJSON() should return a serializable object representing the tree': function () {
        var obj = this.tree.toJSON();

        // Basic checks.
        Assert.isObject(obj, 'should be an object');
        Assert.isString(Y.JSON.stringify(obj), 'should be serializable (no cyclic structures, etc.)');

        // Now the tedious stuff.
        function verifyNode(node, jsonObj) {
            Assert.areSame(node.canHaveChildren, jsonObj.canHaveChildren, node.id + ': canHaveChildren should be serialized');
            Assert.isObject(jsonObj.data, node.id + ': data should be serialized');
            Assert.areSame(node.id, jsonObj.id, node.id + ': id should be serialized');
            Assert.isObject(jsonObj.state, node.id + ': state should be serialized');

            if (node.hasChildren()) {
                Assert.isArray(jsonObj.children, node.id + ': children should be an array');

                for (var i = 0, len = node.children.length; i < len; i++) {
                    verifyNode(node.children[i], jsonObj.children[i]);
                }
            } else {
                Assert.isUndefined(jsonObj.children, node.id + ': children should not be defined for node without children');
            }
        }

        verifyNode(this.tree.rootNode, obj);
    },

    'traverseNode() should traverse the specified node and its descendants in depth-first order': function () {
        var traversed = [],
            tree;

        tree = new Tree({
            rootNode: {id: 'root'},

            nodes: [
                {id: 'a', children: [
                    {id: 'a-a'}
                ]},
                {id: 'b', children: [
                    {id: 'b-a', children: [
                        {id: 'b-a-a'},
                        {id: 'b-a-b'},
                        {id: 'b-a-c'}
                    ]},
                    {id: 'b-b'}
                ]},
                {id: 'c'}
            ]
        });

        tree.traverseNode(tree.rootNode, function (node) {
            traversed.push(node.id);

            Assert.isTrue(node._isYUITreeNode, 'node should be passed to the callback');
            Assert.areSame(Y.config.global, this, '`this` object should be the global object');
        });

        Assert.areSame(10, traversed.length, 'should have traversed 10 nodes');
        Assert.areSame('root a a-a b b-a b-a-a b-a-b b-a-c b-b c',
            traversed.join(' '), 'should traverse nodes in depth-first order');
    },

    'traverseNode() should use the specified `this` object': function () {
        var thisObj = {},
            called;

        this.tree.traverseNode(this.tree.rootNode, function () {
            called = true;
            Assert.areSame(thisObj, this, 'should use custom `this` object');
        }, thisObj);

        Assert.isTrue(called, 'callback should be called');
    },

    'traverseNode() should limit the maximum depth when `options.depth` is set': function () {
        var traversed = [],
            called, tree;

        tree = new Tree({
            rootNode: {id: 'root'},
            nodes   : [
                {id: 'a'},
                {id: 'b', children: [
                    {id: 'b-a', children: [
                        {id: 'b-a-a', children: [
                            {id: 'b-a-a-a'},
                            {id: 'b-a-a-b'}
                        ]}
                    ]}
                ]},
                {id: 'c', children: [
                    {id: 'c-a', children: [
                        {id: 'c-a-a', children: [
                            {id: 'c-a-a-a'},
                            {id: 'c-a-a-b'}
                        ]}
                    ]}
                ]},
                {id: 'd'}
            ]
        });

        tree.traverseNode(tree.rootNode, {depth: 2}, function (node) {
            called = true;
            traversed.push(node.id);
        });

        Assert.isTrue(called, 'callback should be called');
        Assert.areSame('root a b b-a c c-a d', traversed.join(' '),
            'should limit traversal to a depth of 2');
    },

    'traverseNode() should stop traversing if the callback returns `Tree.STOP_TRAVERSAL`': function () {
        var calls = 0;

        this.tree.traverseNode(this.tree.rootNode, function () {
            calls += 1;

            if (calls === 3) {
                return Tree.STOP_TRAVERSAL;
            }
        });

        Assert.areSame(3, calls, 'should stop traversal after three nodes');
    },

    'traverseNode() should throw when given a destroyed node': function () {
        var node = this.tree.createNode();

        this.tree.destroyNode(node);
        this.tree.traverseNode(node, function () {
            Assert.fail('callback should not be called');
        });
    },

    'traverseNode() should not traverse a destroyed node if an errorFn handles the error': function () {
        Y.config.errorFn = function () {
            return true;
        };

        var node = this.tree.createNode();

        this.tree.destroyNode(node);

        Assert.isUndefined(this.tree.traverseNode(node, function () {
            Assert.fail('callback should not be called');
        }), 'should return undefined');
    }
}));

// -- Events -------------------------------------------------------------------
treeSuite.add(new Y.Test.Case({
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

    'appendNode() should fire an `add` event with src "append"': function () {
        var node = this.tree.createNode({id: 'appended'}),
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

        this.tree.appendNode(this.tree.rootNode, {id: 'appended'}, {silent: true});
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

    'clear() should pass along a custom `src`': function () {
        var fired;

        this.tree.once('clear', function (e) {
            fired = true;
            Assert.areSame('foo', e.src, 'src should be set');
        });

        this.tree.clear(null, {src: 'foo'});
        Assert.isTrue(fired, 'event should fire');
    },

    'destroyNode() should fire a `remove` event': function () {
        var node = this.tree.children[0],
            fired;

        this.tree.once('remove', function () {
            fired = true;
        });

        this.tree.destroyNode(node);
        Assert.isTrue(fired, 'event should fire');
    },

    'destroyNode() should not fire a `remove` event if options.silent is truthy': function () {
        var node = this.tree.children[0];

        this.tree.once('remove', function () {
            Assert.fail('event should not fire');
        });

        this.tree.destroyNode(node, {silent: true});
    },

    'destroyNode() should pass along a custom `src`': function () {
        var node = this.tree.children[0],
            fired;

        this.tree.once('remove', function (e) {
            fired = true;
            Assert.areSame('foo', e.src, 'src should be set');
        });

        this.tree.destroyNode(node, {src: 'foo'});
        Assert.isTrue(fired, 'event should fire');
    },

    'prependNode() should fire an `add` event with src "prepend"': function () {
        var node = this.tree.createNode({id: 'prepended'}),
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

        this.tree.prependNode(this.tree.rootNode, {id: 'prepended'}, {silent: true});
    },

    'insertNode() should fire an `add` event with src "insert"': function () {
        var node = this.tree.createNode({id: 'inserted'}),
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
        var node = this.tree.createNode({id: 'inserted'}),
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

        this.tree.insertNode(this.tree.rootNode, {id: 'inserted'}, {silent: true});
    },

    'insertNode() should fire a `remove` event if the inserted node is removed from another parent': function () {
        var fired;

        this.tree.once('remove', function (e) {
            fired = true;
            Assert.areSame('add', e.src, 'src should be "add"');
        });

        this.tree.insertNode(this.tree.rootNode, this.tree.children[0]);

        Assert.isTrue(fired, 'remove event should fire');
    },

    'insertNode() should not fire a `remove` event when the inserted node is removed from another parent if options.silent is truthy': function () {
        this.tree.once('remove', function (e) {
            Assert.fail('remove event should not fire');
        });

        this.tree.insertNode(this.tree.rootNode, this.tree.children[0], {silent: true});
    },

    'removeNode() should fire a `remove` event': function () {
        var node = this.tree.children[1],
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

        this.tree.removeNode(this.tree.children[1], {silent: true});
    },

    'removeNode() should pass along a custom `src`': function () {
        var node = this.tree.children[1],
            fired;

        this.tree.once('remove', function (e) {
            fired = true;
            Assert.areSame('foo', e.src, 'src should be set');
        });

        this.tree.removeNode(node, {src: 'foo'});
        Assert.isTrue(fired, 'event should fire');
    },

    '`add` event should be preventable': function () {
        this.tree.once('add', function (e) {
            e.preventDefault();
        });

        this.tree.insertNode(this.tree.rootNode, {id: 'added'});
        Assert.areSame(7, this.tree.size(), 'node should not have been added');
    },

    '`clear` event should be preventable': function () {
        this.tree.once('clear', function (e) {
            e.preventDefault();
        });

        this.tree.clear();
        Assert.areSame(7, this.tree.size(), 'tree should not have been cleared');
    },

    '`remove` event should be preventable': function () {
        this.tree.once('remove', function (e) {
            e.preventDefault();
        });

        this.tree.removeNode(this.tree.children[0]);
        Assert.areSame(7, this.tree.size(), 'node should not have been removed');
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
        var child0 = new Tree.Node(this.tree),
            child1 = new Tree.Node(this.tree),
            child2 = new Tree.Node(this.tree),

            node = new Tree.Node(this.tree, {
                canHaveChildren: true,
                children       : [child0, child1, child2],
                data           : {foo: 'bar'},
                id             : 'mynode',
                state          : {tested: true}
            });

        Assert.isTrue(node.canHaveChildren, 'canHaveChildren should be true');

        Assert.areSame(child0, node.children[0], 'child 0 should exist');
        Assert.areSame(child1, node.children[1], 'child 1 should exist');
        Assert.areSame(child2, node.children[2], 'child 2 should exist');

        Assert.areSame(node, node.children[0].parent, 'child 0 should have the correct parent reference');
        Assert.areSame(node, node.children[1].parent, 'child 1 should have the correct parent reference');
        Assert.areSame(node, node.children[2].parent, 'child 2 should have the correct parent reference');

        Assert.areSame('bar', node.data.foo, 'data should be set');
        Assert.areSame('mynode', node.id, 'custom id should be set');
        Assert.isTrue(node.state.tested, 'custom state should be set');
    },

    'constructor should mix arbitrary config properties into the instance': function () {
        var node = new Tree.Node(this.tree, {foo: 'bar', _isYUITreeNode: 'moo'});

        Assert.areSame('bar', node.foo, 'node should have a `foo` property');
        Assert.isTrue(node._isYUITreeNode, '`_isYUITreeNode` property should not be overwritten');
    },

    'constructor should generate a unique id if one is not specified': function () {
        var nodeOne = new Tree.Node(this.tree),
            nodeTwo = new Tree.Node(this.tree);

        Assert.isString(nodeOne.id, 'nodeOne.id should be a string');
        Assert.isString(nodeTwo.id, 'nodeTwo.id should be a string');
        Assert.areNotSame(nodeOne.id, nodeTwo.id, 'ids should be unique');
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
        this.node = this.tree.rootNode.append({});
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

    'depth() should return the depth of a node': function () {
        var one   = this.tree.rootNode.append({}),
            two   = one.append({}),
            three = two.append({}),
            four  = three.append({});

        Assert.areSame(1, one.depth(), 'node one should have a depth of 1');
        Assert.areSame(2, two.depth(), 'node two should have a depth of 2');
        Assert.areSame(3, three.depth(), 'node three should have a depth of 3');
        Assert.areSame(4, four.depth(), 'node four should have a depth of 4');
    },

    'depth() should return 0 for the root node': function () {
        Assert.areSame(0, this.tree.rootNode.depth());
    },

    'depth() should return 0 for an unattached node': function () {
        Assert.areSame(0, this.tree.createNode().depth());
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

    'find() should wrap Tree#findNode()': function () {
        var mock     = Mock(),
            callback = function () {},
            options  = {},
            thisObj  = {};

        Mock.expect(mock, {
            method : 'findNode',
            args   : [this.node, options, callback, thisObj],
            run    : Y.bind(this.tree.findNode, this.tree)
        });

        this.node.tree = mock;
        this.node.find(options, callback, thisObj);

        Mock.verify(mock);
    },

    'hasChildren() should return `true` if the node has children, `false` otherwise': function () {
        Assert.isFalse(this.node.hasChildren(), 'should be false when empty');

        this.node.append({});
        Assert.isTrue(this.node.hasChildren(), 'should be true when not empty');
    },

    'index() should return the numerical index of this node within its parent node': function () {
        Assert.areSame(0, this.node.index(), 'index should be 0');
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

    'isRoot() should return `true` if this node is the root of a tree, `false` otherwise': function () {
        Assert.isTrue(this.tree.rootNode.isRoot(), 'should be true for root node');
        Assert.isFalse(this.node.isRoot(), 'should be false for non-root node');
        Assert.isFalse(this.unattachedNode.isRoot(), 'should be false for an unattached node');
    },

    'isRoot() should return `false` on destroyed nodes': function () {
        this.node.remove({destroy: true});
        Assert.isFalse(this.node.isRoot());
    },

    'next() should return the next sibling': function () {
        var nextNode = this.tree.rootNode.append({});
        Assert.areSame(nextNode, this.node.next(), 'should be the next sibling');
    },

    'next() should return `undefined` if there is no next sibling': function () {
        Assert.isUndefined(this.node.next(), 'should be undefined');
    },

    'next() should return `undefined` if the node is a root node': function () {
        Assert.isUndefined(this.node.next(), 'should be undefined');
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

    'previous() should return the previous sibling': function () {
        var prevNode = this.tree.rootNode.prepend({});
        Assert.areSame(prevNode, this.node.previous(), 'should be the previous sibling');
    },

    'previous() should return `undefined` if there is no previous sibling': function () {
        Assert.isUndefined(this.node.previous(), 'should be undefined');
    },

    'previous() should return `undefined` if the node is a root node': function () {
        Assert.isUndefined(this.node.previous(), 'should be undefined');
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

    'size() should return the total number of descendants contained within this node': function () {
        Assert.areSame(0, this.node.size(), 'should be 0');

        this.node.append({});
        Assert.areSame(1, this.node.size(), 'should be 1');

        this.node.children[0].append([{}, {}, {}]);
        Assert.areSame(4, this.node.size(), 'should be 4');
    },

    'toJSON() should return a serializable object representing this node': function () {
        this.node.append([{id: 'child one'}, {id: 'child two'}, {id: 'child three'}]);

        var obj = this.node.toJSON();

        // Basic checks.
        Assert.isObject(obj, 'should be an object');
        Assert.isString(Y.JSON.stringify(obj), 'should be serializable (no cyclic structures, etc.)');

        // Now the tedious stuff.
        function verifyNode(node, jsonObj) {
            Assert.areSame(node.canHaveChildren, jsonObj.canHaveChildren, node.id + ': canHaveChildren should be serialized');
            Assert.isObject(jsonObj.data, node.id + ': data should be serialized');
            Assert.areSame(node.id, jsonObj.id, node.id + ': id should be serialized');
            Assert.isObject(jsonObj.state, node.id + ': state should be serialized');

            if (node.hasChildren()) {
                Assert.isArray(jsonObj.children, node.id + ': children should be an array');

                for (var i = 0, len = node.children.length; i < len; i++) {
                    verifyNode(node.children[i], jsonObj.children[i]);
                }
            } else {
                Assert.isUndefined(jsonObj.children, node.id + ': children should not be defined for node without children');
            }
        }

        verifyNode(this.node, obj);
    },

    'traverse() should wrap Tree#traverseNode()': function () {
        var mock     = Mock(),
            callback = function () {},
            options  = {},
            thisObj  = {};

        Mock.expect(mock, {
            method : 'traverseNode',
            args   : [this.node, options, callback, thisObj],
            run    : Y.bind(this.tree.traverseNode, this.tree)
        });

        this.node.tree = mock;
        this.node.traverse(options, callback, thisObj);

        Mock.verify(mock);
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
        this.tree = new LazyTree({
            nodes: [
                {canHaveChildren: true}
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
        this.node = this.tree.children[0];
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

    '`beforeLoad` event should fire just before the `load()` callback is called': function () {
        var test = this,
            fired,
            loadCalled;

        this.lazy.on('beforeLoad', function (e) {
            fired = true;

            if (loadCalled) {
                Assert.fail('beforeLoad event should fire before the load() callback is called');
            }

            Assert.areSame(test.node, e.node, 'node should be the the node whose children are being loaded');
        });

        this.lazy.load = function (node, callback) {
            loadCalled = true;
            callback();
        };

        this.node.open();

        Assert.isTrue(fired, 'beforeLoad event should fire');
        Assert.isTrue(loadCalled, 'load() callback should be called');
    },

    '`beforeLoad` event should be preventable': function () {
        var fired,
            loadCalled;

        this.lazy.on('beforeLoad', function (e) {
            fired = true;
            e.preventDefault();
        });

        this.lazy.load = function (node, callback) {
            loadCalled = true;
            callback();
        };

        this.node.open();

        Assert.isTrue(fired, 'beforeLoad event should fire');
        Assert.isUndefined(loadCalled, 'load() callback should not be called');
    },

    '`load` event should fire after the `load()` callback is called without an error': function () {
        var test = this,
            fired;

        this.lazy.on('load', function (e) {
            fired = true;
            Assert.areSame(test.node, e.node, 'node should be the the node whose children were loaded');
        });

        this.node.open();

        Assert.isTrue(fired, 'load event should fire');
    }
}));

// -- General Functionality ----------------------------------------------------
lazySuite.add(new Y.Test.Case({
    name: 'Functionality',

    setUp: function () {
        this.tree = new LazyTree({
            nodes: [
                {canHaveChildren: true}
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
        this.node = this.tree.children[0];
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
    requires: ['tree-openable', 'tree-lazy', 'json', 'test']
});
