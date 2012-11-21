YUI.add('end-event-tests', function(Y) {

    var fromHeight = Y.one('#demo .yui3-bd').getComputedStyle('height');
    Y.Test.Runner.add(new Y.Test.Case({
        name: 'End Event Tests',

        'should end at "to" values and remove from document': function() {
            var node = Y.one('#demo .yui3-remove'),
                demo = Y.one('#demo'),
                test = this;

            node.once('click', function(e) {
                e.preventDefault();
                setTimeout(function() {
                    test.resume(function() {
                        Y.Assert.areEqual('0', demo.getStyle('opacity'));
                        Y.Assert.isNull(Y.one('#demo'));
                    });
                }, 1200);
            });

            setTimeout(function() {
                node.simulate('click');
            }, 0);
            test.wait(1500);
        }
    }));

}, '@VERSION@' ,{requires:['anim-base', 'test', 'node-event-simulate']});
