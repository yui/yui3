YUI.add('panel-drag-tests', function(Y) {
    var Assert = Y.Assert,
        suite = new Y.Test.Suite('drag-plugin');

    suite.add(new Y.Test.Case({
        name: 'drag-plugin',
        'is example rendered and dd attached': function() {
            var el = Y.one('.example .yui3-panel');
            Assert.isTrue(el.hasClass('yui3-dd-draggable'), 'Element does not have DD attached');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: ['node-event-simulate' ]  });
