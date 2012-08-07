YUI.add('datasource-function-tests', function(Y) {

    var suite = new Y.Test.Suite('datasource-function example test suite'),
        Assert = Y.Assert;

    var cleanStr = function(str) {
        return str.replace(/\s\s/g, ' ');
    }


    suite.add(new Y.Test.Case({
        name: 'Example tests',

        'test array': function() {
            var test = this,
                outputExpected = cleanStr('{results =&gt; [{id =&gt; 123, name =&gt; abc}, {id =&gt; 456, name =&gt; def}, {id =&gt; 789, name =&gt; ghi}], meta =&gt; {}}');
            Y.one('.example #demo_array').simulate('click');
            var output = Y.one('.example #demo_output_array').getHTML();
//          alert(output);
            Assert.areEqual(outputExpected, cleanStr(output), ' - Failed to find expected output');
        },
        'test json': function() {
            var test = this,
                outputExpected = cleanStr('{results =&gt; [{calories =&gt; 70, name =&gt; apple}, {calories =&gt; 70, name =&gt; banana}, {calories =&gt; 90, name =&gt; orange}], meta =&gt; {}}');
            Y.one('.example #demo_json').simulate('click');
            var output = Y.one('.example #demo_output_json').getHTML();
//          alert(output);
            Assert.areEqual(outputExpected, cleanStr(output), ' - Failed to find expected output');
        }
}));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
