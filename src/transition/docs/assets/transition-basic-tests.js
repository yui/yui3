YUI.add('transition-basic-tests', function(Y) {

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'TabView Tests',

        'should shrink and fade the element': function() {
            var node = Y.one('#demo a'),
                test = this,
                demo = Y.one('#demo'); //setting the variable outside of the click handler prevents win8 metro error. It is still unexplained and should be explored further.

            node.on('click', function(e) {
                setTimeout(function() {
                    test.resume(function() {
                        Y.Assert.areEqual('0', demo.getStyle('opacity'));
                        Y.Assert.areEqual('0px', demo.getStyle('height'));
                        Y.Assert.areEqual('0px', demo.getStyle('width'));
                    });
                }, 2000);
            });

            setTimeout(function() {
                node.simulate('click');
            }, 0);
            test.wait(2200);
        }
    }));

}, '@VERSION@' ,{requires:['transition', 'test', 'node-event-simulate']});

