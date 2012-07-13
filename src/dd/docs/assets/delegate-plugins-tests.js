YUI.add('delegate-plugins-tests', function(Y) {
    
    var Assert = Y.Assert,
        suite = new Y.Test.Suite('delegate-plugins');

    suite.add(new Y.Test.Case({
        name: 'delegate-plugins',
        'is rendered': function() {
            var el = Y.one('#demo');
            Assert.isNotNull(el, '#demo is null');
            
        },
        'drop is rendered': function() {
            var el = Y.one('#drop');
            Assert.isNotNull(el, '#drop is null');
            Assert.isTrue(el.hasClass('yui3-dd-drop'), 'Failed it init drop');
            
        },
        'DD is active': function() {
            var li = Y.one('#demo li');

            Assert.isFalse(li.hasClass('yui3-dd-draggable'), 'item has a dd class');
            Assert.areEqual('', li.get('id'), 'Item has an id');
            li.simulate('mousedown', {
                pageX: 100,
                pageY: 100
            });
            Assert.areNotEqual('', li.get('id'), 'Item does not have an id');
            Assert.isTrue(li.hasClass('yui3-dd-draggable'), 'item does not have dd class');

            li.simulate('mouseup', {
                pageX: 100,
                pageY: 100
            });
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node-event-simulate' ] });
