YUI.add('cropper-tests', function (Y) {

var Assert = Y.Assert,
    cropper,
    resizeKnob;

var testCase = new Y.Test.Case({
    'test: loading': function () {
        Assert.isFunction(Y.ImageCropper);
    },
    'test: instantiation': function () {
        cropper = new Y.ImageCropper({
            srcNode: '#imagecropper',
            width: 333,
            height: 500
        });
        cropper.render();
        resizeKnob = cropper.get('resizeKnob');

        Assert.isInstanceOf(Y.Widget, cropper);
        Assert.isInstanceOf(Y.ImageCropper, cropper);
    },
    'test: arrow down': function () {
        var prevY = resizeKnob.getY();

        cropper._moveResizeKnob({
            type: 'arrow',
            direction: 's',
            shiftKey: false,
            preventDefault: function(){}
        });

        Assert.areEqual(prevY + cropper.get('keyTick'), resizeKnob.getY(), 'The resizeKnob should move with the keyboard');
    },
    'test: arrow up': function () {
        var prevY = resizeKnob.getY();

        cropper._moveResizeKnob({
            type: 'arrow',
            direction: 'n',
            shiftKey: false,
            preventDefault: function(){}
        });

        Assert.areEqual(prevY - cropper.get('keyTick'), resizeKnob.getY(), 'The resizeKnob should move with the keyboard');
    },
    'test: source change': function () {
        var newSource = 'assets/test-picture2.jpg';
        cropper.setAttrs({
            source: newSource
        });

        Assert.isTrue(cropper.get('contentBox').get('src').indexOf(newSource) > -1, 'contentBox should change src');
        Assert.isTrue(resizeKnob.getComputedStyle('backgroundImage').indexOf(newSource) > -1, 'resizeKnob should change background image');
    },
    'test: destroy': function () {
        cropper.destroy();
        
        Assert.isTrue(cropper.get('destroyed'));
        Assert.isUndefined(resizeKnob.hasPlugin(Y.Plugin.Resize), 'The resizeKnob should not be plugged with Resize anymore');
        Assert.isUndefined(resizeKnob.hasPlugin(Y.Plugin.Drag), 'The resizeKnob should not be plugged with Drag anymore');
    }
});

    Y.Test.Runner.add(new Y.Test.Suite("ImageCropper").add(testCase));

});