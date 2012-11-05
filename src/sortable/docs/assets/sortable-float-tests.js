YUI.add('sortable-float-tests', function(Y) {

    var Assert = Y.Assert,
        suite = new Y.Test.Suite('sortable-float');

    suite.add(new Y.Test.Case({
        name: 'sortable-float',
        'is rendered': function() {
            var el = Y.one('#demo');

            Assert.isNotNull(el, '#demo not on page');
            Assert.isTrue(el.hasClass('yui3-dd-drop'), 'dd-drop not attached parent');
        },
        'has multiple drops': function() {
            var ems = Y.all('#demo em');

            ems.each(function(el) {
                Assert.isNotNull(el);
                Assert.isTrue(el.hasClass('yui3-dd-drop'), 'dd-drop not attached to child');
            });
        },
        'delegate is attached': function() {
            var el = Y.one('#demo em');

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
