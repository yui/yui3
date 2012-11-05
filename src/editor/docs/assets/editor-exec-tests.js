YUI.add('editor-exec-tests', function (Y) {
    
    var suite = new Y.Test.Suite('editor exec example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'Example should have rendered clickable buttons': function () {
            var btnContainer = Y.one('#buttons'),
                fooButton  = Y.one('#buttons #foo'),
                barButton  = Y.one('#buttons #bar'),
                bazButton  = Y.one('#buttons #baz');

            Assert.isNotNull(btnContainer, 'Buttons container is missing');
            Assert.isNotNull(fooButton, 'Bold tags button is missing');
            Assert.isNotNull(barButton, 'Italic tags button is missing');
            Assert.isNotNull(bazButton, 'Class `foo` tags button is missing');
        },

        'Editor instance should have rendered': function () {
            var editorFrame = Y.one('#editor iframe');

            Assert.isNotNull(editorFrame, 'Editor iframe is missing');
        },

        'Clicking should result in different outputs': function () {
            var fooButton  = Y.one('#buttons #foo'),
                barButton  = Y.one('#buttons #bar'),
                bazButton  = Y.one('#buttons #baz');

            fooButton.simulate('click');
            
            Assert.areEqual(Y.one('#out').getHTML(),
                'You clicked on Foo',
                'Foo button output is unexpected');

            barButton.simulate('click');

            Assert.areEqual(Y.one('#out').getHTML(),
                'You clicked on Bar',
                'Bar button output is unexpected');

            bazButton.simulate('click');

            Assert.areEqual(Y.one('#out').getHTML(),
                'You clicked on Baz',
                'Baz button output is unexpected');
        }
    }));

    Y.Test.Runner.add(suite);
}, '@VERSION@', { requires: [ 'node', 'node-event-simulate', 'test' ] });

