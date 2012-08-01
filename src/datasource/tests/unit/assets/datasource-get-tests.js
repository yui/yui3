YUI.add('datasource-get-tests', function(Y) {

var Assert = Y.Assert,

    suite = new Y.Test.Suite("DataSource: Get"),

    jsonData = {
        ResultSet: {
            Result: [
                { Title: "Madonna" }
            ]
        }
    };


suite.add(new Y.Test.Case({
    name: "DataSource.Get Tests",

    testGetDefaults: function() {
        var ds = new Y.DataSource.Get({
                    source: "http://query.yahooapis.com/v1/public/yql?format=json&",
                    get: {
                        script: function (uri, config) {
                            var fn = uri.match(/callback=YUI\.Env\.DataSource\.callbacks\.([^&]*)/)[1];
                            YUI.Env.DataSource.callbacks[fn](jsonData);
                        }
                    }
                }),
            request, response, tId, data, callback;

        ds.sendRequest({
            request: "q=select%20*%20from%20search.web%20where%20query%3D%22pizza%22",
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

        Assert.areSame("q=select%20*%20from%20search.web%20where%20query%3D%22pizza%22", request, "Expected same request.");
        Assert.isObject(response, "Expected response object.");
        Assert.isNotUndefined(tId);
        Assert.isNotUndefined(data);
        Assert.isNotUndefined(callback);
    },

    testGetEvents: function() {
        var ds = new Y.DataSource.Get({
                    source: "http://query.yahooapis.com/v1/public/yql?format=json&",
                    get: {
                        script: function (uri, config) {
                            var fn = uri.match(/callback=YUI\.Env\.DataSource\.callbacks\.([^&]*)/)[1];
                            YUI.Env.DataSource.callbacks[fn](jsonData);
                        }
                    }
                }),
            requestCallback, dataCallback, responseCallback;

        ds.plug(Y.Plugin.DataSourceJSONSchema, {
            schema: {
                resultListLocator: "query.results.result",
                resultFields: ["title"]
            }
        });

        ds.on("request", function (e) {
            Assert.areSame("dataSourceGet:request", e.type);
            Assert.isNumber(e.tId, "request: Expected transaction ID.");
            Assert.areSame("q=select%20*%20from%20search.web%20where%20query%3D%22pizza%22", e.request, "Expected same request.");
            Assert.areSame("callback", e.callback, "request: Expected callback.");
            requestCallback = true;
        });

        ds.on("data", function (e) {
            Assert.areSame("dataSourceGet:data", e.type);
            Assert.isNumber(e.tId, "data: Expected transaction ID.");
            Assert.areSame("q=select%20*%20from%20search.web%20where%20query%3D%22pizza%22", e.request, "Expected same request.");
            Assert.areSame("callback", e.callback, "data: Expected callback.");
            Assert.isObject(e.data, "data: Expected raw data.");
            dataCallback = true;
        });

        ds.on("response", function (e) {
            Assert.areSame("dataSourceGet:response", e.type);
            Assert.isNumber(e.tId, "response: Expected transaction ID.");
            Assert.areSame("q=select%20*%20from%20search.web%20where%20query%3D%22pizza%22", e.request, "Expected same request.");
            Assert.areSame("callback", e.callback, "response: Expected callback.");
            Assert.isObject(e.data, "response: Expected raw data.");
            Assert.isObject(e.response, "response: Expected normalized response object.");
            Assert.isArray(e.response.results, "response: Expected parsed results.");
            Assert.isObject(e.response.meta, "response: Expected parsed meta data.");
            responseCallback = true;
        });

        ds.sendRequest({
            request: "q=select%20*%20from%20search.web%20where%20query%3D%22pizza%22",
            callback: "callback"
        });

        Assert.isTrue(requestCallback);
        Assert.isTrue(dataCallback);
        Assert.isTrue(responseCallback);
    },

    testGetError: function () {
        var ds = new Y.DataSource.Get({
                source: "http://query.yahooapis.com/v1/public/yql?format=json&",
                get: {
                    script: function (uri, config) {
                        config.onFailure({ msg: "Planned failure" });
                    }
                }
            }),
            errorCallback;

        ds.plug(Y.Plugin.DataSourceJSONSchema, {
            schema: {
                resultListLocator: "query.results.result",
                resultFields: ["title"]
            }
        });

        ds.on("error", function (e) {
            Assert.areSame("dataSourceGet:error", e.type);
            Assert.isNumber(e.tId, "error: Expected transaction ID.");
            Assert.areSame("a", e.request, "error: Expected request.");
            Assert.areSame("callback", e.callback, "error: Expected callback.");
            Assert.isUndefined(e.data, "error: Expected undefined data.");
            Assert.isObject(e.response, "error: Expected normalized response object.");
            Assert.isObject(e.error, "error: Expected error.");
            Assert.areSame(e.error.message, "Planned failure");
            errorCallback = true;
        });

        ds.set("source", "foo");
        ds.sendRequest({
            request: "a",
            callback: "callback"
        });

        Assert.isTrue(errorCallback);
    },

    testGetTimeout: function () {
        var ds = new Y.DataSource.Get({
                source: "http://query.yahooapis.com/v1/public/yql?format=json&",
                get: {
                    script: function (uri, config) {
                        config.onTimeout({ msg: "Planned timeout" });
                    }
                }
            }),
            timeoutCallback;
        
        ds.plug(Y.Plugin.DataSourceJSONSchema, {
            schema: {
                resultListLocator: "query.results.result",
                resultFields: ["title"]
            }
        });

        ds.on("error", function (e) {
            Assert.areSame("dataSourceGet:error", e.type);
            Assert.isNumber(e.tId, "error: Expected transaction ID.");
            Assert.areSame("b", e.request, "error: Expected request.");
            Assert.areSame("callback", e.callback, "error: Expected callback.");
            Assert.isUndefined(e.data, "error: Expected undefined data.");
            Assert.isObject(e.response, "error: Expected normalized response object.");
            Assert.isObject(e.error, "error: Expected error.");
            Assert.areSame(e.error.message, "Planned timeout");
            timeoutCallback = true;
        });

        ds.set("source", "bar");
        ds.sendRequest({
            request: "b",
            callback: "callback"
        });

        Assert.isTrue(timeoutCallback);
    }
}));

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['datasource-get', 'test']});
