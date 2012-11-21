YUI.add('datasource-function-tests', function(Y) {

var Assert = Y.Assert,

    suite = new Y.Test.Suite("DataSource: Function");

function testFn() {
    return [
        { type: "a", age:  0, name: "c" },
        { type: "d", age:  1, name: "f" },
        { type: "g", age: -1, name: "i" }
    ];
}

suite.add(new Y.Test.Case({
    name: "DataSource.Function Tests",

    testFunctionDefaults: function() {
        var ds = new Y.DataSource.Function({ source: testFn }),
            request = null, response, tId, data, callback;

        ds.sendRequest({
            request: "foo",
            callback: {
                success: function (e) {
                    request  = e.request;
                    response = e.response;
                    tId      = e.tId;
                    data     = e.data;
                    callback = e.callback;
                }
            }
        });

        Assert.areSame("foo", request, "Expected same request.");
        Assert.isObject(response, "Expected response object.");
        Assert.isNotUndefined(tId);
        Assert.isNotUndefined(data);
        Assert.isNotUndefined(callback);
    },

    testFunctionEvents: function() {
        var ds = new Y.DataSource.Function({ source: testFn }),
            requestCallback, dataCallback, responseCallback;

        ds.plug(Y.Plugin.DataSourceArraySchema, {
            schema: {
                resultFields: ["type", "name"]
            }
        });

        ds.on("request", function (e) {
            Assert.areSame("dataSourceFunction:request", e.type);
            Assert.isNumber(e.tId, "request: Expected transaction ID.");
            Assert.areSame("foo", e.request, "Expected same request.");
            Assert.areSame("callback", e.callback, "request: Expected callback.");
            requestCallback = true;
        });

        ds.on("data", function (e) {
            Assert.areSame("dataSourceFunction:data", e.type);
            Assert.isNumber(e.tId, "data: Expected transaction ID.");
            Assert.areSame("foo", e.request, "Expected same request.");
            Assert.areSame("callback", e.callback, "data: Expected callback.");
            Assert.isObject(e.data, "data: Expected raw data.");
            dataCallback = true;
        });

        ds.on("response", function (e) {
            Assert.areSame("dataSourceFunction:response", e.type);
            Assert.isNumber(e.tId, "response: Expected transaction ID.");
            Assert.areSame("foo", e.request, "Expected same request.");
            Assert.areSame("callback", e.callback, "response: Expected callback.");
            Assert.isObject(e.data, "response: Expected raw data.");
            Assert.isObject(e.response, "response: Expected normalized response object.");
            Assert.isArray(e.response.results, "response: Expected parsed results.");
            Assert.isObject(e.response.meta, "response: Expected parsed meta data.");
            responseCallback = true;
        });

        ds.sendRequest({
            request: "foo",
            callback: "callback" // ???
        });

        Assert.isTrue(requestCallback);
        Assert.isTrue(dataCallback);
        Assert.isTrue(responseCallback);
    },

    testFunctionError: function() {
        var ds = new Y.DataSource.Function({ source: "foo" }),
            errorCallback;

        ds.plug(Y.Plugin.DataSourceArraySchema, {
            schema: {
                resultFields: ["type", "name"]
            }
        });

        ds.on("error", function (e) {
            Assert.areSame("dataSourceFunction:error", e.type);
            Assert.isNumber(e.tId, "error: Expected transaction ID.");
            Assert.areSame("a", e.request, "error: Expected request.");
            Assert.areSame("callback", e.callback, "error: Expected callback.");
            Assert.isUndefined(e.data, "error: Expected undefined data.");
            Assert.isObject(e.response, "error: Expected normalized response object.");
            Assert.isObject(e.error, "error: Expected error.");
            errorCallback = true;
        });

        ds.sendRequest({
            request: "a",
            callback: "callback"
        });

        Assert.isTrue(errorCallback);
    },
    
    testFunctionException: function() {
        var ds = new Y.DataSource.Function({
                source: function() {
                    throw new Error("myException");
                }
            }),
            errorCallback;

        ds.plug(Y.Plugin.DataSourceArraySchema, {
            schema: {
                resultFields: ["type", "name"]
            }
        });

        ds.on("error", function (e) {
            Assert.isNumber(e.tId, "error: Expected transaction ID.");
            Assert.areSame("a", e.request, "error: Expected request.");
            Assert.areSame("callback", e.callback, "error: Expected callback.");
            Assert.isUndefined(e.data, "error: Expected undefined data.");
            Assert.isObject(e.response, "error: Expected normalized response object.");
            Assert.isObject(e.error, "error: Expected error.");
            Assert.areSame("myException", e.error.message, "error: Expected message.");
            errorCallback = true;
        });

        ds.sendRequest({
            request: "a",
            callback: "callback"
        });

        Assert.isTrue(errorCallback);
    },

    "success or failure callback should not cause data event to fire again":
    function () {
        var ds = new Y.DataSource.Function({
                source: function () { return ['a','b']; }
            }),
            count = 0;

        ds.on("data", function () {
            count++;
        });

        ds.sendRequest({
            request: 'a',
            callbacks: {
                success: function () {
                    throw new Error("boom");
                }
            }
        });


        Y.Assert.areSame(1, count);

    }
}));

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['datasource-function', 'test']});
