YUI.add('node-tests', function (Y) {
    
    var Assert = Y.Assert,
        suite = new Y.Test.Suite('json Node.js tests');

    suite.add(new Y.Test.Case({
        name: 'Check native in Node.js',
        'should be using native parse': function() {
            Assert.isTrue(Y.JSON.parse.isShim !== true, 'should not be true here');
        },
        'should be using native stringify': function() {
            Assert.isTrue(Y.JSON.stringify.isShim !== true, 'should not be true here');
        }
    }));

    Y.Test.Runner.add(suite);

});
