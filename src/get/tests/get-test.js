YUI.add('get-test', function(Y) {
    Y.GetTests = new Y.Test.Suite("Get Suite");
    Y.GetTests.TEST_FILES_BASE = "getfiles/";

    var FILENAME = /[abc]\.js/,
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

    Y.GetTests.Scripts = new Y.Test.Case({
        name: "Script Tests",

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

                        Y.Assert.areEqual("a.js", G_SCRIPTS[0], "a.js does not seem to be loaded");
                        Y.ArrayAssert.itemsAreEqual(G_SCRIPTS, progress, "Progress does not match G_SCRIPTS");

                        Y.Assert.areEqual(1, G_SCRIPTS.length, "More/Less than 1 script was loaded");
                        Y.Assert.areEqual(1, counts.success, "onSuccess called more than once");

                        areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                        Y.Assert.areEqual(trans.tId, o.tId, "Payload has unexpected tId");
                        Y.Assert.areEqual(1, o.nodes.length, "Payload nodes property has unexpected length");

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

        // TODO: need to test abort()

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
                        Y.Assert.fail("onSuccess shouldn't have been called");
                        test.o = o;
                    });
                },

                onFailure: function(o) {
                    var context = this;

                    test.resume(function() {
                        counts.failure += 1;

                        Y.Assert.areEqual(1, counts.failure, "onFailure called more than once");

                        areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                        Y.Assert.areEqual(trans.tId, o.tId, "Payload has unexpected tId");
                        Y.Assert.areEqual(1, o.nodes.length, "Payload nodes property has unexpected length");

                        Y.Assert.areEqual("foo", context.bar, "Callback context not set");

                        test.o = o;
                    });
                }
            });

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

                onEnd: function(o) {
                    var context = this;

                    test.resume(function() {
                        counts.end++;
                        Y.Assert.areEqual(1, counts.end,"onEnd called more than once");
                        Y.Assert.areEqual(1, counts.success, "onEnd called before onSuccess");

                        areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                        Y.Assert.areEqual(trans.tId, o.tId, "Payload has unexpected tId");
                        Y.Assert.areEqual(1, o.nodes.length, "Payload nodes property has unexpected length");

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

            var trans = Y.Get.script(path("bogus.js"), {
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

                        areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                        Y.Assert.areEqual(trans.tId, o.tId, "Payload has unexpected tId");
                        Y.Assert.areEqual(1, o.nodes.length, "Payload nodes property has unexpected length");

                        Y.Assert.areEqual("foo", context.bar, "Callback context not set");

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

                        Y.Assert.areEqual(1, counts.success, "onSuccess called more than once");

                        areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                        Y.Assert.areEqual(trans.tId, o.tId, "Payload has unexpected tId");
                        Y.Assert.areEqual(3, o.nodes.length, "Payload nodes property has unexpected length");

                        Y.Assert.areEqual("foo", context.bar, "Callback context not set");

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
                        Y.Assert.fail("onSuccess shouldn't have been called");
                        test.o = o;
                    });
                },

                onFailure: function(o) {
                    var context = this;

                    test.resume(function() {
                        counts.failure++;

                        Y.Assert.areEqual(2, G_SCRIPTS.length, "More/fewer than 2 scripts loaded");
                        Y.Assert.areEqual(1, counts.failure, "onFailure called more than once");
                        Y.ArrayAssert.itemsAreEqual(["a.js", "c.js"], G_SCRIPTS, "Unexpected script order");

                        areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                        Y.Assert.areEqual(trans.tId, o.tId, "Payload has unexpected tId");
                        Y.Assert.areEqual("foo", context.bar, "Callback context not set");

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

                onEnd: function(o) {
                    var context = this;

                    test.resume(function() {
                        counts.end++;
                        Y.Assert.areEqual(1, counts.end,"onEnd called more than once");
                        Y.Assert.areEqual(1, counts.success, "onEnd called before onSuccess");

                        areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                        Y.Assert.areEqual(trans.tId, o.tId, "Payload has unexpected tId");
                        Y.Assert.areEqual(3, o.nodes.length, "Payload nodes property has unexpected length");

                        Y.Assert.areEqual("foo", context.bar, "Callback context not set");

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
                    Y.Assert.fail("onSuccess shouldn't have been called");
                },

                onFailure: function() {
                    counts.failure++;
                    Y.Assert.areEqual(1, counts.failure, "onFailure called more than once");
                },

                onEnd: function(o) {
                    var context = this;

                    test.resume(function() {
                        counts.end++;
                        Y.Assert.areEqual(1, counts.end,"onEnd called more than once");
                        Y.Assert.areEqual(1, counts.failure, "onEnd called before onFailure");
                        Y.Assert.areEqual(2, G_SCRIPTS.length, "More/fewer than 2 scripts loaded");
                        Y.ArrayAssert.itemsAreEqual(["a.js", "c.js"], G_SCRIPTS, "Unexpected script order");

                        areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                        Y.Assert.areEqual(trans.tId, o.tId, "Payload has unexpected tId");

                        Y.Assert.areEqual("foo", context.bar, "Callback context not set");

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
                        Y.Assert.areEqual(1, counts.success, "onSuccess called more than once");

                        areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                        Y.Assert.areEqual(trans.tId, o.tId, "Payload has unexpected tId");
                        Y.Assert.areEqual(3, o.nodes.length, "Payload nodes property has unexpected length");

                        Y.Assert.areEqual("foo", context.bar, "Callback context not set");

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
                    Y.Assert.areEqual(3, G_SCRIPTS.length, "More/Less than 3 scripts loaded");
                    Y.ArrayAssert.containsItems(["a.js", "b.js", "c.js"], G_SCRIPTS, "Unexpected script contents");
                    Y.Assert.areEqual(1, counts.success, "onSuccess called more than once");
                },

                onFailure: function() {
                    Y.Assert.fail("onFailure shouldn't have been called");
                },

                onEnd: function(o) {
                    var context = this;

                    test.resume(function() {
                        counts.end++;
                        Y.Assert.areEqual(1, counts.end,"onEnd called more than once");
                        Y.Assert.areEqual(1, counts.success, "onEnd called before onSuccess");

                        areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                        Y.Assert.areEqual(trans.tId, o.tId, "Payload has unexpected tId");
                        Y.Assert.areEqual(3, o.nodes.length, "Payload nodes property has unexpected length");

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

            var trans = Y.Get.script(path(["a.js", "bogus.js", "c.js"]), {
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
                        Y.Assert.areEqual(1, counts.failure, "onFailure called more than once");
                        Y.Assert.areEqual(2, G_SCRIPTS.length, "More/fewer than 2 scripts loaded");
                        Y.ArrayAssert.containsItems(["a.js", "c.js"], G_SCRIPTS, "Unexpected script contents");

                        areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                        Y.Assert.areEqual(trans.tId, o.tId, "Payload has unexpected tId");
                        Y.Assert.areEqual("foo", context.bar, "Callback context not set");

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
                    Y.Assert.fail("onSuccess shouldn't have been called");
                },

                onFailure: function() {
                    counts.failure++;
                    Y.Assert.isTrue(counts.failure === 1, "onFailure called more than once");
                },

                onEnd: function(o) {
                    var context = this;

                    test.resume(function() {
                        counts.end++;
                        Y.Assert.areEqual(1, counts.end,"onEnd called more than once");
                        Y.Assert.areEqual(1, counts.failure, "onEnd called before onFailure");
                        Y.Assert.areEqual(2, G_SCRIPTS.length, "More/fewer than 2 scripts loaded");
                        Y.ArrayAssert.containsItems(["a.js", "c.js"], G_SCRIPTS, "Unexpected script contents");

                        areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");
                        Y.Assert.areEqual(trans.tId, o.tId, "Payload has unexpected tId");
                        Y.Assert.areEqual("foo", context.bar, "Callback context not set");

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
                    "charset": "ISO-8859-1",
                    "title"  : "myscripts",
                    "id"     : "my-awesome-script"
                },

                onSuccess: function(o) {
                    test.resume(function() {
                        var node = document.getElementById(o.nodes[0].id);

                        Y.Assert.areEqual("myscripts", node.title, "title property not set");
                        Y.Assert.areEqual("ISO-8859-1", node.charset, "charset property not set");
                        Y.Assert.areEqual("my-awesome-script", node.id, "id attribute not set");

                        Y.Assert.areEqual("myscripts", node.getAttribute("title"), "title attribute not set");
                        Y.Assert.areEqual("ISO-8859-1", node.getAttribute("charset"), "charset attribute not set");
                        Y.Assert.areEqual("my-awesome-script", node.getAttribute("id"), "id attribute not set");

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
                    "charset": "ISO-8859-1",
                    "title"  : "myscripts"
                },

                onSuccess: function(o) {
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
                    "charset": "ISO-8859-1",
                    "title"  : "myscripts"
                },

                onSuccess: function(o) {
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

                            Y.Assert.areEqual(2, nodes.length, "2 nodes should have been added");

                            for (var i = 0; i < nodes.length; i++) {
                                var node = Y.Node.one(nodes[i]);
                                Y.Assert.isTrue(node.inDoc(), "Scripts should still be in the document");

                                // Convert to id, for final doc check, because purge destroys parentNode
                                nodeIds[i] = node.get("id");
                            }

                            Y.Get.script(path("c.js"), {
                                purgethreshold: 1,

                                onSuccess: function(o) {
                                    test.resume(function() {
                                        for (var i = 0; i < nodeIds.length; i++) {
                                            Y.Assert.isNull(document.getElementById(nodeIds[i]), "Script from previous transaction was not purged");
                                        }

                                        Y.Assert.isTrue(Y.one(o.nodes[0]).inDoc());

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

    // -- CSS Tests ------------------------------------------------------------
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

                        Y.Assert.areEqual("1111", this.na.getComputedStyle("zIndex"), "a.css does not seem to be loaded");
                        Y.Assert.areEqual(1, counts.success, "onSuccess called more than once");

                        areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");

                        Y.Assert.areEqual(trans.tId, o.tId, "Payload has unexpected tId");
                        Y.Assert.areEqual(1, o.nodes.length, "Payload nodes property has unexpected length");
                        Y.Assert.areEqual("foo", context.bar, "Callback context not set");

                        test.o = o;
                    });
                },

                onFailure: function(o) {
                    Y.Assert.fail("onFailure shouldn't have been called");
                }
            });

            test.wait(500);
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

                    test.resume(function() {
                        counts.success++;

                        Y.Assert.areEqual("1111", this.na.getComputedStyle("zIndex"), "a.css does not seem to be loaded");
                        Y.Assert.areEqual("1234", this.nb.getComputedStyle("zIndex"), "b.css does not seem to be loaded");
                        Y.Assert.areEqual("4321", this.nc.getComputedStyle("zIndex"), "c.css does not seem to be loaded");
                        Y.Assert.areEqual(1, counts.success, "onSuccess called more than once");

                        areObjectsReallyEqual({a:1, b:2, c:3}, o.data, "Payload has unexpected data value");

                        Y.Assert.areEqual(trans.tId, o.tId, "Payload has unexpected tId");
                        Y.Assert.areEqual(3, o.nodes.length, "Payload nodes property has unexpected length");
                        Y.Assert.areEqual("foo", context.bar, "Callback context not set");

                        test.o = o;
                    });
                }
            });

            test.wait(500);
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

                        Y.Assert.isTrue(n.compareTo(insertBefore.previous()), "Not inserted before insertBeforeMe");

                        // TODO: These don't work as expected on IE (even though insertBefore worked). Better cross-browser assertion?
                        if (!Y.UA.ie) {
                            Y.Assert.areEqual("9991", this.na.getComputedStyle("zIndex"), "a.css does not seem to be inserted before ib.css");
                        }

                        test.o = o;

                    });
                }
            });

            test.wait(500);
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
                            Y.Assert.isTrue(n.compareTo(insertBefore.previous()), "Not inserted before insertBeforeMe");
                            insertBefore = n;
                        }

                        // TODO: These don't work as expected on IE (even though insertBefore worked). Better cross-browser assertion?
                        if (!Y.UA.ie) {
                            Y.Assert.areEqual("9991", this.na.getComputedStyle("zIndex"), "a.css does not seem to be inserted before ib.css");
                            Y.Assert.areEqual("9992", this.nb.getComputedStyle("zIndex"), "b.css does not seem to be inserted before ib.css");
                            Y.Assert.areEqual("9993", this.nc.getComputedStyle("zIndex"), "c.css does not seem to be inserted before ib.css");
                        }

                        test.o = o;
                    });
                }
            });

            test.wait(500);
        },

        'test: charset, single' : function() {
            var test = this;

            var trans = Y.Get.css(path("a.css?delay=20"), {
                charset: "ISO-8859-1",

                onSuccess: function(o) {
                    test.resume(function() {
                        var node = document.getElementById(o.nodes[0].id);

                        Y.Assert.areEqual("ISO-8859-1", node.getAttribute("charset"), "charset attribute not set");

                        test.o = o;
                    });
                }
            });

            test.wait(500);
        },

        'test: charset, multiple' : function() {
            var test = this;

            var trans = Y.Get.css(path(["a.css?delay=10", "b.css?delay=50", "c.css?delay=20"]), {
                charset: "ISO-8859-1",

                onSuccess: function(o) {
                    test.resume(function() {

                        Y.Assert.areEqual(3, o.nodes.length, "Unexpected node count");

                        for (var i = 0; i < o.nodes.length; i++) {
                            var node = document.getElementById(o.nodes[i].id);

                            Y.Assert.areEqual("ISO-8859-1", node.getAttribute("charset"), "charset attribute not set");
                        }

                        test.o = o;
                    });
                }
            });

            test.wait(500);
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

                        Y.Assert.areEqual("myscripts", node.title, "title property not set");
                        Y.Assert.areEqual("myscripts", node.getAttribute("title"), "title attribute not set");
                        Y.Assert.areEqual("ISO-8859-1", node.getAttribute("charset"), "charset attribute not set");

                        test.o = o;
                    });
                }
            });

            test.wait(500);
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

                        Y.Assert.areEqual(3, o.nodes.length, "Unexpected node count");

                        for (var i = 0; i < o.nodes.length; i++) {

                            var node = document.getElementById(o.nodes[i].id);

                            Y.Assert.areEqual("myscripts", node.title, "title property not set");
                            Y.Assert.areEqual("myscripts", node.getAttribute("title"), "title attribute not set");
                            Y.Assert.areEqual("ISO-8859-1", node.getAttribute("charset"), "charset attribute not set");
                        }

                        test.o = o;
                    });
                }
            });

            test.wait(500);
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
                        Y.Assert.fail("onSuccess shouldn't have been called");
                    });
                },

                onFailure: function(o) {
                    test.resume(function () {
                        counts.failure++;
                        Y.Assert.areEqual(1, counts.failure, "onFailure called more than once");
                    });
                },

                onEnd: function(o) {
                    test.o = o;
                }
            });

            test.wait(500);
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
                        Y.Assert.fail("onSuccess shouldn't have been called");
                    });
                },

                onFailure: function(o) {
                    test.resume(function() {
                        counts.failure++;
                        Y.Assert.areEqual(1, counts.failure, "onFailure called more than once");

                        if (!Y.UA.ie) {
                            Y.Assert.areEqual("1111", this.na.getComputedStyle("zIndex"), "a.css does not seem to be loaded");
                            Y.Assert.areNotEqual("1234", this.nb.getComputedStyle("zIndex"), "b.css was loaded when it shouldn't have been");
                            Y.Assert.areEqual("4321", this.nc.getComputedStyle("zIndex"), "c.css does not seem to be loaded");
                        }

                        test.o = o;
                    });
                },

                onEnd: function(o) {
                    test.o = o;
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
});
