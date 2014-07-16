YUI.add('tree-labelable-test', function (Y) {

var Assert = Y.Assert,
    Tree   = Y.Base.create('testTree', Y.Tree, [Y.Tree.Labelable]),

    suite = Y.TreeLabelableTestSuite = new Y.Test.Suite('Tree.Labelable');

// -- Methods ------------------------------------------------------------------
suite.add(new Y.Test.Case({
    setUp: function () {
        this.tree = new Tree();
        this.node = this.tree.createNode();
    },

    tearDown: function () {
        this.tree.destroy();
        delete this.tree;
        delete this.node;
    },

    'label should be an empty string by default': function () {
        Assert.areSame('', this.node.label);
    },

    'constructor should set the label if one is specified': function () {
        var node = this.tree.createNode({label: 'foo'});
        Assert.areSame('foo', node.label);
    },

    'toJSON() should serialize labels': function () {
        this.node.append([{label: 'child one'}, {label: 'child two'}, {label: 'child three'}]);

        var obj = this.node.toJSON();

        function verifyNode(node, jsonObj) {
            Assert.areSame(node.label, jsonObj.label, node.label + ': label should be serialized');

            if (node.hasChildren()) {
                for (var i = 0, len = node.children.length; i < len; i++) {
                    verifyNode(node.children[i], jsonObj.children[i]);
                }
            }
        }

        verifyNode(this.node, obj);
    }
}));

}, '@VERSION@', {
    requires: ['tree-labelable', 'test']
});
