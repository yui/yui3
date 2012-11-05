YUI.add('flow-example-tests', function(Y) {

    var suite = new Y.Test.Suite('flow-example example test suite'),
        Assert = Y.Assert,
        output = Y.one('.example #log'),
        fireBtn = Y.one('.example #fire');

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test initial output box': function() {
            Assert.isTrue((output.getHTML().indexOf('Custom Event log messages will appear here.') > -1), ' - Failed to find correct initial output message');
        },
        'test click "Fire testEvent" button with no checkboxes': function() {
            fireBtn.simulate('click');
            Assert.isTrue((output.getHTML().indexOf('testEvent subscriber fired on the publisher object.') > -1), ' - Failed on item item 1 of 3');
            Assert.isTrue((output.getHTML().indexOf('testEvent fired on the BubbleTarget object.') > -1), ' - Failed on item 2 of 3');
            Assert.isTrue((output.getHTML().indexOf('defaultFn: testEvent\'s defaultFn executed.') > -1), ' - Failed on item 3 of 3');
        },
        'test click "Fire testEvent" button with Stop Propagation checked': function() {
            Y.one('#stopPropagation').set('checked', 'checked');
            fireBtn.simulate('click');
            Assert.isTrue((output.getHTML().indexOf('testEvent subscriber fired on the publisher object.') > -1), ' - Failed on item 1 of 3');
            Assert.isTrue((output.getHTML().indexOf('stoppedFn: A subscriber to testEvent called stopPropagation().') > -1), ' - Failed on item 2 of 3');
            Assert.isTrue((output.getHTML().indexOf('defaultFn: testEvent\'s defaultFn executed.') > -1), ' - Failed on item 3 of 3');
        },
        'test click "Fire testEvent" button with Prevent Default checked': function() {
            Y.one('#stopPropagation').set('checked', '');
            Y.one('#preventDefault').set('checked', 'checked');
            fireBtn.simulate('click');
            Assert.isTrue((output.getHTML().indexOf('testEvent subscriber fired on the publisher object.') > -1), ' - Failed on item 1 of 3');
            Assert.isTrue((output.getHTML().indexOf('testEvent fired on the BubbleTarget object.') > -1), ' - Failed on item 2 of 3');
            Assert.isTrue((output.getHTML().indexOf('preventedFn: A subscriber to testEvent called preventDefault().') > -1), ' - Failed on item 3 of 3');
        },
        'test click "Fire testEvent" button with Prevent Default and Stop Propagation checked': function() {
            Y.one('#stopPropagation').set('checked', 'checked');
            Y.one('#preventDefault').set('checked', 'checked');
            fireBtn.simulate('click');
            Assert.isTrue((output.getHTML().indexOf('testEvent subscriber fired on the publisher object.') > -1), ' - Failed on item 1 of 3');
            Assert.isTrue((output.getHTML().indexOf('stoppedFn: A subscriber to testEvent called stopPropagation().') > -1), ' - Failed on item 2 of 3');
            Assert.isTrue((output.getHTML().indexOf('preventedFn: A subscriber to testEvent called preventDefault().') > -1), ' - Failed on item 3 of 3');
        }
}));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
