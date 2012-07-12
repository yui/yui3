YUI.add('transition-basic-tests', function(Y) {

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'TabView Tests',

        'should shrink and fade the element': function() {
            var node = Y.one('#demo a'),
                test = this;

            node.on('click', function(e) {
                setTimeout(function() {
                    test.resume(function() {
                        Y.Assert.areEqual('0', Y.one('#demo').getStyle('opacity'));
                        Y.Assert.areEqual('0px', Y.one('#demo').getStyle('height'));
                        Y.Assert.areEqual('0px', Y.one('#demo').getStyle('width'));
                    });
                }, 1000);
            });

            setTimeout(function() {
                node.simulate('click');
            }, 0);
            test.wait(1100);
        }
    }));

}, '@VERSION@' ,{requires:['transition', 'test', 'node-event-simulate']});

