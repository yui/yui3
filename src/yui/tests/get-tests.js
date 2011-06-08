YUI.add('get-tests', function(Y) {
    
    Y.GetTests = new Y.Test.Suite("Get Suite");

    var testGetScript = new Y.Test.Case({

        name: "Get Tests",

        // Change the ignore: to test: as they are filled out.
        
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

            Y.Get.script("getfiles/a.js", {
                onSuccess: function(o) {
                    test.resume(function() {
                        counts.success++;
                        Y.Assert.areEqual(G_SCRIPTS[0], "a.js", "a.js does not seem to be loaded");
                        Y.Assert.areEqual(G_SCRIPTS.length, 1, "More/Less than 1 script was loaded");
                        Y.Assert.isTrue(counts.success === 1, "onSuccess called more than once");
                        this.o = o;
                    });
                },
                onFailure: function(o) {
                    test.resume(function() {
                        Y.Assert.fail("onFailure shouldn't have been called");
                        this.o = o;
                    });
                }
            });

            this.wait();
        },
    
        'test: single script, failure': function() {

            // 404 failure test breaks. Only abort currently hits the failure case
            // as per comments for Get _fail.
            var test = this;
            var counts = {
                success:0,
                failure:0
            };

            // abort() is the only thing which causes onFailure to be hit.
            // Not sure how robust it is to do this inline (that is, could onSuccess fire before abort is hit).
            
            Y.Get.abort(Y.Get.script("getfiles/a.js", {
                onSuccess: function(o) {
                    test.resume(function() {
                        Y.Assert.fail("onSuccess shouldn't have been called");
                        this.o = o;
                    });
                },

                onFailure: function(o) {
                    test.resume(function() {
                        counts.failure++;
                        // Nothing to assert really. Resume is enough of an assert. Better way?
                        Y.Assert.isTrue(counts.failure === 1, "onFailure called more than once");
                        this.o = o;
                    });
                }
            }));

            this.wait();
        },

        'test: single script success, end': function() {

            var test = this;
            var counts = {
                success:0,
                failure:0,
                end:0
            };

            Y.Get.script("getfiles/a.js", {
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
                    test.resume(function() {
                        counts.end++;
                        Y.Assert.areEqual(1, counts.end,"onEnd called more than once");
                        Y.Assert.areEqual(1, counts.success, "onEnd called before onSuccess");
                        Y.Assert.areEqual("OK", o.statusText, "Expected OK result");
                        this.o = o;
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

            Y.Get.abort(Y.Get.script("getfiles/a.js", {
                onFailure: function() {
                    counts.failure++;
                    Y.Assert.isTrue(counts.failure === 1, "onFailure called more than once");
                },
                onSuccess: function() {
                    Y.Assert.fail("onSuccess shouldn't have been called");
                },
                onEnd : function(o) {
                    test.resume(function() {
                        counts.end++;
                        Y.Assert.areEqual(1, counts.end,"onEnd called more than once");
                        Y.Assert.areEqual(1, counts.failure, "onEnd called before onFailure");
                        Y.Assert.areEqual("failure", o.statusText, "Expected failure result");
                        this.o = o;
                    });
                }
            }));

            this.wait();
        },

        'test: multiple script, success': function() {
            
            var test = this;
            var counts = {
                success:0,
                failure:0
            };

            Y.Get.script(["getfiles/b.js", "getfiles/a.js", "getfiles/c.js"], {
                onFailure: function(o) {
                    test.resume(function() {
                        Y.Assert.fail("onFailure shouldn't have been called");
                        this.o = o;
                    });
                },
                onSuccess: function(o) {
                    test.resume(function() {
                        counts.success++;
                        Y.Assert.areEqual(G_SCRIPTS.length, 3, "More/Less than 3 scripts loaded");
                        Y.ArrayAssert.itemsAreEqual(G_SCRIPTS, ["b.js", "a.js", "c.js"], "Unexpected script order");
                        Y.Assert.isTrue(counts.success === 1, "onSuccess called more than once");
                        this.o = o;
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

            // abort() is the only thing which causes onFailure to be hit.
            // Not sure how robust it is to do this inline (that is, could onSuccess fire before this is hit).

            Y.Get.abort(Y.Get.script(["getfiles/a.js", "getfiles/b.js", "getfiles/c.js"], {
                onSuccess: function(o) {
                    test.resume(function() {
                        Y.Assert.fail("onSuccess shouldn't have been called");
                        this.o = o;
                    });
                },
                onFailure: function(o) {
                    test.resume(function() {
                        // Nothing to assert really. Resume is enough of an assert. Better way?
                        counts.failure++;
                        Y.Assert.isTrue(counts.failure === 1, "onFailure called more than once");
                        this.o = o;
                    });
                }
            }));

            this.wait();
        },
        
        'test: multiple script, success, end': function() {

            var test = this;
            var counts = {
                success:0,
                failure:0,
                end:0
            };

            Y.Get.script(["getfiles/c.js", "getfiles/a.js", "getfiles/b.js"], {
                onSuccess: function() {
                    counts.success++;
                    Y.Assert.areEqual(G_SCRIPTS.length, 3, "More/Less than 3 scripts loaded");
                    Y.ArrayAssert.itemsAreEqual(G_SCRIPTS, ["c.js", "a.js", "b.js"], "Unexpected script order");
                    Y.Assert.isTrue(counts.success === 1, "onSuccess called more than once");
                },
                onFailure: function() {
                    Y.Assert.fail("onFailure shouldn't have been called");
                },
                onEnd : function(o) {
                    test.resume(function() {
                        counts.end++;
                        Y.Assert.areEqual(1, counts.end,"onEnd called more than once");
                        Y.Assert.areEqual(1, counts.success, "onEnd called before onSuccess");
                        Y.Assert.areEqual("OK", o.statusText, "Expected OK result");
                        this.o = o;
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

            Y.Get.abort(Y.Get.script(["getfiles/a.js", "getfiles/b.js", "getfiles/c.js"], {
                onSuccess: function() {
                    Y.Assert.fail("onSuccess shouldn't have been called");
                },
                onFailure: function() {
                    counts.failure++;
                    Y.Assert.isTrue(counts.failure === 1, "onFailure called more than once");
                },
                onEnd : function(o) {
                    test.resume(function() {
                        counts.end++;
                        Y.Assert.areEqual(1, counts.end,"onEnd called more than once");
                        Y.Assert.areEqual(1, counts.failure, "onEnd called before onFailure");
                        Y.Assert.areEqual("failure", o.statusText, "Expected failure result");
                        this.o = o;
                    });
                }
            }));

            this.wait();
        },

        'test: async multiple script, success': function() {

            var test = this;
            var counts = {
                success:0,
                failure:0
            };

            Y.Get.script(["getfiles/a.js", "getfiles/b.js", "getfiles/c.js"], {
                onFailure: function(o) {
                    test.resume(function() {
                        Y.Assert.fail("onFailure shouldn't have been called");
                        this.o = o;
                    });
                },
                onSuccess: function(o) {
                    test.resume(function() {
                        counts.success++;
                        Y.Assert.areEqual(G_SCRIPTS.length, 3, "More/Less than 3 scripts loaded");
                        Y.ArrayAssert.containsItems( ["c.js", "a.js", "b.js"], G_SCRIPTS, "Unexpected script contents");
                        Y.Assert.isTrue(counts.success === 1, "onSuccess called more than once");
                        this.o = o;
                    });
                },
                async:true
            });

            this.wait();
        },

        'test: async multiple script, failure': function() {

            var test = this;
            var counts = {
                success:0,
                failure:0
            };

            // abort() is the only thing which causes onFailure to be hit.
            // Not sure how robust it is to do this inline (that is, could onSuccess fire before this is hit).

            Y.Get.abort(Y.Get.script(["getfiles/a.js", "getfiles/b.js", "getfiles/c.js"], {
                onSuccess: function(o) {
                    test.resume(function() {
                        Y.Assert.fail("onSuccess shouldn't have been called");
                        this.o = o;
                    });
                },
                onFailure: function(o) {
                    test.resume(function() {
                        // Nothing to assert really. Resume is enough of an assert. Better way?
                        counts.failure++;
                        Y.Assert.isTrue(counts.failure === 1, "onFailure called more than once");
                        this.o = o;
                    });
                },
                async:true
            }));

            this.wait();
        },

        'test: async multiple script, success, end': function() {

            var test = this;
            var counts = {
                success:0,
                failure:0,
                end:0
            };

            Y.Get.script(["getfiles/c.js", "getfiles/a.js", "getfiles/b.js"], {
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
                    test.resume(function() {
                        counts.end++;
                        Y.Assert.areEqual(1, counts.end,"onEnd called more than once");
                        Y.Assert.areEqual(1, counts.success, "onEnd called before onSuccess");
                        Y.Assert.areEqual("OK", o.statusText, "Expected OK result");
                        this.o = o;
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

            Y.Get.abort(Y.Get.script(["getfiles/a.js", "getfiles/b.js", "getfiles/c.js"], {
                onSuccess: function() {
                    Y.Assert.fail("onSuccess shouldn't have been called");
                },
                onFailure: function() {
                    counts.failure++;
                    Y.Assert.isTrue(counts.failure === 1, "onFailure called more than once");
                },
                onEnd : function(o) {
                    test.resume(function() {
                        counts.end++;
                        Y.Assert.areEqual(1, counts.end,"onEnd called more than once");
                        Y.Assert.areEqual(1, counts.failure, "onEnd called before onFailure");
                        Y.Assert.areEqual("failure", o.statusText, "Expected failure result");
                        this.o = o;
                    });
                },
                async:true
            }));

            this.wait();
        },

        'ignore: callback data payload' : function() {
            /*
                tId: q.tId,
                win: q.win,
                data: q.data,
                nodes: q.nodes,
                msg: msg,
                statusText: result,
                purge: function() {
                    _purge(this.tId);
                }
            */
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

    var testGetCSS = new Y.Test.Case({

        name: "Get CSS Tests",

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

            Y.Get.css("getfiles/a.css", {

                onSuccess: function(o) {
                    // If IE, resume, else Webkit/FF, wait

                    //test.resume(function() {
                        test.wait(function() {
                            counts.success++;
                            Y.Assert.areEqual("absolute", this.na.getStyle("position"), "a.css does not seem to be loaded");
                            Y.Assert.isTrue(counts.success === 1, "onSuccess called more than once");
                            this.o = o;
                        }, 100); // need arbit delay to make sure CSS is applied
                    //});
                },

                onFailure: function(o) {
                    //test.resume(function() {
                        Y.Assert.fail("onFailure shouldn't have been called");
                    //});
                },
                onEnd: function(o) {
                    // Never called for CSS
                    this.o = o;
                }
            });

        },

        'test: multiple css, success': function() {
            var test = this;
            var counts = {
                success:0,
                failure:0
            };

            Y.Get.css(["getfiles/a.css", "getfiles/b.css", "getfiles/c.css"], {
                onFailure: function(o) {
                    Y.Assert.fail("onFailure shouldn't have been called");
                },
                onSuccess: function(o) {
                    test.wait(function() {
                        counts.success++;
                        Y.Assert.areEqual("absolute", this.na.getStyle("position"), "a.css does not seem to be loaded");
                        Y.Assert.areEqual("250px", this.nb.getStyle("left"), "b.css does not seem to be loaded");
                        Y.Assert.areEqual("100px", this.nc.getStyle("top"), "c.css does not seem to be loaded");
                        Y.Assert.isTrue(counts.success === 1, "onSuccess called more than once");
                        this.o = o;
                    }, 100);    // Need arbit delay to make sure CSS is applied
                },
                onEnd: function(o) {
                    // Never called for CSS 
                    this.o = o;
                }
            });
        },

        'test: async multiple css, success': function() {
            var test = this;
            var counts = {
                success:0,
                failure:0
            };

            Y.Get.css(["getfiles/a.css", "getfiles/b.css", "getfiles/c.css"], {
                onFailure: function(o) {
                    Y.Assert.fail("onFailure shouldn't have been called");
                },
                onSuccess: function(o) {
                    test.wait(function() {
                        counts.success++;
                        Y.Assert.areEqual("absolute", this.na.getStyle("position"), "a.css does not seem to be loaded");
                        Y.Assert.areEqual("250px", this.nb.getStyle("left"), "b.css does not seem to be loaded");
                        Y.Assert.areEqual("100px", this.nc.getStyle("top"), "c.css does not seem to be loaded");
                        Y.Assert.isTrue(counts.success === 1, "onSuccess called more than once");
                        this.o = o;
                    }, 100);    // Need arbit delay to make sure CSS is applied
                },
                onEnd: function(o) {
                    // Never called for CSS
                    this.o = o;
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

            // abort() is the only thing which causes onFailure to be hit.
            // Not sure how robust it is to do this inline (that is, could onSuccess fire before this is hit).
            
            Y.Get.abort(Y.Get.css("getfiles/a.css", {
                onSuccess: function(o) {
                    Y.Assert.fail("onSuccess shouldn't have been called");
                },

                onFailure: function(o) {
                    counts.failure++;
                    // Nothing to assert really. Resume is enough of an assert. Better way?
                    Y.Assert.isTrue(counts.failure === 1, "onFailure called more than once");
                },
                onEnd: function(o) {
                    this.o = o;
                }
            }));
        },

        'ignore: multiple css, failure': function() {
            var test = this;
            var counts = {
                success:0,
                failure:0
            };

            Y.Get.abort(Y.Get.css(["getfiles/a.css", "getfiles/b.css", "getfiles/c.css"], {
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
                        this.o = o;
                    });
                },
                onEnd: function(o) {
                    // Never called for CSS
                    this.o = o;
                }
            }));

            this.wait();
        },

        'ignore: async multiple css, failure': function() {
        }
    });

    Y.GetTests.add(testGetScript);
    Y.GetTests.add(testGetCSS);
    Y.Test.Runner.add(Y.GetTests);

});
