YUI.add('requests-tests', function(Y) {

    var suite = new Y.Test.Suite('IO Requests Suite');

    suite.add(new Y.Test.Case({
        name: 'HTTP GET',

        'testGET': function() {
            var t = this;
            this.handler = function() {
                Y.Assert.areSame(200, t.status);
            };

            Y.io(Y.IO.URLS.get, {
                on: { success: function(i, o, a) {
                        t.status = o.status;
                        t.resume(t.handler);
                    }
                }
            });

            this.wait(null, 1000);
        },

        'testGETWithData': function() {
            var t = this, cb;
            this.handler = function() {
                Y.Assert.areSame('hello=world&foo=bar', t.response);
            };
            cb = {
                on: { success: function(id, o, a) {
                        t.response = o.responseText;
                        t.resume(t.handler);
                    }
                }
            };
            Y.io(Y.IO.URLS.get + '?hello=world&foo=bar', cb);
            this.wait(null, 1000);
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'HTTP DELETE',

        'testDELETEWithData': function() {
            var t = this, cb;
            this.handler = function() {
                Y.Assert.areSame('hello=world&foo=bar', t.response);
            };
            cb = {
                method: 'DELETE',
                on: { success: function(id, o, a) {
                        t.response = o.responseText;
                        t.resume(t.handler);
                    }
                }
            };
            Y.io(Y.IO.URLS['delete'] + '?hello=world&foo=bar', cb);
            this.wait(null, 1000);
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'HTTP HEAD',

        'testHEAD': function() {
            var t = this;
            this.handler = function() {
                if (t.headers) {
                    // IE, Safari, Opera all return HTTP response headers
                    Y.Assert.isString(t.headers);
                }
                else {
                    // Firefox 3 does not return anything except an HTTP
                    // status of 0.
                    Y.Assert.areSame(0, t.status);
                }
            };

            Y.io(Y.IO.URLS.get, {
                method: 'HEAD',
                on: { complete: function(i, o, a) {
                        t.status = o.status;
                        t.headers = o.getAllResponseHeaders();
                        t.resume(t.handler);
                    }
                }
            });
            this.wait(null, 1000);
        }
    }));

    // This test fails in Opera.
    suite.add(new Y.Test.Case({
        name: 'HTTP OPTIONS',

        'testOPTIONS': function() {
            var t = this;
            this.handler = function() {
                if (t.headers) {
                    Y.Assert.areSame(200, t.status);
                    Y.Assert.isString(t.headers);
                }
            };

            Y.io(Y.IO.URLS.get, {
                method: 'OPTIONS',
                on: { complete: function(i, o, a) {
                        t.status = o.status;
                        t.headers = o.getAllResponseHeaders();
                        t.resume(t.handler);
                    }
                }
            });
            this.wait(null, 1000);
        }
    }));

    suite.add(new Y.Test.Case({
        name: "HTTP POST",

        'testPOST': function() {
            var t = this;
            this.handler = function() {
                Y.Assert.areSame(200, t.status);
                Y.Assert.areSame('hello=world&foo=bar', t.response, 'POST message and response do not match.');
            };

            Y.io(Y.IO.URLS.post, {
                method: 'POST',
                data: 'hello=world&foo=bar',
                on: { success: function(i, o, a) {
                        t.response = o.responseText;
                        t.status = o.status;
                        t.resume(t.handler);
                    }
                }
            });
            this.wait(null, 1000);
        },

        'testPOSTWithNoData': function() {
            var t = this;
            this.handler = function() {
                Y.Assert.areSame(200, t.status);
                Y.Assert.areSame(0, parseInt(t.response, 0), 'POST message and response do not match.');

            };

            Y.io(Y.IO.URLS.post, {
                method: 'POST',
                on: { success: function(i, o, a) {
                        t.response =+ o.responseText;
                        t.status = o.status;
                        t.resume(t.handler);
                    }
                }
            });
            this.wait(null, 1500);
        }
    }));

    Y.Test.Runner.add(suite);
});
