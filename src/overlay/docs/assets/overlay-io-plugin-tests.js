YUI.add('overlay-io-plugin-tests', function(Y) {

    var suite = new Y.Test.Suite('overlay-io-plugin example test suite'),
        Assert = Y.Assert,
        overlay = Y.one('.yui3-overlay');

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test overlay renders': function() {
            Assert.isTrue((overlay !== null), ' - Failed to render overlay container');
        },
        'test click show button': function() {
            Y.one('.example #show').simulate('click');
            Assert.areEqual('visible', overlay.getComputedStyle('visibility'),'failed to show overlay');
        },
        'test overlay contents': function() {
            Assert.isTrue((overlay.one('.yui3-overlay-content').getHTML().indexOf('yui3-widget-hd') > -1),'failed to find hd in overlay');
            Assert.isTrue((overlay.one('.yui3-overlay-content #feedSelector').getHTML().indexOf('daringfireball') > -1),'failed to find daringfireball in select of hd in overlay');
            Assert.isTrue((overlay.one('.yui3-overlay-content').getHTML().indexOf('yui3-widget-bd') > -1),'failed to find bd in overlay');
        },
        'test click hide button': function() {
            Y.one('.example #hide').simulate('click');
            Assert.areEqual('hidden', overlay.getComputedStyle('visibility'),'failed to hide overlay');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
