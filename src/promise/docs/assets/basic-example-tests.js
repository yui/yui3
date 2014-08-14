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
                Assert.areEqual('Loaded yui\'s data! <a href="https://github.com/yui">Link to profile</a>'.toLowerCase(), success.getHTML().toLowerCase(), 'Success template rendered incorrectly');
            }, function() {
                Assert.fail('Polling failed for success node');
            });
        }
    }));

    Y.Test.Runner.add(suite);
});
