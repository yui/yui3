YUI.add('profiler-object-example-tests', function(Y) {
    
    var Assert = Y.Assert,
        suite = new Y.Test.Suite('profiler-object-example');

    suite.add(new Y.Test.Case({
        name: 'profiler-object-example',
        'is rendered': function() {
            var condition = function() {
                var pre = Y.one('#results pre');
                return pre;
            },
            success = function() {
                var html = Y.one('#results pre').get('innerHTML');
                Assert.isTrue((html.indexOf('Y.Node.all(): Called') > -1));
                Assert.isTrue((html.indexOf('Y.Node.create(): Called') > -1));
                Assert.isTrue((html.indexOf('Y.DOM._getRegExp(): Called') > -1));
                Assert.isTrue((html.indexOf('Y.DOM.hasClass(): Called') > -1));
                Assert.isTrue((html.indexOf('Y.DOM._create(): Called') > -1));
                Assert.isTrue((html.indexOf('Y.DOM.create(): Called') > -1));
            },
            failure = function() {
                Y.Assert.fail('Test Polling Failed');
            };
            
            Y.one('#demo-run').simulate('click');

            this.poll(condition, 100, 10000, success, failure);
        }
    }));

    Y.Test.Runner.add(suite);
}, '', { requires: [ 'node-event-simulate' ] });
