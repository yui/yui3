YUI.add('button-basic-tests', function(Y){

    var SELECTED_CLASS = 'yui3-button-selected',
        WRONG_TEXT = ' has the wrong text.',
        SELECTED_TEXT = 'this pressed  button :)',
        UNSELECTED_TEXT = 'this depressed button :(',
        IS_SELECTED = ' is selected.',
        IS_NOT_SELECTED = ' is not selected.';

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Button Basic Tests',

        'two buttons should exist': function() {
            /** ids are currently changing use other selector process
            var push = Y.one('#myPushButton'),
                toggle = Y.one('#myToggleButton');
            */
            var buttons = Y.all('.example .yui3-button'),
                push = buttons.item(0),
                toggle = buttons.item(1);
           
            Y.Assert.isNotNull(push, 'Push Button does not exist.');
            Y.Assert.isNotNull(toggle, 'Toggle Button does not exist.');

            Y.Assert.isTrue(push.hasClass('yui3-button'));
            Y.Assert.isTrue(toggle.hasClass('yui3-button'));
        },

        'test toggle button alters toggle button': function() {
            /** ids are currently changing use other selector process
            var toggle = Y.one('#myToggleButton');
            */

            var buttons = Y.all('.example .yui3-button'),
                toggle = buttons.item(1);
          
            // unselected
            Y.Assert.isFalse(toggle.hasClass(SELECTED_CLASS), 'Toggle' + IS_SELECTED);
            Y.Assert.areSame(UNSELECTED_TEXT, toggle.getContent(), 'Toggle' + WRONG_TEXT);

            toggle.simulate('click');

            // selected
            Y.Assert.isTrue(toggle.hasClass(SELECTED_CLASS), 'Toggle' + IS_NOT_SELECTED);
            Y.Assert.areSame(SELECTED_TEXT, toggle.getContent(), 'Toggle', + WRONG_TEXT);

            toggle.simulate('click');

            // unselected
            Y.Assert.isFalse(toggle.hasClass(SELECTED_CLASS), 'Toggle' + IS_SELECTED);
            Y.Assert.areSame(UNSELECTED_TEXT, toggle.getContent(), 'Toggle' + WRONG_TEXT);
        },

        'test push button alters toggle button': function() {
            /** ids are currently changing use other selector process
            var push = Y.one('#myPushButton'),
                toggle = Y.one('#myToggleButton');
            */

            var buttons = Y.all('.example .yui3-button'),
                push = buttons.item(0),
                toggle = buttons.item(1);
           
            // unselected
            Y.Assert.isFalse(toggle.hasClass(SELECTED_CLASS), 'Toggle' + IS_SELECTED);
            Y.Assert.areSame(UNSELECTED_TEXT, toggle.getContent(), 'Toggle' + WRONG_TEXT);

            push.simulate('click');

            // selected
            Y.Assert.isTrue(toggle.hasClass(SELECTED_CLASS), 'Toggle' + IS_NOT_SELECTED);
            Y.Assert.areSame(SELECTED_TEXT, toggle.getContent(), 'Toggle', + WRONG_TEXT);

            push.simulate('click');

            // unselected
            Y.Assert.isFalse(toggle.hasClass(SELECTED_CLASS), 'Toggle' + IS_SELECTED);
            Y.Assert.areSame(UNSELECTED_TEXT, toggle.getContent(), 'Toggle' + WRONG_TEXT);
        }

    }));

}, '@VERSION@', {requires: ['button', 'test', 'node-event-simulate']});
