YUI.add('cssbutton-tests', function(Y){

    Y.Test.Runner.add(new Y.Test.Case({
        new: 'CSS Button Tests',

        'should contain 14 buttons': function() {
            Y.Assert.areSame(14, Y.all('.example .yui3-button').size());
        }

        
    }));

}, '@VERSION@', {requires: ['button', 'test']});
