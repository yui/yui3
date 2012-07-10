YUI.add('overlay-align-tests', function(Y) {

    var suite = new Y.Test.Suite('overlay-align example test suite'),
        Assert = Y.Assert,
        overlay = Y.one('.example .yui3-overlay'),
        nextAlignBtn = Y.one('#align'),
        offBy = 4; // IE exact pixels do not match the expected.

    var closeEnough = function(shouldBe, is) {
        if ( (is >= shouldBe - offBy) && (is <= shouldBe + offBy) ){
            return true;
        } else {
            return false;
        }
    }

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'example has images': function() {
            var imgs = Y.all('.example .content img');

            Assert.areEqual(1, imgs.size(), 'Failed to render images');
        },
        'test overlay renders': function() {
            Assert.isTrue((overlay !== null), ' - Failed to render overlay container');
            Assert.isTrue((Y.one('.example #overlay-align') !== null), ' - Failed to render #overlay-align');
        },
        'test align1 position': function() {
            var alignedTo = Y.one('.aligned-to'),
                left = overlay.getX(),
                leftTarget =  (alignedTo.getX() + alignedTo.get('offsetWidth')),
                top = overlay.getY(),
                topTarget =  alignedTo.getY();
            Assert.isTrue((closeEnough(leftTarget, left)), ' - Failed to position left');
            Assert.isTrue((closeEnough(topTarget, top)), ' - Failed to position top');
        },
        'test align2 position': function() {
            nextAlignBtn.simulate('click');
            var alignedTo = Y.one('.aligned-to'),
                left = overlay.getX(),
                top = overlay.getY(),
                leftTarget = (alignedTo.getX() + ((alignedTo.get('offsetWidth') - overlay.get('offsetWidth')) / 2)),
                topTarget = (alignedTo.getY() + ((alignedTo.get('offsetHeight') - overlay.get('offsetHeight')) / 2));
            Assert.isTrue((closeEnough(leftTarget, left)), ' - Failed to position left');
            Assert.isTrue((closeEnough(topTarget, top)), ' - Failed to position top');
        },
        'test align3 position': function() {
            nextAlignBtn.simulate('click');

            var alignedTo = Y.one('.aligned-to'),
                left = overlay.getX(),
                leftTarget =  alignedTo.getX() - ((overlay.get('offsetWidth') - alignedTo.get('offsetWidth')) / 2),
                top = overlay.getY(),
                topTarget =  (alignedTo.getY() + alignedTo.get('offsetHeight'));
            Assert.isTrue((closeEnough(leftTarget, left)), ' - Failed to position left');
            Assert.isTrue((closeEnough(topTarget, top)), ' - Failed to position top');
        },
//         'test align4 position': function() {    // align to r of window
//             nextAlignBtn.simulate('click');
//             // skipping over this one
//         },
        'test align6 position': function() {
            nextAlignBtn.simulate('click'); //skipping the align to window right
            nextAlignBtn.simulate('click'); //skipping the align to window center
            nextAlignBtn.simulate('click');
            var left = parseInt(overlay.getStyle('left'), 10),
                top = parseInt(overlay.getStyle('top'), 10),
                leftTarget = (Y.one('.aligned-to').get('offsetWidth') - overlay.get('offsetWidth')) / 2,
                topTarget = (Y.one('.aligned-to').get('offsetHeight') - overlay.get('offsetHeight')) / 2;
            Assert.isTrue((closeEnough(leftTarget, left)), ' - Failed to position left');
            Assert.isTrue((closeEnough(topTarget, top)), ' - Failed to position top');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
