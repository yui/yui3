YUI.add('dataschema-table-tests', function(Y) {

    var suite = new Y.Test.Suite('dataschema-table example test suite'),
        Assert = Y.Assert;

    var cleanStr = function(str) {
        return str.replace(/\s\s/g, ' ');
    }


    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test simple table': function() {
            var test = this,
                outputExpected = cleanStr('{results =&gt; [{price =&gt; 1.25, beverage =&gt; coffee}, {price =&gt; 2.00, beverage =&gt; juice}, {price =&gt; 1.25, beverage =&gt; tea}, {price =&gt; 1.00, beverage =&gt; soda}], meta =&gt; {}}');
            Y.one('.example #demo_apply_basic').simulate('click');
            var output = Y.one('.example #demo_output_basic').getHTML();
//          alert(output);
            Assert.areEqual(outputExpected, cleanStr(output), ' - Failed to find expected output');
        },
        'test complex table': function() {
            var test = this,
                outputExpected = cleanStr('{results =&gt; [{price =&gt; 4.00, item =&gt; hamburger}, {price =&gt; 4.50, item =&gt; cheeseburger}, {price =&gt; 4.00, item =&gt; veggie burger}, {price =&gt; 5.00, item =&gt; salmon burger}, {price =&gt; 1.50, item =&gt; french fries}, {price =&gt; 2.00, item =&gt; onion rings}, {price =&gt; 2.50, item =&gt; fruit salad}, {price =&gt; 2.00, item =&gt; side salad}, {price =&gt; 1.25, item =&gt; coffee}, {price =&gt; 2.00, item =&gt; juice}, {price =&gt; 1.25, item =&gt; tea}, {price =&gt; 1.00, item =&gt; soda}], meta =&gt; {}}');
            Y.one('.example #demo_apply_complex').simulate('click');
            var output = Y.one('.example #demo_output_complex').getHTML();
//          alert(output);
            Assert.areEqual(outputExpected, cleanStr(output), ' - Failed to find expected output');
        }
}));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
