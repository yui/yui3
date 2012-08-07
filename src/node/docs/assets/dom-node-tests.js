YUI.add('dom-node-tests', function(Y) {

    var suite = new Y.Test.Suite('dom-node example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test click on ipsum on the left side': function() {
            Y.all('.example #demo li').item(1).simulate('click');
            Assert.isTrue((Y.one('.example #demo2').getHTML().indexOf('Cat') > -1),'failed to add ipsum to right side');
        },
        'test click on foo on the right side to remove': function() {
            Y.all('.example #demo2 li').item(0).simulate('click');
            Assert.isTrue((Y.one('.example #demo2').getHTML().indexOf('Wheelbarrow') === -1),'failed to remove foo from the right side');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
