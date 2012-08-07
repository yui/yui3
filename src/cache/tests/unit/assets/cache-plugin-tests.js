YUI.add('cache-plugin-tests', function(Y) {
        // Set up the page
        var ASSERT = Y.Assert,
            ARRAYASSERT = Y.ArrayAssert,
            getWidget = function(config) {
                return new Y.Widget().plug(Y.Plugin.Cache, config);
            };

        var testClass = new Y.Test.Case({
            name: "Class Tests",
        
            testDefaults: function() {
                var myWidget = getWidget();
                ASSERT.areSame("cache", Y.Plugin.Cache.NS, "Expected namespace.");
                ASSERT.areSame("cachePlugin", Y.Plugin.Cache.NAME, "Expected name.");
                ASSERT.isInstanceOf(Y.Cache, myWidget.cache, "Expected instance of Y.Cache.");
                ASSERT.areSame(0, myWidget.cache.get("max"), "Expected default max of 0.");
                ARRAYASSERT.isEmpty(myWidget.cache.get("entries"), "Expected empty array.");
            },

            methods: function() {
                var myWidget = getWidget();
                ASSERT.isFunction(myWidget.cache.add, "Expected method: add.");
                ASSERT.isFunction(myWidget.cache.flush, "Expected method: flush.");
                ASSERT.isFunction(myWidget.cache.retrieve, "Expected method: retrieve.");
            },

            testDestructor: function() {
                var myWidget = getWidget();
                myWidget.cache.destroy();
                ARRAYASSERT.isEmpty(myWidget.cache.get("entries"), "Expected empty array.");
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

                var cache = getWidget({max:2}).cache;
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

                var cache = getWidget({max:2}).cache;
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

                var cache = getWidget({max:2}).cache;
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

                var cache = getWidget({max:2}).cache;
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

                var cache = getWidget({max:2}).cache;
                cache.on("retrieve", mock.handleRetrieve);
                cache.add(1, "a");
                cache.retrieve(2);

                Y.Mock.verify(mock);
            },

            testCancelAdd: function() {
                var cache = getWidget({max:2}).cache;
                cache.on("add", function(e) {
                    e.preventDefault();
                }, this, true);
                cache.add(1, "a");

                // Test the cancel
                ASSERT.areSame(0, cache.get("size"), "Expected 0 entries.");
            },

            testCancelFlush: function() {
                var cache = getWidget({max:2}).cache;
                cache.on("flush", function(e) {
                    e.preventDefault();
                }, this, true);
                cache.add(1, "a");
                cache.flush();

                // Test the cancel
                ASSERT.areSame(1, cache.get("size"), "Expected 1 entry.");
            }
        });

        var suite = new Y.Test.Suite("Cache Plugin");
        suite.add(testClass);
        suite.add(testEvents);

        Y.Test.Runner.add(suite);
});
