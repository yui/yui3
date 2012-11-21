YUI.add('basic-tests', function(Y) {

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Basic Tests',

        'should end at zero opacity': function() {
            var node = Y.one('#demo .yui3-remove'),
                test = this;

            node.on('click', function(e) {
                setTimeout(function() {
                    test.resume(function() {
                        Y.Assert.areEqual('0', Y.one('#demo').getStyle('opacity'));
                    });
                }, 1100);
            });

            setTimeout(function() {
                node.simulate('click');
            }, 0);
            test.wait(1500);
        }
    }));

}, '@VERSION@' ,{requires:['anim-base', 'test', 'node-event-simulate']});
