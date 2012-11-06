YUI.add('datasource-io-tests', function(Y) {

var Assert = Y.Assert,
    ObjectAssert = Y.ObjectAssert,

    suite = new Y.Test.Suite("DataSource: IO"),

    jsonData = '{"ResultSet":{"Result":[{"Title":"Madonna"}]}}';


suite.add(new Y.Test.Case({
    name: "DataSource.IO Tests",

    testConstructorIO: function() {
        var ds = new Y.DataSource.IO();
        Assert.isInstanceOf(Y.Base, ds, "Expected Base instance.");
        Assert.isInstanceOf(Y.DataSource.Local, ds, "Expected DataSource.Local instance.");
        Assert.isInstanceOf(Y.DataSource.IO, ds, "Expected DataSource.IO instance.");
    },

    testIODefaults: function() {
        var ds = new Y.DataSource.IO({
                source: "./php/ysearch_json_madonna.php",
                io: function (uri, config) {
                    var id = Y.guid();
                    config.on.success.call(ds, id, {
                        responseText: jsonData
                    }, config["arguments"]);

                    return id;
                }
            }),
            request, response, tId, data, callback;

        ds.sendRequest({
            request: null,
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

        Assert.isNull(request, "Expected null request.");
        Assert.isObject(response, "Expected response object.");
        Assert.isNotUndefined(tId);
        Assert.isNotUndefined(data);
        Assert.isNotUndefined(callback);
    },

    testIOConfig: function() {
        var ioCallback, failureCallback,
            ds = new Y.DataSource.IO({
                source: "x",
                ioConfig: {
                    method: "POST",
                    data: "foo=bar",
                    timeout: 1
                },
                io: function (uri, config) {
                    var id = Y.guid();
                    Assert.areSame(1, config.timeout);
                    Assert.areSame(ds, config.context);
                    Assert.areSame("foo=bar", config.data);
                    Assert.areSame("POST", config.method);

                    ioCallback = true;

                    config.on.failure.call(config.context, id, {
                        responseText: jsonData
                    }, config["arguments"]);
                }
            });

        ds.sendRequest({
            request: null,
            callback: {
                failure: function (e) {
                    Assert.isObject(e.error, "Expected error from timeout.");
                    Assert.isNull(e.request, "Expected null request.");
                    Assert.isObject(e.response, "Expected response object.");
                    ObjectAssert.ownsKeys({
                        tId: null,
                        request: null,
                        data: null,
                        response: null,
                        callback: null
                    }, e, "Expected all properties.");
                    failureCallback = true;
                }
            }
        });

        Assert.isTrue(ioCallback);
        Assert.isTrue(failureCallback);
    },

    testIOPost: function() {
        var ioCallback, successCallback,
            ds = new Y.DataSource.IO({
                source: "./php/ysearch_json_madonna.php",
                io: function (uri, config) {
                    var id = Y.guid();
                    Assert.areSame(ds, config.context);
                    Assert.areSame("foo=bar", config.data);
                    Assert.areSame("POST", config.method);

                    ioCallback = true;

                    config.on.success.call(config.context, id, {
                        responseText: jsonData
                    }, config["arguments"]);
                }
            });

        ds.sendRequest({
            callback: {
                success: function (e) {
                    Assert.isUndefined(e.request, "Expected undefined request.");
                    Assert.isObject(e.response, "Expected response object.");
                    ObjectAssert.ownsKeys({
                        tId: null,
                        request: null,
                        data: null,
                        response: null,
                        callback: null
                    }, e, "Expected all properties.");

                    successCallback = true;
                }
            },
            cfg: {
                method: "POST",
                data: "foo=bar"
            }
        });

        Assert.isTrue(ioCallback);
        Assert.isTrue(successCallback);
    },

    testIOEvents: function() {
        var ioCallback, requestCallback, dataCallback, responseCallback,
            ds = new Y.DataSource.IO({
                source: "./php/ysearch_json_madonna.php",
                io: function (uri, config) {
                    var id = Y.guid();

                    ioCallback = true;

                    config.on.success.call(config.context, id, {
                        responseText: jsonData
                    }, config["arguments"]);
                }
            });

        ds.plug(Y.Plugin.DataSourceJSONSchema, {
            schema: {
                resultListLocator: "ResultSet.Result",
                resultFields: ["Title"]
            }
        });

        ds.on("request", function (e) {
            Assert.areSame("dataSourceIO:request", e.type);
            Assert.isNumber(e.tId, "request: Expected transaction ID.");
            Assert.isUndefined(e.request, "request: Expected undefined request.");
            Assert.areSame("callback", e.callback, "request: Expected callback.");
            requestCallback = true;
        });

        ds.on("data", function (e) {
            Assert.areSame("dataSourceIO:data", e.type);
            Assert.isNumber(e.tId, "data: Expected transaction ID.");
            Assert.isUndefined(e.request, "data: Expected undefined request.");
            Assert.areSame("callback", e.callback, "data: Expected callback.");
            Assert.isObject(e.data, "data: Expected raw data.");
            dataCallback = true;
        });

        ds.on("response", function (e) {
            Assert.areSame("dataSourceIO:response", e.type);
            Assert.isNumber(e.tId, "response: Expected transaction ID.");
            Assert.isUndefined(e.request, "response: Expected undefined request.");
            Assert.areSame("callback", e.callback, "response: Expected callback.");
            Assert.isObject(e.data, "response: Expected raw data.");
            Assert.isObject(e.response, "response: Expected normalized response object.");
            Assert.isArray(e.response.results, "response: Expected parsed results.");
            Assert.isObject(e.response.meta, "response: Expected parsed meta data.");
            responseCallback = true;
        });

        ds.sendRequest({
            callback: "callback"
        });

        Assert.isTrue(ioCallback);
        Assert.isTrue(requestCallback);
        Assert.isTrue(dataCallback);
        Assert.isTrue(responseCallback);
    },

    testIOError: function() {
        var ds = new Y.DataSource.IO({
                source: "./php/ysearch_json_madonna.php",
                io: function (uri, config) {
                    var id = Y.guid();
                    config.on.failure.call(config.context, id, {
                        responseText: jsonData
                    }, config["arguments"]);
                }
            }),
            errorCallback;

        ds.plug(Y.Plugin.DataSourceJSONSchema, {
            schema: {
                resultListLocator: "ResultSet.Result",
                resultFields: ["Title"]
            }
        });

        ds.on("error", function (e) {
            Assert.areSame("dataSourceIO:error", e.type);
            Assert.isNumber(e.tId, "error: Expected transaction ID.");
            Assert.areSame("a", e.request, "error: Expected request.");
            Assert.areSame("callback", e.callback, "error: Expected callback.");
            Assert.isObject(e.data, "error: Expected raw data.");
            Assert.isObject(e.response, "error: Expected normalized response object.");
            Assert.isObject(e.error, "error: Expected error.");
            errorCallback = true;
        });

        ds.set("source", "foo");
        ds.sendRequest({
            request: "a",
            callback: "callback"
        });

        Assert.isTrue(errorCallback);
    }
}));

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['datasource-io', 'test']});
