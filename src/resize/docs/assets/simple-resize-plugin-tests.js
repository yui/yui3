YUI.add('simple-resize-plugin-tests', function(Y) {

    var Assert = Y.Assert,
        suite = new Y.Test.Suite('simple-resize-plugin');

    suite.add(new Y.Test.Case({
        name: 'simple-resize-plugin',
        setUp: function() {
            this.overlay = Y.one('#overlay');
            this.wrapper = this.overlay.get('parentNode');
        },
        'is rendered': function() {
            
            var el = this.overlay;
            Assert.isNotNull(el);
            Assert.isTrue(el.hasClass('yui3-overlay-content'));
            Assert.isTrue(el.hasClass('yui3-widget-stdmod'));
            Assert.isTrue(el.get('parentNode').hasClass('yui3-overlay-hidden'));
        },
        'show overlay': function() {
            var button = Y.one('#launchOverlay'),
                wrapper = this.wrapper;

            button.simulate('click');

            this.wait(function() {
                Assert.isFalse(wrapper.hasClass('yui3-overlay-hidden'));
            }, 500);
        },
        'click resizeOverlay': function() {
            var button = Y.one('#resizeOverlay'),
                wrapper = this.wrapper;

            button.simulate('click');

            this.wait(function() {
                Assert.isTrue(wrapper.hasClass('yui3-resize'));
            }, 500);
        },
        'did resize render': function() {
            var handles = this.wrapper.all('.yui3-resize-handle');
            
            Assert.areEqual(8, handles.size());
        },
        'dd is active on resize': function() {
            var test = this,
                handle = this.wrapper.one('.yui3-resize-handle');
            
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
        },
        'click dragOverlay': function() {
            var button = Y.one('#dragOverlay'),
                wrapper = this.wrapper;

            button.simulate('click');

            this.wait(function() {
                Assert.isTrue(wrapper.hasClass('yui3-dd-draggable'));
            }, 500);
        }
    }));

    Y.Test.Runner.add(suite);


}, '', { requires: [ 'node-event-simulate' ] });
