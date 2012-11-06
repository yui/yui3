YUI.add('datasource-local-tests', function(Y) {

var Assert = Y.Assert,
    ArrayAssert = Y.ArrayAssert,

    suite = new Y.Test.Suite("DataSource: Local");

suite.add(new Y.Test.Case({
    name: "DataSource.Local Tests",

    testConstructor: function() {
        var ds = new Y.DataSource.Local();
        Assert.isInstanceOf(Y.Base, ds, "Expected DataSource.Base instance.");
        Assert.isInstanceOf(Y.DataSource.Local, ds, "Expected DataSource.Local instance.");
    },

    testLocalDefaults: function() {
        var data = ["a","b","c","d"],
            ds = new Y.DataSource.Local({ source: data }),
            request = null,
            received;

        ds.sendRequest({
            on: {
                success: function (e) {
                    request = e.request;
                    received = e.response.results;
                }
            }
        });
        
        Assert.isUndefined(request);
        ArrayAssert.itemsAreSame(data, received);
    },

    testLocalEvents: function() {
        var ds = new Y.DataSource.Local({ source: ["a","b","c","d"] }),
            requestCallback, dataCallback, responseCallback;
        
        ds.on("request", function (e) {
            Assert.areSame("dataSourceLocal:request", e.type);
            Assert.isNumber(e.tId, "request: Expected transaction ID.");
            Assert.areSame("a", e.request, "request: Expected request.");
            Assert.areSame("callback", e.callback, "request: Expected callback.");
            requestCallback = true;
        });

        ds.on("data", function (e) {
            Assert.areSame("dataSourceLocal:data", e.type);
            Assert.isNumber(e.tId, "data: Expected transaction ID.");
            Assert.areSame("a", e.request, "data: Expected request.");
            Assert.areSame("callback", e.callback, "data: Expected callback.");
            Assert.isArray(e.data, "data: Expected raw data.");
            dataCallback = true;
        });
        
        ds.on("response", function (e) {
            Assert.areSame("dataSourceLocal:response", e.type);
            Assert.isNumber(e.tId, "response: Expected transaction ID.");
            Assert.areSame("a", e.request, "response: Expected request.");
            Assert.areSame("callback", e.callback, "response: Expected callback.");
            Assert.isArray(e.data, "response: Expected raw data.");
            Assert.isObject(e.response, "response: Expected normalized response object.");
            Assert.isArray(e.response.results, "response: Expected parsed results.");
            Assert.isObject(e.response.meta, "response: Expected parsed meta data.");
            responseCallback = true;
        });

        ds.sendRequest({
            request: "a",
            on: "callback"
        });

        Assert.isTrue(requestCallback);
        Assert.isTrue(dataCallback);
        Assert.isTrue(responseCallback);
    },

    testLocalError: function() {
        var ds = new Y.DataSource.Local({ source: ["a","b","c","d"] }),
            errorCallback;

        ds.on("error", function (e) {
            Assert.areSame("dataSourceLocal:error", e.type);
            Assert.isNumber(e.tId, "error: Expected transaction ID.");
            Assert.areSame("a", e.request, "error: Expected request.");
            Assert.areSame("callback", e.callback, "error: Expected callback.");
            Assert.isObject(e.response, "error: Expected normalized response object.");
            Assert.isObject(e.error, "error: Expected error.");
            errorCallback = true;
        });

        ds.set("source", undefined);
        ds.sendRequest({
            request: "a",
            on: "callback"
        });

        Assert.isTrue(errorCallback);
    },

    "test sendRequest({ callback: { ... }}) is alias for on: { ... }": function () {
        var data = ["a","b","c","d"],
            ds = new Y.DataSource.Local({ source: data }),
            request = null,
            received, requestCallback, dataCallback, responseCallback,
            errorCallback,
            handle;

        ds.sendRequest({
            callback: {
                success: function (e) {
                    request = e.request;
                    received = e.response.results;
                }
            }
        });
        
        Assert.isUndefined(request);
        ArrayAssert.itemsAreSame(data, received);

        handle = ds.on({
            request: function (e) {
                Assert.isNumber(e.tId, "request: Expected transaction ID.");
                Assert.areSame("a", e.request, "request: Expected request.");
                Assert.areSame("callback", e.callback, "request: Expected callback.");
                requestCallback = true;
            },
            data: function (e) {
                Assert.isNumber(e.tId, "data: Expected transaction ID.");
                Assert.areSame("a", e.request, "data: Expected request.");
                Assert.areSame("callback", e.callback, "data: Expected callback.");
                Assert.isArray(e.data, "data: Expected raw data.");
                dataCallback = true;
            },
            response: function (e) {
                Assert.isNumber(e.tId, "response: Expected transaction ID.");
                Assert.areSame("a", e.request, "response: Expected request.");
                Assert.areSame("callback", e.callback, "response: Expected callback.");
                Assert.isArray(e.data, "response: Expected raw data.");
                Assert.isObject(e.response, "response: Expected normalized response object.");
                Assert.isArray(e.response.results, "response: Expected parsed results.");
                Assert.isObject(e.response.meta, "response: Expected parsed meta data.");
                responseCallback = true;
            }
        });

        ds.sendRequest({
            request: "a",
            callback: "callback"
        });

        Assert.isTrue(requestCallback);
        Assert.isTrue(dataCallback);
        Assert.isTrue(responseCallback);
        handle.detach();


        ds.on("error", function (e) {
            Assert.isNumber(e.tId, "error: Expected transaction ID.");
            Assert.areSame("a", e.request, "error: Expected request.");
            Assert.areSame("callback", e.callback, "error: Expected callback.");
            Assert.isObject(e.response, "error: Expected normalized response object.");
            Assert.isObject(e.error, "error: Expected error.");
            errorCallback = true;
        });

        ds.set("source", undefined);
        ds.sendRequest({
            request: "a",
            callback: "callback"
        });

        Assert.isTrue(errorCallback);
    },

    "test sendRequest() does not throw an error": function () {
        var data = ["a","b","c","d"],
            ds = new Y.DataSource.Local({ source: data }),
            responseCallback;

        ds.on("response", function (e) {
            responseCallback = true;
        });

        ds.sendRequest();
        
        Assert.isTrue(responseCallback);
    }
}));

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['datasource-local', 'test']});
