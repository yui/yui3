YUI.add('header-tests', function(Y) {

    var suite = new Y.Test.Suite('IO Header Tests'),
	    io = new Y.IO();



    suite.add(new Y.Test.Case({
        name: 'Add HTTP Header',
        'test': function() {
            Y.io.header('Content-Type', 'application/xml');
            Y.Assert.areSame('application/xml', io._headers['Content-Type']);
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Delete HTTP Header',
        'test': function() {
            Y.io.header('Content-Type');
            Y.io.header('X-Requested-With');
            Y.Assert.areSame(undefined, io._headers['Content-Type']);
            Y.Assert.areSame(undefined, io._headers['X-Requested-With']);
        }
    }));

    Y.Test.Runner.add(suite);

});
