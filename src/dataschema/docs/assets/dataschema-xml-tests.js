YUI.add('dataschema-xml-tests', function(Y) {

    var suite = new Y.Test.Suite('dataschema-xml example test suite'),
        Assert = Y.Assert;

    var cleanStr = function(str) {
        return str.replace(/\s\s/g, ' ');
    }


    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test basic example': function() {
            var outputExpected = cleanStr('{results =&gt; [{rank =&gt; 1, artist =&gt; Katy Perry, title =&gt; I Kissed A Girl}, {rank =&gt; 2, artist =&gt; Metro Station, title =&gt; Shake It}, {rank =&gt; 3, artist =&gt; Leona Lewis, title =&gt; Bleeding Love}], meta =&gt; {}}');
            Y.one('.example #demo_apply_basic').simulate('click');
            var output = Y.one('.example #demo_output_basic').getHTML();
//          alert(output);
            Assert.areEqual(outputExpected, cleanStr(output), ' - Failed to find expected output');
        },
        'test complex example': function() {
            var outputExpected = cleanStr('{results =&gt; [{rank =&gt; 1, artist =&gt; Katy Perry, song =&gt; I Kissed A Girl}, {rank =&gt; 2, artist =&gt; Metro Station, song =&gt; Shake It}, {rank =&gt; 3, artist =&gt; Leona Lewis, song =&gt; Bleeding Love}], meta =&gt; {session =&gt; 542235629, total =&gt; 98}}');
            Y.one('.example #demo_apply_complex').simulate('click');
            var output = Y.one('.example #demo_output_complex').getHTML();
//          alert(output);
            Assert.areEqual(outputExpected, cleanStr(output), ' - Failed to find expected output');
        }
}));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
