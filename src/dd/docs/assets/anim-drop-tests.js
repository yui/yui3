YUI.add('anim-drop-tests', function(Y) {
    
    var Assert = Y.Assert,
        suite = new Y.Test.Suite('anim-drop');

    suite.add(new Y.Test.Case({
        name: 'anim-drop',
        'is rendered and dd attached': function() {
            var el = Y.one('#drag');
            Assert.isTrue(el.hasClass('yui3-dd-draggable'), 'Element does not have DD attached');
        },
        'are drop targets available': function() {
            var items = Y.all('.anim');
            items.each(function(i) {
                Assert.isTrue(i.hasClass('yui3-dd-drop'), 'Drop failed to initialize on ' + i.get('id'));
            });
        }
    }));

    Y.Test.Runner.add(suite);

});
