YUI.add('button-plugin-test', function (Y) {

    var Assert      = Y.Assert,
        ArrayAssert = Y.ArrayAssert,
        suite;

    suite = new Y.Test.Suite('button-plugin');

    suite.add(new Y.Test.Case({
        name: 'Methods',

        setUp : function () {
            this.label = "Hello";
            Y.one("#container").setContent('<button id="testButton">' + this.label + '</button>');
        },

        tearDown: function () {
            Y.one('#container').empty(true);
        },

        'node.plug(Y.Plugin.Button, config) should return a Y.Node instance with Button functionality': function () {
            var oldLabel = this.label;
            var newLabel = 'World';
            var node = Y.one("#testButton");
            var button;

            Assert.areSame(oldLabel, node.getContent());
            Assert.isFalse(node.get('disabled'));
            Assert.areNotSame(node, button);

            button = Y.one("#testButton").plug(Y.Plugin.Button, {
                label: newLabel,
                disabled: true
            });

            Assert.areSame(node, button);
            Assert.isInstanceOf(Y.Node, button);
            Assert.areSame(newLabel, node.getContent());
            Assert.isTrue(node.get('disabled'));
        },

        'Y.Plugin.Button.createNode(srcNode) should return a Y.Node instance with Button functionality': function () {
            var oldLabel = this.label;
            var newLabel = 'World';
            var node = Y.one("#testButton");
            var button;

            Assert.areSame(oldLabel, node.getContent());
            Assert.isFalse(node.get('disabled'));
            Assert.areNotSame(node, button);

            button = Y.Plugin.Button.createNode(Y.one("#testButton"));
            node.set('label', newLabel);
            button.set('disabled', true);

            Assert.areSame(node, button);
            Assert.isInstanceOf(Y.Node, button);
            Assert.areSame(newLabel, node.getContent());
            Assert.isTrue(node.get('disabled'));
        },

        'Y.Plugin.Button.createNode(srcNode, config) should return a Y.Node instance with Button functionality': function () {
            var oldLabel = this.label;
            var newLabel = 'World';
            var node = Y.one("#testButton");
            var button;

            Assert.areSame(oldLabel, node.getContent());
            Assert.isFalse(node.get('disabled'));
            Assert.areNotSame(node, button);

            button = Y.Plugin.Button.createNode(Y.one("#testButton"), {
                'label': newLabel,
                'disabled': true
            });

            Assert.areSame(node, button);
            Assert.isInstanceOf(Y.Node, button);
            Assert.areSame(newLabel, node.getContent());
            Assert.isTrue(node.get('disabled'));
        },

        'Y.Plugin.Button.createNode(config) should return a Y.Node instance with Button functionality': function () {
            var oldLabel = this.label;
            var newLabel = 'World';
            var node = Y.one("#testButton");
            var button;

            Assert.areSame(oldLabel, node.getContent());
            Assert.isFalse(node.get('disabled'));
            Assert.areNotSame(node, button);

            button = Y.Plugin.Button.createNode({
                srcNode: Y.one("#testButton"),
                label: newLabel,
                disabled: true
            });

            Assert.areSame(node, button);
            Assert.isInstanceOf(Y.Node, button);
            Assert.areSame(newLabel, node.getContent());
            Assert.areSame(newLabel, button.get('label'));
            Assert.isTrue(node.get('disabled'));
        },

        'Y.Plugin.Button.createNode(config) should return a Y.Node with the specified `template` element': function () {
            var anchorButton = Y.Plugin.Button.createNode({template: '<a href="#foo" />'});

            anchorButton.appendTo('#container');
            
            Assert.areSame('a', anchorButton.get('tagName').toLowerCase(), '`anchorButton` was not an <a>.');
            Assert.areSame('foo', anchorButton.getAttribute('href').split('#')[1], '`anchorButton` did not have href "#foo".');
        }

    }));

    Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['button-plugin', 'test']
});
