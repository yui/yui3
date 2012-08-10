YUI.add('datasource-textschema-tests', function(Y) {

var Assert = Y.Assert,

    suite = new Y.Test.Suite("DataSource: TextSchema"),

    textData = "foo\t0\tabc\nbar\t1\tdef\nbat\t-1\tghi";


suite.add(new Y.Test.Case({
    name: "DataSource TextSchema Plugin Tests",

    testTextSchema: function() {
        var ds = new Y.DataSource.Local({ source: textData }),
            request = null, response;

        ds.plug(Y.Plugin.DataSourceTextSchema, {
            schema: {
                resultDelimiter: "\n",
                fieldDelimiter: "\t",
                resultFields: [
                    { key: "type" },
                    { key: "age", parser: "number" },
                    "name"
                ]
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
        Assert.areSame("foo", response.results[0].type, "Expected first type.");
        Assert.areSame("bat", response.results[2].type, "Expected last type.");
        Assert.areSame(0, response.results[0].age, "Expected first age.");
        Assert.areSame(-1, response.results[2].age, "Expected last age.");
        Assert.areSame("abc", response.results[0].name, "Expected first name.");
        Assert.areSame("ghi", response.results[2].name, "Expected last name.");
    }
}));

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['datasource-textschema', 'test', 'datatype-number-parse']});
