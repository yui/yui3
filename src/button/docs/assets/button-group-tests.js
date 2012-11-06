YUI.add('button-group-tests', function(Y){

    var checkboxGroup = Y.one('#checkboxContainer'),
        radioGroup = Y.one('#radioContainer'),
        BUTTON_SELECTED = 'yui3-button-selected',
        IS_SELECTED = ' is selected.',
        IS_NOT_SELECTED = ' is not selected.';

    // Checkbox Group Tests
    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Button Group Tests - Checkbox',

        'checkbox group should exist': function() {
            Y.Assert.isNotNull(checkboxGroup);
            Y.Assert.areSame(checkboxGroup.get('id'), 'checkboxContainer');
        },

        'three buttons should exist in the checkbox group': function() {
            var allButtons = checkboxGroup.all('button');

            Y.Assert.isTrue(allButtons.size() === 3);
            Y.Assert.isTrue(allButtons.item(0).hasClass('yui3-button'));
            Y.Assert.isTrue(allButtons.item(1).hasClass('yui3-button'));
            Y.Assert.isTrue(allButtons.item(2).hasClass('yui3-button'));
        },

        'test button 1': function() {
            var allButtons = checkboxGroup.all('button');

            allButtons.item(0).simulate('click');

            Y.Assert.isTrue(allButtons.item(0).hasClass(BUTTON_SELECTED), 'Button 1' + IS_NOT_SELECTED);
            Y.Assert.isFalse(allButtons.item(1).hasClass(BUTTON_SELECTED), 'Button 2' + IS_SELECTED);
            Y.Assert.isFalse(allButtons.item(2).hasClass(BUTTON_SELECTED), 'Button 3' + IS_SELECTED);

            allButtons.item(0).simulate('click');

            Y.Assert.isFalse(allButtons.item(0).hasClass(BUTTON_SELECTED), 'Button 1' + IS_SELECTED);
            Y.Assert.isFalse(allButtons.item(1).hasClass(BUTTON_SELECTED), 'Button 2' + IS_SELECTED);
            Y.Assert.isFalse(allButtons.item(2).hasClass(BUTTON_SELECTED), 'Button 3' + IS_SELECTED);
        },

        'test button 2': function() {
            var allButtons = checkboxGroup.all('button');

            allButtons.item(1).simulate('click');

            Y.Assert.isFalse(allButtons.item(0).hasClass(BUTTON_SELECTED), 'Button 1' + IS_SELECTED);
            Y.Assert.isTrue(allButtons.item(1).hasClass(BUTTON_SELECTED), 'Button 2' + IS_NOT_SELECTED);
            Y.Assert.isFalse(allButtons.item(2).hasClass(BUTTON_SELECTED), 'Button 3' + IS_SELECTED);

            allButtons.item(1).simulate('click');

            Y.Assert.isFalse(allButtons.item(0).hasClass(BUTTON_SELECTED), 'Button 1' + IS_SELECTED);
            Y.Assert.isFalse(allButtons.item(1).hasClass(BUTTON_SELECTED), 'Button 2' + IS_SELECTED);
            Y.Assert.isFalse(allButtons.item(2).hasClass(BUTTON_SELECTED), 'Button 3' + IS_SELECTED);
        },

        'test button 3': function() {
            var allButtons = checkboxGroup.all('button');

            allButtons.item(2).simulate('click');

            Y.Assert.isFalse(allButtons.item(0).hasClass(BUTTON_SELECTED), 'Button 1' + IS_SELECTED);
            Y.Assert.isFalse(allButtons.item(1).hasClass(BUTTON_SELECTED), 'Button 2' + IS_SELECTED);
            Y.Assert.isTrue(allButtons.item(2).hasClass(BUTTON_SELECTED), 'Button 3' + IS_NOT_SELECTED);

            allButtons.item(2).simulate('click');

            Y.Assert.isFalse(allButtons.item(0).hasClass(BUTTON_SELECTED), 'Button 1' + IS_SELECTED);
            Y.Assert.isFalse(allButtons.item(1).hasClass(BUTTON_SELECTED), 'Button 2' + IS_SELECTED);
            Y.Assert.isFalse(allButtons.item(2).hasClass(BUTTON_SELECTED), 'Button 3' + IS_SELECTED);
        },

        'should enable all buttons': function() {
            var allButtons = checkboxGroup.all('button');

            allButtons.item(0).simulate('click');
            allButtons.item(1).simulate('click');
            allButtons.item(2).simulate('click');

            Y.Assert.isTrue(allButtons.item(0).hasClass(BUTTON_SELECTED));
            Y.Assert.isTrue(allButtons.item(1).hasClass(BUTTON_SELECTED));
            Y.Assert.isTrue(allButtons.item(2).hasClass(BUTTON_SELECTED));
        },

        'should disable all buttons': function() {
            var allButtons = checkboxGroup.all('button');

            allButtons.item(0).simulate('click');
            allButtons.item(1).simulate('click');
            allButtons.item(2).simulate('click');

            Y.Assert.isFalse(allButtons.item(0).hasClass(BUTTON_SELECTED));
            Y.Assert.isFalse(allButtons.item(1).hasClass(BUTTON_SELECTED));
            Y.Assert.isFalse(allButtons.item(2).hasClass(BUTTON_SELECTED));
        }

    }));


    // Radio Group Tests
    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Button Group Tests - Radio',

        'radio group should exist': function() {
            Y.Assert.isNotNull(radioGroup);
            Y.Assert.areSame(radioGroup.get('id'), 'radioContainer');
        },

        'three buttons should exist in the radio group': function() {
            var allButtons = radioGroup.all('button');

            allButtons.item(0).simulate('click');

            Y.Assert.isTrue(allButtons.item(0).hasClass(BUTTON_SELECTED));
            Y.Assert.isFalse(allButtons.item(1).hasClass(BUTTON_SELECTED));
            Y.Assert.isFalse(allButtons.item(2).hasClass(BUTTON_SELECTED));
        },

        'should enable button 1': function() {
            var allButtons = radioGroup.all('button');

            allButtons.item(0).simulate('click');

            Y.Assert.isTrue(allButtons.item(0).hasClass(BUTTON_SELECTED));
            Y.Assert.isFalse(allButtons.item(1).hasClass(BUTTON_SELECTED));
            Y.Assert.isFalse(allButtons.item(2).hasClass(BUTTON_SELECTED));
        },

        'should enable button 2': function() {
            var allButtons = radioGroup.all('button');

            allButtons.item(1).simulate('click');

            Y.Assert.isFalse(allButtons.item(0).hasClass(BUTTON_SELECTED));
            Y.Assert.isTrue(allButtons.item(1).hasClass(BUTTON_SELECTED));
            Y.Assert.isFalse(allButtons.item(2).hasClass(BUTTON_SELECTED));
        },

        'should enable button 3': function() {
            var allButtons = radioGroup.all('button');

            allButtons.item(2).simulate('click');

            Y.Assert.isFalse(allButtons.item(0).hasClass(BUTTON_SELECTED));
            Y.Assert.isFalse(allButtons.item(1).hasClass(BUTTON_SELECTED));
            Y.Assert.isTrue(allButtons.item(2).hasClass(BUTTON_SELECTED));
        }

    }));



}, '@VERSION@', {requires: ['button', 'test', 'node-event-simulate']});
