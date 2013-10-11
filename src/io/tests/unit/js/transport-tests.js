YUI.add('transport-tests', function(Y) {

    var suite = new Y.Test.Suite('Transport Tests');

    Y.io.transport( { id:'flash', src:'io.swf' } );
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
        'Non-IE browsers and IE >= 10 should be able to use XHR level 2': function() {
            var io = new Y.IO(),
                o = io._create({ xdr: { use:'native' } });

            // IE must use a form of external transport
            if (Y.UA.ie && Y.UA.ie < 10) {
                Y.Assert.isTrue(o.xdr);
            }
            else {
                Y.Assert.isFalse(o.notify);
            }
        },

        'X-Requested-With header should be removed for native XDR': function() {
            var io = new Y.IO(),
                o = io._create({ xdr: { use:'native' } });

            Y.Assert.areSame(undefined, io._headers['X-Requested-With']);
        },

        'X-Requested-With header should be capable of being re-added': function() {
            var io = new Y.IO(),
                o = io._create({ xdr: { use:'native' } });

            io.setHeader('X-Requested-With', 'XMLHttpRequest');

            Y.Assert.areSame('XMLHttpRequest', io._headers['X-Requested-With']);
        }
    }));

    Y.Test.Runner.add(suite);

});
