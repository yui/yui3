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
            {id: 'b'},
            {id: 'a'},
            {id: 'c'}
        ]});
    },

    tearDown: function () {
        this.tree.destroy();
        delete this.tree;
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
