YUI.add('cssgrids-magazine-tests', function(Y) {

    var suite = new Y.Test.Suite('cssgrids-magazine example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Responsive tests',
        'images have max-widths defined': function() {
            var headlineImg = Y.one('.left-bar .article img');
            Assert.isNotUndefined(headlineImg.getComputedStyle('maxWidth'), 'maxWidth undefined on images');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
