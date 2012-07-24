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
                menu     = Y.one('#menu-1'),
                menuItems = menu.all('li'),
                MENU_ITEM_ACTIVE = 'yui3-menuitem-active',
                keyEvent = !(Y.UA.opera) ? 'keydown' : 'keypress';

            button.simulate('click');

            //Wait for a little bit for the DOM to update. Otherwise, the menu doesnt change state in time.
            this.wait(function(){

                //The menu should be open and visible.
                Assert.isTrue(Y.one('.yui3-buttonmenu').hasClass('yui3-overlay-focused'));

                //Loop through the menu items with the down arrow.
                for (var i = 0; i < menuItems.size(); i++) {
                    Assert.isTrue(menuItems.item(i).hasClass(MENU_ITEM_ACTIVE), 'Item is properly focused');
                    Assert.areEqual(choices[i], menuItems.item(i).one('input').get('value'), 'Unexpected output from choice ' + choices[i]);
                    
                    menu.one('input').simulate(keyEvent, {
                        charCode: DOWN_ARROW_KEY,
                        keyCode: DOWN_ARROW_KEY
                    });

                }

            }, 1000);
        }
    }));

    Y.Test.Runner.add(suite);

}, '@VERSION@', { requires: [ 'node', 'node-event-simulate', 'test' ] });
