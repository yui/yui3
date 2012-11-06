YUI.add('shim-drag-tests', function(Y) {
    
    var Assert = Y.Assert,
        suite = new Y.Test.Suite('shim-drag');

    suite.add(new Y.Test.Case({
        name: 'shim-drag',
        'is rendered and dd attached': function() {
            var el = Y.one('#demo');
            Assert.isTrue(el.hasClass('yui3-dd-draggable'), 'Element does not have DD attached');
        },
        'proxy element was created': function() {
            Assert.isNotNull(Y.one('.yui3-dd-proxy'));
        },
        'shim element was created': function() {
            Assert.isNotNull(Y.one('.yui3-dd-shim'));
        }
        //Add actual shim testing here later..
    }));

    Y.Test.Runner.add(suite);

});
