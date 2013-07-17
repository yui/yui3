YUI.add('tree-sortable-test', function (Y) {

var Assert      = Y.Assert,
    Mock        = Y.Mock,
    Tree        = Y.Base.create('testTree', Y.Tree, [Y.Tree.Sortable]),

    suite = Y.TreeSortableTestSuite = new Y.Test.Suite('Tree.Sortable');

// -- Lifecycle ----------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Lifecycle',

    'initializer should accept a `sortComparator` config option': function () {
        var comparator = function () {},
            tree       = new Tree({sortComparator: comparator});

        Assert.areSame(comparator, tree.sortComparator);
    },

    'initializer should accept a `sortReverse` config option': function () {
        var tree = new Tree({sortReverse: true});
        Assert.isTrue(tree.sortReverse);
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

    'sortReverse should default to `false`': function () {
        Assert.isFalse(this.tree.sortReverse);
    }
}));

// -- Methods ------------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Methods',

    setUp: function () {
        this.tree = new Tree({nodes: [
            {id: 'b', children: [
                {id: 'b.b'},
                {id: 'b.a'},

                {id: 'b.c', children: [
                    {id: 'b.c.b'},
                    {id: 'b.c.a'},
                    {id: 'b.c.c'}
                ]}
            ]},

            {id: 'a'},

            {id: 'c', children: [
                {id: 'c.b', children: [
                    {id: 'c.b.b'},
                    {id: 'c.b.a'},
                    {id: 'c.b.c'}
                ]},

                {id: 'c.a'},
                {id: 'c.c'}
            ]}
        ]});
    },

    tearDown: function () {
        this.tree.destroy();
        delete this.tree;
    },

    'sort() should wrap sortNode() for the root node': function () {
        var called;

        // Tree.Sortable#sort() is just a simple wrapper around
        // Tree.Sortable#sortNode(), which is tested heavily later. Instead of
        // duplicating those tests here, just verify that sortNode() is being
        // called as expected.

        this.tree.sortNode = function (node, options) {
            called = true;

            Assert.areSame(this.rootNode, node, 'sortNode() should be called with the root node');
            Assert.isTrue(options.deep, 'sortNode() should be called with `{deep: true}`');
            Assert.areSame('bar', options.foo, 'sortNode() should be called with custom options');
        };

        this.tree.sort({foo: 'bar'});

        Assert.isTrue(called, 'sortNode() should be called');
    },

    'sortComparator() should return the node\'s index by default': function () {
        Assert.areSame(0, this.tree.sortComparator(this.tree.children[0]));
        Assert.areSame(1, this.tree.sortComparator(this.tree.children[1]));
    },

    'sortNode() should sort the given node\'s children': function () {
        this.tree.sortComparator = function (node) {
            return node.id;
        };

        this.tree.sortNode(this.tree.rootNode);

        Assert.areSame('a', this.tree.children[0].id, 'first node should be "a"');
        Assert.areSame('b', this.tree.children[1].id, 'second node should be "b"');
        Assert.areSame('c', this.tree.children[2].id, 'third node should be "c"');

        this.tree.sortReverse = true;
        this.tree.sortNode(this.tree.rootNode);

        Assert.areSame('c', this.tree.children[0].id, 'first node should be "c" when reversed');
        Assert.areSame('b', this.tree.children[1].id, 'second node should be "b" when reversed');
        Assert.areSame('a', this.tree.children[2].id, 'third node should be "a" when reversed');
    },

    'sortNode() should not sort the entire hierarchy by default': function () {
        this.tree.sortComparator = function (node) {
            return node.id;
        };

        this.tree.sortNode(this.tree.rootNode);

        var b = this.tree.getNodeById('b');

        Assert.areSame('b.b', b.children[0].id, 'first node should be "b.b"');
        Assert.areSame('b.a', b.children[1].id, 'second node should be "b.a"');
        Assert.areSame('b.c', b.children[2].id, 'third node should be "b.c"');
    },

    'sortNode() should sort the entire hierarchy when the `deep` option is truthy': function () {
        this.tree.sortComparator = function (node) {
            return node.id;
        };

        this.tree.sortNode(this.tree.rootNode, {deep: true});

        Assert.areSame('a', this.tree.children[0].id, 'first node should be "a"');
        Assert.areSame('b', this.tree.children[1].id, 'second node should be "b"');
        Assert.areSame('c', this.tree.children[2].id, 'third node should be "c"');

        var b = this.tree.getNodeById('b');

        Assert.areSame('b.a', b.children[0].id, 'first node should be "b.a"');
        Assert.areSame('b.b', b.children[1].id, 'second node should be "b.b"');
        Assert.areSame('b.c', b.children[2].id, 'third node should be "b.c"');

        var bC = this.tree.getNodeById('b.c');

        Assert.areSame('b.c.a', bC.children[0].id, 'first node should be "b.c.a"');
        Assert.areSame('b.c.b', bC.children[1].id, 'second node should be "b.c.b"');
        Assert.areSame('b.c.c', bC.children[2].id, 'third node should be "b.c.c"');

        var c = this.tree.getNodeById('c');

        Assert.areSame('c.a', c.children[0].id, 'first node should be "c.a"');
        Assert.areSame('c.b', c.children[1].id, 'second node should be "c.b"');
        Assert.areSame('c.c', c.children[2].id, 'third node should be "c.c"');

        var cB = this.tree.getNodeById('c.b');

        Assert.areSame('c.b.a', cB.children[0].id, 'first node should be "c.b.a"');
        Assert.areSame('c.b.b', cB.children[1].id, 'second node should be "c.b.b"');
        Assert.areSame('c.b.c', cB.children[2].id, 'third node should be "c.b.c"');

        this.tree.sortReverse = true;
        this.tree.sortNode(this.tree.rootNode, {deep: true});

        Assert.areSame('c', this.tree.children[0].id, 'first node should be "c" when reversed');
        Assert.areSame('b', this.tree.children[1].id, 'second node should be "b" when reversed');
        Assert.areSame('a', this.tree.children[2].id, 'third node should be "a" when reversed');

        Assert.areSame('b.c', b.children[0].id, 'first node should be "b.c" when reversed');
        Assert.areSame('b.b', b.children[1].id, 'second node should be "b.b" when reversed');
        Assert.areSame('b.a', b.children[2].id, 'third node should be "b.a" when reversed');

        Assert.areSame('c.b.c', cB.children[0].id, 'first node should be "c.b.c" when reversed');
        Assert.areSame('c.b.b', cB.children[1].id, 'second node should be "c.b.b" when reversed');
        Assert.areSame('c.b.a', cB.children[2].id, 'third node should be "c.b.a" when reversed');
    },

    'sortNode() should support a `sortComparator` option': function () {
        var comparator = function (node) {
            return node.id;
        };

        this.tree.sortNode(this.tree.rootNode, {
            sortComparator: comparator
        });

        Assert.areSame('a', this.tree.children[0].id, 'first node should be "a"');
        Assert.areSame('b', this.tree.children[1].id, 'second node should be "b"');
        Assert.areSame('c', this.tree.children[2].id, 'third node should be "c"');

        Assert.areSame(comparator, this.tree.rootNode.sortComparator, 'sortComparator should become associated with the node');
    },

    'sortNode() should support a `sortReverse` option': function () {
        this.tree.sortComparator = function (node) {
            return node.id;
        };

        this.tree.sortNode(this.tree.rootNode, {sortReverse: true});

        Assert.areSame('c', this.tree.children[0].id, 'first node should be "c"');
        Assert.areSame('b', this.tree.children[1].id, 'second node should be "b"');
        Assert.areSame('a', this.tree.children[2].id, 'third node should be "a"');

        Assert.isTrue(this.tree.rootNode.sortReverse, 'sortReverse should be set on the node');
    },

    'sortNode() should be chainable': function () {
        Assert.areSame(this.tree, this.tree.sortNode(this.tree.rootNode));
    }
}));

// -- Events -------------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Events',

    setUp: function () {
        this.tree = new Tree({nodes: [
            {id: 'b'},
            {id: 'a'},
            {id: 'c'}
        ]});
    },

    tearDown: function () {
        this.tree.destroy();
        delete this.tree;
    },

    'sortNode() should fire a `sort` event': function () {
        var node = this.tree.rootNode,
            fired;

        this.tree.once('sort', function (e) {
            fired = true;

            Assert.areSame(node, e.node, 'node should be set');
            Assert.isFalse(e.reverse, 'reverse should be false');
            Assert.areSame('monkeys', e.src, 'src should be "monkeys"');
        });

        this.tree.sortNode(node, {src: 'monkeys'});
        Assert.isTrue(fired, 'event should fire');
    },

    'sortNode() should not fire an event when `options.silent` is truthy': function () {
        this.tree.once('sort', function () {
            Assert.fail('event should not be fired');
        });

        this.tree.sortNode(this.tree.rootNode, {silent: true});
    }
}));

suite.add(new Y.Test.Case({
    name: 'Miscellaneous',

    'nodes should be sorted in insertion order by default': function () {
        var tree = new Tree();

        tree.insertNode(tree.rootNode, {id: 'x'});
        tree.insertNode(tree.rootNode, [{id: 'a'}, {id: 'g'}]);

        Assert.areSame('x', tree.children[0].id, 'first node should be "x"');
        Assert.areSame('a', tree.children[1].id, 'second node should be "a"');
        Assert.areSame('g', tree.children[2].id, 'third node should be "g"');
    },

    'nodes should be sorted in descending insertion order if sortReverse is true': function () {
        var tree = new Tree({sortReverse: true});

        tree.insertNode(tree.rootNode, {id: 'x'});
        tree.insertNode(tree.rootNode, [{id: 'a'}, {id: 'g'}]);

        Assert.areSame('g', tree.children[0].id, 'first node should be "g"');
        Assert.areSame('a', tree.children[1].id, 'second node should be "a"');
        Assert.areSame('x', tree.children[2].id, 'third node should be "x"');
    },

    'nodes should be sorted at insertion time': function () {
        var tree = new Tree({
            sortComparator: function (node) {
                return node.id;
            }
        });

        tree.insertNode(tree.rootNode, {id: 'z'});
        tree.insertNode(tree.rootNode, {id: 'a'});
        tree.insertNode(tree.rootNode, [{id: 'o'}, {id: 'm'}, {id: 'a'}]);

        Assert.areSame('a', tree.children[0].id, 'first node should be "a"');
        Assert.areSame('a', tree.children[1].id, 'second node should be "a"');
        Assert.areSame('m', tree.children[2].id, 'third node should be "m"');
        Assert.areSame('o', tree.children[3].id, 'fourth node should be "o"');
        Assert.areSame('z', tree.children[4].id, 'fifth node should be "z"');
    },

    'nodes should be sorted in descending order at insertion time if sortReverse is true': function () {
        var tree = new Tree({
            sortComparator: function (node) {
                return node.id;
            },

            sortReverse: true
        });

        tree.insertNode(tree.rootNode, {id: 'z'});
        tree.insertNode(tree.rootNode, {id: 'a'});
        tree.insertNode(tree.rootNode, [{id: 'o'}, {id: 'm'}, {id: 'a'}]);

        Assert.areSame('z', tree.children[0].id, 'first node should be "z"');
        Assert.areSame('o', tree.children[1].id, 'second node should be "o"');
        Assert.areSame('m', tree.children[2].id, 'third node should be "m"');
        Assert.areSame('a', tree.children[3].id, 'fourth node should be "a"');
        Assert.areSame('a', tree.children[4].id, 'fifth node should be "a"');
    },

    'nodes should not be sorted on insert if inserted via append() or prepend()': function () {
        var tree = new Tree({
            sortComparator: function (node) {
                return node.id;
            }
        });

        tree.appendNode(tree.rootNode, {id: 'z'});
        tree.appendNode(tree.rootNode, {id: 'a'});
        tree.prependNode(tree.rootNode, [{id: 'o'}, {id: 'm'}, {id: 'a'}]);

        Assert.areSame('o', tree.children[0].id, 'first node should be "o"');
        Assert.areSame('m', tree.children[1].id, 'second node should be "m"');
        Assert.areSame('a', tree.children[2].id, 'third node should be "a"');
        Assert.areSame('z', tree.children[3].id, 'fourth node should be "z"');
        Assert.areSame('a', tree.children[4].id, 'fifth node should be "a"');
    },

    'node-specific sortComparator should be used if defined': function () {
        var tree = new Tree();

        tree.rootNode.sortComparator = function (node) {
            return node.foo;
        };

        tree.insertNode(tree.rootNode, {foo: 5});
        tree.insertNode(tree.rootNode, {foo: 1});
        tree.insertNode(tree.rootNode, [{foo: 2}, {foo: 8}]);

        Assert.areSame(1, tree.children[0].foo, 'first node should be 1');
        Assert.areSame(2, tree.children[1].foo, 'second node should be 2');
        Assert.areSame(5, tree.children[2].foo, 'third node should be 5');
        Assert.areSame(8, tree.children[3].foo, 'fourth node should be 8');
    },

    'node-specific sortComparator should be executed with the node as the `this` object': function () {
        var tree = new Tree(),
            called;

        tree.rootNode.sortComparator = function (node) {
            called = true;
            Assert.areSame(tree.rootNode, this, '`this` should be `tree.rootNode`');
            return node.foo;
        };

        tree.insertNode(tree.rootNode, {foo: 5});
        tree.insertNode(tree.rootNode, {foo: 1});

        Assert.isTrue(called, 'sortComparator should be called');
    },

    'node-specific sortReverse should be used if defined': function () {
        var tree = new Tree();

        tree.rootNode.sortComparator = function (node) {
            return node.foo;
        };

        tree.rootNode.sortReverse = true;

        tree.insertNode(tree.rootNode, {foo: 5});
        tree.insertNode(tree.rootNode, {foo: 1});
        tree.insertNode(tree.rootNode, [{foo: 2}, {foo: 8}]);

        Assert.areSame(8, tree.children[0].foo, 'first node should be 8');
        Assert.areSame(5, tree.children[1].foo, 'second node should be 5');
        Assert.areSame(2, tree.children[2].foo, 'third node should be 2');
        Assert.areSame(1, tree.children[3].foo, 'fourth node should be 1');
    },

    'tree-specific sortComparator should be executed with the tree as the `this` object': function () {
        var tree = new Tree(),
            called;

        tree.sortComparator = function (node) {
            called = true;
            Assert.areSame(tree, this, '`this` should be the tree');
            return node.foo;
        };

        tree.insertNode(tree.rootNode, {foo: 5});
        tree.insertNode(tree.rootNode, {foo: 1});

        Assert.isTrue(called, 'sortComparator should be called');
    },

    'options-specific sortComparator should be executed with the global object as the `this` object': function () {
        var global = (function () { return this; }()),
            tree   = new Tree(),
            called;

        tree.insertNode(tree.rootNode, {foo: 5});
        tree.insertNode(tree.rootNode, {foo: 1});

        tree.sortNode(tree.rootNode, {
            sortComparator: function (node) {
                called = true;
                Assert.areSame(global, this, '`this` should be the global object');
                return node.foo;
            }
        });

        Assert.isTrue(called, 'sortComparator should be called');
    },

    'node children should be re-indexed after being sorted': function () {
        var tree = new Tree();

        tree.insertNode(tree.rootNode, [
            {foo: 'z'},
            {foo: 'a'},
            {foo: 'b'}
        ]);

        Assert.areSame(0, tree.children[0].index(), 'first node should have index 0 before sort');
        Assert.areSame(1, tree.children[1].index(), 'second node should have index 1 before sort');
        Assert.areSame(2, tree.children[2].index(), 'third node should have index 2 before sort');

        tree.rootNode.sortComparator = function (node) {
            return node.foo;
        };

        tree.sortNode(tree.rootNode);

        Assert.areSame(0, tree.children[0].index(), 'first node should have index 0 after sort');
        Assert.areSame(1, tree.children[1].index(), 'second node should have index 1 after sort');
        Assert.areSame(2, tree.children[2].index(), 'third node should have index 2 after sort');
    }
}));

// -- Y.Tree.Node.Sortable -----------------------------------------------------
var nodeSuite = new Y.Test.Suite('Tree.Node.Sortable');
suite.add(nodeSuite);

// -- Methods ------------------------------------------------------------------
nodeSuite.add(new Y.Test.Case({
    name: 'Methods',

    setUp: function () {
        this.tree = new Tree();
        this.node = this.tree.rootNode.append({id: 'one'});
    },

    tearDown: function () {
        this.tree.destroy();

        delete this.tree;
        delete this.node;
    },

    'sort() should wrap Tree#sortNode()': function () {
        /* jshint newcap:false */
        var mock    = Mock(),
            options = {};

        Mock.expect(mock, {
            method : 'sortNode',
            args   : [this.node, options],
            run    : Y.bind(this.tree.sortNode, this.tree)
        });

        this.node.tree = mock;
        this.node.sort(options);

        Mock.verify(mock);
    },

    'sort() should be chainable': function () {
        Assert.areSame(this.node, this.node.sort());
    }
}));

}, '@VERSION@', {
    requires: ['tree-sortable', 'test']
});
