YUI.add('curve-tests', function(Y) {

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Curve Tests',

        'should end at final values': function() {
            var node = Y.one('#btn-animate'),
                test = this;

            node.on('click', function(e) {
                setTimeout(function() {
                    test.resume(function() {
                        var target = Y.one('#dot-3').getXY(),
                            actual = Y.one('#demo').getXY();

                        // IE off by 1
                        Y.Assert.isTrue(target[0] === actual[0] || (target[0] - 1 === actual[0]));
                        Y.Assert.isTrue(target[1] === actual[1] || (target[1] - 1 === actual[1]));
                    });
                }, 2500);
            });

            setTimeout(function() {
                node.simulate('click');
            }, 0);
            test.wait(3000);
        }
    }));

}, '@VERSION@' ,{requires:['anim', 'test', 'node-event-simulate']});
