YUI.add('button-plugin-tests', function(Y) {

    var BUTTON_CLASS = 'yui3-button',
        NO_CLASS = ' does not have the button class.',
        WRONG_TEXT = ' does not have the correct text.';

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Button Plugin Tests',
        
        'all buttons should exist': function() {
            Y.Assert.isNotNull(Y.one('#myButton'));
            Y.Assert.isNotNull(Y.one('#myEventButton'));
            Y.Assert.isNotNull(Y.one('#myDisabledButton'));
        },

        'test simple push button plugin': function() {
            var btn = Y.one('#myButton');

            Y.Assert.isNotNull(btn);

            Y.Assert.isTrue(btn.hasClass(BUTTON_CLASS), 'Simple Button' + NO_CLASS);
        },

        'test event button': function() {
            var eventBtn = Y.one('#myEventButton'),
                disabledBtn = Y.one('#myDisabledButton');

            Y.Assert.isTrue(eventBtn.hasClass(BUTTON_CLASS), 'Event Button' + NO_CLASS);
            Y.Assert.isTrue(disabledBtn.hasClass(BUTTON_CLASS), 'Disabled Button' + NO_CLASS);

            // initial state
            Y.Assert.areSame('Disabled', disabledBtn.getContent(), 'Disabled Button' + WRONG_TEXT);
            Y.Assert.isTrue(disabledBtn.get('disabled'), 'Disabled Button is not disabled');

            eventBtn.simulate('click');

            // toggled state
            Y.Assert.areSame('Not disabled', disabledBtn.getContent(), 'Disabled Button' + WRONG_TEXT);

            eventBtn.simulate('click');
            
            // initial state
            Y.Assert.areSame('Disabled', disabledBtn.getContent(), 'Disabled Button' + WRONG_TEXT);
            Y.Assert.isTrue(disabledBtn.get('disabled'), 'Disabled Button is not disabled');

        }
    }));

}, '@VERSION@' ,{requires:['button', 'test', 'node-event-simulate']});
