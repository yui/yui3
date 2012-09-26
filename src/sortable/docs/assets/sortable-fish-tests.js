YUI.add('sortable-fish-tests', function(Y) {

    var Assert = Y.Assert,
        suite = new Y.Test.Suite('sortable-multi');

    suite.add(new Y.Test.Case({
        name: 'sortable-multi',
        '#list1 is rendered': function() {
            var el = Y.one('#list1');

            Assert.isNotNull(el, '#list1 not on page');
            Assert.isTrue(el.hasClass('yui3-dd-drop'), 'dd-drop not attached parent');
        },
        '#list2 is rendered': function() {
            var el = Y.one('#list2');

            Assert.isNotNull(el, '#list2 not on page');
            Assert.isTrue(el.hasClass('yui3-dd-drop'), 'dd-drop not attached parent');
        },
        '#list1 has multiple drops': function() {
            var lis = Y.all('#list1 li');

            lis.each(function(el) {
                Assert.isNotNull(el);
                Assert.isTrue(el.hasClass('yui3-dd-drop'), 'dd-drop not attached to child');
            });
        },
        '#list2 has multiple drops': function() {
            var lis = Y.all('#list2 li');

            lis.each(function(el) {
                Assert.isNotNull(el);
                Assert.isTrue(el.hasClass('yui3-dd-drop'), 'dd-drop not attached to child');
            });
        },
        '#list1 delegate is attached': function() {
            var el = Y.one('#list1 li');

            Assert.isFalse(el.hasClass('yui3-dd-draggable'));
            el.simulate('mousedown', {
                pageX: 100,
                pageY: 100
            });
            Assert.isTrue(el.hasClass('yui3-dd-draggable'));
            
            el.simulate('mouseup');
            Assert.isFalse(el.hasClass('yui3-dd-draggable'));
        },
        '#list2 delegate is attached': function() {
            var el = Y.one('#list2 li');

            Assert.isFalse(el.hasClass('yui3-dd-draggable'));
            el.simulate('mousedown', {
                pageX: 100,
                pageY: 100
            });
            Assert.isTrue(el.hasClass('yui3-dd-draggable'));
            
            el.simulate('mouseup');
            Assert.isFalse(el.hasClass('yui3-dd-draggable'));
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node-event-simulate' ] });
