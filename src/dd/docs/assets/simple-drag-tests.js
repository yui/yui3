YUI.add('simple-drag-tests', function(Y) {
    
    var Assert = Y.Assert,
        suite = new Y.Test.Suite('simple-drag');

    suite.add(new Y.Test.Case({
        name: 'simple-drag',
        'is rendered and dd attached': function() {
            var el = Y.one('#demo');
            Assert.isTrue(el.hasClass('yui3-dd-draggable'), 'Element does not have DD attached');
        }
    }));

    Y.Test.Runner.add(suite);

});
