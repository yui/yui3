YUI.add('dataschema-text-tests', function(Y) {

    var suite = new Y.Test.Suite('dataschema-text example test suite'),
        Assert = Y.Assert;

    var cleanStr = function(str) {
        return str.replace(/\s\s/g, ' ');
    }


    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test apply schema for text': function() {
            var outputExpected = cleanStr('{results =&gt; [{detail =&gt;  spiral-bound, quantity =&gt;  100, product =&gt; notebooks}, {detail =&gt;  #2 with erasers, quantity =&gt;  300, product =&gt; pencils}, {detail =&gt;  blue ink, quantity =&gt;  500, product =&gt; pens}], meta =&gt; {}}');
            Y.one('.example #demo_apply').simulate('click');
            var output = Y.one('.example #demo_output').getHTML();
//          alert(output);
            Assert.areEqual(outputExpected, cleanStr(output), ' - Failed to find expected output');
        }
}));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
