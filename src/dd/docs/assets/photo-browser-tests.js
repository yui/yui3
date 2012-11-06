YUI.add('photo-browser-tests', function(Y) {
    
    var Assert = Y.Assert,
        suite = new Y.Test.Suite('photo-browser');

    suite.add(new Y.Test.Case({
        name: 'photo-browser',
        'photoList is rendered and drop attached': function() {
            var lis = Y.all('#photoList li');
            lis.each(function(item) {
                if (!item.hasClass('all')) { //skip the first one
                    Assert.isTrue(item.hasClass('yui3-dd-drop'), 'Drop not initialized: ' + item.get('id'));
                }
            });
        },
        'proxy element was created': function() {
            var test = this;
            test.wait(function() {
                Assert.isNotNull(Y.one('.yui3-dd-proxy'), 'Failed to find the DD proxy element');
            }, 5000);
        },
        'are pictures there and draggable': function() {
            var lis = Y.all('#yui-main .yui-b .yui-g li');

            Assert.isTrue((lis.size() > 50), 'At least 50 images should be rendered');

            lis.each(function(item) {
                Assert.isTrue(item.hasClass('yui3-dd-draggable'), 'Failed to register dd object');
            });
        },
        'did slider render': function() {
            var span = Y.one('.horiz_slider span');

            Assert.isNotNull(span, 'Slider failed to render');
            Assert.isTrue(span.hasClass('yui3-widget'));
            Assert.isTrue(span.hasClass('yui3-sliderbase'));
            Assert.isTrue(span.hasClass('yui3-slider'));
        }
    }));

    Y.Test.Runner.add(suite);

});
