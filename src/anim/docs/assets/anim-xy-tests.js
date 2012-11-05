YUI.add('anim-xy-tests', function(Y) {

    var node = Y.one('#demo-stage'),
        //xy = [Math.round(node.getX()) + 300, Math.round(node.getY() + 200)];
        xy = [0, 0]; // IE9: ignores clientX/Y

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'XY Tests',

        'should end at "to" values': function() {
                test = this;

            node.on('click', function(e) {
                setTimeout(function() {
                    test.resume(function() {
                        //Y.Assert.areEqual(xy[0], Y.one('#demo').getX());
                        //Y.Assert.areEqual(xy[1], Y.one('#demo').getY());
                        var demo = Y.one('#demo'),
                            x = demo.getX(),
                            y = demo.getY();
                        Y.Assert.isTrue(test.closeEnough(xy[0], x), "The value should equal " + x + " instead of " + xy[0] + ".");
                        Y.Assert.isTrue(test.closeEnough(xy[1], y), "The value should equal " + y + " instead of " + xy[1] + ".");
                    });
                }, 1200);
            });

            setTimeout(function() {
                node.simulate('click', {
                    clientX: xy[0], 
                    clientY: xy[1] 
                });
            }, 0);
            test.wait(1500);
        }
    }));

}, '@VERSION@' ,{requires:['anim', 'test', 'node-event-simulate']});
