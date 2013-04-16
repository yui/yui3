YUI.add('subclass-example-tests', function (Y) {

    var Assert = Y.Assert,
        suite = new Y.Test.Suite('subclass-example');

    suite.add(new Y.Test.Case({
        name: 'Basic Promise tests',

        'is rendered': function () {
            Assert.isNotNull(Y.one('#demo'));
        },

        'test correct results from GitHub API': function () {
            var node = Y.one('#demo'),
                expectedOutput = '<div>Fetching GitHub data for users: "yui", "yahoo" and "davglass"...</div><div>Getting name for user "yui"...</div><div>Getting name for user "yahoo"...</div><div>Getting name for user "davglass"...</div><div>Checking if the name "YUI Library" starts with "Y"...</div><div>Checking if the name "Yahoo! Inc." starts with "Y"...</div><div>Checking if the name "Dav Glass" starts with "Y"...</div><div>Done!</div><div>0. YUI Library</div><div>1. Yahoo! Inc.</div>';

            this.poll(function() {
                return node.get('children').size() > 1;
            }, 100, 10000, function () {
                Assert.areEqual(expectedOutput, node.getHTML(), 'Request output does not match');
            }, function() {
                Assert.fail('Polling failed for success node');
            });
        }

    }));

    Y.Test.Runner.add(suite);
});
