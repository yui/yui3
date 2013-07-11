YUI.add('get-test', function (Y) {

    Y.GetTests = new Y.Test.Suite("Get");

    var ArrayAssert  = Y.ArrayAssert,
        Assert       = Y.Assert,
        ObjectAssert = Y.ObjectAssert,

        FILENAME = /[abc]\.js/,

        ua       = Y.UA,
        env      = Y.Get._getEnv(),

        // Win8 JS packaged apps currently hang on async:false and 404s - http://connect.microsoft.com/IE/feedback/details/763466/ie10-dynamic-script-loading-bug-async-404s
        winJSOnErrorBug = ((typeof Windows !== "undefined") && Windows.System),

        supports = {
            // True if this browser should call an onFailure callback on a link
            // that 404s. Currently only Firefox 9+ and WebKit 535.24+ (Chrome
            // 19) support this.
            cssFailure: env.cssFail,

            // True if this browser should call an onFailure callback on a script that 404s.
            jsFailure: !((ua.ie && ua.ie < 9) || (ua.opera && ua.compareVersions(ua.opera, 11.6) < 0) || (ua.webkit && ua.compareVersions(ua.webkit, 530.17) < 0))
        },

        // echoecho delay in seconds
        DELAY = Y.config.echoechoDelay || 0,

        // JS content
        JS_A = 'G_SCRIPTS.push("a.js")',
        JS_B = 'G_SCRIPTS.push("b.js")',
        JS_C = 'G_SCRIPTS.push("c.js")',

        // CSS content
        CSS_A = '.get_test_a {' +
                    'position: absolute;' +
                    'z-index: 1111;' +
                    '/* Just for eyeballing, not used to test */' +
                    'background-color: #ff0000;' +
                '}',
        CSS_B = '.get_test_b {' +
                    'position:absolute;' +
                    'z-index:1234;' +
                    '/* Just for eyeballing, not used to test */' +
                    'background-color:#00ff00;' +
                '}',
        CSS_C = '.get_test_c {' +
                    'position:absolute;' +
                    'z-index:4321;' +
                    '/* Just for eyeballing, not used to test */' +
                    'background-color:#0000ff;' +
                '}',
        CSS_IB = '.get_test_a {' +
                     'position:absolute;' +
                     'z-index:9991;' +
                     '/* Just for eyeballing, not used to test */' +
                     'background-color:#cccccc;' +
                 '}' +
                 '.get_test_b {' +
                     'position:absolute;' +
                     'z-index:9992;' +
                     '/* Just for eyeballing, not used to test */' +
                     'background-color:#cccccc;' +
                 '}' +
                 '.get_test_c {' +
                     'position:absolute;' +
                     'z-index:9993;' +
                     '/* Just for eyeballing, not used to test */' +
                     'background-color:#cccccc;' +
                 '}';

    function areObjectsReallyEqual(o1, o2, msg) {
        Y.ObjectAssert.areEqual(o1, o2, msg);
        Y.ObjectAssert.areEqual(o2, o1, msg);
    }

    function unique() {
        if (!unique.counter) {
            unique.counter = 0;
        }
        // Append a simple counter to guarantee uniqueness in case we invoke
        // this function too fast.
        unique.counter += 1;
        return new Date().getTime() + '-' + unique.counter;
    }

    // Adds a cache-busting param to the given url.
    function randUrl(url) {
        url += (url.indexOf('?') !== -1) ? '&' : '?';
        return url + 'bust=' + unique();
    }

    /**
    Generates a unique echoecho 404 URL.

    @return A unique echoecho 404 URL.
    **/
    function getUniqueEchoecho404() {
        return randUrl('echo/status/404');
    }

    /**
    Generates a unique echoecho JavaScript URL.

    @param {String} content The JavaScript to respond with.
    @param {String} delay The number of seconds to delay the response.
    @return A unique echoecho JavaScript URL.
    **/
    function getUniqueEchoechoJs(content, delay) {
        var url;

        delay   = delay || 0;
        content = content || 'console.log("' + unique() + '")';

        url = 'echo/delay/' + delay + '/get'
                  + '?response=' + encodeURIComponent(content)
                  + '&type=js';

        return randUrl(url);
    }

    /**
    Generates a unique echoecho CSS URL.

    @param {String} content The CSS to respond with.
    @param {String} delay The number of seconds to delay the response.
    @return A unique echoecho CSS URL.
    **/
    function getUniqueEchoechoCss(content, delay) {
        var url;

        delay   = delay || 0;
        content = content || '.foo{}';

        url = 'echo/delay/' + delay + '/get'
                  + '?response=' + encodeURIComponent(content)
                  + '&type=css';

        // Get.load() only loads CSS if the URL ends with '.css'
        return randUrl(url) + '&hacky=.css';
    }

    // -- Basic JS loading -----------------------------------------------------
    Y.GetTests.BasicJS = new Y.Test.Case({
        name: "Basic JS loading",

        setUp: function() {
            G_SCRIPTS = [];
        },

        tearDown: function() {
            if (this.o) {
                this.o.purge();
            }

            this.removeInsertBeforeNode();
        },

        createInsertBeforeNode: function() {
            this.ib = Y.Node.create('<div id="insertBeforeMe"></div>');
            Y.Node.one("body").appendChild(this.ib);
        },

        removeInsertBeforeNode: function() {
            if (this.ib) {
                this.ib.remove(true);
            }
        },

        _should: {
            ignore: {

                // IE 10 (pp4) seems to jump into an executing JS stack and invoke the callback for 304/404s.
                // As a result this test in IE10 follows the 404 path, as opposed to timeout path, without
                // an explicit delay on the 404 response, even with timeout:1ms.
                'test: single script timeout callback': Y.UA.phantomjs || (Y.UA.ie && Y.UA.ie >= 10),

                'test: single script, failure': !supports.jsFailure || winJSOnErrorBug,
                'test: single script failure, end': !supports.jsFailure || winJSOnErrorBug,
                'test: multiple scripts, one failure': !supports.jsFailure || winJSOnErrorBug,
                'test: multiple scripts, failure, end': !supports.jsFailure || winJSOnErrorBug,
                'test: async multiple script, failure': !supports.jsFailure,
                'test: async multiple script, failure, end': !supports.jsFailure
            }
        },

        'test: single script, success': function() {
            var test = this;
            var progress = [];
            var counts = {
                success:0,
                failure:0
            };
            var url = getUniqueEchoechoJs(JS_A, DELAY);

            var trans = Y.Get.script(url, {
                data: {a:1, b:2, c:3},
                context: {bar:"foo"},

                onProgress: function(o) {
                    var file = o.url.match(FILENAME);
                    progress.push(file[0]);
                },

                onSuccess: function(o) {
                    var context = this;

                    test.resume(function() {
                        counts.success++;

                        Assert.areEqual("a.js", G_SCRIPTS[0], "a.js does not seem to be loaded");
                        ArrayAssert.itemsAreEqual(G_SCRIPTS, progress, "Progress does not match G_SCRIPTS");

                        Assert.areEqual(1, G_SCRIPTS.length, "More/Less than 1 script was loaded");
                        Assert.areEqual(1, counts.success, "onSuccess called more than once");

                        areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                        Assert.areEqual(trans.id, o.id, "Payload has unexpected id");
                        Assert.areEqual(1, o.nodes.length, "Payload nodes property has unexpected length");

                        Assert.areEqual("foo", context.bar, "Callback context not set");

                        test.o = o;
                    });
                },

                onFailure: function(o) {
                    test.resume(function() {
                        Assert.fail("onFailure shouldn't have been called");
                        test.o = o;
                    });
                }
            });

            this.wait(30000);
        },

        'test: single script, failure': function() {
            var test = this;

            var counts = {
                success:0,
                failure:0
            };
            var url = getUniqueEchoecho404();

            var trans = Y.Get.script(url, {
                data: {a:1, b:2, c:3},
                context: {bar:"foo"},

                onSuccess: function(o) {
                    test.resume(function() {
                        Assert.fail("onSuccess shouldn't have been called");
                        test.o = o;
                    });
                },

                onFailure: function(o) {
                    var context = this;

                    test.resume(function() {
                        counts.failure += 1;

                        Assert.areEqual(1, counts.failure, "onFailure called more than once");

                        areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                        Assert.areEqual(trans.id, o.id, "Payload has unexpected id");
                        Assert.areEqual(1, o.nodes.length, "Payload nodes property has unexpected length");

                        Assert.areEqual("foo", context.bar, "Callback context not set");

                        test.o = o;
                    });
                }
            });

            this.wait(30000);
        },

        'test: single script timeout callback': function() {
            var test = this,

                // The following delayed JS response should not have any
                // side-effects to avoid interfering with other tests.
                url = getUniqueEchoechoJs(
                    'console.log("1s delayed response")',
                    1  // 1s
                );

            trans = Y.Get.script(url, {

                timeout: 1, // 1ms

                onTimeout: function(e) {
                    test.resume(function() {
                        Assert.areSame('Timeout', e.errors[0].error, 'Failure message is not a timeout message');
                        test.wait(30000);
                    });
                },

                onFailure: function(e) {
                    test.resume(function() {
                        Assert.areSame('Timeout', e.errors[0].error, 'Failure message is not a timeout message');
                    });
                },

                onSuccess: function() {
                    test.resume(function() {
                        Assert.fail('onSuccess should not be called');
                    });
                }
            });

            test.wait(30000);
        },

        'test: single script success, end': function() {
            var test = this;
            var counts = {
                success:0,
                failure:0,
                end:0
            };
            var url = getUniqueEchoechoJs(JS_A, DELAY);

            var trans = Y.Get.script(url, {
                data: {a:1, b:2, c:3},
                context: {bar:"foo"},

                onSuccess: function() {
                    counts.success++;
                    Assert.areEqual("a.js", G_SCRIPTS[0], "a.js does not seem to be loaded");
                    Assert.areEqual(1, G_SCRIPTS.length, "More/Less than 1 script was loaded");
                    Assert.areEqual(1, counts.success, "onSuccess called more than once");
                },

                onFailure: function() {
                    Assert.fail("onFailure shouldn't have been called");
                },

                onEnd: function(o) {
                    var context = this;

                    test.resume(function() {
                        counts.end++;
                        Assert.areEqual(1, counts.end,"onEnd called more than once");
                        Assert.areEqual(1, counts.success, "onEnd called before onSuccess");

                        areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                        Assert.areEqual(trans.id, o.id, "Payload has unexpected id");
                        Assert.areEqual(1, o.nodes.length, "Payload nodes property has unexpected length");

                        Assert.areEqual("foo", context.bar, "Callback context not set");

                        test.o = o;
                    });
                }
            });

            this.wait(30000);
        },

        'test: single script failure, end': function() {
            var test = this;
            var counts = {
                success:0,
                failure:0,
                end:0
            };
            var url = getUniqueEchoecho404();

            var trans = Y.Get.script(url, {
                data: {a:1, b:2, c:3},
                context: {bar:"foo"},

                onFailure: function() {
                    counts.failure++;
                    Assert.isTrue(counts.failure === 1, "onFailure called more than once");
                },

                onSuccess: function() {
                    Assert.fail("onSuccess shouldn't have been called");
                },

                onEnd : function(o) {
                    var context = this;

                    test.resume(function() {
                        counts.end++;
                        Assert.areEqual(1, counts.end,"onEnd called more than once");
                        Assert.areEqual(1, counts.failure, "onEnd called before onFailure");

                        areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                        Assert.areEqual(trans.id, o.id, "Payload has unexpected id");
                        Assert.areEqual(1, o.nodes.length, "Payload nodes property has unexpected length");

                        Assert.areEqual("foo", context.bar, "Callback context not set");

                        test.o = o;
                    });
                }
            });

            this.wait(30000);
        },

        'test: multiple scripts, success': function() {
            var test = this;
            var progress = [];
            var counts = {
                success:0,
                failure:0
            };
            var urls = [
                getUniqueEchoechoJs(JS_B, DELAY),
                getUniqueEchoechoJs(JS_A, DELAY),
                getUniqueEchoechoJs(JS_C, DELAY)
            ];

            var trans = Y.Get.script(urls, {
                data: {a:1, b:2, c:3},
                context: {bar:"foo"},

                onFailure: function(o) {
                    test.resume(function() {
                        Assert.fail("onFailure shouldn't have been called");
                        test.o = o;
                    });
                },

                onProgress: function(o) {
                    var file = o.url.match(/[abc]\.js/);
                    progress.push(file[0]);
                },

                onSuccess: function(o) {
                    var context = this;

                    test.resume(function() {
                        counts.success++;
                        Assert.areEqual(3, G_SCRIPTS.length, "More/Less than 3 scripts loaded");
                        ArrayAssert.itemsAreEqual(["b.js", "a.js", "c.js"], G_SCRIPTS, "Unexpected script order");
                        ArrayAssert.itemsAreEqual(G_SCRIPTS, progress, "Progress does not match G_SCRIPTS");

                        Assert.areEqual(1, counts.success, "onSuccess called more than once");

                        areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                        Assert.areEqual(trans.id, o.id, "Payload has unexpected id");
                        Assert.areEqual(3, o.nodes.length, "Payload nodes property has unexpected length");

                        Assert.areEqual("foo", context.bar, "Callback context not set");

                        test.o = o;
                    });
                }
            });

            this.wait(30000);
        },

        'test: multiple scripts, one failure': function() {
            var test = this;
            var counts = {
                success:0,
                failure:0
            };
            var urls = [
                getUniqueEchoechoJs(JS_A, DELAY),
                getUniqueEchoecho404(),
                getUniqueEchoechoJs(JS_C, DELAY)
            ];

            var trans = Y.Get.script(urls, {
                data: {a:1, b:2, c:3},
                context: {bar:"foo"},

                onSuccess: function(o) {
                    test.resume(function() {
                        Assert.fail("onSuccess shouldn't have been called");
                        test.o = o;
                    });
                },

                onFailure: function(o) {
                    var context = this;

                    test.resume(function() {
                        counts.failure++;

                        Assert.areEqual(2, G_SCRIPTS.length, "More/fewer than 2 scripts loaded");
                        Assert.areEqual(1, counts.failure, "onFailure called more than once");
                        ArrayAssert.itemsAreEqual(["a.js", "c.js"], G_SCRIPTS, "Unexpected script order");

                        areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                        Assert.areEqual(trans.id, o.id, "Payload has unexpected id");
                        Assert.areEqual("foo", context.bar, "Callback context not set");

                        test.o = o;
                    });
                }
            });

            this.wait(30000);
        },

        'test: multiple scripts, success, end': function() {
            var test = this;
            var progress = [];
            var counts = {
                success:0,
                failure:0,
                end:0
            };
            var urls = [
                getUniqueEchoechoJs(JS_C, DELAY),
                getUniqueEchoechoJs(JS_B, DELAY),
                getUniqueEchoechoJs(JS_A, DELAY)
            ];

            var trans = Y.Get.script(urls, {
                data: {a:1, b:2, c:3},
                context: {bar:"foo"},

                onSuccess: function() {
                    counts.success++;

                    Assert.areEqual(3, G_SCRIPTS.length, "More/Less than 3 scripts loaded");
                    ArrayAssert.itemsAreEqual(["c.js", "b.js", "a.js"], G_SCRIPTS,  "Unexpected script order");
                    ArrayAssert.itemsAreEqual(G_SCRIPTS, progress, "Progress does not match G_SCRIPTS");
                    Assert.isTrue(counts.success === 1, "onSuccess called more than once");
                },

                onProgress: function(o) {
                    var file = o.url.match(/[abc]\.js/);
                    progress.push(file[0]);
                },

                onFailure: function() {
                    Assert.fail("onFailure shouldn't have been called");
                },

                onEnd: function(o) {
                    var context = this;

                    test.resume(function() {
                        counts.end++;
                        Assert.areEqual(1, counts.end,"onEnd called more than once");
                        Assert.areEqual(1, counts.success, "onEnd called before onSuccess");

                        areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                        Assert.areEqual(trans.id, o.id, "Payload has unexpected id");
                        Assert.areEqual(3, o.nodes.length, "Payload nodes property has unexpected length");

                        Assert.areEqual("foo", context.bar, "Callback context not set");

                        test.o = o;
                    });
                }
            });

            this.wait(30000);
        },

        'test: multiple scripts, failure, end': function() {
            var test = this;
            var counts = {
                success:0,
                failure:0,
                end:0
            };
            var urls = [
                getUniqueEchoechoJs(JS_A, DELAY),
                getUniqueEchoecho404(),
                getUniqueEchoechoJs(JS_C, DELAY)
            ];

            var trans = Y.Get.script(urls, {
                data: {a:1, b:2, c:3},
                context: {bar:"foo"},

                onSuccess: function() {
                    Assert.fail("onSuccess shouldn't have been called");
                },

                onFailure: function() {
                    counts.failure++;
                    Assert.areEqual(1, counts.failure, "onFailure called more than once");
                },

                onEnd: function(o) {
                    var context = this;

                    test.resume(function() {
                        counts.end++;
                        Assert.areEqual(1, counts.end,"onEnd called more than once");
                        Assert.areEqual(1, counts.failure, "onEnd called before onFailure");
                        Assert.areEqual(2, G_SCRIPTS.length, "More/fewer than 2 scripts loaded");
                        ArrayAssert.itemsAreEqual(["a.js", "c.js"], G_SCRIPTS, "Unexpected script order");

                        areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                        Assert.areEqual(trans.id, o.id, "Payload has unexpected id");

                        Assert.areEqual("foo", context.bar, "Callback context not set");

                        test.o = o;
                    });
                }
            });

            this.wait(30000);
        },

        'test: async multiple scripts, success': function() {
            var test = this;
            var progress = [];
            var counts = {
                success:0,
                failure:0
            };
            var urls = [
                getUniqueEchoechoJs(JS_A, DELAY),
                getUniqueEchoechoJs(JS_B, DELAY),
                getUniqueEchoechoJs(JS_C, DELAY)
            ];

                var trans = Y.Get.script(urls, {
                    data: {a:1, b:2, c:3},
                    context: {bar:"foo"},

                    onFailure: function(o) {
                        test.resume(function() {
                            Assert.fail("onFailure shouldn't have been called");
                            test.o = o;
                        });
                    },

                    onProgress: function(o) {
                        var file = o.url.match(/[abc]\.js/);
                        progress.push(file[0]);
                    },

                    onSuccess: function(o) {
                        var context = this;

                        test.resume(function() {
                            counts.success++;
                            Assert.areEqual(3, G_SCRIPTS.length, "More/Less than 3 scripts loaded");
                            ArrayAssert.itemsAreEqual(G_SCRIPTS, progress, "Progress does not match G_SCRIPTS");
                            ArrayAssert.containsItems( ["c.js", "a.js", "b.js"], G_SCRIPTS, "Unexpected script contents");
                            Assert.areEqual(1, counts.success, "onSuccess called more than once");

                            areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                            Assert.areEqual(trans.id, o.id, "Payload has unexpected id");
                            Assert.areEqual(3, o.nodes.length, "Payload nodes property has unexpected length");

                            Assert.areEqual("foo", context.bar, "Callback context not set");

                            test.o = o;
                        });
                    },
                    async:true
                });

            this.wait(30000);
        },

        'test: async multiple scripts, success, end': function() {
            var test = this;
            var counts = {
                success:0,
                failure:0,
                end:0
            };
            var urls = [
                getUniqueEchoechoJs(JS_C, DELAY),
                getUniqueEchoechoJs(JS_A, DELAY),
                getUniqueEchoechoJs(JS_B, DELAY)
            ];

            var trans = Y.Get.script(urls, {
                data: {a:1, b:2, c:3},
                context: {bar:"foo"},

                onSuccess: function() {
                    counts.success++;
                    Assert.areEqual(3, G_SCRIPTS.length, "More/Less than 3 scripts loaded");
                    ArrayAssert.containsItems(["a.js", "b.js", "c.js"], G_SCRIPTS, "Unexpected script contents");
                    Assert.areEqual(1, counts.success, "onSuccess called more than once");
                },

                onFailure: function() {
                    Assert.fail("onFailure shouldn't have been called");
                },

                onEnd: function(o) {
                    var context = this;

                    test.resume(function() {
                        counts.end++;
                        Assert.areEqual(1, counts.end,"onEnd called more than once");
                        Assert.areEqual(1, counts.success, "onEnd called before onSuccess");

                        areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                        Assert.areEqual(trans.id, o.id, "Payload has unexpected id");
                        Assert.areEqual(3, o.nodes.length, "Payload nodes property has unexpected length");

                        Assert.areEqual("foo", context.bar, "Callback context not set");

                        test.o = o;
                    });
                },
                async:true
            });

            this.wait(30000);
        },

        'test: async multiple script, failure, end': function() {
            var test = this;
            var counts = {
                success:0,
                failure:0,
                end:0
            };
            var urls = [
                getUniqueEchoechoJs(JS_A, DELAY),
                getUniqueEchoecho404(),
                getUniqueEchoechoJs(JS_C, DELAY)
            ];

            var trans = Y.Get.script(urls, {
                data: {a:1, b:2, c:3},
                context: {bar:"foo"},

                onSuccess: function() {
                    Assert.fail("onSuccess shouldn't have been called");
                },

                onFailure: function() {
                    counts.failure++;
                    Assert.isTrue(counts.failure === 1, "onFailure called more than once");
                },

                onEnd: function(o) {
                    var context = this;

                    test.resume(function() {
                        counts.end++;
                        Assert.areEqual(1, counts.end,"onEnd called more than once");
                        Assert.areEqual(1, counts.failure, "onEnd called before onFailure");
                        Assert.areEqual(2, G_SCRIPTS.length, "More/fewer than 2 scripts loaded");
                        ArrayAssert.containsItems(["a.js", "c.js"], G_SCRIPTS, "Unexpected script contents");

                        areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                        Assert.areEqual(trans.id, o.id, "Payload has unexpected id");
                        Assert.areEqual("foo", context.bar, "Callback context not set");

                        test.o = o;
                    });

                },
                async:true
            });

            this.wait(30000);
        },

        'test: insertBefore, single' : function() {
            var test = this;
            var url = getUniqueEchoechoJs(JS_A, DELAY);

            test.createInsertBeforeNode();

            var trans = Y.Get.script(url, {
                insertBefore: "insertBeforeMe",

                onSuccess: function(o) {
                    test.resume(function() {
                        var n = Y.Node.one(o.nodes[0]);
                        var insertBefore = Y.Node.one("#insertBeforeMe");

                        Assert.isTrue(n.compareTo(insertBefore.previous()), "Not inserted before insertBeforeMe");

                        test.o = o;
                    });
                },

                onFailure: function(o) {
                    test.resume(function() {
                        Assert.fail("onFailure shouldn't have been called");
                        test.o = o;
                    });
                }
            });

            this.wait(30000);
        },

        'test: insertBefore, multiple' : function() {
            var test = this;
            var urls = [
                getUniqueEchoechoJs(JS_A, DELAY),
                getUniqueEchoechoJs(JS_B, DELAY)
            ];

            test.createInsertBeforeNode();

            var trans = Y.Get.script(urls, {
                insertBefore: "insertBeforeMe",

                onSuccess: function(o) {
                    test.resume(function() {
                        var insertBefore = Y.Node.one("#insertBeforeMe");

                        for (var i = o.nodes.length-1; i >= 0; i--) {
                            var n = Y.Node.one(o.nodes[i]);
                            Assert.isTrue(n.compareTo(insertBefore.previous()), "Not inserted before insertBeforeMe");
                            insertBefore = n;
                        }

                        test.o = o;
                    });
                },

                onFailure: function(o) {
                    test.resume(function() {
                        Assert.fail("onFailure shouldn't have been called");
                        test.o = o;
                    });
                }
            });

            this.wait(30000);
        },

        'test: async, insertBefore, multiple' : function() {
            var test = this;
            var urls = [
                getUniqueEchoechoJs(JS_A, DELAY),
                getUniqueEchoechoJs(JS_B, DELAY)
            ];

            test.createInsertBeforeNode();

            var trans = Y.Get.script(urls, {
                insertBefore: "insertBeforeMe",

                onSuccess: function(o) {

                    test.resume(function() {
                        var insertBefore = Y.Node.one("#insertBeforeMe");

                        for (var i = o.nodes.length-1; i >= 0; i--) {
                            var n = Y.Node.one(o.nodes[i]);
                            Assert.isTrue(n.compareTo(insertBefore.previous()), "Not inserted before insertBeforeMe");
                            insertBefore = n;
                        }

                        test.o = o;
                    });
                },

                onFailure: function(o) {
                    test.resume(function() {
                        Assert.fail("onFailure shouldn't have been called");
                        test.o = o;
                    });
                },
                async:true
            });

            this.wait(30000);
        },

        'test: charset, single' : function() {
            var test = this;
            var url = getUniqueEchoechoJs(JS_A, DELAY);

            var trans = Y.Get.script(url, {
                charset: "ISO-8859-1",

                onSuccess: function(o) {
                    test.resume(function() {

                        var node = document.getElementById(o.nodes[0].id);

                        Assert.areEqual("ISO-8859-1", node.charset, "charset property not set");
                        Assert.areEqual("ISO-8859-1", node.getAttribute("charset"), "charset attribute not set");

                        test.o = o;
                    });
                },

                onFailure: function(o) {
                    test.resume(function() {
                        Assert.fail("onFailure shouldn't have been called");
                        test.o = o;
                    });
                }
            });

            this.wait(30000);
        },

        'test: charset, multiple' : function() {
            var test = this;
            var urls = [
                getUniqueEchoechoJs(JS_A, DELAY),
                getUniqueEchoechoJs(JS_B, DELAY),
                getUniqueEchoechoJs(JS_C, DELAY)
            ];

            var trans = Y.Get.script(urls, {
                charset: "ISO-8859-1",

                onSuccess: function(o) {
                    test.resume(function() {
                        Assert.areEqual(3, o.nodes.length, "Unexpected node count");

                        for (var i = 0; i < o.nodes.length; i++) {
                            var node = document.getElementById(o.nodes[i].id);

                            Assert.areEqual("ISO-8859-1", node.charset, "charset property not set");
                            Assert.areEqual("ISO-8859-1", node.getAttribute("charset"), "charset attribute not set");
                        }

                        test.o = o;
                    });
                },

                onFailure: function(o) {
                    test.resume(function() {
                        Assert.fail("onFailure shouldn't have been called");
                        test.o = o;
                    });
                }
            });

            this.wait(30000);
        },

        'test: async, charset, multiple' : function() {
            var test = this;
            var urls = [
                getUniqueEchoechoJs(JS_A, DELAY),
                getUniqueEchoechoJs(JS_B, DELAY),
                getUniqueEchoechoJs(JS_C, DELAY)
            ];

            var trans = Y.Get.script(urls, {
                charset: "ISO-8859-1",

                onSuccess: function(o) {
                    test.resume(function() {
                        Assert.areEqual(3, o.nodes.length, "Unexpected node count");

                        for (var i = 0; i < o.nodes.length; i++) {
                            var node = document.getElementById(o.nodes[i].id);

                            Assert.areEqual("ISO-8859-1", node.charset, "charset property not set");
                            Assert.areEqual("ISO-8859-1", node.getAttribute("charset"), "charset attribute not set");
                        }

                        test.o = o;
                    });
                },

                onFailure: function(o) {
                    test.resume(function() {
                        Assert.fail("onFailure shouldn't have been called");
                        test.o = o;
                    });
                },

                async :true
            });

            this.wait(30000);
        },

        'test: attributes, single' : function() {
            var test = this;
            var url = getUniqueEchoechoJs(JS_A, DELAY);

            var trans = Y.Get.script(url, {
                attributes: {
                    "charset": "ISO-8859-1",
                    "title"  : "myscripts",
                    "id"     : "my-awesome-script"
                },

                onSuccess: function(o) {
                    test.resume(function() {
                        var node = document.getElementById(o.nodes[0].id);

                        Assert.areEqual("myscripts", node.title, "title property not set");
                        Assert.areEqual("ISO-8859-1", node.charset, "charset property not set");
                        Assert.areEqual("my-awesome-script", node.id, "id attribute not set");

                        Assert.areEqual("myscripts", node.getAttribute("title"), "title attribute not set");
                        Assert.areEqual("ISO-8859-1", node.getAttribute("charset"), "charset attribute not set");
                        Assert.areEqual("my-awesome-script", node.getAttribute("id"), "id attribute not set");

                        test.o = o;
                    });
                },

                onFailure: function(o) {
                    test.resume(function() {
                        Assert.fail("onFailure shouldn't have been called");
                        test.o = o;
                    });
                }
            });

            this.wait(30000);
        },

        'test: attributes, multiple' : function() {
            var test = this;
            var urls = [
                getUniqueEchoechoJs(JS_A, DELAY),
                getUniqueEchoechoJs(JS_B, DELAY),
                getUniqueEchoechoJs(JS_C, DELAY)
            ];

            var trans = Y.Get.script(urls, {
                attributes: {
                    "charset": "ISO-8859-1",
                    "title"  : "myscripts"
                },

                onSuccess: function(o) {
                    test.resume(function() {
                        Assert.areEqual(3, o.nodes.length, "Unexpected node count");

                        for (var i = 0; i < o.nodes.length; i++) {
                            var node = document.getElementById(o.nodes[i].id);

                            Assert.areEqual("myscripts", node.title, "title property not set");
                            Assert.areEqual("ISO-8859-1", node.charset, "charset property not set");

                            Assert.areEqual("myscripts", node.getAttribute("title"), "title attribute not set");
                            Assert.areEqual("ISO-8859-1", node.getAttribute("charset"), "charset attribute not set");
                        }

                        test.o = o;
                    });
                },

                onFailure: function(o) {
                    test.resume(function() {
                        Assert.fail("onFailure shouldn't have been called");
                        test.o = o;
                    });
                }
            });

            this.wait(30000);
        },

        'test: async, attributes, multiple' : function() {
            var test = this;
            var urls = [
                getUniqueEchoechoJs(JS_A, DELAY),
                getUniqueEchoechoJs(JS_B, DELAY),
                getUniqueEchoechoJs(JS_C, DELAY)
            ];

            var trans = Y.Get.script(urls, {
                attributes: {
                    "charset": "ISO-8859-1",
                    "title"  : "myscripts"
                },

                onSuccess: function(o) {

                    test.resume(function() {
                        Assert.areEqual(3, o.nodes.length, "Unexpected node count");

                        for (var i = 0; i < o.nodes.length; i++) {
                            var node = document.getElementById(o.nodes[i].id);

                            Assert.areEqual("myscripts", node.title, "title property not set");
                            Assert.areEqual("ISO-8859-1", node.charset, "charset property not set");

                            Assert.areEqual("myscripts", node.getAttribute("title"), "title attribute not set");
                            Assert.areEqual("ISO-8859-1", node.getAttribute("charset"), "charset attribute not set");
                        }

                        test.o = o;
                    });
                },

                onFailure: function(o) {
                    test.resume(function() {
                        Assert.fail("onFailure shouldn't have been called");
                        test.o = o;
                    });
                },

                async :true
            });

            this.wait(30000);
        },

        'ignore: abort' : function() {
            // Covered above, but worth testing payload also
        },

        'ignore: timeout' : function() {
            // Need delay.js always available to test this reliably. Leaving out for now
        },

        'scripts should be automatically purged after 20 nodes by default': function () {
            var test = this,
                urls = [],
                i;

            for (i = 0; i < 30; ++i) {
                urls.push(
                    getUniqueEchoechoJs(JS_A, DELAY)
                );
            }

            Y.Get.script(urls, {attributes: {'class': 'purge-test'}}, function (err, tx) {
                test.resume(function () {
                    var count = Y.all('script.purge-test').size();
                    Y.assert(count > 0 && count < 20, 'there should be fewer than 20 scripts on the page (actual: ' + count + ')');
                });
            });

            this.wait(30000);
        },

        'test: purgethreshold' : function() {
            var test    = this;
            var nodes   = [];
            var nodeIds = [];

            // Purge only happens at the start of a queue call.
            Y.Get.script(getUniqueEchoechoJs(JS_A, DELAY), {
                purgethreshold: 1000, // Just to make sure we're not purged as part of the default 20 script purge.

                onSuccess: function(o) {
                    nodes = nodes.concat(o.nodes);

                    Y.Get.script(getUniqueEchoechoJs(JS_B, DELAY), {
                        purgethreshold: 1000, // Just to make sure we're not purged as part of the default 20 script purge.

                        onSuccess: function(o) {
                            nodes = nodes.concat(o.nodes);

                            Assert.areEqual(2, nodes.length, "2 nodes should have been added");

                            for (var i = 0; i < nodes.length; i++) {
                                var node = Y.Node.one(nodes[i]);
                                Assert.isTrue(node.inDoc(), "Scripts should still be in the document");

                                // Convert to id, for final doc check, because purge destroys parentNode
                                nodeIds[i] = node.get("id");
                            }

                            Y.Get.script(getUniqueEchoechoJs(JS_C, DELAY), {
                                purgethreshold: 1,

                                onSuccess: function(o) {
                                    test.resume(function() {
                                        for (var i = 0; i < nodeIds.length; i++) {
                                            Assert.isNull(document.getElementById(nodeIds[i]), "Script from previous transaction was not purged");
                                        }

                                        Assert.isTrue(Y.one(o.nodes[0]).inDoc());

                                        test.o = o;
                                    });
                                }
                            });
                        }
                    });
                }
            });

            this.wait(30000);
        },

        // THE ASYNC FAILURE TESTS NEED TO BE AT THE END,
        // BECAUSE ABORTING THEM WILL NOT STOP PARALLEL SCRIPTS
        // FROM DOWNLOADING (at least currently) AND SINCE WE USE
        // A GLOBAL, IT POLLUTES THE NEXT SUCCESS TEST

        // TODO: Maybe we can explore the idea of moving from global to something instance based?

        'test: async multiple script, failure': function() {
            var test = this;
            var counts = {
                success:0,
                failure:0
            };
            var urls = [
                getUniqueEchoechoJs(JS_A, DELAY),
                getUniqueEchoecho404(),
                getUniqueEchoechoJs(JS_C, DELAY)
            ];

            var trans = Y.Get.script(urls, {
                data: {a:1, b:2, c:3},
                context: {bar:"foo"},

                onSuccess: function(o) {
                    test.resume(function() {
                        Assert.fail("onSuccess shouldn't have been called");
                        test.o = o;
                    });
                },

                onFailure: function(o) {
                    var context = this;

                    test.resume(function() {
                        counts.failure++;
                        Assert.areEqual(1, counts.failure, "onFailure called more than once");
                        Assert.areEqual(2, G_SCRIPTS.length, "More/fewer than 2 scripts loaded");
                        ArrayAssert.containsItems(["a.js", "c.js"], G_SCRIPTS, "Unexpected script contents");

                        areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                        Assert.areEqual(trans.id, o.id, "Payload has unexpected id");
                        Assert.areEqual("foo", context.bar, "Callback context not set");

                        test.o = o;
                    });
                },
                async:true
            });

            this.wait(30000);
        }
    });

    // -- Basic CSS loading ----------------------------------------------------
    Y.GetTests.BasicCSS = new Y.Test.Case({
        name: "Basic CSS loading",

        setUp: function() {
            this.na = Y.Node.create('<div class="get_test_a">get_test_a</div>');
            this.nb = Y.Node.create('<div class="get_test_b">get_test_b</div>');
            this.nc = Y.Node.create('<div class="get_test_c">get_test_c</div>');

            var b = Y.Node.one("body");
            b.append(this.na);
            b.append(this.nb);
            b.append(this.nc);
        },

        tearDown: function() {
            this.na.remove(true);
            this.nb.remove(true);
            this.nc.remove(true);

            this.o && this.o.purge();
            this.removeInsertBeforeNode();
        },

        createInsertBeforeNode: function() {

            // Not using innerHTML because of WinJS RT.

            var link = Y.config.doc.createElement("link");
            link.setAttribute("id", "insertBeforeMe");
            link.setAttribute("rel", "stylesheet");
            link.setAttribute("type", "text/css");
            link.setAttribute("charset", "utf-8");
            link.setAttribute("href", getUniqueEchoechoCss(CSS_IB, DELAY));

            this.ib = Y.Node.one(link);

            Y.Node.one("head").appendChild(this.ib);
        },

        removeInsertBeforeNode: function() {
            if (this.ib) {
                this.ib.remove(true);
            }
        },

        'test: single css, success': function() {
            var test = this;
            var counts = {
                success:0,
                failure:0
            };
            var url = getUniqueEchoechoCss(CSS_A, DELAY);

            var trans = Y.Get.css(url, {
                data: {a:1, b:2, c:3},
                context: {bar:"foo"},

                onSuccess: function(o) {
                    var context = this;

                    test.resume(function() {
                        counts.success++;

                        Assert.areEqual("1111", this.na.getComputedStyle("zIndex"), "a.css does not seem to be loaded");
                        Assert.areEqual(1, counts.success, "onSuccess called more than once");

                        areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");

                        Assert.areEqual(trans.id, o.id, "Payload has unexpected id");
                        Assert.areEqual(1, o.nodes.length, "Payload nodes property has unexpected length");
                        Assert.areEqual("foo", context.bar, "Callback context not set");

                        test.o = o;
                    });
                },

                onFailure: function(o) {
                    test.resume(function () {
                        Assert.fail("onFailure shouldn't have been called");
                    });
                }
            });

            test.wait(30000);
        },

        'test: multiple css, success': function() {
            var test = this;
            var counts = {
                success:0,
                failure:0
            };
            var urls = [
                getUniqueEchoechoCss(CSS_A, DELAY),
                getUniqueEchoechoCss(CSS_B, DELAY),
                getUniqueEchoechoCss(CSS_C, DELAY)
            ];

            var trans = Y.Get.css(urls, {
                data: {a:1, b:2, c:3},
                context: {bar:"foo"},

                onFailure: function(o) {
                    test.resume(function () {
                        Assert.fail("onFailure shouldn't have been called");
                    });
                },

                onSuccess: function(o) {
                    var context = this;

                    test.resume(function() {
                        counts.success++;

                        Assert.areEqual("1111", this.na.getComputedStyle("zIndex"), "a.css does not seem to be loaded");
                        Assert.areEqual("1234", this.nb.getComputedStyle("zIndex"), "b.css does not seem to be loaded");
                        Assert.areEqual("4321", this.nc.getComputedStyle("zIndex"), "c.css does not seem to be loaded");
                        Assert.areEqual(1, counts.success, "onSuccess called more than once");

                        areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");

                        Assert.areEqual(trans.id, o.id, "Payload has unexpected id");
                        Assert.areEqual(3, o.nodes.length, "Payload nodes property has unexpected length");
                        Assert.areEqual("foo", context.bar, "Callback context not set");

                        test.o = o;
                    });
                }
            });

            test.wait(30000);
        },

        'test: insertBefore, single' : function() {
            var test = this;
            var url = getUniqueEchoechoCss(CSS_A, DELAY);

            test.createInsertBeforeNode();

            var trans = Y.Get.css(url, {
                insertBefore: "insertBeforeMe",

                onSuccess: function(o) {
                    test.resume(function() {
                        var n = Y.Node.one(o.nodes[0]);
                        var insertBefore = Y.Node.one("#insertBeforeMe");

                        Assert.isTrue(n.compareTo(insertBefore.previous()), "Not inserted before insertBeforeMe");

                        test.o = o;

                        // TODO: These don't work as expected on IE (even though insertBefore worked). Better cross-browser assertion?
                        if (!Y.UA.ie) {
                            // Let the CSS kick in ??
                            test.wait(function() {
                                Assert.areEqual("9991", this.na.getComputedStyle("zIndex"), "a.css does not seem to be inserted before ib.css");
                            }, 5000);
                        }
                    });
                }
            });

            test.wait(30000);
        },

        'test: insertBefore, multiple' : function() {
            var test = this;
            var urls = [
                getUniqueEchoechoCss(CSS_A, DELAY),
                getUniqueEchoechoCss(CSS_B, DELAY),
                getUniqueEchoechoCss(CSS_C, DELAY)
            ];

            test.createInsertBeforeNode();

            var trans = Y.Get.css(urls, {
                insertBefore: "insertBeforeMe",

                onSuccess: function(o) {
                    test.resume(function() {
                        var insertBefore = Y.Node.one("#insertBeforeMe");

                        for (var i = o.nodes.length-1; i >= 0; i--) {
                            var n = Y.Node.one(o.nodes[i]);
                            Assert.isTrue(n.compareTo(insertBefore.previous()), "Not inserted before insertBeforeMe");
                            insertBefore = n;
                        }

                        test.o = o;

                        // TODO: These don't work as expected on IE (even though insertBefore worked). Better cross-browser assertion?
                        if (!Y.UA.ie) {
                            // Let the CSS kick in ??
                            test.wait(function() {
                                Assert.areEqual("9991", this.na.getComputedStyle("zIndex"), "a.css does not seem to be inserted before ib.css");
                                Assert.areEqual("9992", this.nb.getComputedStyle("zIndex"), "b.css does not seem to be inserted before ib.css");
                                Assert.areEqual("9993", this.nc.getComputedStyle("zIndex"), "c.css does not seem to be inserted before ib.css");
                            }, 5000);
                        }
                    });
                }
            });

            test.wait(30000);
        },

        'test: charset, single' : function() {
            var test = this;
            var url = getUniqueEchoechoCss(CSS_A, DELAY);

            var trans = Y.Get.css(url, {
                charset: "ISO-8859-1",

                onSuccess: function(o) {
                    test.resume(function() {
                        var node = document.getElementById(o.nodes[0].id);

                        Assert.areEqual("ISO-8859-1", node.getAttribute("charset"), "charset attribute not set");

                        test.o = o;
                    });
                }
            });

            test.wait(30000);
        },

        'test: charset, multiple' : function() {
            var test = this;
            var urls = [
                getUniqueEchoechoCss(CSS_A, DELAY),
                getUniqueEchoechoCss(CSS_B, DELAY),
                getUniqueEchoechoCss(CSS_C, DELAY)
            ];

            var trans = Y.Get.css(urls, {
                charset: "ISO-8859-1",

                onSuccess: function(o) {
                    test.resume(function() {

                        Assert.areEqual(3, o.nodes.length, "Unexpected node count");

                        for (var i = 0; i < o.nodes.length; i++) {
                            var node = document.getElementById(o.nodes[i].id);

                            Assert.areEqual("ISO-8859-1", node.getAttribute("charset"), "charset attribute not set");
                        }

                        test.o = o;
                    });
                }
            });

            test.wait(30000);
        },

        'test: attributes, single' : function() {
            var test = this;
            var url = getUniqueEchoechoCss(CSS_A, DELAY);

            var trans = Y.Get.css(url, {
                attributes: {
                    "charset": "ISO-8859-1",
                    "title": "myscripts"
                },

                onSuccess: function(o) {
                    test.resume(function() {
                        var node = document.getElementById(o.nodes[0].id);

                        Assert.areEqual("myscripts", node.title, "title property not set");
                        Assert.areEqual("myscripts", node.getAttribute("title"), "title attribute not set");
                        Assert.areEqual("ISO-8859-1", node.getAttribute("charset"), "charset attribute not set");

                        test.o = o;
                    });
                }
            });

            test.wait(30000);
        },

        'test: attributes, multiple' : function() {
            var test = this;
            var urls = [
                getUniqueEchoechoCss(CSS_A, DELAY),
                getUniqueEchoechoCss(CSS_B, DELAY),
                getUniqueEchoechoCss(CSS_C, DELAY)
            ];

            var trans = Y.Get.css(urls, {
                attributes: {
                    "charset": "ISO-8859-1",
                    "title": "myscripts"
                },

                onSuccess: function(o) {
                    test.resume(function() {

                        Assert.areEqual(3, o.nodes.length, "Unexpected node count");

                        for (var i = 0; i < o.nodes.length; i++) {

                            var node = document.getElementById(o.nodes[i].id);

                            Assert.areEqual("myscripts", node.title, "title property not set");
                            Assert.areEqual("myscripts", node.getAttribute("title"), "title attribute not set");
                            Assert.areEqual("ISO-8859-1", node.getAttribute("charset"), "charset attribute not set");
                        }

                        test.o = o;
                    });
                }
            });

            test.wait(30000);
        },

        'test: single css, failure': function() {
            var test = this;
            var counts = {
                success:0,
                failure:0
            };
            var url = getUniqueEchoecho404();

            Y.Get.css(url, {
                data: {a:1, b:2, c:3},
                context: {bar:"foo"},

                onSuccess: function(o) {
                    test.resume(function () {
                        if (supports.cssFailure) {
                            Assert.fail("onSuccess shouldn't have been called");
                        }
                    });
                },

                onFailure: function(o) {
                    test.resume(function () {
                        counts.failure++;
                        Assert.areEqual(1, counts.failure, "onFailure called more than once");
                    });
                },

                onEnd: function(o) {
                    test.o = o;
                }
            });

            test.wait(30000);
        },

        'test: multiple css, failure': function() {
            var test = this;
            var counts = {
                success:0,
                failure:0
            };
            var urls = [
                getUniqueEchoechoCss(CSS_A, DELAY),
                getUniqueEchoecho404(),
                getUniqueEchoechoCss(CSS_C, DELAY)
            ];

            Y.Get.css(urls, {
                data: {a:1, b:2, c:3},
                context: {bar:"foo"},

                onSuccess: function(o) {
                    test.resume(function() {
                        if (supports.cssFailure) {
                            Assert.fail("onSuccess shouldn't have been called");
                        }
                    });
                },

                onFailure: function(o) {
                    test.resume(function() {
                        counts.failure++;
                        Assert.areEqual(1, counts.failure, "onFailure called more than once");

                        test.o = o;

                        if (!Y.UA.ie) {
                            // Let the CSS kick in?
                            test.wait(function() {
                                Assert.areEqual("1111", this.na.getComputedStyle("zIndex"), "a.css does not seem to be loaded");
                                Assert.areNotEqual("1234", this.nb.getComputedStyle("zIndex"), "b.css was loaded when it shouldn't have been");
                                Assert.areEqual("4321", this.nc.getComputedStyle("zIndex"), "c.css does not seem to be loaded");
                            }, 5000);
                        }

                    });
                },

                onEnd: function(o) {
                    test.o = o;
                }
            });

            this.wait(30000);
        },

        'CSS nodes should be inserted in order': function () {
            var test = this;
            var urls = [
                getUniqueEchoechoCss(CSS_A, DELAY),
                getUniqueEchoechoCss(CSS_B, DELAY),
                getUniqueEchoechoCss(CSS_C, DELAY)
            ];

            test.o = Y.Get.css([
                {url: urls[0], attributes: {id: 'a'}},
                {url: urls[1], attributes: {id: 'b'}},
                {url: urls[2], attributes: {id: 'c'}}
            ], function (err, transaction) {
                test.resume(function () {
                    var nodes = transaction.nodes;

                    Assert.isNull(err, '`err` should be null');
                    Assert.areEqual('b', Y.one(nodes[0]).next('link,style').get('id'), 'b.css should have been inserted after a.css');
                    Assert.areEqual('c', Y.one(nodes[1]).next('link,style').get('id'), 'b.css should have been inserted after a.css');

                });
            });

            this.wait(30000);
        }
    });

    // -- Y.Get Methods --------------------------------------------------------
    Y.GetTests.GetMethods = new Y.Test.Case({
        name: 'Y.Get methods',

        setUp: function () {
            G_SCRIPTS = [];
        },

        tearDown: function () {
            this.t && this.t.purge();
            this.interval && clearInterval(this.interval);
        },

        'abort() should abort a transaction when given a transaction object': function () {
            var test = this;
            var urls = [
                getUniqueEchoechoJs(JS_A, DELAY),
                getUniqueEchoechoJs(JS_B, DELAY),
                getUniqueEchoechoJs(JS_C, DELAY)
            ];

            test.t = Y.Get.js(urls, {
                onFailure: function () {
                    test.resume(function () {
                        ArrayAssert.containsMatch(function (item) {
                            return item.error === 'Aborted'
                        }, test.t.errors, "Transaction failed, but wasn't aborted.");
                    });
                },

                onProgress: function () {
                    Y.Get.abort(test.t);
                },

                onSuccess: function () {
                    test.resume(function () {
                        Assert.fail('onSuccess should not be called');
                    });
                }
            });

            test.wait(30000);
        },

        'abort() should abort a transaction when given a transaction id': function () {
            var test = this;
            var urls = [
                getUniqueEchoechoJs(JS_A, DELAY),
                getUniqueEchoechoJs(JS_B, DELAY),
                getUniqueEchoechoJs(JS_C, DELAY)
            ];

            test.t = Y.Get.js(urls, {
                onFailure: function () {
                    test.resume(function () {
                        ArrayAssert.containsMatch(function (item) {
                            return item.error === 'Aborted'
                        }, test.t.errors, "Transaction failed, but wasn't aborted.");
                    });
                },

                onProgress: function () {
                    Y.Get.abort(test.t.id);
                },

                onSuccess: function () {
                    test.resume(function () {
                        Assert.fail('onSuccess should not be called');
                    });
                }
            });

            this.wait(30000);
        },

        // -- css() ------------------------------------------------------------
        'css() should accept a URL': function () {
            var test = this;
            var url = getUniqueEchoechoCss(CSS_A, DELAY);

            setTimeout(function () {
                test.t = Y.Get.css(url);
            }, 1);

            // Silly hack so we can verify that the CSS request finished without
            // having to pass a callback to Y.Get.css().
            test.interval = setInterval(function () {
                var t = test.t;

                if (!t.requests.length) {
                    return;
                }

                if (t.requests[0].finished) {
                    clearInterval(test.interval);
                    test.resume();
                }
            }, 20);

            this.wait(30000);
        },

        'css() should accept a URL, options object, and callback function': function () {
            var test = this,
                url  = getUniqueEchoechoCss(CSS_A, DELAY),
                callbackCalled;

            test.t = Y.Get.css(url, {
                onFailure: function () {
                    test.resume(function () {
                        Assert.fail('onFailure should not be called');
                    });
                },

                onSuccess: function () {
                    test.resume(function () {
                        Assert.isTrue(callbackCalled, 'inline callback should be called before onSuccess');
                    });
                }
            }, function (err, transaction) {
                var self = this;

                callbackCalled = true;

                test.resume(function () {
                    Assert.isNull(err, '`err` should be null');
                    Assert.areSame(test.t, transaction, 'transaction should be passed to the callback');
                    Assert.areSame(test.t, self, '`this` object should be the transaction');

                    test.wait(100);
                });
            });

            this.wait(30000);
        },

        'css() should allow the callback function as the second parameter': function () {
            var test = this;
            var url = getUniqueEchoechoCss(CSS_A, DELAY);

            test.t = Y.Get.css(url, function (err, transaction) {
                var self = this;

                test.resume(function () {
                    Assert.isNull(err, '`err` should be null');
                    Assert.areSame(test.t, transaction, 'transaction should be passed to the callback');
                    Assert.areSame(test.t, self, '`this` object should be the transaction');
                });
            });

            this.wait(30000);
        },

        'css() should accept an array of URLs': function () {
            var test = this;
            var urls = [
                getUniqueEchoechoCss(CSS_A, DELAY),
                getUniqueEchoechoCss(CSS_B, DELAY),
                getUniqueEchoechoCss(CSS_C, DELAY)
            ];

            test.t = Y.Get.css(urls, {
                onFailure: function () {
                    test.resume(function () {
                        Assert.fail('onFailure should not be called');
                    });
                },

                onSuccess: function () {
                    test.resume(function () {
                        Assert.areSame(3, test.t.requests.length, '3 requests should have been made');
                        Assert.areSame(3, test.t.nodes.length, '3 nodes should have been inserted');
                    });
                }
            });

            this.wait(30000);
        },

        'css() should accept a request object': function () {
            var test = this;
            var url = getUniqueEchoechoCss(CSS_A, DELAY);

            test.t = Y.Get.css({url: url}, {
                onFailure: function () {
                    test.resume(function () {
                        Assert.fail('onFailure should not be called');
                    });
                },

                onSuccess: function () {
                    test.resume(function () {
                        Assert.areSame(1, test.t.requests.length, '1 request should have been made');
                        Assert.areSame(1, test.t.nodes.length, '1 node should have been inserted');
                    });
                }
            });

            this.wait(30000);
        },

        'css() should accept an array of request objects': function () {
            var test = this;
            var urls = [
                getUniqueEchoechoCss(CSS_A, DELAY),
                getUniqueEchoechoCss(CSS_B, DELAY),
                getUniqueEchoechoCss(CSS_C, DELAY)
            ];

            test.t = Y.Get.css([{url: urls[0]}, {url: urls[1]}, {url: urls[2]}], {
                onFailure: function () {
                    test.resume(function () {
                        Assert.fail('onFailure should not be called');
                    });
                },

                onSuccess: function () {
                    test.resume(function () {
                        Assert.areSame(3, test.t.requests.length, '3 requests should have been made');
                        Assert.areSame(3, test.t.nodes.length, '3 nodes should have been inserted');
                    });
                }
            });

            this.wait(30000);
        },

        'css() should accept a mixed array of URLs and request objects': function () {
            var test = this;
            var urls = [
                getUniqueEchoechoCss(CSS_A, DELAY),
                getUniqueEchoechoCss(CSS_B, DELAY),
                getUniqueEchoechoCss(CSS_C, DELAY)
            ];

            test.t = Y.Get.css([urls[0], {url: urls[1]}, urls[2]], {
                onFailure: function () {
                    test.resume(function () {
                        Assert.fail('onFailure should not be called');
                    });
                },

                onSuccess: function () {
                    test.resume(function () {
                        Assert.areSame(3, test.t.requests.length, '3 requests should have been made');
                        Assert.areSame(3, test.t.nodes.length, '3 nodes should have been inserted');
                    });
                }
            });

            this.wait(30000);
        },

        // -- js() -------------------------------------------------------------
        'js() should accept a URL': function () {
            var test = this;
            var url = getUniqueEchoechoJs(JS_A, DELAY);

            setTimeout(function () {
                test.t = Y.Get.js(url);
            }, 1);

            // Silly hack so we can verify that the request finished without
            // having to pass a callback to Y.Get.js().
            test.interval = setInterval(function () {
                var t = test.t;

                if (!t.requests.length) {
                    return;
                }

                if (t.requests[0].finished) {
                    clearInterval(test.interval);
                    test.resume();
                }
            }, 20);

            this.wait(30000);
        },

        'js() should accept a URL, options object, and callback function': function () {
            var test = this,
                url  = getUniqueEchoechoJs(JS_A, DELAY),
                callbackCalled;

            test.t = Y.Get.js(url, {
                onFailure: function () {
                    test.resume(function () {
                        Assert.fail('onFailure should not be called');
                    });
                },

                onSuccess: function () {
                    test.resume(function () {
                        Assert.isTrue(callbackCalled, 'inline callback should be called before onSuccess');
                    });
                }
            }, function (err, transaction) {
                var self = this;

                callbackCalled = true;

                test.resume(function () {
                    Assert.isNull(err, '`err` should be null');
                    Assert.areSame(test.t, transaction, 'transaction should be passed to the callback');
                    Assert.areSame(test.t, self, '`this` object should be the transaction');

                    test.wait(100);
                });
            });

            this.wait(30000);
        },

        'js() should allow the callback function as the second parameter': function () {
            var test = this;
            var url = getUniqueEchoechoJs(JS_A, DELAY);

            test.t = Y.Get.js(url, function (err, transaction) {
                var self = this;

                test.resume(function () {
                    Assert.isNull(err, '`err` should be null');
                    Assert.areSame(test.t, transaction, 'transaction should be passed to the callback');
                    Assert.areSame(test.t, self, '`this` object should be the transaction');
                });
            });

            this.wait(30000);
        },

        'js() should accept an array of URLs': function () {
            var test = this;
            var urls = [
                getUniqueEchoechoJs(JS_A, DELAY),
                getUniqueEchoechoJs(JS_B, DELAY),
                getUniqueEchoechoJs(JS_C, DELAY)
            ];

            test.t = Y.Get.js(urls, {
                onFailure: function () {
                    test.resume(function () {
                        Assert.fail('onFailure should not be called');
                    });
                },

                onSuccess: function () {
                    test.resume(function () {
                        Assert.areSame(3, test.t.requests.length, '3 requests should have been made');
                        Assert.areSame(3, test.t.nodes.length, '3 nodes should have been inserted');
                    });
                }
            });

            this.wait(30000);
        },

        'js() should accept a request object': function () {
            var test = this;
            var url = getUniqueEchoechoJs(JS_A, DELAY);

            test.t = Y.Get.js({url: url}, {
                onFailure: function () {
                    test.resume(function () {
                        Assert.fail('onFailure should not be called');
                    });
                },

                onSuccess: function () {
                    test.resume(function () {
                        Assert.areSame(1, test.t.requests.length, '1 request should have been made');
                        Assert.areSame(1, test.t.nodes.length, '1 node should have been inserted');
                    });
                }
            });

            this.wait(30000);
        },

        'js() should accept an array of request objects': function () {
            var test = this;
            var urls = [
                getUniqueEchoechoJs(JS_A, DELAY),
                getUniqueEchoechoJs(JS_B, DELAY),
                getUniqueEchoechoJs(JS_C, DELAY)
            ];

            test.t = Y.Get.js(urls, {
                onFailure: function () {
                    test.resume(function () {
                        Assert.fail('onFailure should not be called');
                    });
                },

                onSuccess: function () {
                    test.resume(function () {
                        Assert.areSame(3, test.t.requests.length, '3 requests should have been made');
                        Assert.areSame(3, test.t.nodes.length, '3 nodes should have been inserted');
                    });
                }
            });

            this.wait(30000);
        },

        'js() should accept a mixed array of URLs and request objects': function () {
            var test = this;
            var urls = [
                getUniqueEchoechoJs(JS_A, DELAY),
                getUniqueEchoechoJs(JS_B, DELAY),
                getUniqueEchoechoJs(JS_C, DELAY)
            ];

            test.t = Y.Get.js([urls[0], {url: urls[1]}, urls[2]], {
                onFailure: function () {
                    test.resume(function () {
                        Assert.fail('onFailure should not be called');
                    });
                },

                onSuccess: function () {
                    test.resume(function () {
                        Assert.areSame(3, test.t.requests.length, '3 requests should have been made');
                        Assert.areSame(3, test.t.nodes.length, '3 nodes should have been inserted');
                    });
                }
            });

            this.wait(30000);
        },

        // -- load() -----------------------------------------------------------
        'load() should accept a URL': function () {
            var test = this;
            var url = getUniqueEchoechoJs(JS_A, DELAY);

            setTimeout(function () {
                test.t = Y.Get.load(url);
            }, 1);

            // Silly hack so we can verify that the request finished without
            // having to pass a callback to Y.Get.load().
            test.interval = setInterval(function () {
                var t = test.t;

                if (!t.requests.length) {
                    return;
                }

                if (t.requests[0].finished) {
                    clearInterval(test.interval);
                    test.resume(function () {
                        Assert.areSame('js', t.requests[0].type, 'request type should be "js"');
                    });
                }
            }, 20);

            this.wait(30000);
        },

        'load() should accept a URL, options object, and callback function': function () {
            var test = this,
                url = getUniqueEchoechoCss(CSS_A, DELAY),
                callbackCalled;

            test.t = Y.Get.load(url, {
                onFailure: function () {
                    test.resume(function () {
                        Assert.fail('onFailure should not be called');
                    });
                },

                onSuccess: function () {
                    test.resume(function () {
                        Assert.isTrue(callbackCalled, 'inline callback should be called before onSuccess');
                        Assert.areSame('css', test.t.requests[0].type, 'request type should be "css"');
                    });
                }
            }, function (err, transaction) {
                var self = this;

                callbackCalled = true;

                test.resume(function () {
                    Assert.isNull(err, '`err` should be null');
                    Assert.areSame(test.t, transaction, 'transaction should be passed to the callback');
                    Assert.areSame(test.t, self, '`this` object should be the transaction');

                    test.wait(100);
                });
            });

            this.wait(30000);
        },

        'load() should allow the callback function as the second parameter': function () {
            var test = this;
            var url = getUniqueEchoechoJs(JS_A, DELAY);

            test.t = Y.Get.load(url, function (err, transaction) {
                var self = this;

                test.resume(function () {
                    Assert.isNull(err, '`err` should be null');
                    Assert.areSame(test.t, transaction, 'transaction should be passed to the callback');
                    Assert.areSame(test.t, self, '`this` object should be the transaction');
                });
            });

            this.wait(30000);
        },

        'load() should accept an array of URLs': function () {
            var test = this;
            var urls = [
                getUniqueEchoechoJs(JS_A, DELAY),
                getUniqueEchoechoCss(CSS_B, DELAY),
                getUniqueEchoechoJs(JS_C, DELAY)
            ];

            test.t = Y.Get.load(urls, {
                onFailure: function () {
                    test.resume(function () {
                        Assert.fail('onFailure should not be called');
                    });
                },

                onSuccess: function () {
                    test.resume(function () {
                        Assert.areSame(3, test.t.requests.length, '3 requests should have been made');
                        Assert.areSame(3, test.t.nodes.length, '3 nodes should have been inserted');
                        Assert.areSame('js', test.t.requests[0].type, 'first request type should be "js"');
                        Assert.areSame('css', test.t.requests[1].type, 'second request type should be "css"');
                        Assert.areSame('js', test.t.requests[2].type, 'third request type should be "js"');
                    });
                }
            });

            this.wait(30000);
        },

        'load() should accept a request object': function () {
            var test = this;
            var url = getUniqueEchoechoJs(JS_A, DELAY);

            test.t = Y.Get.load({url: url}, {
                onFailure: function () {
                    test.resume(function () {
                        Assert.fail('onFailure should not be called');
                    });
                },

                onSuccess: function () {
                    test.resume(function () {
                        Assert.areSame(1, test.t.requests.length, '1 request should have been made');
                        Assert.areSame(1, test.t.nodes.length, '1 node should have been inserted');
                        Assert.areSame('js', test.t.requests[0].type, 'request type should be "js"');
                    });
                }
            });

            this.wait(30000);
        },

        'load() should accept an array of request objects': function () {
            var test = this;
            var urls = [
                getUniqueEchoechoCss(CSS_A, DELAY),
                getUniqueEchoechoJs(JS_B, DELAY),
                getUniqueEchoechoCss(CSS_C, DELAY)
            ];

            test.t = Y.Get.load([{url: urls[0]}, {url: urls[1]}, {url: urls[2]}], {
                onFailure: function () {
                    test.resume(function () {
                        Assert.fail('onFailure should not be called');
                    });
                },

                onSuccess: function () {
                    test.resume(function () {
                        Assert.areSame(3, test.t.requests.length, '3 requests should have been made');
                        Assert.areSame(3, test.t.nodes.length, '3 nodes should have been inserted');
                        Assert.areSame('css', test.t.requests[0].type, 'first request type should be "css"');
                        Assert.areSame('js', test.t.requests[1].type, 'second request type should be "js"');
                        Assert.areSame('css', test.t.requests[2].type, 'third request type should be "css"');
                    });
                }
            });

            this.wait(30000);
        },

        'load() should accept a mixed array of URLs and request objects': function () {
            var test = this;
            var urls = [
                getUniqueEchoechoJs(JS_A, DELAY),
                getUniqueEchoechoJs(JS_B, DELAY),
                getUniqueEchoechoCss(CSS_C, DELAY)
            ];

            test.t = Y.Get.load([urls[0], {url: urls[1]}, urls[2]], {
                onFailure: function () {
                    test.resume(function () {
                        Assert.fail('onFailure should not be called');
                    });
                },

                onSuccess: function () {
                    test.resume(function () {
                        Assert.areSame(3, test.t.requests.length, '3 requests should have been made');
                        Assert.areSame(3, test.t.nodes.length, '3 nodes should have been inserted');
                        Assert.areSame('js', test.t.requests[0].type, 'first request type should be "js"');
                        Assert.areSame('js', test.t.requests[1].type, 'second request type should be "js"');
                        Assert.areSame('css', test.t.requests[2].type, 'third request type should be "css"');
                    });
                }
            });

            this.wait(30000);
        },

        // -- script() ---------------------------------------------------------
        'script() should be an alias for js()': function () {
            Assert.areSame(Y.Get.js, Y.Get.script);
        }
    });

    // -- Y.Get.Transaction behavior -------------------------------------------
    Y.GetTests.TransactionBehavior = new Y.Test.Case({
        name: 'Transaction behavior',

        setUp: function () {
            G_SCRIPTS = [];
        },

        'transactions should always execute one at a time by default': function () {
            var test = this,
                urls = [
                    getUniqueEchoechoJs(JS_A, DELAY),
                    getUniqueEchoechoJs(JS_B, DELAY),
                    getUniqueEchoechoCss(CSS_A, DELAY),
                    getUniqueEchoechoJs(JS_C, DELAY)
                ],

                t1 = Y.Get.js([urls[0], urls[1]], finish),
                t2 = Y.Get.css(urls[2], finish),
                t3 = Y.Get.load(urls[3], function (err, t) {
                    finish(err, t);

                    test.resume(function () {
                        Assert.areSame('done', t1._state, 'transaction 1 should be finished');
                        Assert.areSame('done', t2._state, 'transaction 2 should be finished');
                        Assert.areSame('done', t3._state, 'transaction 3 should be finished');

                        // This has to be a >= comparison or it'll fail on Windows due to IE's
                        // low-res timer.
                        Assert.isTrue(t2.finish >= t1.finish, "transaction 2 shouldn't start before transaction 1 finishes");
                        Assert.isTrue(t3.finish >= t2.finish, "transaction 3 shouldn't start before transaction 2 finishes");

                        t1.purge();
                        t2.purge();
                        t3.purge();
                    });
                });

            function finish(err, t) {
                t.finish = Y.Lang.now();
            }

            this.wait(30000);
        }
    });

    // -- Y.Get.Transaction methods --------------------------------------------
    Y.GetTests.TransactionMethods = new Y.Test.Case({
        name: 'Transaction methods',

        setUp: function () {
            G_SCRIPTS = [];
        },

        tearDown: function () {
            this.t && this.t.purge();
        },

        'abort() should abort the transaction': function () {
            var test = this;
            var urls = [
                getUniqueEchoechoJs(JS_A, DELAY),
                getUniqueEchoechoJs(JS_B, DELAY),
                getUniqueEchoechoJs(JS_C, DELAY)
            ];

            // Progress is called async, followed by a sync call to failure

            test.t = Y.Get.js(urls, {
                onFailure: function () {
                    ArrayAssert.containsMatch(function (item) {
                        return item.error === 'Aborted'
                    }, test.t.errors, "Transaction failed, but wasn't aborted.");
                },

                onProgress: function () {
                    test.resume(function() {
                        test.t.abort();
                    });
                },

                onSuccess: function () {
                    test.resume(function () {
                        Assert.fail('onSuccess should not be called');
                    });
                }
            });

            test.wait(30000);
        },

        'abort() should accept a custom error message': function () {
            var test = this;
            var urls = [
                getUniqueEchoechoJs(JS_A, DELAY),
                getUniqueEchoechoJs(JS_B, DELAY),
                getUniqueEchoechoJs(JS_C, DELAY)
            ];

            // Progress is called async, followed by a sync call to failure

            test.t = Y.Get.js(urls, {
                onFailure: function () {
                    ArrayAssert.containsMatch(function (item) {
                        return item.error === 'monkey britches!'
                    }, test.t.errors, "Transaction failed, but wasn't aborted (or was aborted with the wrong error message).");
                },

                onProgress: function () {
                    test.resume(function() {
                        test.t.abort('monkey britches!');
                    });
                },

                onSuccess: function () {
                    test.resume(function () {
                        Assert.fail('onSuccess should not be called');
                    });
                }
            });

            test.wait(30000);
        },

        'execute() should queue callbacks': function () {
            var test = this,
                url  = getUniqueEchoechoJs(JS_A, DELAY),
                callbackOne, callbackTwo;

            test.t = Y.Get.js(url);

            test.t.execute(function (err, transaction) {
                callbackOne = true;

                test.resume(function () {
                    Assert.isUndefined(callbackTwo, 'callback two should not have been called before callback one');
                    Assert.isNull(err, '`err` should be null');
                    Assert.areSame(test.t, transaction, 'transaction should be passed to the callback');

                    test.wait(30000);
                });
            });

            test.t.execute(function (err, transaction) {
                callbackTwo = true;

                test.resume(function () {
                    Assert.isTrue(callbackOne, 'callback one should have been called first');
                    Assert.isNull(err, '`err` should be null');
                    Assert.areSame(test.t, transaction, 'transaction should be passed to the callback');
                });
            });

            this.wait(30000);
        },

        'execute() should call the callback immediately if the transaction has already finished': function () {
            var test = this;
            var url = getUniqueEchoechoJs(JS_A, DELAY);

            test.t = Y.Get.js(url, function (err, transaction) {

                test.resume(function () {
                    var callbackOne, callbackTwo;

                    Assert.isNull(err, '`err` should be null');
                    Assert.areSame(test.t, transaction, 'transaction should be passed to the callback');

                    test.t.execute(function (err, transaction) {
                        callbackOne = true;

                        Assert.isUndefined(callbackTwo, 'callback two should not have been called before callback one');
                        Assert.isNull(err, '`err` should be null');
                        Assert.areSame(test.t, transaction, 'transaction should be passed to the callback');
                    });

                    test.t.execute(function (err, transaction) {
                        callbackTwo = true;

                        Assert.isTrue(callbackOne, 'callback one should have been called first');
                        Assert.isNull(err, '`err` should be null');
                        Assert.areSame(test.t, transaction, 'transaction should be passed to the callback');
                    });

                    Assert.isTrue(callbackOne, 'callback one should have been called synchronously');
                    Assert.isTrue(callbackTwo, 'callback two should have been called synchronously');
                });
            });

            this.wait(30000);
        },

        'purge() should purge any nodes inserted by the transaction': function () {
            var test = this;
            var urls = [
                getUniqueEchoechoJs(JS_A, DELAY),
                getUniqueEchoechoJs(JS_B, DELAY),
                getUniqueEchoechoJs(JS_C, DELAY)
            ];

            test.t = Y.Get.js(urls, function (err, t) {
                test.resume(function () {
                    var ids = [];

                    Assert.isNull(err, '`err` should be null');
                    Assert.areSame(3, t.nodes.length, '3 nodes should have been inserted');

                    Y.Array.each(t.nodes, function (node) {
                        ids.push(node.id);
                    });

                    t.purge();

                    Assert.areSame(0, t.nodes.length, 'the `nodes` array should now be empty');

                    Y.Array.each(ids, function (id) {
                        var node = Y.config.doc.getElementById(id);
                        Assert.isNull(node, 'node should not exist in the document anymore');
                    });
                });
            });

            test.wait(30000);
        }
    });

    // -- TODO: Y.Get.Transaction properties -----------------------------------------
    Y.GetTests.TransactionProperties = new Y.Test.Case({

        name: 'Transaction properties',

        _should : {
            ignore : {
                // Need to look into this for IE10 support: Currently if we issue a Get transaction
                // with [bogus.js, bogus.js], we get 2 onerror callbacks and we call onFailure correctly,
                // but subsequent Get transactions for 304 resources don't fire the onload handler.
                // I can't replicate this outside of Get yet.
                '`errors` property should contain an array of error objects' : Y.UA.ie && Y.UA.ie >= 10
            }
        },

        setUp: function () {
            G_SCRIPTS = [];
        },

        tearDown: function () {
            this.t && this.t.purge();
        },

        'transactions should have a unique `id` property': function () {
            var urls = [
                getUniqueEchoechoJs(JS_A, DELAY),
                getUniqueEchoechoJs(JS_B, DELAY)
            ];
            var t1 = Y.Get.js(urls[0]);
            var t2 = Y.Get.js(urls[1]);

            Assert.isNotUndefined(t1.id, 'id property should not be undefined');
            Assert.isNotUndefined(t2.id, 'id property should not be undefined');
            Assert.areNotSame(t1.id, t2.id);

            t1.purge();
            t2.purge();
        },

        'transactions should have a `data` property when a data object is provided': function () {
            var data = {};
            var url = getUniqueEchoechoJs(JS_A, DELAY);

            this.t = Y.Get.js(url, { data: data });
            Assert.areSame(data, this.t.data);
        },

        '`errors` property should contain an array of error objects': function () {
            var test = this;
            var urls = [
                getUniqueEchoecho404(),
                getUniqueEchoecho404()
            ];

            this.t = Y.Get.js(urls, function (err, t) {
                test.resume(function () {
                    Assert.isArray(t.errors, '`errors` should be an array');

                    if (supports.jsFailure) {
                        Assert.areSame(2, t.errors.length, '`errors` array should have two items');
                        ObjectAssert.ownsKeys(['error', 'request'], t.errors[0]);
                        ObjectAssert.ownsKeys(['error', 'request'], t.errors[1]);
                    }
                });
            });

            this.wait(30000);
        },

        '`nodes` property should contain an array of injected nodes': function () {
            var test = this;
            var urls = [
                getUniqueEchoechoJs(JS_A, DELAY),
                getUniqueEchoechoJs(JS_B, DELAY)
            ];

            this.t = Y.Get.js(urls, function (err, t) {

                test.resume(function () {
                    Assert.isArray(t.nodes, '`nodes` should be an array');
                    Assert.areSame(2, t.nodes.length, '`nodes` array should contain two items');
                    Assert.areSame('script', t.nodes[0].nodeName.toLowerCase());
                    Assert.areSame('script', t.nodes[1].nodeName.toLowerCase());
                });
            });

            this.wait(30000);
        },

        '`options` property should contain transaction options': function () {
            var url = getUniqueEchoechoJs(JS_A, DELAY);

            this.t = Y.Get.js(url, {
                attributes: {'class': 'testing'},
                data: 'foo',
                bar: 'baz'
            });

            Assert.isObject(this.t.options, '`options` should be an object');
            ObjectAssert.ownsKeys(['attributes', 'data', 'bar'], this.t.options);

            this.t.abort();
        },

        '`requests` property should contain an array of request objects': function () {
            var test = this;
            var urls = [
                getUniqueEchoechoJs(JS_A, DELAY),
                getUniqueEchoechoJs(JS_B, DELAY)
            ];

            this.t = Y.Get.js(urls, function (err, t) {
                test.resume(function () {
                    Assert.isArray(t.requests, '`requests` should be an array');
                    Assert.areSame(2, t.requests.length, '`requests` array should contain two items');
                    Assert.areSame(urls[0], t.requests[0].url);
                    Assert.areSame(urls[1], t.requests[1].url);

                    Assert.isTrue(t.requests[0].finished);
                    Assert.isTrue(t.requests[0].finished);
                });
            });

            this.wait(30000);
        }
    });

    // -- Options --------------------------------------------------------------
    Y.GetTests.Options = new Y.Test.Case({
        name: 'Options',

        setUp: function () {
            G_SCRIPTS = [];
        },

        tearDown: function () {
            if (this.t) {
                this.t.purge();
            }
        },

        '`class` attribute should be set correctly in all browsers': function () {
            var test = this;
            var url = getUniqueEchoechoJs(JS_A, DELAY);

            this.t = Y.Get.js(url, {
                attributes: {'class': 'get-class-test'}
            }, function (err, t) {
                test.resume(function () {
                    Assert.areSame('get-class-test', t.nodes[0].className, 'className should be set');
                    Assert.areSame(1, Y.all('.get-class-test').size(), 'selector should return one node');
                    test.t = t;
                });
            });

            this.wait(30000);
        }

    });

    // -- Functional tests -----------------------------------------------------
    Y.GetTests.Functional = new Y.Test.Case({
        name: "Functional tests",

        'test: Loader, ScrollView' : function() {
            var test = this;

            YUI().use("scrollview", function(Y2) {
                test.resume(function() {
                    Assert.isFunction(Y2.ScrollView, "ScrollView not loaded");
                });
            });

            this.wait(30000);
        },

        'test: Loader, Autocomplete' : function() {
            var test = this;

            YUI().use("autocomplete-list", function(Y2) {
                test.resume(function() {
                    Assert.isFunction(Y2.AutoCompleteList, "Autocomplete not loaded");
                });
            });

            this.wait(30000);
        }
    });
}, '3.5.0', {
    requires: ['get', 'test']
});
