YUI.add('image-resize-tests', function(Y) {

    var Assert = Y.Assert,
        suite = new Y.Test.Suite('image-resize');

    suite.add(new Y.Test.Case({
        name: 'image-resize',
        'is rendered': function() {
            var el = Y.one('#demoContainer');

            Assert.isNotNull(el);
            Assert.isTrue(el.hasClass('yui3-resize-knob'));
        },
        'has 8 handles': function() {
            var handles = Y.all('#demoContainer .yui3-resize-handle');
            Assert.areEqual(8, handles.size());

            var handles = Y.all('#demoContainer .yui3-resize-handle-inner');
            Assert.areEqual(8, handles.size());
        },
        'dd is active on resize': function() {
            var test = this,
                handle = Y.one('#demoContainer .yui3-resize-handle');
            
            Assert.isFalse(handle.hasClass('yui3-dd-draggable'));
            Assert.isFalse(handle.hasClass('yui3-dd-dragging'));
            Assert.isFalse(handle.hasClass('yui3-resize-handle-active'));

            handle.simulate('mousedown', {
                pageX: 100,
                pageY: 100
            });

            test.wait(function() {
                Assert.isTrue(handle.hasClass('yui3-dd-draggable'));
                Assert.isTrue(handle.hasClass('yui3-dd-dragging'));
                Assert.isTrue(handle.hasClass('yui3-resize-handle-active'));
                handle.simulate('mouseup');
            }, 300);

        }
    }));

    Y.Test.Runner.add(suite);


}, '', { requires: [ 'node-event-simulate' ] });
