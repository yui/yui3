YUI.add('editor-nodechange-tests', function (Y) {

    var suite = new Y.Test.Suite('editor nodechange example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'Example should have rendered an iframe for Editor': function () {
            var editorFrame = Y.one('#editor iframe');

            Assert.isNotNull(editorFrame, 'Editor iframe is missing');
        },

        'Example should have rendered a console for logging': function () {
            var consoleNode = Y.one('#console .yui3-console');

            Assert.isNotNull(consoleNode, 'Console widget is missing');
        }
    }));

    Y.Test.Runner.add(suite);
}, '@VERSION@', { requires: [ 'node', 'test' ] });
