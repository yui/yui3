YUI.add('reverse-tests', function(Y) {

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Reverse Tests',

        'should end at "to" values': function() {
            var node = Y.one('#demo .yui3-toggle'),
                test = this;

            node.once('click', function(e) {
                e.preventDefault();
                setTimeout(function() {
                    test.resume(function() {
                        Y.Assert.areEqual('0', Y.one('#demo .yui3-bd').get('offsetHeight'));
                    });
                }, 1200);
            });

            setTimeout(function() {
                node.simulate('click');
            }, 0);
            test.wait(1500);
        },

        'should end at "from" values': function() {
            var node = Y.one('#demo .yui3-toggle'),
                fromHeight = Y.one('#demo .yui3-bd').get('scrollHeight'),
                test = this;

            node.once('click', function(e) {
                e.preventDefault();
                setTimeout(function() {
                    test.resume(function() {
                        Y.Assert.areEqual(fromHeight, Y.one('#demo .yui3-bd').get('offsetHeight'));
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
