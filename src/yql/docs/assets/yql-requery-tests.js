YUI.add('yql-requery-tests', function (Y) {

    var suite = new Y.Test.Suite('yql requery example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'example should have an enclosing div': function () {
            var enclosure = Y.one('#res');

            Assert.isNotNull(enclosure, 'Enclosure missing');
            Y.assert(!enclosure.hasChildNodes(), 'Enclosure has initial nodes');
        },

        'example should return Flickr pictures after queries': function () {
            var test = this,
                firstNumber;
            test.wait(function () {
                var queryNode   = Y.one('#res h2 em'),
                    content     = queryNode.getHTML();
                
                firstNumber = parseInt(content.match(/\d+\.?\d*/g), 10);

                Assert.isNumber(firstNumber, 'Query number not found');
            }, 10000);

            test.wait(function () {
                var queryNode   = Y.one('#res h2 em'),
                    content     = queryNode.getHTML(),
                    nextNumber  = parseInt(content.math(/\d+\.?d*/g), 10);

                Assert.isNumber(nextNumber, 'Next number not found');
                Assert.areNotEqual(firstNumber, nextNumber,
                    'Queries have different query numbers');
            }, 10000);
        }
    }));

    Y.Test.Runner.add(suite);
}, '@VERSION@', { requires: [ 'yql', 'node', 'test' ] });
