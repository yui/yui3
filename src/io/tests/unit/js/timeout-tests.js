YUI.add('timeout-tests', function(Y) {


    var timeout = function(id, o) {
        Y.Assert.areSame(0, o.status);
        Y.Assert.areSame('timeout', o.statusText);
    },
    abort = function(id, o) {
        Y.Assert.areSame(0, o.status);
        Y.Assert.areSame('abort', o.statusText);
    },
    cfg1 = {
        on: {
            complete: timeout,
            failure: timeout
         }
    },
    cfg2 = {
        on: {
            complete: abort,
            failure: abort
         }
    },
	io = new Y.IO(),
    suite = new Y.Test.Suite('IO Timeout/Abort Tests');


    suite.add(new Y.Test.Case({
        name: 'Timeout Test',
        'test': function() {
            io._evt('complete', { id: 0,  e: 'timeout' }, cfg1);
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Abort Test',
        'test': function() {
            io._evt('complete', { id: 1, e: 'abort' }, cfg2);
        }
    }));

    Y.Test.Runner.add(suite);

});
