YUI.add('get-tests', function(Y) {

    Y.GetTests = new Y.Test.Suite("Get Suite");
    Y.GetTests.TEST_FILES_BASE = "getfiles/";

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

            // abort() is the only thing which causes onFailure to be hit. 404s don't
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
                        
                        // We can't control when it will fail
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
        // A GLOBAL, IT POLLUTES THE NEXT SUCCESS TEST. 

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

        'ignore: attributes' : function() {
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

            var trans = Y.Get.css(path("a.css?delay=100"), {

                data: {a:1, b:2, c:3},
                context: {bar:"foo"},

                onSuccess: function(o) {

                    var context = this;

                    setTimeout(function() {
                        test.resume(function() {
                            counts.success++;
    
                            Y.Assert.areEqual("absolute", this.na.getStyle("position"), "a.css does not seem to be loaded");
                            Y.Assert.isTrue(counts.success === 1, "onSuccess called more than once");
    
                            areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                            
                            // Test infrastructure won't let us easily get a trans reference and also wait. 
                            // See if there's a way to do this
                            // Y.Assert.areEqual(trans.tId, o.tId, "Payload has unexpected tId");

                            Y.Assert.areEqual(1, o.nodes.length, "Payload nodes property has unexpected length");
                            Y.Assert.isUndefined(o.statusText, "Payload should not have a statusText");
                            Y.Assert.isUndefined(o.msg, "Payload should not have a msg");
    
                            Y.Assert.areEqual("foo", context.bar, "Callback context not set");
    
                            test.o = o;
                        });
                    }, 300); // need arbit delay to make sure CSS is applied
                    
                    test.wait();                    
                },

                onFailure: function(o) {
                    Y.Assert.fail("onFailure shouldn't have been called");
                }
            });
        },

        'test: multiple css, success': function() {
            var test = this;
            var counts = {
                success:0,
                failure:0
            };

            var trans = Y.Get.css(path(["a.css?delay=300", "b.css?delay=100", "c.css?delay=200"]), {

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
    
                            Y.Assert.areEqual("absolute", this.na.getStyle("position"), "a.css does not seem to be loaded");
                            Y.Assert.areEqual("250px", this.nb.getStyle("left"), "b.css does not seem to be loaded");
                            Y.Assert.areEqual("100px", this.nc.getStyle("top"), "c.css does not seem to be loaded");
                            Y.Assert.isTrue(counts.success === 1, "onSuccess called more than once");
                            
                            areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                            
                            //Y.Assert.areEqual(trans.tId, o.tId, "Payload has unexpected tId");
                            
                            Y.Assert.areEqual(3, o.nodes.length, "Payload nodes property has unexpected length");
                            Y.Assert.isUndefined(o.statusText, "Payload should not have a statusText");
                            Y.Assert.isUndefined(o.msg, "Payload should not have a msg");
    
                            Y.Assert.areEqual("foo", context.bar, "Callback context not set");
                            
                            test.o = o;
                        });
                    }, 800);
                    
                    test.wait();
                }
            });
        },

        'test: async multiple css, success': function() {
            var test = this;
            var counts = {
                success:0,
                failure:0
            };

            var trans = Y.Get.css(path(["a.css?delay=200", "b.css?delay=100", "c.css?delay=100"]), {

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
                            Y.Assert.areEqual("absolute", this.na.getStyle("position"), "a.css does not seem to be loaded");
                            Y.Assert.areEqual("250px", this.nb.getStyle("left"), "b.css does not seem to be loaded");
                            Y.Assert.areEqual("100px", this.nc.getStyle("top"), "c.css does not seem to be loaded");
                            Y.Assert.isTrue(counts.success === 1, "onSuccess called more than once");
                            
                            areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                            
                            //Y.Assert.areEqual(trans.tId, o.tId, "Payload has unexpected tId");

                            Y.Assert.areEqual(3, o.nodes.length, "Payload nodes property has unexpected length");
                            Y.Assert.isUndefined(o.statusText, "Payload should not have a statusText");
                            Y.Assert.isUndefined(o.msg, "Payload should not have a msg");
    
                            Y.Assert.areEqual("foo", context.bar, "Callback context not set");

                            test.o = o;
                        });
                    }, 500);

                    test.wait();
                },
                async:true
            });
        },

        'ignore: single css, failure': function() {

            // CSS failure not widely supported
    
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
                    // Nothing to assert really. Resume is enough of an assert. Better way?
                    Y.Assert.isTrue(counts.failure === 1, "onFailure called more than once");
                },
                onEnd: function(o) {
                    test.o = o;
                }
            }));
        },

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
                        // Nothing to assert really. Resume is enough of an assert.
                        counts.failure++;
                        Y.Assert.isTrue(counts.failure === 1, "onFailure called more than once");
                        test.o = o;
                    });
                },
                onEnd: function(o) {
                    // Never called for CSS
                    test.o = o;
                }
            }));

            this.wait();
        },

        'ignore: async multiple css, failure': function() {
        }
    });

});
