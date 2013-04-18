YUI.add('basic-example-tests', function (Y) {
    
    var Assert = Y.Assert,
        suite = new Y.Test.Suite('basic-example');

    suite.add(new Y.Test.Case({
        name: 'Basic Promise tests',

        'is rendered': function () {
            Assert.isNotNull(Y.one('#demo'));
        },

        'loaded yui user': function () {
            var test = this;

            this.poll(function() {
                return !!Y.one('#demo .success');
            }, 100, 10000, function () {
                var success = Y.one('#demo .success');
                Assert.areEqual('Loaded yui\'s data! <a href="https://github.com/yui">Link to profile</a>', success.getHTML(), 'Success template rendered incorrectly');
            }, function() {
                Assert.fail('Polling failed for success node');
            });
        },

        'loaded unexisting user': function () {
            this.poll(function() {
                return !!Y.one('#demo .error');
            }, 100, 10000, function () {
                var failure = Y.one('#demo .error');
                // Do not check specifically for the message error.
                // It is provided by GitHub and it might change
                Assert.isTrue(failure.getHTML().length > 0, 'Missing error message');
            }, function() {
                Assert.fail('Polling failed for error node');
            });
        }
    }));

    Y.Test.Runner.add(suite);
});
