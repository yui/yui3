YUI.add('requests-tests', function (Y) {

    var suite = new Y.Test.Suite('IO Requests Suite');

    function resume(test, handler) {
        return function () {
            var args = Y.Array(arguments);

            test.resume(function () {
                handler.apply(test, args);
            });
        };
    }

    suite.add(new Y.Test.Case({
        name: 'HTTP GET',

        'testGET': function() {
            function handler(tx, res, extra) {
                Y.Assert.areSame(200, res.status);
            }

            Y.io(Y.IO.URLS.get, {
                on: {success: resume(this, handler)}
            });

            this.wait(1000);
        },

        'testGETWithData': function() {
            function handler(tx, res, extra) {
                Y.Assert.areSame('hello=world&foo=bar', res.responseText);
            }

            Y.io(Y.IO.URLS.get + '?hello=world&foo=bar', {
                on: {success: resume(this, handler)}
            });

            this.wait(1000);
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'HTTP DELETE',

        'testDELETEWithData': function() {
            function handler(tx, res, extra) {
                Y.Assert.areSame('hello=world&foo=bar', res.responseText);
            }

            Y.io(Y.IO.URLS['delete'] + '?hello=world&foo=bar', {
                method: 'DELETE',
                on    : {success: resume(this, handler)}
            });

            this.wait(1000);
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'HTTP HEAD',

        'testHEAD': function() {
            function handler(tx, res, extra) {
                var headers = res.getAllResponseHeaders();

                if (headers) {
                    // IE, Safari, Opera all return HTTP response headers
                    Y.Assert.isString(headers);
                }
                else {
                    // Firefox 3 does not return anything except an HTTP
                    // status of 0.
                    Y.Assert.areSame(0, res.status);
                }
            }

            Y.io(Y.IO.URLS.get, {
                method: 'HEAD',
                on    : {complete: resume(this, handler)}
            });

            this.wait(1000);
        }
    }));

    // This test fails in Opera.
    suite.add(new Y.Test.Case({
        name: 'HTTP OPTIONS',

        'testOPTIONS': function() {
            function handler(tx, res, extra) {
                var headers = res.getAllResponseHeaders();

                if (headers) {
                    Y.Assert.areSame(200, res.status);
                    Y.Assert.isString(headers);
                }
            }

            Y.io(Y.IO.URLS.get, {
                method: 'OPTIONS',
                on    : {complete: resume(this, handler)}
            });

            this.wait(1000);
        }
    }));

    suite.add(new Y.Test.Case({
        name: "HTTP POST",

        'testPOST': function() {
            function handler(tx, res, extra) {
                Y.Assert.areSame(200, res.status);
                Y.Assert.areSame('hello=world&foo=bar', res.responseText, 'POST message and response do not match.');
            }

            Y.io(Y.IO.URLS.post, {
                method: 'POST',
                data  : 'hello=world&foo=bar',
                on    : {success: resume(this, handler)}
            });

            this.wait(1000);
        },

        'testPOSTWithNoData': function() {
            function handler(tx, res, extra) {
                var status = res.status;

                // IE: It'll never fail to show you its dumb parts!
                if (status === 1223) {
                    status = 204;
                }

                Y.Assert.areSame(204, status);
                Y.Assert.areSame('', res.responseText, 'POST message and response do not match.');
            }

            Y.io(Y.IO.URLS.post, {
                method: 'POST',
                on    : {success: resume(this, handler)}
            });

            this.wait(1500);
        }
    }));

    Y.Test.Runner.add(suite);
});
