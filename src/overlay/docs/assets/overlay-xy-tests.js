YUI.add('overlay-xy-tests', function(Y) {

    var suite = new Y.Test.Suite('overlay-xy example test suite'),
        Assert = Y.Assert,
        overlay = Y.one('.example .yui3-overlay'),
        closeEnough = function(target, actual) {
            if (Math.abs(target - actual) < 2) {
                return true;
            } else {
                return false;
            }
        };

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test overlay renders': function() {
            Assert.isTrue((overlay !== null), ' - Failed to render overlay container');
            Assert.isTrue((Y.one('.example #overlay') !== null), ' - Failed to render #overlay');
        },
        'test initial position': function() {
            var homeXY = Y.one(".example #overlay-position").getXY(),
                initXY = [homeXY[0] + 30, homeXY[1] + 38];
            Assert.isTrue((closeEnough(initXY[0], overlay.getX())),' - Failed to move to correct X');
            Assert.isTrue((closeEnough(initXY[1], overlay.getY())),' - Failed to move to correct Y');
        },
        'test moving to new xy': function() {
            Y.one('.example #x').set('value', '237');
            Y.one('.example #y').set('value', '303');
            Y.one('.example #move').simulate('click');
            Assert.isTrue((closeEnough(237, overlay.getX())),' - Failed to move to correct X');
            Assert.isTrue((closeEnough(303, overlay.getY())),' - Failed to move to correct Y');
        },
        'test hide and show': function() {
            Y.one('.example #hide').simulate('click');
            Assert.areEqual('hidden', overlay.getStyle('visibility'), ' - Failed hide');
            Y.one('.example #show').simulate('click');
            Assert.areEqual('visible', overlay.getStyle('visibility'), ' - Failed show');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
