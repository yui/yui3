YUI.add('get-tests', function(Y) {

    Y.GetTests = new Y.Test.Suite("Get Suite");
    Y.GetTests.TEST_FILES_BASE = "getfiles/";

    // TODO: Should get.js stick this somewhere public?
    Y.GetTests.ONLOAD_SUPPORTED = {
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
        var base = Y.GetTests.TEST_FILES_BASE;

        if (typeof urls === "string") {
            urls = base + randUrl(urls);
        } else {
            for (var i = 0; i < urls.length; i++) {
                urls[i] = base + randUrl(urls[i]);
            }
        }
        return urls;
    }

    Y.GetTests.Scripts = new Y.Test.Case({

        name: "Script Tests",

        setUp: function() {
            G_SCRIPTS = [];
        },

        tearDown: function() {
            this.o && this.o.purge();
        },

        'test: single script, success': function() {
            var test = this;

            var counts = {
                success:0,
                failure:0
            };

            var trans = Y.Get.script(path("a.js"), {

                data: {a:1, b:2, c:3},
                context: {bar:"foo"},

                onSuccess: function(o) {

                    var context = this;

                    test.resume(function() {

                        counts.success++;

                        Y.Assert.areEqual(G_SCRIPTS[0], "a.js", "a.js does not seem to be loaded");
                        Y.Assert.areEqual(G_SCRIPTS.length, 1, "More/Less than 1 script was loaded");
                        Y.Assert.isTrue(counts.success === 1, "onSuccess called more than once");

                        areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                        Y.Assert.areEqual(trans.tId, o.tId, "Payload has unexpected tId");
                        Y.Assert.areEqual(1, o.nodes.length, "Payload nodes property has unexpected length");
                        Y.Assert.isUndefined(o.statusText, "Payload should not have a statusText");
                        Y.Assert.isUndefined(o.msg, "Payload should not have a msg");

                        Y.Assert.areEqual("foo", context.bar, "Callback context not set");

                        test.o = o;
                    });
                },
                onFailure: function(o) {

                    test.resume(function() {

                        Y.Assert.fail("onFailure shouldn't have been called");
                        test.o = o;
                    });
                }
            });

            this.wait();
        },
    
        'test: single script, failure': function() {

            var test = this;

            var counts = {
                success:0,
                failure:0
            };

            // TODO: abort() is the only thing which causes onFailure to be hit. 404s don't. Fix when we can fail on 404s
            // Not sure how robust it is to do this inline (that is, could onSuccess fire before abort is hit).
            
            var trans = Y.Get.script(path("a.js"), {
                
                data: {a:1, b:2, c:3},
                context: {bar:"foo"},
                
                onSuccess: function(o) {
                    test.resume(function() {
                        Y.Assert.fail("onSuccess shouldn't have been called");
                        test.o = o;
                    });
                },

                onFailure: function(o) {
                    
                    var context = this;
                    
                    test.resume(function() {

                        counts.failure++;

                        Y.Assert.isTrue(counts.failure === 1, "onFailure called more than once");

                        areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                        Y.Assert.areEqual(trans.tId, o.tId, "Payload has unexpected tId");
                        Y.Assert.areEqual(1, o.nodes.length, "Payload nodes property has unexpected length");
                        Y.Assert.isUndefined(o.statusText, "Payload should not have a statusText");
                        Y.Assert.isString(o.msg, "Payload should have a msg");

                        Y.Assert.areEqual("foo", context.bar, "Callback context not set");

                        test.o = o;
                    });
                }
            });

            Y.Get.abort(trans.tId);

            this.wait();
        },

        'test: single script success, end': function() {

            var test = this;
            var counts = {
                success:0,
                failure:0,
                end:0
            };

            var trans = Y.Get.script(path("a.js"), {

                data: {a:1, b:2, c:3},
                context: {bar:"foo"},
                
                onSuccess: function() {
                    counts.success++;
                    Y.Assert.areEqual("a.js", G_SCRIPTS[0], "a.js does not seem to be loaded");
                    Y.Assert.areEqual(1, G_SCRIPTS.length, "More/Less than 1 script was loaded");
                    Y.Assert.areEqual(1, counts.success, "onSuccess called more than once");
                },
                onFailure: function() {
                    Y.Assert.fail("onFailure shouldn't have been called");
                },
                onEnd : function(o) {
                    
                    var context = this;
                    
                    test.resume(function() {
                        counts.end++;
                        Y.Assert.areEqual(1, counts.end,"onEnd called more than once");
                        Y.Assert.areEqual(1, counts.success, "onEnd called before onSuccess");
                        Y.Assert.areEqual("OK", o.statusText, "Expected OK result");

                        areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                        Y.Assert.areEqual(trans.tId, o.tId, "Payload has unexpected tId");
                        Y.Assert.areEqual(1, o.nodes.length, "Payload nodes property has unexpected length");
                        Y.Assert.areEqual("OK", o.statusText, "Payload should have an OK statusText");
                        Y.Assert.isUndefined(o.msg, "Payload should have an undefined msg");

                        Y.Assert.areEqual("foo", context.bar, "Callback context not set");

                        test.o = o;
                    });
                }
            });

            this.wait();
        },
        
        'test: single script failure, end': function() {

            var test = this;
            var counts = {
                success:0,
                failure:0,
                end:0
            };

            var trans = Y.Get.script(path("a.js"), {
                
                data: {a:1, b:2, c:3},
                context: {bar:"foo"},
                
                onFailure: function() {
                    counts.failure++;
                    Y.Assert.isTrue(counts.failure === 1, "onFailure called more than once");
                },
                onSuccess: function() {
                    Y.Assert.fail("onSuccess shouldn't have been called");
                },
                onEnd : function(o) {

                    var context = this;
                    
                    test.resume(function() {
                        counts.end++;
                        Y.Assert.areEqual(1, counts.end,"onEnd called more than once");
                        Y.Assert.areEqual(1, counts.failure, "onEnd called before onFailure");
                        Y.Assert.areEqual("failure", o.statusText, "Expected failure result");

                        areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                        Y.Assert.areEqual(trans.tId, o.tId, "Payload has unexpected tId");
                        Y.Assert.areEqual(1, o.nodes.length, "Payload nodes property has unexpected length");
                        Y.Assert.areEqual("failure", o.statusText, "Payload should have a failure statusText");
                        Y.Assert.isString(o.msg, "Payload should have a failure msg");

                        Y.Assert.areEqual("foo", context.bar, "Callback context not set");

                        test.o = o;
                    });
                }
            });

            Y.Get.abort(trans.tId);

            this.wait();
        },

        'test: multiple script, success': function() {
            
            var test = this;
            var counts = {
                success:0,
                failure:0
            };

            var trans = Y.Get.script(path(["b.js", "a.js", "c.js"]), {
                
                data: {a:1, b:2, c:3},
                context: {bar:"foo"},
                
                onFailure: function(o) {
                    test.resume(function() {
                        Y.Assert.fail("onFailure shouldn't have been called");
                        test.o = o;
                    });
                },
                onSuccess: function(o) {
                    
                    var context = this;
                    
                    test.resume(function() {
                        counts.success++;
                        Y.Assert.areEqual(G_SCRIPTS.length, 3, "More/Less than 3 scripts loaded");
                        Y.ArrayAssert.itemsAreEqual(G_SCRIPTS, ["b.js", "a.js", "c.js"], "Unexpected script order");
                        Y.Assert.isTrue(counts.success === 1, "onSuccess called more than once");

                        areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                        Y.Assert.areEqual(trans.tId, o.tId, "Payload has unexpected tId");
                        Y.Assert.areEqual(3, o.nodes.length, "Payload nodes property has unexpected length");
                        Y.Assert.isUndefined(o.statusText, "Payload should have an undefined statusText");
                        Y.Assert.isUndefined(o.msg, "Payload should have an undefined msg");

                        Y.Assert.areEqual("foo", context.bar, "Callback context not set");
                        
                        test.o = o;
                    });
                }
            });

            this.wait();
        },

        'test: multiple script, failure': function() {

            var test = this;
            var counts = {
                success:0,
                failure:0
            };

            var trans = Y.Get.script(path(["a.js", "b.js", "c.js"]), {
                
                data: {a:1, b:2, c:3},
                context: {bar:"foo"},
                
                onSuccess: function(o) {
                    test.resume(function() {
                        Y.Assert.fail("onSuccess shouldn't have been called");
                        test.o = o;
                    });
                },
                onFailure: function(o) {
                    
                    var context = this;
                    
                    test.resume(function() {
                        counts.failure++;
                        Y.Assert.isTrue(counts.failure === 1, "onFailure called more than once");
                        
                        areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                        Y.Assert.areEqual(trans.tId, o.tId, "Payload has unexpected tId");

                        // TODO: We can't control which script it will fail on. Fix when we can (when we have built in server env).
                        // Y.Assert.areEqual(3, o.nodes.length, "Payload nodes property has unexpected length");

                        Y.Assert.isUndefined(o.statusText, "Payload should have an undefined statusText");
                        Y.Assert.isString(o.msg, "Payload should have a failure msg");

                        Y.Assert.areEqual("foo", context.bar, "Callback context not set");
                        
                        test.o = o;
                    });
                }
            });

            Y.Get.abort(trans.tId);

            this.wait();
        },
        
        'test: multiple script, success, end': function() {

            var test = this;
            var counts = {
                success:0,
                failure:0,
                end:0
            };

            var trans = Y.Get.script(path(["c.js", "b.js", "a.js"]), {
                
                data: {a:1, b:2, c:3},
                context: {bar:"foo"},
                
                onSuccess: function() {
                    counts.success++;
                    Y.Assert.areEqual(G_SCRIPTS.length, 3, "More/Less than 3 scripts loaded");
                    Y.ArrayAssert.itemsAreEqual(G_SCRIPTS, ["c.js", "b.js", "a.js"], "Unexpected script order");
                    Y.Assert.isTrue(counts.success === 1, "onSuccess called more than once");
                },
                onFailure: function() {
                    Y.Assert.fail("onFailure shouldn't have been called");
                },
                onEnd : function(o) {

                    var context = this;
                    
                    test.resume(function() {
                        counts.end++;
                        Y.Assert.areEqual(1, counts.end,"onEnd called more than once");
                        Y.Assert.areEqual(1, counts.success, "onEnd called before onSuccess");

                        areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                        Y.Assert.areEqual(trans.tId, o.tId, "Payload has unexpected tId");
                        Y.Assert.areEqual(3, o.nodes.length, "Payload nodes property has unexpected length");
                        Y.Assert.areEqual("OK", o.statusText, "Payload should have an OK statusText");
                        Y.Assert.isUndefined(o.msg, "Payload should have an undefined msg");

                        Y.Assert.areEqual("foo", context.bar, "Callback context not set");

                        test.o = o;
                    });
                }
            });

            this.wait();
            
        },

        'test: multiple script, failure, end': function() {

            var test = this;
            var counts = {
                success:0,
                failure:0,
                end:0
            };

            var trans = Y.Get.script(path(["a.js", "b.js", "c.js"]), {

                data: {a:1, b:2, c:3},
                context: {bar:"foo"},

                onSuccess: function() {
                    Y.Assert.fail("onSuccess shouldn't have been called");
                },

                onFailure: function() {
                    counts.failure++;
                    Y.Assert.isTrue(counts.failure === 1, "onFailure called more than once");
                },

                onEnd : function(o) {

                    var context = this;
                    
                    test.resume(function() {
                        counts.end++;
                        Y.Assert.areEqual(1, counts.end,"onEnd called more than once");
                        Y.Assert.areEqual(1, counts.failure, "onEnd called before onFailure");
                        
                        areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                        Y.Assert.areEqual(trans.tId, o.tId, "Payload has unexpected tId");
                        
                        //Y.Assert.areEqual(1, o.nodes.length, "Payload nodes property has unexpected length");
                        
                        Y.Assert.areEqual("failure", o.statusText, "Payload should have a failure statusText");
                        Y.Assert.isString(o.msg, "Payload should have a failure msg");

                        Y.Assert.areEqual("foo", context.bar, "Callback context not set");
                        
                        test.o = o;
                    });
                }
            });

            Y.Get.abort(trans.tId);

            this.wait();
        },

        'test: async multiple script, success': function() {

            var test = this;
            var counts = {
                success:0,
                failure:0
            };

            var trans = Y.Get.script(path(["a.js", "b.js", "c.js"]), {
                
                data: {a:1, b:2, c:3},
                context: {bar:"foo"},
                
                onFailure: function(o) {
                    test.resume(function() {
                        Y.Assert.fail("onFailure shouldn't have been called");
                        test.o = o;
                    });
                },
                onSuccess: function(o) {
                    
                    var context = this;
                    
                    test.resume(function() {
                        counts.success++;
                        Y.Assert.areEqual(G_SCRIPTS.length, 3, "More/Less than 3 scripts loaded");
                        Y.ArrayAssert.containsItems( ["c.js", "a.js", "b.js"], G_SCRIPTS, "Unexpected script contents");
                        Y.Assert.isTrue(counts.success === 1, "onSuccess called more than once");
                        
                        areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                        Y.Assert.areEqual(trans.tId, o.tId, "Payload has unexpected tId");
                        Y.Assert.areEqual(3, o.nodes.length, "Payload nodes property has unexpected length");
                        Y.Assert.isUndefined(o.statusText, "Payload should have an undefined statusText");
                        Y.Assert.isUndefined(o.msg, "Payload should have an undefined msg");

                        Y.Assert.areEqual("foo", context.bar, "Callback context not set");
                        
                        test.o = o;
                    });
                },
                async:true
            });

            this.wait();
        },

        'test: async multiple script, success, end': function() {

            var test = this;
            var counts = {
                success:0,
                failure:0,
                end:0
            };

            var trans = Y.Get.script(path(["c.js", "a.js", "b.js"]), {

                data: {a:1, b:2, c:3},
                context: {bar:"foo"},
                
                onSuccess: function() {
                    counts.success++;
                    Y.Assert.areEqual(G_SCRIPTS.length, 3, "More/Less than 3 scripts loaded");
                    Y.ArrayAssert.containsItems(G_SCRIPTS, ["a.js", "b.js", "c.js"], "Unexpected script contents");
                    Y.Assert.isTrue(counts.success === 1, "onSuccess called more than once");
                },
                onFailure: function() {
                    Y.Assert.fail("onFailure shouldn't have been called");
                },
                onEnd : function(o) {

                    var context = this;
                    
                    test.resume(function() {
                        counts.end++;
                        Y.Assert.areEqual(1, counts.end,"onEnd called more than once");
                        Y.Assert.areEqual(1, counts.success, "onEnd called before onSuccess");

                        areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                        Y.Assert.areEqual(trans.tId, o.tId, "Payload has unexpected tId");
                        Y.Assert.areEqual(3, o.nodes.length, "Payload nodes property has unexpected length");
                        Y.Assert.areEqual("OK", o.statusText, "Payload should have an OK statusText");
                        Y.Assert.isUndefined(o.msg, "Payload should have an undefined msg");

                        Y.Assert.areEqual("foo", context.bar, "Callback context not set");
                        
                        test.o = o;
                    });
                },
                async:true
            });

            this.wait();
            
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

            var trans = Y.Get.script(path(["a.js", "b.js", "c.js"]), {

                data: {a:1, b:2, c:3},
                context: {bar:"foo"},
                
                onSuccess: function(o) {
                    test.resume(function() {
                        Y.Assert.fail("onSuccess shouldn't have been called");
                        test.o = o;
                    });
                },
                onFailure: function(o) {
                    
                    var context = this;
                    
                    test.resume(function() {
                        counts.failure++;
                        Y.Assert.isTrue(counts.failure === 1, "onFailure called more than once");
                        
                        areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                        Y.Assert.areEqual(trans.tId, o.tId, "Payload has unexpected tId");

                        // Can't control which script it will abort at. Also async will keep on downloading
                        // Y.Assert.areEqual(3, o.nodes.length, "Payload nodes property has unexpected length");

                        Y.Assert.isUndefined(o.statusText, "Payload should have an undefined statusText");
                        Y.Assert.isString(o.msg, "Payload should have a failure msg");

                        Y.Assert.areEqual("foo", context.bar, "Callback context not set");

                        test.o = o;
                    });
                },
                async:true
            })

            Y.Get.abort(trans.tId);

            this.wait();
        },

        'test: async multiple script, failure, end': function() {

            var test = this;
            var counts = {
                success:0,
                failure:0,
                end:0
            };

            var trans = Y.Get.script(path(["a.js", "b.js", "c.js"]), {

                data: {a:1, b:2, c:3},
                context: {bar:"foo"},
                
                onSuccess: function() {
                    Y.Assert.fail("onSuccess shouldn't have been called");
                },
                onFailure: function() {
                    counts.failure++;
                    Y.Assert.isTrue(counts.failure === 1, "onFailure called more than once");
                },
                onEnd : function(o) {

                    var context = this;
                    
                    test.resume(function() {
                        counts.end++;
                        Y.Assert.areEqual(1, counts.end,"onEnd called more than once");
                        Y.Assert.areEqual(1, counts.failure, "onEnd called before onFailure");

                        areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                        Y.Assert.areEqual(trans.tId, o.tId, "Payload has unexpected tId");

                        //Y.Assert.areEqual(1, o.nodes.length, "Payload nodes property has unexpected length");

                        Y.Assert.areEqual("failure", o.statusText, "Payload should have a failure statusText");
                        Y.Assert.isString(o.msg, "Payload should have a failure msg");

                        Y.Assert.areEqual("foo", context.bar, "Callback context not set");

                        test.o = o;
                    });
                },
                async:true
            });

            Y.Get.abort(trans.tId);

            this.wait();
        },

        'ignore: abort' : function() {
            // Kind of covered above, but worth testing payload also
        },

        'ignore: timeout' : function() {
        },

        'ignore: purgethreshold' : function() {
        },

        'ignore: insertBefore' : function() {
        },

        'ignore: charset' : function() {
        },

        'test: attributes, single' : function() {

            var test = this;

            var trans = Y.Get.script(path("a.js"), {

                onSuccess: function(o) {
                    test.resume(function() {
                        
                        test.o = o;
                    });
                },
                onFailure: function(o) {
                    test.resume(function() {
                        Y.Assert.fail("onFailure shouldn't have been called");
                        test.o = o;
                    });
                }
            });

            this.wait();
        },

        'test: attributes, multiple' : function() {
            var test = this;

            var counts = {
                success:0,
                failure:0
            };

            var trans = Y.Get.script(path("a.js"), {

                data: {a:1, b:2, c:3},
                context: {bar:"foo"},

                onSuccess: function(o) {

                    var context = this;

                    test.resume(function() {

                        counts.success++;

                        Y.Assert.areEqual(G_SCRIPTS[0], "a.js", "a.js does not seem to be loaded");
                        Y.Assert.areEqual(G_SCRIPTS.length, 1, "More/Less than 1 script was loaded");
                        Y.Assert.isTrue(counts.success === 1, "onSuccess called more than once");

                        areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                        Y.Assert.areEqual(trans.tId, o.tId, "Payload has unexpected tId");
                        Y.Assert.areEqual(1, o.nodes.length, "Payload nodes property has unexpected length");
                        Y.Assert.isUndefined(o.statusText, "Payload should not have a statusText");
                        Y.Assert.isUndefined(o.msg, "Payload should not have a msg");

                        Y.Assert.areEqual("foo", context.bar, "Callback context not set");

                        test.o = o;
                    });
                },
                onFailure: function(o) {

                    test.resume(function() {

                        Y.Assert.fail("onFailure shouldn't have been called");
                        test.o = o;
                    });
                }
            });

            this.wait();
        }
    });

    Y.GetTests.Functional = new Y.Test.Case({

        name: "Functional Tests",

        'test: Loader, ScrollView' : function() {
            var test = this;

            YUI().use("scrollview", function(Y2) {
                test.resume(function() {
                    Y.Assert.isFunction(Y2.ScrollView, "ScrollView not loaded");    
                });
            });

            this.wait();
        },

        'test: Loader, Autocomplete' : function() {
            var test = this;

            YUI().use("autocomplete-list", function(Y2) {
                test.resume(function() {
                    Y.Assert.isFunction(Y2.AutoCompleteList, "Autocomplete not loaded");    
                });
            });

            this.wait();
        }
    });

    Y.GetTests.CSS = new Y.Test.Case({

        name: "CSS Tests",

        setUp: function() {
            this.na = Y.Node.create('<div class="get_test_a">get_test_a</div>');
            this.nb = Y.Node.create('<div class="get_test_b">get_test_b</div>');
            this.nc = Y.Node.create('<div class="get_test_c">get_test_c</div>');

            var b = Y.Node.one("body");
            b.append(this.na);
            b.append(this.nb);
            b.append(this.nc);

            this.onload = Y.GetTests.ONLOAD_SUPPORTED['css'];
        },

        tearDown: function() {
            this.na.remove(true);
            this.nb.remove(true);
            this.nc.remove(true);
            this.o && this.o.purge();
        },

        'test: single css, success': function() {
            var test = this;
            var counts = {
                success:0,
                failure:0
            };
            
            // Using test.onload to switch test behavior for IE/Opera vs. others.
            // In IE/Opera we don't need to artifical timeout, since we're notified
            // onload. For the others, onSuccess is called synchronously.

            var trans = Y.Get.css(path("a.css?delay=100"), {

                data: {a:1, b:2, c:3},
                context: {bar:"foo"},

                onSuccess: function(o) {

                    var context = this;

                    setTimeout(function() {
                        test.resume(function() {
                            counts.success++;
    
                            Y.Assert.areEqual("1111", this.na.getStyle("zIndex"), "a.css does not seem to be loaded");
                            Y.Assert.isTrue(counts.success === 1, "onSuccess called more than once");
    
                            areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");

                            // TODO: Test infrastructure won't let us easily get a populated trans reference and also wait (AFAICT). So commenting this out.
                            // Y.Assert.areEqual(trans.tId, o.tId, "Payload has unexpected tId");

                            Y.Assert.areEqual(1, o.nodes.length, "Payload nodes property has unexpected length");
                            Y.Assert.isUndefined(o.statusText, "Payload should not have a statusText");
                            Y.Assert.isUndefined(o.msg, "Payload should not have a msg");
    
                            Y.Assert.areEqual("foo", context.bar, "Callback context not set");
    
                            test.o = o;
                        });
                    }, test.onload ? 0 : 200); // need arbit delay to make sure CSS is applied

                    if (!test.onload) {
                        test.wait();
                    }
                    
                },

                onFailure: function(o) {
                    Y.Assert.fail("onFailure shouldn't have been called");
                }
            });

            if (test.onload) {
                test.wait();
            }
        },

        'test: multiple css, success': function() {

            var test = this;
            var counts = {
                success:0,
                failure:0
            };

            var trans = Y.Get.css(path(["a.css?delay=100", "b.css?delay=200", "c.css?delay=50"]), {

                data: {a:1, b:2, c:3},
                context: {bar:"foo"},

                onFailure: function(o) {
                    Y.Assert.fail("onFailure shouldn't have been called");
                },

                onSuccess: function(o) {
                    
                    var context = this;

                    setTimeout(function() {
                        test.resume(function() {
                            counts.success++;
    
                            Y.Assert.areEqual("1111", this.na.getStyle("zIndex"), "a.css does not seem to be loaded");
                            Y.Assert.areEqual("1234", this.nb.getStyle("zIndex"), "b.css does not seem to be loaded");
                            Y.Assert.areEqual("4321", this.nc.getStyle("zIndex"), "c.css does not seem to be loaded");
                            Y.Assert.isTrue(counts.success === 1, "onSuccess called more than once");
                            
                            areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                            
                            //Y.Assert.areEqual(trans.tId, o.tId, "Payload has unexpected tId");
                            
                            Y.Assert.areEqual(3, o.nodes.length, "Payload nodes property has unexpected length");
                            Y.Assert.isUndefined(o.statusText, "Payload should not have a statusText");
                            Y.Assert.isUndefined(o.msg, "Payload should not have a msg");
    
                            Y.Assert.areEqual("foo", context.bar, "Callback context not set");
                            
                            test.o = o;
                        });
                    }, test.onload ? 0 : 700);

                    if (!test.onload) {
                        test.wait();
                    }
                }
            });
            
            if (test.onload) {
                test.wait();
            }
        },

        'test: async multiple css, success': function() {

            var test = this;
            var counts = {
                success:0,
                failure:0
            };

            var trans = Y.Get.css(path(["a.css?delay=300", "b.css?delay=100", "c.css?delay=50"]), {

                data: {a:1, b:2, c:3},
                context: {bar:"foo"},

                onFailure: function(o) {
                    Y.Assert.fail("onFailure shouldn't have been called");
                },
                onSuccess: function(o) {

                    var context = this;

                    setTimeout(function() {
                        test.resume(function() {
                            counts.success++;
                            Y.Assert.areEqual("1111", this.na.getStyle("zIndex"), "a.css does not seem to be loaded");
                            Y.Assert.areEqual("1234", this.nb.getStyle("zIndex"), "b.css does not seem to be loaded");
                            Y.Assert.areEqual("4321", this.nc.getStyle("zIndex"), "c.css does not seem to be loaded");
                            Y.Assert.isTrue(counts.success === 1, "onSuccess called more than once");
                            
                            areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                            
                            //Y.Assert.areEqual(trans.tId, o.tId, "Payload has unexpected tId");

                            Y.Assert.areEqual(3, o.nodes.length, "Payload nodes property has unexpected length");
                            Y.Assert.isUndefined(o.statusText, "Payload should not have a statusText");
                            Y.Assert.isUndefined(o.msg, "Payload should not have a msg");
    
                            Y.Assert.areEqual("foo", context.bar, "Callback context not set");

                            test.o = o;
                        });
                    }, test.onload ? 0 : 700);

                    if (!test.onload) {
                        test.wait();
                    }
                },
                async:true
            });
            
            if (test.onload) {
                test.wait();
            }
        },

        // TODO: CSS failure not widely supported. Enable when success/failure handling is in place
    
        'ignore: single css, failure': function() {

            var test = this;
            var counts = {
                success:0,
                failure:0
            };
            
            Y.Get.abort(Y.Get.css(path("a.css"), {

                data: {a:1, b:2, c:3},
                context: {bar:"foo"},

                onSuccess: function(o) {
                    Y.Assert.fail("onSuccess shouldn't have been called");
                },

                onFailure: function(o) {
                    counts.failure++;
                    Y.Assert.isTrue(counts.failure === 1, "onFailure called more than once");
                },
                onEnd: function(o) {
                    test.o = o;
                }
            }));
        },

        // TODO: CSS failure not widely supported. Enable when success/failure handling is in place

        'ignore: multiple css, failure': function() {
            var test = this;
            var counts = {
                success:0,
                failure:0
            };

            Y.Get.abort(Y.Get.css(path(["a.css", "b.css", "c.css"]), {

                data: {a:1, b:2, c:3},
                context: {bar:"foo"},
                
                onSuccess: function(o) {
                    test.resume(function() {
                        Y.Assert.fail("onSuccess shouldn't have been called");
                    });
                },
                onFailure: function(o) {
                    test.resume(function() {
                        counts.failure++;
                        Y.Assert.isTrue(counts.failure === 1, "onFailure called more than once");
                        test.o = o;
                    });
                },
                onEnd: function(o) {
                    test.o = o;
                }
            }));

            this.wait();
        },

        // TODO: CSS failure not widely supported. Enable when success/failure handling is in place

        'ignore: async multiple css, failure': function() {
        }
    });

});
