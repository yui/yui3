YUI.add('getio-tests', function (Y) {

    Y.GetIOTests = new Y.Test.Suite("Get Suite");
    Y.GetIOTests.TEST_FILES_BASE = "getfiles/";

    var FILENAME = /[abc]\.js/;

    // TODO: Should get.js stick this somewhere public?
    Y.GetIOTests.ONLOAD_SUPPORTED = {
        script: true,
        css: !(Y.UA.webkit || Y.UA.gecko)
    };

    function areObjectsReallyEqual(o1, o2, msg) {
        Y.ObjectAssert.areEqual(o1, o2, msg);
        Y.ObjectAssert.areEqual(o2, o1, msg);
    }

    function randUrl(url) {
        return url + ((url.indexOf("?") !== -1) ? "&" : "?") + "dt=" + new Date().getTime();
    }

    function path(urls, guid) {
        var base = Y.GetIOTests.TEST_FILES_BASE;

        if (typeof urls === "string") {
            urls = base + randUrl(urls);
        } else {
            for (var i = 0; i < urls.length; i++) {
                urls[i] = base + randUrl(urls[i]);
            }
        }
        return urls;
    }

    Y.GetIOTests.Scripts = new Y.Test.Case({

        name: "Script Tests",

        setUp: function () {
            G_SCRIPTS = [];
            this.createInsertBeforeNode();
        },

        createInsertBeforeNode: function () {
            this.ib = Y.Node.create('<div id="insertBeforeMe"></div>');
            Y.Node.one("body").appendChild(this.ib);
        },

        removeInsertBeforeNode: function () {
            if (this.ib) {
                this.ib.remove(true);
            }
        },

        tearDown: function () {
            if (this.o) {
                this.o.purge();
            }
            this.removeInsertBeforeNode();
        },

        'test: single script, success': function () {

            var test = this;
            var progress = [];
            var counts = {
                success: 0,
                failure: 0
            };
            var cfg = {
                arguments: {
                    a: 1,
                    b: 2,
                    c: 3
                },
                context: {
                    bar: 'foo'
                },
                type: 'script',
                on: {
                    success: function (transactionid, response, args) {

                        var context = this,
                            o = response;

                        test.resume(function () {

                            counts.success++;

                            Y.Assert.areEqual("a.js", G_SCRIPTS[0], "a.js does not seem to be loaded");
                            Y.ArrayAssert.itemsAreEqual(G_SCRIPTS, progress, "Progress does not match G_SCRIPTS");

                            Y.Assert.areEqual(1, G_SCRIPTS.length, "More/Less than 1 script was loaded");
                            Y.Assert.isTrue(counts.success === 1, "onSuccess called more than once");

                            areObjectsReallyEqual({
                                a: 1,
                                b: 2,
                                c: 3
                            }, args, "Payload has unexpected data value");
                            Y.Assert.areEqual(1, o.nodes.length, "Payload nodes property has unexpected length");
                            Y.Assert.isUndefined(o.statusText, "Payload should not have a statusText");
                            Y.Assert.isUndefined(o.msg, "Payload should not have a msg");

                            Y.Assert.areEqual("foo", context.bar, "Callback context not set");

                            test.o = response;
                        });
                    },
                    failure: function (transactionid, response, args) {
                        test.resume(function () {
                            Y.Assert.fail("onFailure shouldn't have been called");
                            test.o = response;
                        });
                    },
                    progress: function (transactionid, response, args) {
                        var file = response.url.match(FILENAME);
                        progress.push(file[0]);
                    }
                },
            };
            var trans = Y.io(path("a.js"), cfg);

            this.wait();
        },
        'test: single script, failure': function () {

            var test = this;

            var counts = {
                success: 0,
                failure: 0
            };

            // TODO: abort() is the only thing which causes onFailure to be hit. 404s don't. Fix when we can fail on 404s
            // Not sure how robust it is to do this inline (that is, could onSuccess fire before abort is hit).

            var cfg = {
                arguments: {
                    a: 1,
                    b: 2,
                    c: 3
                },
                context: {
                    bar: 'foo'
                },
                type: 'script',
                on: {
                    success: function (transactionid, response, args) {
                        test.resume(function () {
                            Y.Assert.fail("onSuccess shouldn't have been called");
                            test.o = o;
                        });
                    },

                    failure: function (transactionid, response, args) {
                        var context = this,
                            o = response;;
                        test.resume(function () {
                            counts.failure++;

                            Y.Assert.isTrue(counts.failure === 1, "onFailure called more than once");

                            areObjectsReallyEqual({
                                a: 1,
                                b: 2,
                                c: 3
                            }, args, "Payload has unexpected data value");
                            //Y.Assert.areEqual(trans.tId, o.tId, "Payload has unexpected tId");
                            Y.Assert.areEqual(1, o.nodes.length, "Payload nodes property has unexpected length");
                            Y.Assert.isUndefined(o.statusText, "Payload should not have a statusText");
                            Y.Assert.isString(o.msg, "Payload should have a msg");

                            Y.Assert.areEqual("foo", context.bar, "Callback context not set");

                            test.o = o;
                        });
                    }
                } //end of on
            }; //end of cfg.
            var trans = Y.io(path("b.js"), cfg);
            trans.abort();

            this.wait();
        },
        'test: single script success, end': function () {

            var test = this,
            counts = {
                success: 0,
                failure: 0,
                end: 0
            }, trans,
            cfg = {

                arguments: {
                    a: 1,
                    b: 2,
                    c: 3
                },
                context: {
                    bar: "foo"
                },
                type: 'script',
                on: {
                    success: function (transactionid, response, args) {
                        counts.success++;
                        Y.Assert.areEqual("a.js", G_SCRIPTS[0], "a.js does not seem to be loaded");
                        Y.Assert.areEqual(1, G_SCRIPTS.length, "More/Less than 1 script was loaded");
                        Y.Assert.areEqual(1, counts.success, "onSuccess called more than once");
                    },
                    failure: function (transactionid, response, args) {
                        Y.Assert.fail("onFailure shouldn't have been called");
                    },
                    end: function (transactionid, response, args) {
                        var context = this,
                            o = response;

                        test.resume(function () {
                            counts.end++;
                            Y.Assert.areEqual(1, counts.end, "onEnd called more than once");
                            Y.Assert.areEqual(1, counts.success, "onEnd called before onSuccess");
                            Y.Assert.areEqual("OK", o.statusText, "Expected OK result");

                            areObjectsReallyEqual({
                                a: 1,
                                b: 2,
                                c: 3
                            }, args, "Payload has unexpected data value");
                            //Y.Assert.areEqual(trans.tId, o.tId, "Payload has unexpected tId");
                            Y.Assert.areEqual(1, o.nodes.length, "Payload nodes property has unexpected length");
                            Y.Assert.areEqual("OK", o.statusText, "Payload should have an OK statusText");
                            Y.Assert.isUndefined(o.msg, "Payload should have an undefined msg");

                            Y.Assert.areEqual("foo", context.bar, "Callback context not set");

                            test.o = o;
                        });
                    }
                } //end of on
            }; //end of cfg  
            trans = Y.io(path("a.js"), cfg);
            this.wait();
        },

        'test: single script failure, end': function () {

            var test = this;
            var counts = {
                success: 0,
                failure: 0,
                end: 0
            };


            var cfg = {

                arguments: {
                    a: 1,
                    b: 2,
                    c: 3
                },
                context: {
                    bar: "foo"
                },
                type: 'script',
                on: {
                    failure: function (transactionid, response, args) {
                        counts.failure++;
                        Y.Assert.isTrue(counts.failure === 1, "onFailure called more than once");
                    },
                    success: function (transactionid, response, args) {
                        Y.Assert.fail("onSuccess shouldn't have been called");
                    },
                    end: function (transactionid, response, args) {

                        var context = this,
                            o = response;

                        test.resume(function () {
                            counts.end++;
                            Y.Assert.areEqual(1, counts.end, "onEnd called more than once");
                            Y.Assert.areEqual(1, counts.failure, "onEnd called before onFailure");
                            Y.Assert.areEqual("failure", o.statusText, "Expected failure result");

                            areObjectsReallyEqual({
                                a: 1,
                                b: 2,
                                c: 3
                            }, args, "Payload has unexpected data value");
                            //Y.Assert.areEqual(trans.tId, o.tId, "Payload has unexpected tId");
                            Y.Assert.areEqual(1, o.nodes.length, "Payload nodes property has unexpected length");
                            Y.Assert.areEqual("failure", o.statusText, "Payload should have a failure statusText");
                            Y.Assert.isString(o.msg, "Payload should have a failure msg");

                            Y.Assert.areEqual("foo", context.bar, "Callback context not set");
                            test.o = o;
                        });
                    }
                } //end of on
            }; //end of cfg
            var trans = Y.io(path("a.js"), cfg);
            trans.abort();

            this.wait();
        }
    });

    Y.GetIOTests.Functional = new Y.Test.Case({

        name: "Functional Tests",

        'test: Loader, ScrollView': function () {
            var test = this;

            YUI().use("scrollview", function (Y2) {
                test.resume(function () {
                    Y.Assert.isFunction(Y2.ScrollView, "ScrollView not loaded");
                });
            });

            this.wait();
        },

        'test: Loader, Autocomplete': function () {
            var test = this;

            YUI().use("autocomplete-list", function (Y2) {
                test.resume(function () {
                    Y.Assert.isFunction(Y2.AutoCompleteList, "Autocomplete not loaded");
                });
            });

            this.wait();
        }
    });

});
