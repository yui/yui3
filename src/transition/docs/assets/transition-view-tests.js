YUI.add('transition-view-tests', function(Y) {

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Transition Tests',

        'should hide the element': function() {
            var node = Y.one('#hide'),
                test = this;

            node.on('click', function(e) {
                setTimeout(function() {
                    test.resume(function() {
                        test.assert(Y.one('.demo').getStyle('display') === 'none');
                    });
                }, 1000);
            });

            setTimeout(function() {
                node.simulate('click');
            }, 0);
            test.wait(2000);
        },

        'should show the element': function() {
            var node = Y.one('#show'),
                test = this;

            node.on('click', function(e) {
                setTimeout(function() {
                    test.resume(function() {
                        test.assert(Y.one('.demo').getStyle('display') === 'block');
                    });
                }, 1000);
            });

            setTimeout(function() {
                node.simulate('click');
            }, 0);
            test.wait(2000);
        }
    }));

}, '@VERSION@' ,{requires:['transition', 'test', 'node-event-simulate']});

