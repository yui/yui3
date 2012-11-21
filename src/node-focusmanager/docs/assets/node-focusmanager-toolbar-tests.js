YUI.add('node-focusmanager-toolbar-tests', function (Y) {
    var suite = new Y.Test.Suite('node focusmanager toolbar example test suite'),
        Assert = Y.Assert,
        LEFT_ARROW_KEY  = 37,
        RIGHT_ARROW_KEY = 39;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'example should have rendered an enclosing div': function () {
            var example = Y.one('.example'),
                toolbar = Y.one('#toolbar-1'),
                out     = Y.one('#out');

            Assert.isNotNull(example, 'Example enclosure missing');
            Assert.isNotNull(toolbar, 'Toolbar element missing');
            Assert.isNotNull(out, 'Output div element missing');
        },

        'all buttons should be clickable and generate output': function () {
            var buttons = ['Add', 'Edit', 'Print', 'Delete', 'Open', 'Save'],
                out     = Y.one('#out'),
                currBtn;

            for (var i = 0; i < buttons.length; i++) {
                currBtn = Y.one('#' + buttons[i].toLowerCase() + '-btn');
                currBtn.simulate('click');
                Assert.areEqual('You clicked ' + buttons[i], out.getHTML(),
                    'Button output is unexpected');
            }
        },

        'all buttons should support arrow keys to focus': function () {
            var buttons  = ['Add', 'Edit', 'Print', 'Delete', 'Open', 'Save'],
                out      = Y.one('#out'),
                firstBtn = Y.one('#add-btn span span input'),
                keyEvent = !(Y.UA.opera) ? 'keydown' : 'keypress';

            var currBtn, nextBtn;

            // Set focus on the first element programatically
            firstBtn.focus();

            Assert.isTrue(firstBtn.hasClass('focus'),
                'Initial button does not have the focus class');

            // First go to the right

            for (var i = 0; i < buttons.length - 1; i++) {
                var currID = '#' + buttons[i].toLowerCase() + '-btn',
                    nextID = '#' + buttons[i+1].toLowerCase() + '-btn';

                currBtn = Y.one(currID + ' span span input');
                nextBtn = Y.one(nextID + ' span span input');

                currBtn.simulate(keyEvent, {
                    charCode: RIGHT_ARROW_KEY,
                    keyCode: RIGHT_ARROW_KEY
                });

                Assert.isTrue(nextBtn.hasClass('focus'),
                    'Button ' + buttons[i+1] + ' is not focused with right key');
            }

            // Then go to the left
            
            for (var j = buttons.length - 1; j > 0; j--) {
                var currID = '#' + buttons[j].toLowerCase() + '-btn',
                    nextID = '#' + buttons[j-1].toLowerCase() + '-btn';

                currBtn = Y.one(currID + ' span span input');
                nextBtn = Y.one(nextID + ' span span input');

                currBtn.simulate(keyEvent, {
                    charCode: LEFT_ARROW_KEY,
                    keyCode: LEFT_ARROW_KEY
                });

                Assert.isTrue(nextBtn.hasClass('focus'),
                    'Button ' + buttons[j-1] + ' is not focused with left key');
            }
        },

        'Focusing buttons should be able to circle around': function () {
            var out      = Y.one('#out'),
                addBtn   = Y.one('#add-btn span span input'),
                saveBtn  = Y.one('#save-btn span span input'),
                keyEvent = !(Y.UA.opera) ? 'keydown' : 'keypress';

            // Set focus on the first element programatically
            addBtn.focus();

            Assert.isTrue(addBtn.hasClass('focus'),
                'Initial button does not have the focus class');

            // Left direction should wrap around
            addBtn.simulate(keyEvent, {
                charCode: LEFT_ARROW_KEY,
                keyCode: LEFT_ARROW_KEY
            });

            Assert.isTrue(saveBtn.hasClass('focus'), 
                'Last button does not have focus');

            // Right direction should also wrap around
            saveBtn.simulate(keyEvent, {
                charCode: RIGHT_ARROW_KEY,
                keyCode: RIGHT_ARROW_KEY
            });

            Assert.isTrue(addBtn.hasClass('focus'),
                'First button does not have focus'); 
        }
    }));

    Y.Test.Runner.add(suite);

}, '@VERSION@', { requires: [ 'node', 'node-event-simulate', 'test' ] });
