YUI.add('node-focusmanager-button-tests', function (Y) {
    var suite = new Y.Test.Suite('node focusmanager button test suite'),
        Assert = Y.Assert,
        ENTER_KEY = 13,
        UP_ARROW_KEY = 38,
        DOWN_ARROW_KEY = 40;

    suite.add(new Y.Test.Case({
        'example should have rendered an enclosing div': function () {
            var example = Y.one('.example'),
                button  = Y.one('#button-1'),
                out     = Y.one('#out');

            Assert.isNotNull(example, 'Example enclosure missing');
            Assert.isNotNull(button, 'Button element missing');
            Assert.isNotNull(out, 'Output div element missing');
        },

        'all drop-down elements should be clickable': function () {
            var button  = Y.one('#button-1'),
                options = Y.all('#menu-1 ul li input'),
                out     = Y.one('#out');
            
            options.each(function (node) {
                button.simulate('click');
                node.simulate('click');
                Assert.areEqual('You clicked ' + node.get('value'), 
                    out.getHTML(), 'Option ' + node.get('value') + ' is wrong'); 
            });
        },

        'menu should be navigatable with arrow keys and enter': function () {
            var choices  = ['Inbox', 'Archive', 'Trash'],
                button   = Y.one('#button-1'),
                menu     = Y.one('#menu-1');
                out      = Y.one('#out'),
                options  = Y.all('#menu-1 input'),
                keyEvent = !(Y.UA.opera) ? 'keydown' : 'keypress';

            button.simulate('click');
            options.item(0).simulate(keyEvent, {
                charCode: DOWN_ARROW_KEY,
                keyCode: DOWN_ARROW_KEY
            });

            /* for (var i = 0; i < 3; i++) {
                button.simulate('click');
                // Scroll down using the arrow keys
                for (var j = 0; j < i; j++) {
                    console.log('hi');
                    menu.simulate(keyEvent, {
                        charCode: DOWN_ARROW_KEY,
                        keyCode: DOWN_ARROW_KEY,

                    });
                }

                Assert.isTrue(options.item(j).hasClass('yui3-menuitem-active'),
                    'Item is properly focused');
                // Assert.areEqual('You clicked ' + choices[i], out.getHTML(),
                //    'Unexpected output from choice ' + choices[i]);
            }*/
        }
    }));

    Y.Test.Runner.add(suite);

}, '@VERSION@', { requires: [ 'node', 'node-event-simulate', 'test' ] });
