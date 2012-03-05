YUI.add('get-test', function (Y) {
    Y.GetTests = new Y.Test.Suite("Y.Get");
    Y.GetTests.TEST_FILES_BASE = "getfiles/";

    var ArrayAssert  = Y.ArrayAssert,
        Assert       = Y.Assert,
        ObjectAssert = Y.ObjectAssert,

        FILENAME = /[abc]\.js/,
        ua       = Y.UA,

        supports = {
            // True if this browser should call an onFailure callback on a link
            // that 404s. Currently only Firefox 9+ supports this.
            cssFailure: ua.gecko >= 9,

            // True if this browser should call an onFailure callback on a
            // script that 404s.
            jsFailure: !((ua.ie && ua.ie < 9) || (ua.opera && ua.opera < 11.6) || (ua.webkit && ua.webkit < 530.17))
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
                'test: single script, failure': !supports.jsFailure,
                'test: single script failure, end': !supports.jsFailure,
                'test: multiple scripts, one failure': !supports.jsFailure,
                'test: multiple scripts, failure, end': !supports.jsFailure,
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

            this.wait();
        },

        'test: single script, failure': function() {
            var test = this;

            var counts = {
                success:0,
                failure:0
            };

            var trans = Y.Get.script(path("bogus.js"), {
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

            this.wait();
        },

        'test: single script timeout callback': function() {
            var test = this;

            var trans = Y.Get.script(path("bogus.js"), {
                timeout: 1,
                onTimeout: function(e) {
                    Assert.areSame('Timeout', e.errors[0].error, 'Failure message is not a timeout message');
                },
                onFailure: function(e) {
                    Assert.areSame('Timeout', e.errors[0].error, 'Failure message is not a timeout message');
                },
                onSuccess: function() {
                    Assert.fail('onSuccess should not be called');
                }
            });
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

            this.wait();
        },

        'test: single script failure, end': function() {
            var test = this;
            var counts = {
                success:0,
                failure:0,
                end:0
            };

            var trans = Y.Get.script(path("bogus.js"), {
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

            this.wait();
        },

        'test: multiple scripts, success': function() {
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

            this.wait();
        },

        'test: multiple scripts, one failure': function() {
            var test = this;
            var counts = {
                success:0,
                failure:0
            };

            var trans = Y.Get.script(path(["a.js", "bogus.js", "c.js"]), {
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

            this.wait();
        },

        'test: multiple scripts, success, end': function() {
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

            this.wait();
        },

        'test: multiple scripts, failure, end': function() {
            var test = this;
            var counts = {
                success:0,
                failure:0,
                end:0
            };

            var trans = Y.Get.script(path(["a.js", "bogus.js", "c.js"]), {
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

            this.wait();
        },

        'test: async multiple scripts, success': function() {
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

            this.wait();
        },

        'test: async multiple scripts, success, end': function() {
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

            var trans = Y.Get.script(path(["a.js", "bogus.js", "c.js"]), {
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

            this.wait();
        },

        'test: async multiple script, failure, end': function() {
            var test = this;
            var counts = {
                success:0,
                failure:0,
                end:0
            };

            var trans = Y.Get.script(path(["a.js", "bogus.js", "c.js"]), {
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

            this.wait();
        },

        'test: charset, single' : function() {
            var test = this;

            var trans = Y.Get.script(path("a.js"), {
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

            this.wait();
        },

        'test: charset, multiple' : function() {
            var test = this;

            var trans = Y.Get.script(path(["a.js", "b.js", "c.js"]), {
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

            this.wait();
        },

        'test: async, charset, multiple' : function() {
            var test = this;

            var trans = Y.Get.script(path(["a.js", "b.js", "c.js"]), {
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

            this.wait();
        },

        'test: attributes, single' : function() {
            var test = this;

            var trans = Y.Get.script(path("a.js"), {
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

            this.wait();
        },

        'test: attributes, multiple' : function() {
            var test = this;

            var trans = Y.Get.script(path(["a.js", "b.js", "c.js"]), {
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

            this.wait();
        },

        'test: async, attributes, multiple' : function() {
            var test = this;

            var trans = Y.Get.script(path(["a.js", "b.js", "c.js"]), {
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

            this.wait();
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
                urls.push(path('a.js'));
            }

            Y.Get.script(urls, {attributes: {'class': 'purge-test'}}, function (err, tx) {
                test.resume(function () {
                    var count = Y.all('script.purge-test').size();
                    Y.assert(count > 0 && count < 20, 'there should be fewer than 20 scripts on the page (actual: ' + count + ')');
                });
            });

            this.wait();
        },

        'test: purgethreshold' : function() {
            var test    = this;
            var nodes   = [];
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

                            Assert.areEqual(2, nodes.length, "2 nodes should have been added");

                            for (var i = 0; i < nodes.length; i++) {
                                var node = Y.Node.one(nodes[i]);
                                Assert.isTrue(node.inDoc(), "Scripts should still be in the document");

                                // Convert to id, for final doc check, because purge destroys parentNode
                                nodeIds[i] = node.get("id");
                            }

                            Y.Get.script(path("c.js"), {
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

            this.wait();
        }
    });

    // -- Basic CSS loading ----------------------------------------------------
    Y.GetTests.BasicCSS = new Y.Test.Case({
        name: "Basic CSS loading",

        setUp: function() {
            this.na = Y.Node.create('<div class="get_test_a">get_test_a</div>');
            this.nb = Y.Node.create('<div class="get_test_b">get_test_b</div>');
            this.nc = Y.Node.create('<div class="get_test_c">get_test_c</div>');

            var naa = this.na;

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

        _should: {
            ignore: {
                'test: single css, failure': !supports.cssFailure,
                'test: multiple css, failure': !supports.cssFailure
            }
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

        'test: single css, success': function() {
            var test = this;
            var counts = {
                success:0,
                failure:0
            };

            var trans = Y.Get.css(path("a.css?delay=50"), {
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
                    Assert.fail("onFailure shouldn't have been called");
                }
            });

            test.wait();
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

            test.wait();
        },

        'test: insertBefore, single' : function() {
            var test = this;

            test.createInsertBeforeNode();

            var trans = Y.Get.css(path("a.css?delay=30"), {
                insertBefore: "insertBeforeMe",

                onSuccess: function(o) {
                    test.resume(function() {
                        var n = Y.Node.one(o.nodes[0]);
                        var insertBefore = Y.Node.one("#insertBeforeMe");

                        Assert.isTrue(n.compareTo(insertBefore.previous()), "Not inserted before insertBeforeMe");

                        // TODO: These don't work as expected on IE (even though insertBefore worked). Better cross-browser assertion?
                        if (!Y.UA.ie) {
                            Assert.areEqual("9991", this.na.getComputedStyle("zIndex"), "a.css does not seem to be inserted before ib.css");
                        }

                        test.o = o;

                    });
                }
            });

            test.wait();
        },

        'test: insertBefore, multiple' : function() {
            var test = this;

            test.createInsertBeforeNode();

            var trans = Y.Get.css(path(["a.css?delay=20", "b.css?delay=75", "c.css?delay=10"]), {
                insertBefore: "insertBeforeMe",

                onSuccess: function(o) {
                    test.resume(function() {
                        var insertBefore = Y.Node.one("#insertBeforeMe");

                        for (var i = o.nodes.length-1; i >= 0; i--) {
                            var n = Y.Node.one(o.nodes[i]);
                            Assert.isTrue(n.compareTo(insertBefore.previous()), "Not inserted before insertBeforeMe");
                            insertBefore = n;
                        }

                        // TODO: These don't work as expected on IE (even though insertBefore worked). Better cross-browser assertion?
                        if (!Y.UA.ie) {
                            Assert.areEqual("9991", this.na.getComputedStyle("zIndex"), "a.css does not seem to be inserted before ib.css");
                            Assert.areEqual("9992", this.nb.getComputedStyle("zIndex"), "b.css does not seem to be inserted before ib.css");
                            Assert.areEqual("9993", this.nc.getComputedStyle("zIndex"), "c.css does not seem to be inserted before ib.css");
                        }

                        test.o = o;
                    });
                }
            });

            test.wait();
        },

        'test: charset, single' : function() {
            var test = this;

            var trans = Y.Get.css(path("a.css?delay=20"), {
                charset: "ISO-8859-1",

                onSuccess: function(o) {
                    test.resume(function() {
                        var node = document.getElementById(o.nodes[0].id);

                        Assert.areEqual("ISO-8859-1", node.getAttribute("charset"), "charset attribute not set");

                        test.o = o;
                    });
                }
            });

            test.wait();
        },

        'test: charset, multiple' : function() {
            var test = this;

            var trans = Y.Get.css(path(["a.css?delay=10", "b.css?delay=50", "c.css?delay=20"]), {
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

            test.wait();
        },

        'test: attributes, single' : function() {
            var test = this;

            var trans = Y.Get.css(path("a.css?delay=10"), {
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

            test.wait();
        },

        'test: attributes, multiple' : function() {
            var test = this;

            var trans = Y.Get.css(path(["a.css?delay=10", "b.css?delay=50", "c.css?delay=20"]), {
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

            test.wait();
        },

        'test: single css, failure': function() {
            var test = this;
            var counts = {
                success:0,
                failure:0
            };

            Y.Get.css(path("bogus.css"), {
                data: {a:1, b:2, c:3},
                context: {bar:"foo"},

                onSuccess: function(o) {
                    test.resume(function () {
                        Assert.fail("onSuccess shouldn't have been called");
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

            test.wait();
        },

        'test: multiple css, failure': function() {
            var test = this;
            var counts = {
                success:0,
                failure:0
            };

            Y.Get.css(path(["a.css", "bogus.css", "c.css"]), {
                data: {a:1, b:2, c:3},
                context: {bar:"foo"},

                onSuccess: function(o) {
                    test.resume(function() {
                        Assert.fail("onSuccess shouldn't have been called");
                    });
                },

                onFailure: function(o) {
                    test.resume(function() {
                        counts.failure++;
                        Assert.areEqual(1, counts.failure, "onFailure called more than once");

                        if (!Y.UA.ie) {
                            Assert.areEqual("1111", this.na.getComputedStyle("zIndex"), "a.css does not seem to be loaded");
                            Assert.areNotEqual("1234", this.nb.getComputedStyle("zIndex"), "b.css was loaded when it shouldn't have been");
                            Assert.areEqual("4321", this.nc.getComputedStyle("zIndex"), "c.css does not seem to be loaded");
                        }

                        test.o = o;
                    });
                },

                onEnd: function(o) {
                    test.o = o;
                }
            });

            this.wait();
        },

        'CSS nodes should be inserted in order': function () {
            var test = this;

            test.o = Y.Get.css([
                {url: path('a.css'), attributes: {id: 'a'}},
                {url: path('b.css'), attributes: {id: 'b'}},
                {url: path('c.css'), attributes: {id: 'c'}}
            ], function (err, transaction) {
                test.resume(function () {
                    var nodes = transaction.nodes;

                    Assert.isNull(err, '`err` should be null');
                    Assert.areEqual('b', Y.one(nodes[0]).next('link,style').get('id'), 'b.css should have been inserted after a.css');
                    Assert.areEqual('c', Y.one(nodes[1]).next('link,style').get('id'), 'b.css should have been inserted after a.css');
                });
            });

            this.wait();
        }
    });

    // -- Y.Get Methods --------------------------------------------------------
    Y.GetTests.GetMethods = new Y.Test.Case({
        name: 'Y.Get methods',

        tearDown: function () {
            this.t && this.t.purge();
            this.interval && clearInterval(this.interval);
        },

        'abort() should abort a transaction when given a transaction object': function () {
            var test = this;

            test.t = Y.Get.js([path('a.js'), path('b.js'), path('c.js')], {
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

            test.wait();
        },

        'abort() should abort a transaction when given a transaction id': function () {
            var test = this;

            test.t = Y.Get.js([path('a.js'), path('b.js'), path('c.js')], {
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

            this.wait();
        },

        // -- css() ------------------------------------------------------------
        'css() should accept a URL': function () {
            var test = this,
                url  = path('a.css');

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

            this.wait();
        },

        'css() should accept a URL, options object, and callback function': function () {
            var test = this,
                callbackCalled;

            test.t = Y.Get.css(path('a.css'), {
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

            this.wait();
        },

        'css() should allow the callback function as the second parameter': function () {
            var test = this;

            test.t = Y.Get.css(path('a.css'), function (err, transaction) {
                var self = this;

                test.resume(function () {
                    Assert.isNull(err, '`err` should be null');
                    Assert.areSame(test.t, transaction, 'transaction should be passed to the callback');
                    Assert.areSame(test.t, self, '`this` object should be the transaction');
                });
            });

            this.wait();
        },

        'css() should accept an array of URLs': function () {
            var test = this;

            test.t = Y.Get.css([path('a.css'), path('b.css'), path('c.css')], {
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

            this.wait();
        },

        'css() should accept a request object': function () {
            var test = this;

            test.t = Y.Get.css({url: path('a.css')}, {
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

            this.wait();
        },

        'css() should accept an array of request objects': function () {
            var test = this;

            test.t = Y.Get.css([{url: path('a.css')}, {url: path('b.css')}, {url: path('c.css')}], {
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

            this.wait();
        },

        'css() should accept a mixed array of URLs and request objects': function () {
            var test = this;

            test.t = Y.Get.css([path('a.css'), {url: path('b.css')}, path('c.css')], {
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

            this.wait();
        },

        // -- js() -------------------------------------------------------------
        'js() should accept a URL': function () {
            var test = this,
                url  = path('a.js');

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

            this.wait();
        },

        'js() should accept a URL, options object, and callback function': function () {
            var test = this,
                callbackCalled;

            test.t = Y.Get.js(path('a.js'), {
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

            this.wait();
        },

        'js() should allow the callback function as the second parameter': function () {
            var test = this;

            test.t = Y.Get.js(path('a.js'), function (err, transaction) {
                var self = this;

                test.resume(function () {
                    Assert.isNull(err, '`err` should be null');
                    Assert.areSame(test.t, transaction, 'transaction should be passed to the callback');
                    Assert.areSame(test.t, self, '`this` object should be the transaction');
                });
            });

            this.wait();
        },

        'js() should accept an array of URLs': function () {
            var test = this;

            test.t = Y.Get.js([path('a.js'), path('b.js'), path('c.js')], {
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

            this.wait();
        },

        'js() should accept a request object': function () {
            var test = this;

            test.t = Y.Get.js({url: path('a.js')}, {
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

            this.wait();
        },

        'js() should accept an array of request objects': function () {
            var test = this;

            test.t = Y.Get.js([{url: path('a.js')}, {url: path('b.js')}, {url: path('c.js')}], {
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

            this.wait();
        },

        'js() should accept a mixed array of URLs and request objects': function () {
            var test = this;

            test.t = Y.Get.js([path('a.js'), {url: path('b.js')}, path('c.js')], {
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

            this.wait();
        },

        // -- load() -----------------------------------------------------------
        'load() should accept a URL': function () {
            var test = this,
                url  = path('a.js');

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

            this.wait();
        },

        'load() should accept a URL, options object, and callback function': function () {
            var test = this,
                callbackCalled;

            test.t = Y.Get.load(path('a.css'), {
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

            this.wait();
        },

        'load() should allow the callback function as the second parameter': function () {
            var test = this;

            test.t = Y.Get.load(path('a.js'), function (err, transaction) {
                var self = this;

                test.resume(function () {
                    Assert.isNull(err, '`err` should be null');
                    Assert.areSame(test.t, transaction, 'transaction should be passed to the callback');
                    Assert.areSame(test.t, self, '`this` object should be the transaction');
                });
            });

            this.wait();
        },

        'load() should accept an array of URLs': function () {
            var test = this;

            test.t = Y.Get.load([path('a.js'), path('b.css'), path('c.js')], {
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

            this.wait();
        },

        'load() should accept a request object': function () {
            var test = this;

            test.t = Y.Get.load({url: path('a.js')}, {
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

            this.wait();
        },

        'load() should accept an array of request objects': function () {
            var test = this;

            test.t = Y.Get.load([{url: path('a.css')}, {url: path('b.js')}, {url: path('c.css')}], {
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

            this.wait();
        },

        'load() should accept a mixed array of URLs and request objects': function () {
            var test = this;

            test.t = Y.Get.load([path('a.js'), {url: path('b.js')}, path('c.css')], {
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

            this.wait();
        },

        // -- script() ---------------------------------------------------------
        'script() should be an alias for js()': function () {
            Assert.areSame(Y.Get.js, Y.Get.script);
        }
    });

    // -- Y.Get.Transaction behavior -------------------------------------------
    Y.GetTests.TransactionBehavior = new Y.Test.Case({
        name: 'Transaction behavior',

        'transactions should always execute one at a time by default': function () {
            var test = this,

                t1 = Y.Get.js(path(['a.js', 'b.js']), finish),
                t2 = Y.Get.css(path('a.css'), finish),
                t3 = Y.Get.load(path('c.js'), function (err, t) {
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

            this.wait();
        }
    });

    // -- Y.Get.Transaction methods --------------------------------------------
    Y.GetTests.TransactionMethods = new Y.Test.Case({
        name: 'Transaction methods',

        tearDown: function () {
            this.t && this.t.purge();
        },

        'abort() should abort the transaction': function () {
            var test = this;

            test.t = Y.Get.js([path('a.js'), path('b.js'), path('c.js')], {
                onFailure: function () {
                    test.resume(function () {
                        ArrayAssert.containsMatch(function (item) {
                            return item.error === 'Aborted'
                        }, test.t.errors, "Transaction failed, but wasn't aborted.");
                    });
                },

                onProgress: function () {
                    test.t.abort();
                },

                onSuccess: function () {
                    test.resume(function () {
                        Assert.fail('onSuccess should not be called');
                    });
                }
            });

            test.wait();
        },

        'abort() should accept a custom error message': function () {
            var test = this;

            test.t = Y.Get.js([path('a.js'), path('b.js'), path('c.js')], {
                onFailure: function () {
                    test.resume(function () {
                        ArrayAssert.containsMatch(function (item) {
                            return item.error === 'monkey britches!'
                        }, test.t.errors, "Transaction failed, but wasn't aborted (or was aborted with the wrong error message).");
                    });
                },

                onProgress: function () {
                    test.t.abort('monkey britches!');
                },

                onSuccess: function () {
                    test.resume(function () {
                        Assert.fail('onSuccess should not be called');
                    });
                }
            });

            test.wait();
        },

        'execute() should queue callbacks': function () {
            var test = this,
                callbackOne, callbackTwo;

            test.t = Y.Get.js(path('a.js'));

            test.t.execute(function (err, transaction) {
                callbackOne = true;

                test.resume(function () {
                    Assert.isUndefined(callbackTwo, 'callback two should not have been called before callback one');
                    Assert.isNull(err, '`err` should be null');
                    Assert.areSame(test.t, transaction, 'transaction should be passed to the callback');

                    test.wait(100);
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

            this.wait();
        },

        'execute() should call the callback immediately if the transaction has already finished': function () {
            var test = this;

            test.t = Y.Get.js(path('a.js'), function (err, transaction) {
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

            this.wait();
        },

        'purge() should purge any nodes inserted by the transaction': function () {
            var test = this;

            test.t = Y.Get.js([path('a.js'), path('b.js'), path('c.js')], function (err, t) {
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

            test.wait();
        }
    });

    // -- TODO: Y.Get.Transaction properties -----------------------------------------
    Y.GetTests.TransactionProperties = new Y.Test.Case({
        name: 'Transaction properties',

        tearDown: function () {
            this.t && this.t.purge();
        },

        'transactions should have a unique `id` property': function () {
            var t1 = Y.Get.js('getfiles/a.js'),
                t2 = Y.Get.js('getfiles/b.js');

            Assert.isNotUndefined(t1.id, 'id property should not be undefined');
            Assert.isNotUndefined(t2.id, 'id property should not be undefined');
            Assert.areNotSame(t1.id, t2.id);

            t1.purge();
            t2.purge();
        },

        'transactions should have a `data` property when a data object is provided': function () {
            var data = {};

            this.t = Y.Get.js('getfiles/a.js', {data: data});
            Assert.areSame(data, this.t.data);
        },

        '`errors` property should contain an array of error objects': function () {
            var test = this;

            this.t = Y.Get.js(['bogus.js', 'bogus.js'], function (err, t) {
                test.resume(function () {
                    Assert.isArray(t.errors, '`errors` should be an array');

                    if (supports.jsFailure) {
                        Assert.areSame(2, t.errors.length, '`errors` array should have two items');
                        ObjectAssert.ownsKeys(['error', 'request'], t.errors[0]);
                        ObjectAssert.ownsKeys(['error', 'request'], t.errors[1]);
                    }
                });
            });

            this.wait();
        },

        '`nodes` property should contain an array of injected nodes': function () {
            var test = this;

            this.t = Y.Get.js(['getfiles/a.js', 'getfiles/b.js'], function (err, t) {
                test.resume(function () {
                    Assert.isArray(t.nodes, '`nodes` should be an array');
                    Assert.areSame(2, t.nodes.length, '`nodes` array should contain two items');
                    Assert.areSame('script', t.nodes[0].nodeName.toLowerCase());
                    Assert.areSame('script', t.nodes[1].nodeName.toLowerCase());
                });
            });

            this.wait();
        },

        '`options` property should contain transaction options': function () {
            this.t = Y.Get.js('getfiles/a.js', {
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

            this.t = Y.Get.js(['getfiles/a.js', 'getfiles/b.js'], function (err, t) {
                test.resume(function () {
                    Assert.isArray(t.requests, '`requests` should be an array');
                    Assert.areSame(2, t.requests.length, '`requests` array should contain two items');
                    Assert.areSame('getfiles/a.js', t.requests[0].url);
                    Assert.areSame('getfiles/b.js', t.requests[1].url);

                    Assert.isTrue(t.requests[0].finished);
                    Assert.isTrue(t.requests[0].finished);
                });
            });

            this.wait();
        }
    });

    // -- TODO: Options --------------------------------------------------------------
    Y.GetTests.Options = new Y.Test.Case({
        name: 'Options'
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

            this.wait();
        },

        'test: Loader, Autocomplete' : function() {
            var test = this;

            YUI().use("autocomplete-list", function(Y2) {
                test.resume(function() {
                    Assert.isFunction(Y2.AutoCompleteList, "Autocomplete not loaded");
                });
            });

            this.wait();
        }
    });
}, '3.5.0', {
    requires: ['get', 'test']
});
