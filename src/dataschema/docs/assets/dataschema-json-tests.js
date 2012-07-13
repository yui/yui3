YUI.add('dataschema-json-tests', function(Y) {

    var suite = new Y.Test.Suite('dataschema-json example test suite'),
        Assert = Y.Assert;

    var cleanStr = function(str) {
        return str.replace(/\s\s/g, ' ');
    }


    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test basic example': function() {
            var outputExpected = cleanStr('{results =&gt; [{lname =&gt; Washington, fname =&gt; George, n =&gt; 1}, {lname =&gt; Adams, fname =&gt; John, n =&gt; 2}, {lname =&gt; Jefferson, fname =&gt; Thomas, n =&gt; 3}, {lname =&gt; Madison, fname =&gt; James, n =&gt; 4}, {lname =&gt; Monroe, fname =&gt; James, n =&gt; 5}, {lname =&gt; Adams, fname =&gt; John, n =&gt; 6}, {lname =&gt; Jackson, fname =&gt; Andrew, n =&gt; 7}, {lname =&gt; Van Buren, fname =&gt; Martin, n =&gt; 8}, {lname =&gt; Harrison, fname =&gt; William, n =&gt; 9}, {lname =&gt; Tyler, fname =&gt; John, n =&gt; 10}], meta =&gt; {total =&gt; 10}}');
            Y.one('.example #demo_apply_basic').simulate('click');
            var output = Y.one('.example #demo_output_basic').getHTML();
//          alert(output);
            Assert.areEqual(outputExpected, cleanStr(output), ' - Failed to find expected output');
        },
        'test complex example': function() {
            var outputExpected = cleanStr('{results =&gt; [{activity =&gt; swimming, day =&gt; sunday}, {activity =&gt; running, day =&gt; monday}, {activity =&gt; biking, day =&gt; tuesday}, {activity =&gt; running, day =&gt; wednesday}, {activity =&gt; swimming, day =&gt; thursday}, {activity =&gt; running, day =&gt; friday}, {activity =&gt; golf, day =&gt; saturday}], meta =&gt; {current =&gt; 160, target =&gt; 150, reference =&gt; [{name =&gt; biking, calories =&gt; 550}, {name =&gt; golf, calories =&gt; 1000}, {name =&gt; running, calories =&gt; 650}, {name =&gt; swimming, calories =&gt; 650}, {name =&gt; walking, calories =&gt; 225}]}}');
            Y.one('.example #demo_apply_complex').simulate('click');
            var output = Y.one('.example #demo_output_complex').getHTML();
//          alert(output);
            Assert.areEqual(outputExpected, cleanStr(output), ' - Failed to find expected output');
        }
}));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
