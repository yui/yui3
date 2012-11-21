YUI.add('delegate-tests', function(Y) {
    
    var Assert = Y.Assert,
        suite = new Y.Test.Suite('delegate');

    suite.add(new Y.Test.Case({
        name: 'delegate',
        'is rendered': function() {
            var el = Y.one('#demo');
            Assert.isNotNull(el);
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
        },
        'adding more': function() {
            var len = Y.all('#demo li').size();
            Assert.areEqual(10, len, 'Failed to find 10 LIs');
            Y.one('#make').simulate('click');
            var len = Y.all('#demo li').size();
            Assert.areEqual(20, len, 'Failed to find 20 LIs');
        },
        'DD is still active on new items' : function() {
            var li = Y.all('#demo li').item(15);
            
            Assert.areEqual('New item #6', li.get('innerHTML'), 'Failed to get the right node');
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
        },
        'adding more again': function() {
            var len = Y.all('#demo li').size();
            Assert.areEqual(20, len, 'Failed to find 20 LIs');
            Y.one('#make').simulate('click');
            var len = Y.all('#demo li').size();
            Assert.areEqual(30, len, 'Failed to find 30 LIs');
        },
        'DD is still active on new items after second make' : function() {
            var li = Y.all('#demo li').item(26);
            
            Assert.areEqual('New item #7', li.get('innerHTML'), 'Failed to get the right node');
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
