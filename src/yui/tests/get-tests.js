YUI.add('get-tests', function(Y) {

    Y.GetTests = new Y.Test.Suite("Get Suite");
    Y.GetTests.TEST_FILES_BASE = "getfiles/";
    
    var FILENAME = /[abc]\.js/;

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

        createInsertBeforeNode: function() {
            this.ib = Y.Node.create('<div id="insertBeforeMe"></div>');
            Y.Node.one("body").appendChild(this.ib);
        },

        removeInsertBeforeNode: function() {
            if (this.ib) {
                this.ib.remove(true);
            }
        },

        tearDown: function() {
            if (this.o) {
                this.o.purge();
            }
            this.removeInsertBeforeNode();
        },

        'test: single script, success': function() {

            var test = this;
            var progress = [];
            var counts = {
                success:0,
                failure:0
            };

            var trans = Y.Get.script(path("a.js"), {

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

                        Y.Assert.areEqual("a.js", G_SCRIPTS[0], "a.js does not seem to be loaded");
                        Y.ArrayAssert.itemsAreEqual(G_SCRIPTS, progress, "Progress does not match G_SCRIPTS");
                        
                        Y.Assert.areEqual(1, G_SCRIPTS.length, "More/Less than 1 script was loaded");
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
            var progress = [];
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

                onProgress: function(o) {
                    var file = o.url.match(/[abc]\.js/);
                    progress.push(file[0]);
                },

                onSuccess: function(o) {
                    
                    var context = this;

                    test.resume(function() {
                        counts.success++;
                        Y.Assert.areEqual(3, G_SCRIPTS.length, "More/Less than 3 scripts loaded");
                        Y.ArrayAssert.itemsAreEqual(["b.js", "a.js", "c.js"], G_SCRIPTS, "Unexpected script order");
                        Y.ArrayAssert.itemsAreEqual(G_SCRIPTS, progress, "Progress does not match G_SCRIPTS");
 
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
            var progress = [];
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

                    Y.Assert.areEqual(3, G_SCRIPTS.length, "More/Less than 3 scripts loaded");
                    Y.ArrayAssert.itemsAreEqual(["c.js", "b.js", "a.js"], G_SCRIPTS,  "Unexpected script order");
                    Y.ArrayAssert.itemsAreEqual(G_SCRIPTS, progress, "Progress does not match G_SCRIPTS");
                    Y.Assert.isTrue(counts.success === 1, "onSuccess called more than once");
                },
                
                onProgress: function(o) {
                    var file = o.url.match(/[abc]\.js/);
                    progress.push(file[0]);
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
            var progress = [];
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
                
                onProgress: function(o) {
                    var file = o.url.match(/[abc]\.js/);
                    progress.push(file[0]);
                },
                
                onSuccess: function(o) {
                    
                    var context = this;
                    
                    test.resume(function() {
                        counts.success++;
                        Y.Assert.areEqual(3, G_SCRIPTS.length, "More/Less than 3 scripts loaded");
                        Y.ArrayAssert.itemsAreEqual(G_SCRIPTS, progress, "Progress does not match G_SCRIPTS");                        
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
                    Y.Assert.areEqual(3, G_SCRIPTS.length, "More/Less than 3 scripts loaded");
                    Y.ArrayAssert.containsItems(["a.js", "b.js", "c.js"], G_SCRIPTS, "Unexpected script contents");
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

        'test: insertBefore, single' : function() {

            var test = this;

            test.createInsertBeforeNode();

            var trans = Y.Get.script(path("a.js"), {
                
                insertBefore: "insertBeforeMe",

                onSuccess: function(o) {
                    test.resume(function() {

                        var n = Y.Node.one(o.nodes[0]);
                        var insertBefore = Y.Node.one("#insertBeforeMe");

                        Y.Assert.isTrue(n.compareTo(insertBefore.previous()), "Not inserted before insertBeforeMe");

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

        'test: insertBefore, multiple' : function() {

            var test = this;

            test.createInsertBeforeNode();

            var trans = Y.Get.script(path(["a.js", "b.js"]), {

                insertBefore: "insertBeforeMe",

                onSuccess: function(o) {
                    test.resume(function() {

                        var insertBefore = Y.Node.one("#insertBeforeMe");

                        for (var i = o.nodes.length-1; i >= 0; i--) {
                            var n = Y.Node.one(o.nodes[i]);
                            Y.Assert.isTrue(n.compareTo(insertBefore.previous()), "Not inserted before insertBeforeMe");
                            insertBefore = n;
                        }
                        
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

        'test: async, insertBefore, multiple' : function() {

            var test = this;

            test.createInsertBeforeNode();

            var trans = Y.Get.script(path(["a.js", "b.js"]), {

                insertBefore: "insertBeforeMe",

                onSuccess: function(o) {
                    test.resume(function() {

                        var insertBefore = Y.Node.one("#insertBeforeMe");

                        for (var i = o.nodes.length-1; i >= 0; i--) {
                            var n = Y.Node.one(o.nodes[i]);
                            Y.Assert.isTrue(n.compareTo(insertBefore.previous()), "Not inserted before insertBeforeMe");
                            insertBefore = n;
                        }
                        
                        test.o = o;
                    });
                },

                onFailure: function(o) {
                    test.resume(function() {
                        Y.Assert.fail("onFailure shouldn't have been called");
                        test.o = o;
                    });
                },
                async:true
            });

            this.wait();
        },

        'test: charset, single' : function() {

            var test = this;

            var trans = Y.Get.script(path("a.js"), {

                charset: "ISO-8859-1",  

                onSuccess: function(o) {
                    test.resume(function() {

                        var node = document.getElementById(o.nodes[0].id);

                        Y.Assert.areEqual("ISO-8859-1", node.charset, "charset property not set");
                        Y.Assert.areEqual("ISO-8859-1", node.getAttribute("charset"), "charset attribute not set");

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

        'test: charset, multiple' : function() {

            var test = this;

            var trans = Y.Get.script(path(["a.js", "b.js", "c.js"]), {

                charset: "ISO-8859-1",  

                onSuccess: function(o) {

                    test.resume(function() {

                        Y.Assert.areEqual(3, o.nodes.length, "Unexpected node count");

                        for (var i = 0; i < o.nodes.length; i++) {

                            var node = document.getElementById(o.nodes[i].id);

                            Y.Assert.areEqual("ISO-8859-1", node.charset, "charset property not set");
                            Y.Assert.areEqual("ISO-8859-1", node.getAttribute("charset"), "charset attribute not set");
                        }

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
        
        'test: async, charset, multiple' : function() {

            var test = this;

            var trans = Y.Get.script(path(["a.js", "b.js", "c.js"]), {

                charset: "ISO-8859-1",  

                onSuccess: function(o) {

                    test.resume(function() {

                        Y.Assert.areEqual(3, o.nodes.length, "Unexpected node count");

                        for (var i = 0; i < o.nodes.length; i++) {

                            var node = document.getElementById(o.nodes[i].id);

                            Y.Assert.areEqual("ISO-8859-1", node.charset, "charset property not set");
                            Y.Assert.areEqual("ISO-8859-1", node.getAttribute("charset"), "charset attribute not set");
                        }

                        test.o = o;
                    });
                },

                onFailure: function(o) {
                    test.resume(function() {
                        Y.Assert.fail("onFailure shouldn't have been called");
                        test.o = o;
                    });
                },

                async :true
            });

            this.wait();
        },

        'test: attributes, single' : function() {

            var test = this;

            var trans = Y.Get.script(path("a.js"), {

                attributes: {
                    "defer":true,         // Too much potential to interfere with global test structure?
                    "charset": "ISO-8859-1",  
                    "title": "myscripts"
                },

                onSuccess: function(o) {
                    test.resume(function() {

                        var node = document.getElementById(o.nodes[0].id);

                        Y.Assert.areEqual("myscripts", node.title, "title property not set");
                        Y.Assert.areEqual("ISO-8859-1", node.charset, "charset property not set");
                        Y.Assert.areEqual(true, node.defer, "defer property not set");

                        Y.Assert.areEqual("myscripts", node.getAttribute("title"), "title attribute not set");
                        Y.Assert.areEqual("ISO-8859-1", node.getAttribute("charset"), "charset attribute not set");

                        // Needs cross browser normalization, IE8 returns "defer", Safari returns "true" etc. 
                        // Y.Assert.areEqual("true", node.getAttribute("defer"), "defer attribute not set");

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

            var trans = Y.Get.script(path(["a.js", "b.js", "c.js"]), {

                attributes: {
                    "defer":true,         // Too much potential to interfere with global test structure?
                    "charset": "ISO-8859-1",  
                    "title": "myscripts"
                },

                onSuccess: function(o) {

                    test.resume(function() {

                        Y.Assert.areEqual(3, o.nodes.length, "Unexpected node count");

                        for (var i = 0; i < o.nodes.length; i++) {

                            var node = document.getElementById(o.nodes[i].id);

                            Y.Assert.areEqual("myscripts", node.title, "title property not set");
                            Y.Assert.areEqual("ISO-8859-1", node.charset, "charset property not set");
                            Y.Assert.areEqual(true, node.defer, "defer property not set");
    
                            Y.Assert.areEqual("myscripts", node.getAttribute("title"), "title attribute not set");
                            Y.Assert.areEqual("ISO-8859-1", node.getAttribute("charset"), "charset attribute not set");
                        }

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
        
        'test: async, attributes, multiple' : function() {

            var test = this;

            var trans = Y.Get.script(path(["a.js", "b.js", "c.js"]), {

                attributes: {
                    "defer":true,         // Too much potential to interfere with global test structure?
                    "charset": "ISO-8859-1",  
                    "title": "myscripts"
                },

                onSuccess: function(o) {

                    test.resume(function() {

                        Y.Assert.areEqual(3, o.nodes.length, "Unexpected node count");

                        for (var i = 0; i < o.nodes.length; i++) {

                            var node = document.getElementById(o.nodes[i].id);

                            Y.Assert.areEqual("myscripts", node.title, "title property not set");
                            Y.Assert.areEqual("ISO-8859-1", node.charset, "charset property not set");
                            Y.Assert.areEqual(true, node.defer, "defer property not set");
    
                            Y.Assert.areEqual("myscripts", node.getAttribute("title"), "title attribute not set");
                            Y.Assert.areEqual("ISO-8859-1", node.getAttribute("charset"), "charset attribute not set");
                        }

                        test.o = o;
                    });
                },

                onFailure: function(o) {
                    test.resume(function() {
                        Y.Assert.fail("onFailure shouldn't have been called");
                        test.o = o;
                    });
                },

                async :true
            });

            this.wait();
        },

        'ignore: abort' : function() {
            // Covered above, but worth testing payload also
        },

        'ignore: timeout' : function() {
            // Need delay.js always available to test this reliably. Leaving out for now
        },

        'test: purgethreshold' : function() {

            var test = this;
            var nodes = [];
            var nodeIds = [];

            // Purge only happens at the start of a queue call.

            Y.Get.script(path("a.js"), {
                
                purgethreshold: 1000, // Just to make sure we're not purged as part of the default 20 script purge.

                onSuccess: function(o) {

                    nodes = nodes.concat(o.nodes);

                    Y.Get.script(path("b.js"), {
                        
                        purgethreshold: 1000, // Just to make sure we're not purged as part of the default 20 script purge.
                        
                        onSuccess: function(o) {

                            nodes = nodes.concat(o.nodes);

                            Y.Assert.areEqual(2, nodes.length, "2 nodes should have been added");

                            for (var i = 0; i < nodes.length; i++) {
                                var node = Y.Node.one(nodes[i]);
                                Y.Assert.isTrue(node.inDoc(), "Scripts should still be in the document");

                                // Convert to id, for final doc check, because purge destroys parentNode
                                nodeIds[i] = node.get("id");
                            }

                            Y.Get.script(path("c.js"), {

                                purgethreshold:1,

                                onSuccess: function(o) {

                                    test.resume(function() {

                                        for (var i = 0; i < nodeIds.length; i++) {
                                            Y.Assert.isNull(Y.Node.one(nodeIds[i]), "Script from previous transaction was not purged");
                                        }
    
                                        Y.Assert.isTrue(Y.Node.one(o.nodes[0]).inDoc());
                                        
                                        test.o = o;
                                    });                               
                                }
                            });                                            
                        }
                    });
                }
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

            naa = this.na;

            var b = Y.Node.one("body");
            b.append(this.na);
            b.append(this.nb);
            b.append(this.nc);

            this.onload = Y.GetTests.ONLOAD_SUPPORTED['css'];
        },

        createInsertBeforeNode: function() {
            this.ib = Y.Node.create('<link id="insertBeforeMe" href="' + path("ib.css?delay=0") + '" rel="stylesheet" type="text/css" charset="utf-8">');
            Y.Node.one("head").appendChild(this.ib);
        },

        removeInsertBeforeNode: function() {
            if (this.ib) {
                this.ib.remove(true);
            }
        },

        tearDown: function() {
            this.na.remove(true);
            this.nb.remove(true);
            this.nc.remove(true);

            this.o && this.o.purge();
            this.removeInsertBeforeNode();
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

            var trans = Y.Get.css(path("a.css?delay=50"), {

                data: {a:1, b:2, c:3},
                context: {bar:"foo"},

                onSuccess: function(o) {

                    var context = this;

                    setTimeout(function() {
                        test.resume(function() {
                            counts.success++;
    
                            Y.Assert.areEqual("1111", this.na.getComputedStyle("zIndex"), "a.css does not seem to be loaded");
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

            var trans = Y.Get.css(path(["a.css?delay=50", "b.css?delay=100", "c.css?delay=75"]), {

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
    
                            Y.Assert.areEqual("1111", this.na.getComputedStyle("zIndex"), "a.css does not seem to be loaded");
                            Y.Assert.areEqual("1234", this.nb.getComputedStyle("zIndex"), "b.css does not seem to be loaded");
                            Y.Assert.areEqual("4321", this.nc.getComputedStyle("zIndex"), "c.css does not seem to be loaded");
                            Y.Assert.isTrue(counts.success === 1, "onSuccess called more than once");
                            
                            areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                            
                            //Y.Assert.areEqual(trans.tId, o.tId, "Payload has unexpected tId");
                            
                            Y.Assert.areEqual(3, o.nodes.length, "Payload nodes property has unexpected length");
                            Y.Assert.isUndefined(o.statusText, "Payload should not have a statusText");
                            Y.Assert.isUndefined(o.msg, "Payload should not have a msg");
    
                            Y.Assert.areEqual("foo", context.bar, "Callback context not set");
                            
                            test.o = o;
                        });
                    }, test.onload ? 0 : 400);

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

            var trans = Y.Get.css(path(["a.css?delay=100", "b.css?delay=75", "c.css?delay=50"]), {

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
                            Y.Assert.areEqual("1111", this.na.getComputedStyle("zIndex"), "a.css does not seem to be loaded");
                            Y.Assert.areEqual("1234", this.nb.getComputedStyle("zIndex"), "b.css does not seem to be loaded");
                            Y.Assert.areEqual("4321", this.nc.getComputedStyle("zIndex"), "c.css does not seem to be loaded");
                            Y.Assert.isTrue(counts.success === 1, "onSuccess called more than once");
                            
                            areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                            
                            //Y.Assert.areEqual(trans.tId, o.tId, "Payload has unexpected tId");

                            Y.Assert.areEqual(3, o.nodes.length, "Payload nodes property has unexpected length");
                            Y.Assert.isUndefined(o.statusText, "Payload should not have a statusText");
                            Y.Assert.isUndefined(o.msg, "Payload should not have a msg");
    
                            Y.Assert.areEqual("foo", context.bar, "Callback context not set");

                            test.o = o;
                        });
                    }, test.onload ? 0 : 400);

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

        'test: insertBefore, single' : function() {

            var test = this;

            test.createInsertBeforeNode();

            var trans = Y.Get.css(path("a.css?delay=30"), {

                insertBefore: "insertBeforeMe",

                onSuccess: function(o) {

                    setTimeout(function() {
                        test.resume(function() {

                            var n = Y.Node.one(o.nodes[0]);
    
                            var insertBefore = Y.Node.one("#insertBeforeMe");
    
                            Y.Assert.isTrue(n.compareTo(insertBefore.previous()), "Not inserted before insertBeforeMe");
    
                            /* TODO: These don't work as expected on IE (even though insertBefore worked). Better cross-browser assertion? */
                            if (!Y.UA.ie) {
                                Y.Assert.areEqual("9991", this.na.getComputedStyle("zIndex"), "a.css does not seem to be inserted before ib.css");
                            }
    
                            test.o = o;

                        });
                    }, test.onload ? 0 : 100);

                    if (!test.onload) {
                        test.wait();
                    }
                }
            });

            if (test.onload) {
                test.wait();
            }
        },

        'test: insertBefore, multiple' : function() {

            var test = this;

            test.createInsertBeforeNode();

            var trans = Y.Get.css(path(["a.css?delay=20", "b.css?delay=75", "c.css?delay=10"]), {

                insertBefore: "insertBeforeMe",

                onSuccess: function(o) {
                    setTimeout(function() {
                        test.resume(function() {
                            var insertBefore = Y.Node.one("#insertBeforeMe");
    
                            for (var i = o.nodes.length-1; i >= 0; i--) {
                                var n = Y.Node.one(o.nodes[i]);
                                Y.Assert.isTrue(n.compareTo(insertBefore.previous()), "Not inserted before insertBeforeMe");
                                insertBefore = n;
                            }

                            /* TODO: These don't work as expected on IE (even though insertBefore worked). Better cross-browser assertion? */
                            if (!Y.UA.ie) {
                                Y.Assert.areEqual("9991", this.na.getComputedStyle("zIndex"), "a.css does not seem to be inserted before ib.css");
                                Y.Assert.areEqual("9992", this.nb.getComputedStyle("zIndex"), "b.css does not seem to be inserted before ib.css");
                                Y.Assert.areEqual("9993", this.nc.getComputedStyle("zIndex"), "c.css does not seem to be inserted before ib.css");
                            }
                           
                            test.o = o;
                        });
                    }, test.onload ? 0 : 200);

                    if (!test.onload) {
                        test.wait();
                    }
                }
            });

            if (test.onload) {
                test.wait();
            }
        },

        'test: async, insertBefore, multiple' : function() {

            var test = this;

            test.createInsertBeforeNode();

            var trans = Y.Get.css(path(["a.css?delay=30", "b.css?delay=10", "c.css?delay=50"]), {

                insertBefore: "insertBeforeMe",

                onSuccess: function(o) {

                    setTimeout(function() {
                        test.resume(function() {
                            var insertBefore = Y.Node.one("#insertBeforeMe");
    
                            for (var i = o.nodes.length-1; i >= 0; i--) {
                                var n = Y.Node.one(o.nodes[i]);
                                Y.Assert.isTrue(n.compareTo(insertBefore.previous()), "Not inserted before insertBeforeMe");
                                insertBefore = n;
                            }

                            /* TODO: These don't work as expected on IE (even though insertBefore worked). Better cross-browser assertion? */
                            if (!Y.UA.ie) {        
                                Y.Assert.areEqual("9991", this.na.getComputedStyle("zIndex"), "a.css does not seem to be inserted before ib.css");
                                Y.Assert.areEqual("9992", this.nb.getComputedStyle("zIndex"), "b.css does not seem to be inserted before ib.css");
                                Y.Assert.areEqual("9993", this.nc.getComputedStyle("zIndex"), "c.css does not seem to be inserted before ib.css");
                            }
                            
                            test.o = o;

                        });

                    }, test.onload ? 0 : 200);

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
        
        'test: charset, single' : function() {

            var test = this;

            var trans = Y.Get.css(path("a.css?delay=20"), {

                charset: "ISO-8859-1",  

                onSuccess: function(o) {
                    setTimeout(function() {
                        test.resume(function() {

                            var node = document.getElementById(o.nodes[0].id);
    
                            Y.Assert.areEqual("ISO-8859-1", node.charset, "charset property not set");
                            Y.Assert.areEqual("ISO-8859-1", node.getAttribute("charset"), "charset attribute not set");
    
                            test.o = o;
                        });
                    
                    }, test.onload ? 0 : 100);

                    if (!test.onload) {
                        test.wait();
                    }
                }
            });

            if (test.onload) {
                test.wait();
            }
        },

        'test: charset, multiple' : function() {

            var test = this;

            var trans = Y.Get.css(path(["a.css?delay=10", "b.css?delay=50", "c.css?delay=20"]), {

                charset: "ISO-8859-1",  

                onSuccess: function(o) {

                    setTimeout(function() {
                        test.resume(function() {

                            Y.Assert.areEqual(3, o.nodes.length, "Unexpected node count");
    
                            for (var i = 0; i < o.nodes.length; i++) {
    
                                var node = document.getElementById(o.nodes[i].id);
    
                                Y.Assert.areEqual("ISO-8859-1", node.charset, "charset property not set");
                                Y.Assert.areEqual("ISO-8859-1", node.getAttribute("charset"), "charset attribute not set");
                            }
    
                            test.o = o;
                        });
                    }, test.onload ? 0 : 200);

                    if (!test.onload) {
                        test.wait();
                    }
                }
            });

            if (test.onload) {
                test.wait();
            }
        },
        
        'test: async, charset, multiple' : function() {

            var test = this;

            var trans = Y.Get.css(path(["a.css?delay=30", "b.css?delay=10", "c.css?delay=20"]), {

                charset: "ISO-8859-1",  

                onSuccess: function(o) {

                    setTimeout(function() {
                        test.resume(function() {

                            Y.Assert.areEqual(3, o.nodes.length, "Unexpected node count");
    
                            for (var i = 0; i < o.nodes.length; i++) {
    
                                var node = document.getElementById(o.nodes[i].id);
    
                                Y.Assert.areEqual("ISO-8859-1", node.charset, "charset property not set");
                                Y.Assert.areEqual("ISO-8859-1", node.getAttribute("charset"), "charset attribute not set");
                            }
    
                            test.o = o;
                        });
                        
                    }, test.onload ? 0 : 200);

                    if (!test.onload) {
                        test.wait();
                    }
                },
                async :true
            });

            if (test.onload) {
                test.wait();
            }
        },
        
        'test: attributes, single' : function() {

            var test = this;

            var trans = Y.Get.css(path("a.css?delay=10"), {

                attributes: {
                    "charset": "ISO-8859-1",
                    "title": "myscripts"
                },

                onSuccess: function(o) {

                    setTimeout(function() {
                        test.resume(function() {

                            var node = document.getElementById(o.nodes[0].id);
    
                            Y.Assert.areEqual("myscripts", node.title, "title property not set");
                            Y.Assert.areEqual("ISO-8859-1", node.charset, "charset property not set");
                            Y.Assert.areEqual("myscripts", node.getAttribute("title"), "title attribute not set");
                            Y.Assert.areEqual("ISO-8859-1", node.getAttribute("charset"), "charset attribute not set");
    
                            test.o = o;
                        });

                    }, test.onload ? 0 : 100);

                    if (!test.onload) {
                        test.wait();
                    }
                }
            });


            if (test.onload) {
                test.wait();
            }
        },

        'test: attributes, multiple' : function() {

            var test = this;

            var trans = Y.Get.css(path(["a.css?delay=10", "b.css?delay=50", "c.css?delay=20"]), {

                attributes: {
                    "charset": "ISO-8859-1",  
                    "title": "myscripts"
                },

                onSuccess: function(o) {

                    setTimeout(function() {
                        test.resume(function() {

                            Y.Assert.areEqual(3, o.nodes.length, "Unexpected node count");
    
                            for (var i = 0; i < o.nodes.length; i++) {
    
                                var node = document.getElementById(o.nodes[i].id);
    
                                Y.Assert.areEqual("myscripts", node.title, "title property not set");
                                Y.Assert.areEqual("ISO-8859-1", node.charset, "charset property not set");
                                Y.Assert.areEqual("myscripts", node.getAttribute("title"), "title attribute not set");
                                Y.Assert.areEqual("ISO-8859-1", node.getAttribute("charset"), "charset attribute not set");
                            }
    
                            test.o = o;
                        });
                    }, test.onload ? 0 : 200);

                    if (!test.onload) {
                        test.wait();
                    }
                        
                }
            });


            if (test.onload) {
                test.wait();
            }
        },
        
        'test: async, attributes, multiple' : function() {

            var test = this;

            var trans = Y.Get.css(path(["a.css?delay=10", "b.css?delay=50", "c.css?delay=20"]), {

                attributes: {
                    "charset": "ISO-8859-1",  
                    "title": "myscripts"
                },

                onSuccess: function(o) {

                    setTimeout(function() {
                        test.resume(function() {

                            Y.Assert.areEqual(3, o.nodes.length, "Unexpected node count");
    
                            for (var i = 0; i < o.nodes.length; i++) {
    
                                var node = document.getElementById(o.nodes[i].id);
    
                                Y.Assert.areEqual("myscripts", node.title, "title property not set");
                                Y.Assert.areEqual("ISO-8859-1", node.charset, "charset property not set");
                                Y.Assert.areEqual("myscripts", node.getAttribute("title"), "title attribute not set");
                                Y.Assert.areEqual("ISO-8859-1", node.getAttribute("charset"), "charset attribute not set");
                            }
    
                            test.o = o;
                        });
                    }, test.onload ? 0 : 200);

                    if (!test.onload) {
                        test.wait();
                    }
                },

                async :true
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

});
