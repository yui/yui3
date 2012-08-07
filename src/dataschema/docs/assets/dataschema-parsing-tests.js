YUI.add('dataschema-parsing-tests', function(Y) {

    var suite = new Y.Test.Suite('dataschema-parsing example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test apply schema for parsing': function() {
            Y.one('.example #demo_apply_parsing').simulate('click');
            var output = Y.one('.example #demo_output_parsing').getHTML();
//          alert(output);
            Assert.isTrue((output.indexOf('string: aardvark [string], number: 1 [number], date: Mon Jan') > -1), ' - Failed to find aardvark');
            Assert.isTrue((output.indexOf('string: bat [string], number: 2 [number], date: Sat Feb') > -1), ' - Failed to find bat');
            Assert.isTrue((output.indexOf('string: camel [string], number: 3 [number], date: Mon Mar') > -1), ' - Failed to find camel');

        }
}));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
