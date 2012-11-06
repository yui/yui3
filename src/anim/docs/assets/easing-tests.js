YUI.add('easing-tests', function(Y) {

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Easing Tests',

        'should end at zero height': function() {
            var node = Y.one('#demo .yui3-toggle'),
                test = this;

            node.on('click', function(e) {
                setTimeout(function() {
                    test.resume(function() {
                        Y.Assert.areEqual(0, Y.one('#demo .yui3-bd').get('offsetHeight'));
                    });
                }, 1100);
            });

            setTimeout(function() {
                node.simulate('click');
            }, 0);
            test.wait(1500);
        }
    }));

}, '@VERSION@' ,{requires:['anim', 'test', 'node-event-simulate']});
