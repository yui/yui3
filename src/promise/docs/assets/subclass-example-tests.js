YUI.add('subclass-example-tests', function (Y) {

    var Assert = Y.Assert,
        ArrayAssert = Y.ArrayAssert,
        suite = new Y.Test.Suite('subclass-example');

    suite.add(new Y.Test.Case({
        name: 'Basic Promise tests',

        'is rendered': function () {
            Assert.isNotNull(Y.one('#demo'));
        },

        'test correct results from GitHub API': function () {
            var node = Y.one('#demo'),
                expectedOutput = [
                    'Fetching GitHub data for users: "yui", "yahoo" and "davglass"...',
                    'Getting name for user "yui"...',
                    'Getting name for user "yahoo"...',
                    'Getting name for user "davglass"...',
                    'Checking if the name "YUI Library" starts with "Y"...',
                    'Checking if the name "Yahoo Inc." starts with "Y"...',
                    'Checking if the name "Dav Glass" starts with "Y"...',
                    'Done!',
                    '0. YUI Library',
                    '1. Yahoo Inc.'
                ];

            this.poll(function() {
                return node.get('children').size() === 10;
            }, 100, 10000, function () {
                var children = node.get('children'),
                    data = children.get('text');

                ArrayAssert.itemsAreSame(expectedOutput, data);
            }, function() {
                Assert.fail('Polling failed for success node');
            });
        }

    }));

    Y.Test.Runner.add(suite);
});
