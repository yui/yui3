YUI.add('module-tests', function(Y) {

    var listFormatTests = new Y.Test.Case({
        name: "List Format Tests",
        
        testListFormat: function() {
            var input = [];

            var result = Y.Array.format(input);
            Y.Assert.areEqual("", result);

            input.push("US");
            result = Y.Array.format(input);
            Y.Assert.areEqual("US", result);

            input.push("UK");
            result = Y.Array.format(input);
            Y.Assert.areEqual("US and UK", result);

            input.push("Canada");
            result = Y.Array.format(input);
            Y.Assert.areEqual("US, UK and Canada", result);
        }
    });

    Y.Test.Runner.add(listFormatTests);

},'', { requires: [ 'test', 'datatype-list-format', 'lang/datatype-list-format_en-GB' ] });
