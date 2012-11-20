YUI.add('constrained-drag-tests', function(Y) {
    
    var Assert = Y.Assert,
        suite = new Y.Test.Suite('constrained-drag');

    suite.add(new Y.Test.Case({
        name: 'constrained-drag',
        'is rendered and dd attached': function() {
            var el = Y.one('#dd-demo-1');
            Assert.isTrue(el.hasClass('yui3-dd-draggable'), 'Element does not have DD attached');

            var el = Y.one('#dd-demo-2');
            Assert.isTrue(el.hasClass('yui3-dd-draggable'), 'Element does not have DD attached');

            var el = Y.one('#dd-demo-3');
            Assert.isTrue(el.hasClass('yui3-dd-draggable'), 'Element does not have DD attached');
        }
    }));

    Y.Test.Runner.add(suite);

});
