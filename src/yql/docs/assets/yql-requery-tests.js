YUI.add('yql-requery-tests', function (Y) {

    var suite = new Y.Test.Suite('yql requery example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'example should have an enclosing div': function () {
            var test = this;
            test.wait(function() {
                var enclosure = Y.one('#res');
                Assert.isNotNull(enclosure, 'Enclosure missing');
            }, 5000);
        },
        'example should render 10 images': function() {
            var test = this,
                count = Y.all('#res img').size();

            Assert.areEqual(count, 10, 'Failed to fetch 10 images');
        },
        'example should return Flickr pictures after queries': function () {
            var test = this,
                reg = /\d+\.?\d*/g,
                firstNumber,
                getNumber = function(content) {
                    return parseInt(content.match(reg), 10);
                };

            var queryNode   = Y.one('#res h2 em'),
                content     = queryNode.getHTML();
            
            firstNumber = getNumber(content);
            Assert.isNumber(firstNumber, 'Query number not found');

            test.wait(function () {
                var queryNode   = Y.one('#res h2 em'),
                    content     = queryNode.getHTML(),
                    nextNumber  = getNumber(content);

                Assert.isNumber(nextNumber, 'Next number not found');
                Assert.areNotEqual(firstNumber, nextNumber,
                    'Queries have different query numbers');
            }, 10000);

        }
    }));

    Y.Test.Runner.add(suite);
}, '@VERSION@', { requires: [ 'yql', 'node', 'test' ] });
