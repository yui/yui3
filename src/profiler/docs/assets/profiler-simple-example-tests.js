YUI.add('profiler-simple-example-tests', function(Y) {
    
    var Assert = Y.Assert,
        suite = new Y.Test.Suite('profiler-simple-example');

    suite.add(new Y.Test.Case({
        name: 'profiler-simple-example',
        'is rendered': function() {
            var condition = function() {
                var pre = Y.one('#results pre');
                return pre && pre.get('children');
            },
            success = function() {
                var html = Y.one('#results pre').get('innerHTML');
                Assert.isTrue((html.indexOf('Method Y.example.profiler.MathHelper was run') === 0));
                Assert.isTrue((html.indexOf('The average time was') > 0));
                Assert.isTrue((html.indexOf('The max time was') > 0));
                Assert.isTrue((html.indexOf('The min time was') > 0));
            },
            failure = function() {
                Y.Assert.fail('Test Polling Failed');
            };

            this.poll(condition, 100, 1000, success, failure);
        }
    }));

    Y.Test.Runner.add(suite);
});
