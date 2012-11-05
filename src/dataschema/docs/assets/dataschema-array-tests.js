YUI.add('dataschema-array-tests', function(Y) {

    var suite = new Y.Test.Suite('dataschema-array example test suite'),
        Assert = Y.Assert;

    var cleanStr = function(str) {
        return str.replace(/\s\s/g, ' ');
    }


    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test Array of objects': function() {
            var outputExpected = cleanStr('{results =&gt; [{year =&gt; 1957, model =&gt; Bel Air, make =&gt; Chevrolet}, {year =&gt; 1964, model =&gt; Dart, make =&gt; Dodge}, {year =&gt; 1968, model =&gt; Mustang, make =&gt; Ford}], meta =&gt; {}}');
            Y.one('.example #demo_apply_objects').simulate('click');
            var output = Y.one('.example #demo_output_objects').getHTML();
//          alert(output);
            Assert.areEqual(outputExpected, cleanStr(output), ' - Failed to find expected output');
        },
        'test Array of arrays': function() {
            var outputExpected = cleanStr('{results =&gt; [{year =&gt; 1957, model =&gt; Bel Air, make =&gt; Chevrolet}, {year =&gt; 1964, model =&gt; Dart, make =&gt; Dodge}, {year =&gt; 1968, model =&gt; Mustang, make =&gt; Ford}], meta =&gt; {}}');
            Y.one('.example #demo_apply_arrays').simulate('click');
            var output = Y.one('.example #demo_output_arrays').getHTML();
//          alert(output);
            Assert.areEqual(outputExpected, cleanStr(output), ' - Failed to find expected output');
        },
        'test Simple array of primitives': function() {
            var outputExpected = cleanStr('{results =&gt; [1957 Chevrolet Bel Air, 1964 Dodge Dart, 1968 Ford Mustang], meta =&gt; {}}');
            Y.one('.example #demo_apply_simple').simulate('click');
            var output = Y.one('.example #demo_output_simple').getHTML();
//          alert(output);
            Assert.areEqual(outputExpected, cleanStr(output), ' - Failed to find expected output');
        }
}));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
