YUI.add('constrain-resize-plugin-tests', function(Y) {

    var Assert = Y.Assert,
        suite = new Y.Test.Suite('constrain-resize-plugin');
    
    suite.add(new Y.Test.Case({
        name: 'constrain-resize-plugin',
        'is rendered': function() {
            var test = this,
                timeout = 10000,
                button = Y.one('#launchOverlay'),
                condition = function() {
                    return button.get('value') === 'Launch Weather Widget';
                },
                success = function() {
                    Assert.pass('Components loaded');
                },
                failure = function() {
                    Assert.fail("Example does not seem to have executed within " + timeout + "ms.");
                };
            test.poll(condition, 100, timeout, success, failure);
        },
        'launch overlay': function() {
            var test = this,
                wrapper = Y.one('#weatherWidget').get('parentNode'),
                button = Y.one('#launchOverlay');

            Assert.isTrue(wrapper.hasClass('yui3-overlay-hidden'));

            button.simulate('click');

            test.wait(function() {
                Assert.isFalse(wrapper.hasClass('yui3-overlay-hidden'));
            }, 500);
        },
        'has 8 handles': function() {
            var wrapper = Y.one('#weatherWidget').get('parentNode'),
                handles = wrapper.all('.yui3-resize-handle');

            Assert.areEqual(8, handles.size());

            handles = wrapper.all('.yui3-resize-handle-inner');
            Assert.areEqual(8, handles.size());
        },
        'dd is active on resize': function() {
            var test = this,
                wrapper = Y.one('#weatherWidget').get('parentNode'),
                handle = wrapper.one('.yui3-resize-handle');
            
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
