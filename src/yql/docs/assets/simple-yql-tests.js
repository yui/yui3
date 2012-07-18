YUI.add('simple-yql-tests', function (Y) {

    var suite = new Y.Test.Suite('simple yql example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'example should have rendered an enclosing div': function () {
            var test = this;
            test.wait(function () {
                var mod = Y.one('.mod');

                Assert.isNotNull(mod, 'Enclosure missing: network problem?');
            }, 3000);
        },

        'example should have correct zip code in header': function () {
            var header = Y.one('.mod h2');

            Assert.areEqual(header.getHTML(), 'Weather for 90210', 'Header has incorrect text');
        },

        'example should return well-formatted weather data': function () {
            var imgNode = Y.all('.mod img'),
                boldNodes = Y.all('.mod b'),
                links = Y.all('.mod a');

            Assert.areEqual(imgNode.size(), 1, 'Failed to render image');
            Assert.areEqual(boldNodes.size(), 2, 'Failed to render bold text');
            Assert.areEqual(links.size(), 2, 'Failed to render external links');
        }
    }));

    Y.Test.Runner.add(suite);

}, '@VERSION@', { requires: [ 'yql', 'node', 'test' ] });
