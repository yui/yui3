YUI.add('node-style-tests', function(Y) {

    var suite = new Y.Test.Suite('node-style example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test click on box': function() {
            Y.one('.example #demo').simulate('click');
            Assert.areEqual('rgb(255, 0, 0)', Y.one('.example #demo').getComputedStyle('color'),'failed to set color of #demo text to red');
        },
        'test style information after clicked #demo': function() {
            var ddVal = Y.all('.example dd');
            Assert.areEqual('red', ddVal.item(0).getHTML(), 'failed to display value for getStyle.color');
            Assert.areEqual('rgb(255, 0, 0)', ddVal.item(1).getHTML(), 'failed to display value for getComputedStyle.color');
        },
        'reset the page so you can manually test it too': function() {
            Y.one('.example #demo').setStyle('color', 'black');
            var ddVal = Y.all('.example dd');
            ddVal.item(0).setHTML('black');
            ddVal.item(1).setHTML('rgb(0, 0, 0)');
            Assert.areEqual('rgb(0, 0, 0)', Y.one('.example #demo').getComputedStyle('color'),'failed to reset color of #demo text to black');
        }

    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
