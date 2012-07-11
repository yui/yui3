YUI.add('dialog-tests', function(Y) {

    var suite = new Y.Test.Suite('dialog example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test click Show Dialog button': function() {
            Assert.areEqual('hidden', Y.one('#dialog').getStyle('visibility'),' - Failed to instantiate #dialog with hidden visibility');
            Y.one('.example .btn-show').simulate('click');
            Assert.areEqual('visible', Y.one('#dialog').getStyle('visibility'),' - Failed to make #dialog visible');
        },
        'test message': function() {
            var msg = Y.one('.example .message'),
                radios = Y.all('.example [type=radio]');

            Assert.areEqual('Are you sure you want to [take some action]?', msg.getHTML(), ' - Failed to have proper initial message');
            Assert.isTrue((msg.hasClass('icon-warn')), ' - Failed to find correct message class icon-warn');
            radios.item(3).simulate('click');
            Assert.isTrue((msg.hasClass('icon-question')), ' - Failed to find correct message class icon-question');
            radios.item(5).simulate('click');
            Assert.isTrue((msg.hasClass('icon-success')), ' - Failed to find correct message class icon-success');
        },
         'test changing message text': function() {
            var msg = Y.one('.example .message');
            Y.one('.example textarea').setHTML('You successfully created a new [something].');
            Y.one('.example textarea').simulate('keyup');
            Assert.areEqual('You successfully created a new [something].', msg.getHTML(), ' - Failed to update dialog message');
        },
         'test clicking OK button on dialog': function() {
            var okBtn = Y.one('.example #dialog .yui3-widget-buttons button');
            okBtn.simulate('click');
            Assert.areEqual('hidden', Y.one('#dialog').getStyle('visibility'),' - Failed to hide #dialog');
        },
        'test click Show Dialog button after dialog was hidden': function() {
            Y.one('.example .btn-show').simulate('click');
            Assert.areEqual('visible', Y.one('#dialog').getStyle('visibility'),' - Failed to make #dialog visible');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
