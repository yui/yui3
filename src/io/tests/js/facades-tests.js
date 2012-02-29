YUI.add('facades-tests', function(Y) {


    var io = new Y.IO( { emitFacade: 1 }),
        id = 0, cfg, o1, o2,
        suite = new Y.Test.Suite('IO Facades Test');

    function se(o) {
        Y.Assert.isObject(o);
        Y.Assert.isObject(o.cfg);
        Y.Assert.isNumber(o.id);				
        Y.Assert.isUndefined(o.data.status);
        Y.Assert.isUndefined(o.data.statusText);
        Y.Assert.isUndefined(o.data.responseText);
        Y.Assert.isString(o.arguments);
    };

    function csf(o) {
        Y.Assert.isObject(o);
        Y.Assert.isObject(o.cfg);
        Y.Assert.isNumber(o.id);				
        Y.Assert.isNumber(o.data.status);
        Y.Assert.isString(o.data.statusText);
        Y.Assert.isString(o.data.responseText);
        Y.Assert.isFunction(o.data.getResponseHeader);
        Y.Assert.isFunction(o.data.getAllResponseHeaders);
        Y.Assert.isString(o.arguments);
    };

    cfg = {
        on: {
            start: se,
            complete: csf,
            end: se,
            success: csf,
            failure: csf
         },
        arguments: 'foo=bar'
    };
    o1 = {
        id: + id,
        c: {
            status: undefined,
            statusText: undefined,
            responseText: undefined,
            responseXML: undefined
        }
    };
    o2 = {
        id: + id,
        c: {
            responseText: 'Hello World',
            responseXML: null,
            getResponseHeader: function() { },
            getAllResponseHeaders: function() { }	
        }
    };

    suite.add(new Y.Test.Case({
        name: 'Test IO Start Event Facade',
        'test': function() {		
            io._evt('start', o1, cfg);
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Test IO Complete, Success Event Facade',
        'test': function() {
            o2.c.status = 200;
            o2.c.statusText = 'OK';
            io._evt('complete', o2, cfg);
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Test IO Failure Event Facade',
        'test': function() {
            o2.c.status = 500;
            o2.c.statusText = 'Server Error';
            io._evt('complete', o2, cfg);
        }
    }));

    Y.Test.Runner.add(suite);

});
