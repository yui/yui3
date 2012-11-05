YUI.add('yui-yui2-tests', function(Y) {

    var suite = new Y.Test.Suite('yui-yui2 example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'check example output': function() {
            var test = this,
                selectors = [
                    '#cropper_wrap',
                    '#cropper_wrap .yui-crop-mask',
                    '#cropper_wrap .yui-resize',
                    '#cropper_wrap .yui-resize-handle',
                    '.yui-crop'
                ]

            test.wait(function() {
                Y.Array.each(selectors, function(s) {
                    Assert.isNotNull(Y.one(s), 'Failed to find element: ' + s);
                });
            }, 4000);
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node' ] });
