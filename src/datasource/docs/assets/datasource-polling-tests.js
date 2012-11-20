YUI.add('datasource-polling-tests', function(Y) {

    var suite = new Y.Test.Suite('datasource-polling example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',

        'test polling every second': function() {
            Assert.areEqual('jeff', 'jeff', 'failed');
            var test = this,
                output = Y.one('.example #demo_output_polling'),
                outputStr;

            Y.one('.example #demo_enable').simulate('click');

             var foo = function() {
                setTimeout(function() {
                    test.resume(function() {
                        var delayedOutputStr = output.getHTML();
                        Assert.isTrue((outputStr !== delayedOutputStr), ' - Failed to get a different time after 3 seconds');
                    });
                }, 3000);
            };

            setTimeout(function() {
                outputStr = output.getHTML();
                foo();
            }, 2000);
            test.wait(6000);
        },
        'test end polling': function() {
            Assert.areEqual('jeff', 'jeff', 'failed');
            var test = this,
                output = Y.one('.example #demo_output_polling'),
                outputStr;

            Y.one('.example #demo_disable').simulate('click');

             var foo = function() {
                setTimeout(function() {
                    test.resume(function() {
                        var delayedOutputStr = output.getHTML();
                        Assert.isTrue((outputStr === delayedOutputStr), ' - Failed to get the same time after stopping polling for 3 seconds');
                    });
                }, 2000);
            };

            setTimeout(function() {
                outputStr = output.getHTML(); // capture current time
                foo();
            }, 1000);
            test.wait(4000);
        }

}));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
