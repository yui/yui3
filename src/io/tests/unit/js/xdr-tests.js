YUI.add('xdr-tests', function (Y) {

    var URLS      = Y.IO.URLS,
        suite     = new Y.Test.Suite('IO XDR Tests'),
        xdrServer = getXDRServerLocation();

    function getXDRServerLocation() {
        var loc  = window.location,
            port = window.YOGI_CONFIG && YOGI_CONFIG.xdrPort;

        // We need a location and XDR server port.
        if (!(loc && port)) { return; }

        return loc.protocol + '//' + loc.hostname + ':' + port + '/';
    }

    suite.add(new Y.Test.Case({
        name: "XDR GET",

        _should: {
            ignore: {
                'XDR GET should return the queried data in the response': !xdrServer
            }
        },

        'XDR GET should return the queried data in the response': function () {
            var test = this,
                data = Y.QueryString.stringify({foo: 'bar'});

            function handleSuccess(tx, res, args) {
                test.resume(function () {
                    Y.Assert.areSame(data, res.responseText);
                });
            }

            Y.io(xdrServer + URLS.get + '?' + data, {
                method: 'GET',
                xdr   : {use: 'native'},
                on    : {success: handleSuccess}
            });

            test.wait(5000);
        }
    }));

    suite.add(new Y.Test.Case({
        name: "XDR POST",

        _should: {
            ignore: {
                'XDR POST should return the POSTed data in the response': !xdrServer
            }
        },

        'XDR POST should return the POSTed data in the response': function () {
            var test = this,
                data = Y.QueryString.stringify({foo: 'bar'});

            function handleSuccess(tx, res, args) {
                test.resume(function () {
                    Y.Assert.areSame(data, res.responseText);
                });
            }

            Y.io(xdrServer + URLS.post, {
                method : 'POST',
                data   : data,
                headers: {'Content-Type': 'text/plain'},
                xdr    : {use: 'native'},
                on     : {success: handleSuccess},
            });

            test.wait(5000);
        }
    }));

    Y.Test.Runner.add(suite);

});
