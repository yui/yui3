YUI.add('transport-tests', function(Y) {

    var suite = new Y.Test.Suite('Transport Tests');

    Y.io.transport( { id:'flash', src:'../../../build/io-xdr/io.swf' } );
    Y.IO.transports.iframe = function() { return {}; };

    suite.add(new Y.Test.Case({
        name: 'Flash Transport Test',
        'test': function() {
            Y.Assert.isObject(Y.IO.transports.flash);
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'iframe Transport Test',
        'test': function() {
            Y.Assert.isObject(Y.IO.transports.iframe);
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Native Transport Test',
        'test': function() {
            var io = new Y.IO(),
                o = io._create({ xdr: { use:'native' } });

            if (Y.UA.ie) {
                Y.Assert.isTrue(o.notify);
            }
            else {
                Y.Assert.isFalse(o.notify);
            }
        }
    }));

    Y.Test.Runner.add(suite);

});
