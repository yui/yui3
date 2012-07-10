YUI.add('events-tests', function(Y) {

    var suite = new Y.Test.Suite('events example test suite'),
        Assert = Y.Assert,
        // work around for #2532482 IE
        dropZeros = function(rgb){
            return rgb.replace(/\s/g, '');
        };
    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'example has images': function() {
            var imgs = Y.all('.example img');

            Assert.areEqual(1, imgs.size(), 'Failed to render images');
        },
        'Test: clicking on <code> DOM item': function() {






            Y.one('.example strong').simulate('click');
            Assert.isTrue((Y.one('.example #event-result').getHTML().indexOf('>click</') > -1),'&#8226; failed to update the event-result for "click"');
            Assert.isTrue((Y.one('.example #event-result').getHTML().indexOf('>STRONG</') > -1),'&#8226; failed to update the event-result for "code"');
            Assert.areEqual(dropZeros(Y.one('.example strong').getComputedStyle('color')), dropZeros(Y.one('.example #event-result .dd-color').getComputedStyle('backgroundColor')), '&#8226; Failed to set color of target\'s font');
            Assert.isTrue((Y.one('.example #event-result').getHTML().indexOf('>DIV#container</') > -1),'&#8226; failed to update the event-result for "tag name and ID"');
        },
        'Test: clicking on <img> DOM item': function() {
            Y.one('.example img').simulate('click');
            Assert.isTrue((Y.one('.example #event-result').getHTML().indexOf('>IMG</') > -1),'&#8226; failed to update the event-result for "img"');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
