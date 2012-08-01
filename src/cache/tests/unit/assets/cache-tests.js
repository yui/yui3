YUI.add('cache-tests', function(Y) {
        // Set up the page
        var ASSERT = Y.Assert,
            ARRAYASSERT = Y.ArrayAssert;
        

        var testClass = new Y.Test.Case({
            name: "Class Tests",
        
            testDefaults: function() {
                var cache = new Y.Cache();
                ASSERT.isInstanceOf(Y.Cache, cache, "Expected instance of Y.Cache.");
                ASSERT.areSame(0, cache.get("max"), "Expected default max of 0.");
                ARRAYASSERT.isEmpty(cache.get("entries"), "Expected empty array.");
            },

            testDestructor: function() {
                var cache = new Y.Cache();
                cache.destroy();
                ARRAYASSERT.isEmpty(cache.get("entries"), "Expected empty array.");
            }
        });
        
        var testBasic = new Y.Test.Case({
            name: "Basic Tests",

            testmax0: function() {
                var cache = new Y.Cache();
                ASSERT.areSame(0, cache.get("max"), "Expected max to be 0.");
                
                cache.add(1, "a");
                ASSERT.areSame(0, cache.get("size"), "Expected 0 entries.");
                ASSERT.isNull(cache.retrieve(1), "Expected null cached response.");
            },

            testmax2: function() {
                var cache = new Y.Cache({max:2});
                ASSERT.areSame(2, cache.get("max"), "Expected max to be 2.");
                
                cache.add(1, "a");
                ASSERT.areSame(1, cache.get("size"), "Expected 1 entry.");
                cache.add(2, "b");
                ASSERT.areSame(2, cache.get("size"), "Expected 2 entries.");
                cache.add(3, "c");
                ASSERT.areSame(2, cache.get("size"), "Expected 2 entries (still).");
            },
        
            testmax2to1: function() {
                var cache = new Y.Cache({max:2});
                cache.add(1, "a");
                cache.add(2, "b");
                cache.set("max", 1);
                ASSERT.areSame(1, cache.get("size"), "Expected 1 entry.");

                cache.add(3, "c");
                ASSERT.areSame(1, cache.get("size"), "Expected 1 entry (still).");
            },

            testmax2to0: function() {
                var cache = new Y.Cache({max:2});
                cache.add(1, "a");
                cache.add(2, "b");
                cache.set("max", 0);
                ARRAYASSERT.isEmpty(cache.get("entries"), "Expected empty array.");
                cache.add(3, "c");
                ARRAYASSERT.isEmpty(cache.get("entries"), "Expected empty array (still).");
            },

            testmax2toNegative: function() {
                var cache = new Y.Cache({max:2});
                cache.add(1, "a");
                cache.add(2, "b");
                cache.set("max", -5);
                ARRAYASSERT.isEmpty(cache.get("entries"), "Expected empty array.");
                cache.add(3, "c");
                ARRAYASSERT.isEmpty(cache.get("entries"), "Expected empty array (still).");
                ASSERT.areSame(0, cache.get("max"), "Expected negative value normalized to 0.");
            },

            testRetrieve: function() {
                var cache = new Y.Cache({max:2}),
                    cachedentry;
                cache.add(1, "a");
                cache.add("b", "c");
                cachedentry = cache.retrieve(1);
                ASSERT.areSame("a", cachedentry.response, "Expected first cached response.");
                ASSERT.isInstanceOf(Date, cachedentry.cached, "Expected first cached Date.");
                ASSERT.isNull(cachedentry.expires, "Expected null expires first.");

                cachedentry = cache.retrieve("b");
                ASSERT.areSame("c", cachedentry.response, "Expected second cached response.");
                ASSERT.isInstanceOf(Date, cachedentry.cached, "Expected second cached Date.");
                ASSERT.isNull(cachedentry.expires, "Expected null expires second.");
            },

            testNoExpires: function() {
                this.cache = new Y.Cache({max:5, expires:0}),
                this.cache.add(1, "a");
                this.cache.add("b", "c");

                var cachedentry = this.cache.retrieve(1);
                ASSERT.areSame("a", cachedentry.response, "Expected cached response.");
                ASSERT.isInstanceOf(Date, cachedentry.cached, "Expected cached Date.");
                ASSERT.isNull(cachedentry.expires, "Expected null expires.");
            },

            testExpiresNumber: function() {
                this.cache = new Y.Cache({max:5, expires:2000}),
                this.cache.add(1, "a");

                var cachedentry = this.cache.retrieve(1);
                ASSERT.areSame("a", cachedentry.response, "Expected cached response.");
                ASSERT.isInstanceOf(Date, cachedentry.expires, "Expected cached Date.");

                this.cache.set("expires", 1);
                this.cache.add(2, "b");

                this.wait(function(){
                    cachedentry = this.cache.retrieve(2);
                    ASSERT.isNull(cachedentry, "Expected expired data.");
                }, 50);
            },

            testExpiresDate: function() {
                this.cache = new Y.Cache({max:5, expires:new Date(new Date().getTime() + 86400000)}),
                this.cache.add(1, "a");

                var cachedentry = this.cache.retrieve(1);
                ASSERT.areSame("a", cachedentry.response, "Expected cached response.");
                ASSERT.isInstanceOf(Date, cachedentry.expires, "Expected cached Date.");

                this.cache.flush();
                this.cache.set("expires", new Date(new Date().getTime() - 86400000));
                this.cache.add(1, "a");
                cachedentry = this.cache.retrieve(1);
                ASSERT.isNull(cachedentry, "Expected expired data.");
            },

            testNoMatch: function() {
                var cache = new Y.Cache({max:2}),
                    cachedentry;
                cache.add("a", "b");
                cachedentry = cache.retrieve("c");
                ASSERT.areSame(null, cachedentry, "Expected no match.");
            },

            testFlush: function() {
                var cache = new Y.Cache({max:2});
                cache.add(1, "a");
                cache.add(2, "b");
                cache.flush();
                ASSERT.areSame(0, cache.get("size"), "Expected empty cache.");
            },
            
            testFlushItem: function() {
                var cache = new Y.Cache({max:2});
                cache.add(1, "a");
                cache.add(2, "b");
                cache.flush(1);
                ASSERT.areSame(1, cache.get("size"), "Expected single item");
                ASSERT.areSame("b", cache.get("entries")[0].response, "Expected 'b'");
            }
        });
    
        var testEvents = new Y.Test.Case({
            name: "Event Tests",

            testAdd: function() {
                var mock = new Y.Mock();
                Y.Mock.expect(mock, {
                    method: "handleAdd",
                    args: [Y.Mock.Value.Object]
                });

                var cache = new Y.Cache({max:2});
                cache.on("add", mock.handleAdd);
                cache.add(1, "a");

                Y.Mock.verify(mock);
            },
        
            testFlush: function() {
                var mock = new Y.Mock();
                Y.Mock.expect(mock, {
                    method: "handleFlush",
                    args: [Y.Mock.Value.Object]
                });

                var cache = new Y.Cache({max:2});
                cache.on("flush", mock.handleFlush);
                cache.add(1, "a");
                cache.flush();

                Y.Mock.verify(mock);
            },

            testRequest: function() {
                var mock = new Y.Mock();
                Y.Mock.expect(mock, {
                    method: "handleRequest",
                    args: [Y.Mock.Value(function(e){
                        ASSERT.areSame(2, e.request, "Expected request.");
                    })]
                });

                var cache = new Y.Cache({max:2});
                cache.on("request", mock.handleRequest);
                cache.add(1, "a");
                cache.retrieve(2);

                Y.Mock.verify(mock);
            },

            testRetrieveSuccess: function() {
                var mock = new Y.Mock();
                Y.Mock.expect(mock, {
                    method: "handleRetrieve",
                    args: [Y.Mock.Value(function(e){
                        ASSERT.areSame(1, e.entry.request);
                        ASSERT.areSame("a", e.entry.response);
                    })]
                });

                var cache = new Y.Cache({max:2});
                cache.on("retrieve", mock.handleRetrieve);
                cache.add(1, "a");
                cache.retrieve(1);

                Y.Mock.verify(mock);
            },

            testRetrieveFailure: function() {
                var mock = new Y.Mock();
                Y.Mock.expect(mock, {
                    method: "handleRetrieve",
                    args: [Y.Mock.Value.Any],
                    callCount: 0
                });

                var cache = new Y.Cache({max:2});
                cache.on("retrieve", mock.handleRetrieve);
                cache.add(1, "a");
                cache.retrieve(2);

                Y.Mock.verify(mock);
            },

            testCancelAdd: function() {
                var cache = new Y.Cache({max:2});
                cache.on("add", function(e) {
                    e.preventDefault();
                }, this, true);
                cache.add(1, "a");
                
                // Test the cancel
                ASSERT.areSame(0, cache.get("size"), "Expected 0 entries.");
            },

            testCancelFlush: function() {
                var cache = new Y.Cache({max:2});
                cache.on("flush", function(e) {
                    e.preventDefault();
                }, this, true);
                cache.add(1, "a");
                cache.flush();
                
                // Test the cancel
                ASSERT.areSame(1, cache.get("size"), "Expected 1 entry.");
            }
        });

        var testEntryManagement = new Y.Test.Case({
            name: "Entry Management Tests",

            testNonUniqueKeys: function() {
                var cache = new Y.Cache({max:3});
                cache.add(1, "a");
                cache.add(2, "b");
                cache.add(1, "c");
                ASSERT.areSame(3, cache.get("size"), "Expected 3 entries.");
            },

            testUniqueKeys: function() {
                var cache = new Y.Cache({max:3,uniqueKeys:true});
                cache.add(1, "a");
                cache.add(2, "b");
                cache.add(1, "c");
                ASSERT.areSame(2, cache.get("size"), "Expected 2 entries.");
            },
            
            testUniqueKeyValues: function() {
                var cache = new Y.Cache({max:3,uniqueKeys:true});
                cache.add(1, "a");
                cache.add(2, "b");
                cache.add(1, "c");
                ASSERT.areSame("c", cache.retrieve(1).response, "Expected 'c'");
            },

            testFreshness: function() {
                var cache = new Y.Cache({max:3});
                cache.add(1, "a");
                cache.add(2, "b");
                cache.add(3, "c");
                cache.retrieve(1);
                ASSERT.areSame(3, cache.get("size"), "Expected 3 entries.");
                ASSERT.areSame(1, cache.get("entries")[2].request, "Expected entry to be refreshed.");
            }
        });

        var testBoundaryValues = new Y.Test.Case({
            name: "Invalid Value Tests",

            testUndefinedRequest: function() {
                var cache = new Y.Cache({max:3});
                cache.add(undefined, "a");
                cache.add(undefined, "b");
                ASSERT.areSame("b", cache.retrieve().response, "Expected cached response.");
            },

            testNullRequest: function() {
                var cache = new Y.Cache({max:3});
                cache.add(null, "a");
                cache.add(null, "b");
                ASSERT.areSame("b", cache.retrieve(null).response, "Expected cached response.");
            },

            testNaNRequest: function() {
                var cache = new Y.Cache({max:3});
                cache.add(NaN, "a");
                cache.add(NaN, "b");
                ASSERT.areSame(0, cache.get("size"), "Expected 0 entries.");
            },

            testEmptyStringRequest: function() {
                var cache = new Y.Cache({max:3});
                cache.add("", "a");
                cache.add("", "b");
                ASSERT.areSame("b", cache.retrieve("").response, "Expected cached response.");
            }
        });

        var suite = new Y.Test.Suite("Cache");
        suite.add(testClass);
        suite.add(testBasic);
        suite.add(testEvents);
        suite.add(testEntryManagement);
        suite.add(testBoundaryValues);

        Y.Test.Runner.add(suite);
});
