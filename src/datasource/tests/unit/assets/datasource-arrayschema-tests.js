YUI.add('datasource-arrayschema-tests', function(Y) {

var Assert = Y.Assert,

    suite = new Y.Test.Suite("DataSource: ArraySchema"),

    arrayData = [
        { type: "a", age: 0, name: "c" },
        { type: "d", age: 1,  name: "f"},
        { type: "g", age: -1, name: "i"}
    ];


suite.add(new Y.Test.Case({
    name: "DataSource ArraySchema Plugin Tests",

    testArraySchema: function() {
        var ds = new Y.DataSource.Local({ source: arrayData }),
            request = null, response;

        ds.plug(Y.Plugin.DataSourceArraySchema, {
            schema: {
                resultFields: ["type", "name"]
            }
        });

        ds.sendRequest({
            callback: {
                success: function (e) {
                    request  = e.request;
                    response = e.response;
                }
            }
        });

        Assert.isUndefined(request, "Expected undefined request.");
        Assert.isObject(response, "Expected normalized response object.");
        Assert.isArray(response.results, "Expected results array.");
        Assert.areSame(3, response.results.length, "Expected 3 results.");
        Assert.areSame("a", response.results[0].type, "Expected first type.");
        Assert.areSame("g", response.results[2].type, "Expected last type.");
        Assert.areSame("c", response.results[0].name, "Expected first name.");
        Assert.areSame("i", response.results[2].name, "Expected last name.");
        Assert.isUndefined(response.results[0].age, "Expected no age on first result.");
        Assert.isUndefined(response.results[2].age, "Expected no age on last result.");
    }
}));

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['datasource-arrayschema', 'test']});
