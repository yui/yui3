YUI.add('ua-tests', function(Y) {
    

    var Assert = Y.Assert,
    suite = new Y.Test.Suite('User Agent String Tests');

    var testCase = {
        name: 'Node.js',
        'test: Node.js': function() {
            Assert.areEqual(6, Y.UA.nodejs, 'Failed to get Node.js process version from process object');
            Assert.areEqual('Win32', Y.UA.os, 'Failed to get Node.js process platform from process object');
        }
    };
    suite.add(new Y.Test.Case(testCase));

    Y.each(Y.UAData, function(info, name) {
        testCase = {
            name: 'User Agent: ' + name
        };

        Y.each(info, function(data) {
            testCase['test: ' + data.ua] = (function(i) {
                return function() {
                    var ua = YUI.Env.parseUA(i.ua);
                    Y.each(i.data, function(v, k) {
                        Y.Assert.areEqual(v, ua[k], 'Key (' + k + ') for ' + i.ua);
                    });
                };
            }(data));
        });

        suite.add(new Y.Test.Case(testCase));
    });

    Y.Test.Runner.add(suite);

});
