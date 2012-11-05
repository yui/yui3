YUI.add('attribute-basic-tests', function(Y) {

    var suite = new Y.Test.Suite('attribute-basic example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example Tests',

        'create first instance' : function() {
            var btn = Y.one("#createo1 .do"),
                output;

            btn.simulate("click");

            output = Y.one("#createo1 .example-out .myclass-attrs");

            Y.Assert.areEqual(output.get("children").item(0).get("text"), "foo: 5");
            Y.Assert.areEqual(output.get("children").item(1).get("text"), "bar: Hello World!");
            Y.Assert.areEqual(output.get("children").item(2).get("text"), "foobar: true");
        },

        'update first instance' : function() {
            var btn = Y.one("#updateo1 .do"),
                output;

            btn.simulate("click");

            output = Y.one("#updateo1 .example-out .myclass-attrs");

            Y.Assert.areEqual(output.get("children").item(0).get("text"), "foo: 10");
            Y.Assert.areEqual(output.get("children").item(1).get("text"), "bar: Hello New World!");
            Y.Assert.areEqual(output.get("children").item(2).get("text"), "foobar: false");
        },

        'create second instance' : function() {
            var btn = Y.one("#createo2 .do"),
                output;

            btn.simulate("click");

            output = Y.one("#createo2 .example-out .myclass-attrs");

            Y.Assert.areEqual(output.get("children").item(0).get("text"), "foo: 7");
            Y.Assert.areEqual(output.get("children").item(1).get("text"), "bar: Aloha World!");
            Y.Assert.areEqual(output.get("children").item(2).get("text"), "foobar: false");
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
