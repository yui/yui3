YUI.add('datasource-cache-tests', function(Y) {

var Assert = Y.Assert,

    suite = new Y.Test.Suite("Datasource: Cache");


suite.add(new Y.Test.Case({
    name: "DataSource Caching Tests",

    setUp: function () {
        this.ds = new Y.DataSource.Local({ source: ["a","b","c","d"] });
    },

    testCacheDefaultMax: function() {
        this.ds.plug(Y.Plugin.DataSourceCache);
        Assert.isInstanceOf(Y.Cache, this.ds.cache, "Expected Cache instance.");
        Assert.areSame(0, this.ds.cache.get("max"), "Expected 0 max in Cache.");
    },

    testCacheInitMax: function() {
        this.ds.plug(Y.Plugin.DataSourceCache, { max: 3 });
        Assert.isInstanceOf(Y.Cache, this.ds.cache, "Expected Cache instance.");
        Assert.areSame(3, this.ds.cache.get("max"), "Expected 3 max in Cache.");
    },

    testCacheSetMax: function() {
        this.ds.plug(Y.Plugin.DataSourceCache);
        this.ds.cache.set("max", 5);
        Assert.isInstanceOf(Y.Cache, this.ds.cache, "Expected Cache instance.");
        Assert.areSame(5, this.ds.cache.get("max"), "Expected 5 max in Cache.");
    },
    
    testLocalCache: function() {
        var cached;

        this.ds.plug(Y.Plugin.DataSourceCache, { max: 3 });

        this.ds.sendRequest({ request: "a" });

        this.ds.sendRequest({
            request: "a",
            callback: {
                success: function (e) {
                    cached = e.cached;
                }
            }
        });

        Assert.isInstanceOf(Date, cached);
    },

    testLocalCacheUnplug: function() {
        var cached;

        this.ds.plug(Y.Plugin.DataSourceCache, { max: 3 });

        this.ds.sendRequest({ request: "a" });

        this.ds.sendRequest({
            request: "a",
            callback: {
                success: function (e) {
                    cached = e.cached;
                }
            }
        });

        Assert.isInstanceOf(Date, cached);

        this.ds.unplug(Y.Plugin.DataSourceCache);

        Assert.isUndefined(this.ds.cache);

        this.ds.sendRequest({
            request: "a",
            callback: {
                success: function (e) {
                    cached = e.cached;
                }
            }
        });

        Assert.isUndefined(cached);
    },

    "cache retrieval should not overwrite callback": function () {
        var response, callbackA, callbackB;

        this.ds.plug(Y.Plugin.DataSourceCache, { max: 3 });

        this.ds.sendRequest({
            request: "a", 
            callback: {
                success: function (e) {
                    response = e.response;
                    callbackA = true;
                    Assert.isUndefined(e.cached);
                }
            }
        });

        this.ds.sendRequest({
            request: "a",
            callback: {
                success: function (e) {
                    Assert.areSame(response, e.response);
                    Assert.isInstanceOf(Date, e.cached);
                    callbackB = true;
                }
            }
        });

        Assert.isTrue(callbackA);
        Assert.isTrue(callbackB);
    }
}));

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['datasource-cache', 'test']});
