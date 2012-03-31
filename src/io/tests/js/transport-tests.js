YUI.add('transport-tests', function(Y) {

    var suite = new Y.Test.Suite('Transport Tests');

    Y.io.transport( { id:'flash', src:'../../../build/io-xdr/io.swf' } );

    Y.IO.transports.iframe = function() { return {}; };

    suite.add(new Y.Test.Case({
        name: 'Transports Test',
        'flashTransport': function() {
            Y.Assert.isObject(Y.IO.transports.flash);
        },
        'iframeTransport': function() {
            Y.Assert.isObject(Y.IO.transports.iframe);
        }
    }));

    Y.Test.Runner.add(suite);

});
