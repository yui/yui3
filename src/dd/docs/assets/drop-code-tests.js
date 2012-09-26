YUI.add('drop-code-tests', function(Y) {
    
    var Assert = Y.Assert,
        suite = new Y.Test.Suite('drop-code');

    suite.add(new Y.Test.Case({
        name: 'drop-code',
        'is rendered and dd attached': function() {
            var els = Y.all('.drag');
            els.each(function(dd) {
                Assert.isTrue(dd.hasClass('yui3-dd-draggable'), 'Element does not have DD attached: ' + dd.get('id'));
            });
        },
        'drop attached': function() {
            var el = Y.one('#drop');
            Assert.isTrue(el.hasClass('yui3-dd-drop'), 'Failed to attach drop target');
        }
    }));

    Y.Test.Runner.add(suite);

});
