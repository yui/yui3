YUI.add('get-tests', function(Y) {
    
    Y.GetTests = new Y.Test.Suite("Get Suite");

    var testGetScript = new Y.Test.Case({

        name: "Get Tests",

        // Change the ignore: to test: as they are filled out.

        'test: single script, success': function() {
            var test = this;
            var counts = {
                success:0,
                failure:0
            };

            Y.Get.script("getfiles/a.js", {
                onSuccess: function() {
                    test.resume(function() {
                        counts.success++;
                        Y.Assert.isTrue(G_TEST_A, "a.js does not seem to be loaded");
                        Y.Assert.isTrue(counts.success === 1, "onSuccess called more than once");
                    });
                },
                onFailure: function(o) {
                    test.resume(function() {
                        Y.Assert.fail("onFailure shouldn't have been called");
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
                    });
                },

                onFailure: function(o) {
                    test.resume(function() {
                        counts.failure++;
                        // Nothing to assert really. Resume is enough of an assert. Better way?
                        Y.Assert.isTrue(true, true);
                        Y.Assert.isTrue(counts.failure === 1, "onFailure called more than once");
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
                    Y.Assert.isTrue(G_TEST_A, "a.js does not seem to be loaded");
                    Y.Assert.isTrue(counts.success === 1, "onSuccess called more than once");
                },
                onFailure: function(o) {
                    Y.Assert.fail("onFailure shouldn't have been called");
                },
                onEnd : function() {
                    test.resume(function() {
                        counts.end++;
                        Y.Assert.isTrue(counts.end === 1, "onEnd called more than once");
                        Y.Assert.isTrue(counts.success === 1, "onEnd called before onSuccess");
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
                onSuccess: function(o) {
                    Y.Assert.fail("onSuccess shouldn't have been called");
                },
                onEnd : function() {
                    test.resume(function() {
                        counts.end++;
                        Y.Assert.isTrue(counts.end === 1, "onEnd called more than once");
                        Y.Assert.isTrue(counts.failure === 1, "onEnd called before onFailure");
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

            Y.Get.script(["getfiles/a.js", "getfiles/b.js", "getfiles/c.js"], {
                onFailure: function(o) {
                    test.resume(function() {
                        Y.Assert.fail("onFailure shouldn't have been called");
                    });
                },
                onSuccess: function() {
                    test.resume(function() {
                        counts.success++;
                        Y.Assert.isTrue(G_TEST_A, "a.js does not seem to be loaded");
                        Y.Assert.isTrue(G_TEST_B, "b.js does not seem to be loaded");
                        Y.Assert.isTrue(G_TEST_C, "c.js does not seem to be loaded");
                        Y.Assert.isTrue(counts.success === 1, "onSuccess called more than once");
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
                    });
                },
                onFailure: function(o) {
                    test.resume(function() {
                        // Nothing to assert really. Resume is enough of an assert. Better way?
                        counts.failure++;
                        Y.Assert.isTrue(true, true);
                        Y.Assert.isTrue(counts.failure === 1, "onFailure called more than once");
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

            Y.Get.script(["getfiles/a.js", "getfiles/b.js", "getfiles/c.js"], {
                onSuccess: function() {
                    counts.success++;
                    Y.Assert.isTrue(G_TEST_A, "a.js does not seem to be loaded");
                    Y.Assert.isTrue(G_TEST_B, "b.js does not seem to be loaded");
                    Y.Assert.isTrue(G_TEST_C, "c.js does not seem to be loaded");
                    Y.Assert.isTrue(counts.success === 1, "onSuccess called more than once");
                },
                onFailure: function(o) {
                    Y.Assert.fail("onFailure shouldn't have been called");
                },
                onEnd : function() {
                    test.resume(function() {
                        counts.end++;
                        Y.Assert.isTrue(counts.end === 1, "onEnd called more than once");
                        Y.Assert.isTrue(counts.success === 1, "onEnd called before onSuccess");
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
                onSuccess: function(o) {
                    Y.Assert.fail("onSuccess shouldn't have been called");
                },
                onFailure: function(o) {
                    counts.failure++;
                    Y.Assert.isTrue(true, true);
                    Y.Assert.isTrue(counts.failure === 1, "onFailure called more than once");
                },
                onEnd : function() {
                    test.resume(function() {
                        counts.end++;
                        Y.Assert.isTrue(counts.end === 1, "onEnd called more than once");
                        Y.Assert.isTrue(counts.failure === 1, "onEnd called before onFailure");
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
                    });
                },
                onSuccess: function() {
                    test.resume(function() {
                        counts.success++;
                        Y.Assert.isTrue(G_TEST_A, "a.js does not seem to be loaded");
                        Y.Assert.isTrue(G_TEST_B, "b.js does not seem to be loaded");
                        Y.Assert.isTrue(G_TEST_C, "c.js does not seem to be loaded");
                        Y.Assert.isTrue(counts.success === 1, "onSuccess called more than once");
                    });
                },
                async:true
            });

            this.wait();
        },

        'ignore: async multiple script, failure': function() {
            // Same tests as above with async:true. Refactor above tests to reuse code
            // Really just testing for breakage. Not sure if we can test || loading - maybe with really large files?
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
        },
    
        'test: single css, success': function() {
            var test = this;
            var counts = {
                success:0,
                failure:0
            };

            Y.Get.css("getfiles/a.css", {

                onSuccess: function() {
                    // If Webkit/FF
                    //test.resume(function() {
                        test.wait(function() {
                            counts.success++;
                            Y.Assert.areEqual("absolute", this.na.getStyle("position"), "a.css does not seem to be loaded");
                            Y.Assert.isTrue(counts.success === 1, "onSuccess called more than once");
                        }, 200); // need arbit delay to make sure CSS is applied
                    //});
                },

                onFailure: function(o) {
                    //test.resume(function() {
                        Y.Assert.fail("onFailure shouldn't have been called");
                    //});
                }
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
                    Y.Assert.isTrue(true, true);
                    Y.Assert.isTrue(counts.failure === 1, "onFailure called more than once");
                }
            }));
        },

        'ignore: multiple css, success': function() {
            var test = this;
            var counts = {
                success:0,
                failure:0
            };

            Y.Get.css(["getfiles/a.css", "getfiles/b.css", "getfiles/c.css"], {
                onFailure: function(o) {
                    test.resume(function() {
                        Y.Assert.fail("onFailure shouldn't have been called");
                    });
                },
                onSuccess: function() {
                    test.resume(function() {
                        counts.success++;
                        Y.Assert.isTrue(counts.success === 1, "onSuccess called more than once");
                    });
                }
            });

            this.wait();
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
                        Y.Assert.isTrue(true, true);
                        Y.Assert.isTrue(counts.failure === 1, "onFailure called more than once");
                    });
                }
            }));

            this.wait();
        },

        'ignore: async multiple css, success': function() {
        },

        'ignore: async multiple css, failure': function() {
        }
    });

    Y.GetTests.add(testGetScript);
    Y.GetTests.add(testGetCSS);
    Y.Test.Runner.add(Y.GetTests);

});
