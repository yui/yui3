YUI.add('drag-plugin-tests', function(Y) {
    
    var Assert = Y.Assert,
        suite = new Y.Test.Suite('drag-plugin');

    suite.add(new Y.Test.Case({
        name: 'drag-plugin',
        'is .demo rendered and dd attached': function() {
            var el = Y.one('.demo');
            Assert.isTrue(el.hasClass('yui3-dd-draggable'), 'Element does not have DD attached');
        },
        'is .luggage rendered and dd attached': function() {
            var el = Y.one('.luggage');
            Assert.isTrue(el.hasClass('yui3-dd-draggable'), 'Element does not have DD attached');
        },
        'check for .demo mousedown': function() {
            var el = Y.one('.demo .yui-hd');
            Assert.areEqual('', el.getAttribute('id'));
            el.simulate('mousedown', {
                pageX: 100,
                pageY: 100
            });
            el.simulate('mouseup');
            Assert.areNotEqual('', el.getAttribute('id'));
            
        },
        'check for .luggage mousedown': function() {
            var el = Y.one('.luggage .handle');
            Assert.areEqual('', el.getAttribute('id'));
            el.simulate('mousedown', {
                pageX: 100,
                pageY: 100
            });
            el.simulate('mouseup');
            Assert.areNotEqual('', el.getAttribute('id'));
            
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: ['node-event-simulate' ]  });
