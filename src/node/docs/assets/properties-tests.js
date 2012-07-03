YUI.add('properties-tests', function(Y) {

    var suite = new Y.Test.Suite('properties example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test clicking on the get button': function() {
            Y.one('.example .btn-get').simulate('click');
            Assert.areEqual('232px', Y.one('.example #output').getHTML(), 'failed to get the correct initial width');
        },
        'test clicking on the set button': function() {
            Y.one('.example .btn-set').simulate('click');
            Assert.areEqual('? px', Y.one('.example #output').getHTML(), 'failed to reset ruler text to "? px"');
            Assert.areEqual('550', Y.one('.example #corn').get('offsetWidth'), 'failed to get the correct corn width');
        },
        'test setting specific width': function() {

            Y.one('.example #input').set('value', '346');
            Y.one('.example .btn-set').simulate('click');
            Assert.areEqual('? px', Y.one('.example #output').getHTML(), 'failed to reset ruler text to "? px"');
            Assert.areEqual('346', Y.one('.example #corn').get('offsetWidth'), 'failed to get the correct corn width');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
