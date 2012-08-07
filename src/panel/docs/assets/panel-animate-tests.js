YUI.add('panel-animate-tests', function (Y) {

var Assert = Y.Assert,

    open  = Y.one('#openButton'),
    panel = Y.one('#panelContent').ancestor('.yui3-panel'),
    suite = new Y.Test.Suite('Todo List Example App Suite');

function getPanelTopPos() {
    return parseInt(panel.getComputedStyle('top'), 10);
}

suite.add(new Y.Test.Case({
    name: 'Example Tests',

    'Panel should be rendered in the DOM': function () {
        Assert.isNotNull(panel, 'Panel node was not found.');
        Assert.isTrue(Y.one('body').contains(panel), 'Panel is not a descendant of the <body>');
    },

    'Panel should be hidden': function () {
        Assert.isTrue(panel.hasClass('yui3-panel-hidden'), 'Panel does not have the hidden CSS class.');
        Assert.areSame('hidden', panel.getStyle('visibility'), 'Panel does have a `visibility` of `hidden`.');
    },

    'Clicking the "Open" button should animate-in the panel from the top': function () {
        var lastPos, currentPos;

        Assert.isNotNull(open, '"Open Panel" button was not found.');

        open.simulate('click');

        Assert.isFalse(panel.hasClass('yui3-panel-hidden'), 'The hidden CSS class was not removed from the panel.');
        Assert.areSame('visible', panel.getStyle('visibility'), 'Panel does have a `visibility` of `visible`.');

        lastPos = currentPos = getPanelTopPos();

        // Wait for it to animate some.
        this.wait(function () {
            currentPos = getPanelTopPos();

            Assert.isTrue(currentPos > lastPos);

            lastPos = currentPos;

            // Let the animation finish.
            this.wait(function () {
                currentPos = getPanelTopPos();

                Assert.isTrue(currentPos > lastPos);
            }, 1000);
        }, 100);
    },

    'Clicking the "Close" button should animate-in the panel from the top': function () {
        var close = panel.one('.yui3-widget-ft button'),
            lastPos, currentPos;

        Assert.isNotNull(close, '"Close the panel" button was not found.');

        close.simulate('click');

        lastPos = currentPos = getPanelTopPos();

        // Wait for it to animate some.
        this.wait(function () {
            currentPos = getPanelTopPos();

            Assert.isTrue(currentPos < lastPos);

            lastPos = currentPos;

            // Let the animation finish.
            this.wait(function () {
                currentPos = getPanelTopPos();

                Assert.isTrue(currentPos < lastPos);
                Assert.isTrue(panel.hasClass('yui3-panel-hidden'), 'Panel does not have the hidden CSS class.');
                Assert.areSame('hidden', panel.getStyle('visibility'), 'Panel does have a `visibility` of `hidden`.');
            }, 1000);
        }, 100);
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['node', 'node-event-simulate', 'widget']
});
