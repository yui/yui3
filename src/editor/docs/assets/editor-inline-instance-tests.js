YUI.add('editor-inline-instance-tests', function (Y) {

    var suite = new Y.Test.Suite('editor instance example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'Example should have rendered clickable buttons': function () {
            var btnContainer = Y.one('#buttons'),
                bTagsButton  = Y.one('#buttons #btags'),
                iTagsButton  = Y.one('#buttons #itags'),
                cTagsButton  = Y.one('#buttons #ctags');

            Assert.isNotNull(btnContainer, 'Buttons container is missing');
            Assert.isNotNull(bTagsButton, 'Bold tags button is missing');
            Assert.isNotNull(iTagsButton, 'Italic tags button is missing');
            Assert.isNotNull(cTagsButton, 'Class `foo` tags button is missing');
        },

        'Editor instance should have rendered': function () {
            var editorFrame = Y.one('#editor');

            Assert.isTrue(editorFrame.hasAttribute('contenteditable'));
        },

        'Clicking should result in different outputs': function () {
            var bTagsButton  = Y.one('#buttons #btags'),
                iTagsButton  = Y.one('#buttons #itags'),
                cTagsButton  = Y.one('#buttons #ctags');

            bTagsButton.simulate('click');

            Assert.areEqual(Y.one('#out').getHTML(),
                'There are (2) B tags in the inline editor.',
                'Bold tags output is unexpected');

            iTagsButton.simulate('click');

            Assert.areEqual(Y.one('#out').getHTML(),
                'There is (1) I tag in the inline editor.',
                'Italic tags output is unexpected');

            cTagsButton.simulate('click');

            Assert.areEqual(Y.one('#out').getHTML(),
                'There are (2) items with class foo in the inline editor.',
                'Foo tags output is unexpected');
        }
    }));

    Y.Test.Runner.add(suite);
}, '@VERSION@', { requires: [ 'node', 'node-event-simulate', 'test' ] });

