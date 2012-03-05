YUI.add('widget-stack-test', function (Y) {

var Assert      = Y.Assert,
    ArrayAssert = Y.ArrayAssert,

    TestWidget, suite;

// -- Suite --------------------------------------------------------------------
suite      = new Y.Test.Suite('WidgetStack');
TestWidget = Y.Base.create('testWidget', Y.Widget, [Y.WidgetStack]);

// -- Lifecycle ----------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Lifecycle',

    tearDown: function () {
        this.widget && this.widget.destroy();
        delete this.widget;
        Y.one('#test').empty();
    },

    'WidgetStack should add a `zIndex` attribute': function () {
        this.widget = new TestWidget();
        this.widget.render('#test');

        Assert.areSame(0, this.widget.get('zIndex'), '`zIndex` is not 0.');
    }
}));

// -- Attributes and Properties ------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Attributes and Properties',

    tearDown: function () {
        this.widget && this.widget.destroy();
        delete this.widget;
        Y.one('#test').empty();
    },

    'zIndex of "auto" parsed from a node should not override the default': function () {
        // The follow nodes should all be considered to have an "auto" `zIndex`.
        var offDoc         = Y.Node.create('<div />'),
            offDocStyle    = Y.Node.create('<div style="z-index: 10;" />'),
            offDocStylePos = Y.Node.create('<div style="z-index: 10; position: relative;" />'),
            inDoc          = Y.Node.create('<div />').appendTo('#test'),
            inDocStyle     = Y.Node.create('<div style="z-index: 10" />').appendTo('#test'),
            inDocCss       = Y.Node.create('<div />').addClass('css-htmlparser').appendTo('#test'),
            parseZIndex    = Y.WidgetStack.prototype._parseZIndex;

        Assert.areSame(null, parseZIndex(offDoc), 'offDoc did not have z-index: auto');
        Assert.areSame(null, parseZIndex(offDocStyle), 'offDocStyle did not have z-index: auto');
        Assert.areSame(null, parseZIndex(offDocStylePos), 'offDocStylePos did not have z-index: auto');
        Assert.areSame(null, parseZIndex(inDoc), 'inDoc did not have z-index: auto');
        Assert.areSame(null, parseZIndex(inDocStyle), 'inDocStyle did not have z-index: auto');
        Assert.areSame(null, parseZIndex(inDocCss), 'inDocCss did not have z-index: auto');

        this.widget = new TestWidget({
            srcNode: inDocStyle.cloneNode().appendTo('#test'),
            render : true
        });

        Assert.areSame(0, this.widget.get('zIndex'), 'widget zIndex was not 0.');
        Assert.areSame(0, parseInt(this.widget.get('boundingBox').getStyle('zIndex'), 10), 'widget bb zIndex was not 0.');
    },

    'srcNode in the document with position should have its zIndex parsed from the DOM': function () {
        var style = Y.Node.create('<div style="z-index: 10; position: relative;" />').appendTo('#test'),
            css   = Y.Node.create('<div style="position: relative;" />').addClass('css-htmlparser').appendTo('#test');

        this.widget = new TestWidget({
            srcNode: style,
            render : true
        });

        Assert.areSame(10, this.widget.get('zIndex'), 'widget zIndex was not 10.');
        Assert.areSame(10, parseInt(this.widget.get('boundingBox').getStyle('zIndex'), 10), 'widget bb zIndex was not 10.');

        // Clean up.
        this.widget.destroy();

        this.widget = new TestWidget({
            srcNode: css,
            render : true
        });

        Assert.areSame(2, this.widget.get('zIndex'), 'widget zIndex was not 2.');
        Assert.areSame(2, parseInt(this.widget.get('boundingBox').getStyle('zIndex'), 10), 'widget bb zIndex was not 2.');
    },

    'A user specified zIndex should override the parsed zIndex value': function () {
        var srcNode = Y.Node.create('<div style="z-index: 10; position: relative;" />').appendTo('#test');

        this.widget = new TestWidget({
            srcNode: srcNode,
            zIndex : 11,
            render : true
        });

        Assert.areSame(11, this.widget.get('zIndex'), 'widget zIndex was not 11.');
        Assert.areSame(11, parseInt(this.widget.get('boundingBox').getStyle('zIndex'), 10), 'widget bb zIndex was not 11.');
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['widget-stack', 'test']
});
