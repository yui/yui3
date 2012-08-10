YUI.add('widget-modality-test', function (Y) {

var Assert      = Y.Assert,
    ArrayAssert = Y.ArrayAssert,

    suite, TestWidget;

// -- Suite --------------------------------------------------------------------
suite      = new Y.Test.Suite('Widget: Modality');
TestWidget = Y.Base.create('testWidget', Y.Widget, [Y.WidgetModality]);

// -- Lifecycle ----------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Lifecycle',

    tearDown: function () {
        this.widget && this.widget.destroy();
        delete this.widget;
        Y.one('#test').empty();
    },

    'WidgetModality should add a `modal` attribute': function () {
        this.widget = new TestWidget();
        this.widget.render('#test');

        Assert.isBoolean(this.widget.get('modal'), '`modal` is not a Boolean.');
    },

    'WidgetModality should add a mask node when `modal` is `true`': function () {
        this.widget = new TestWidget({
            modal : true,
            render: '#test'
        });

        Assert.isTrue(this.widget.get('modal'), 'widget is not modal.');
        Assert.isNotNull(Y.one('.yui3-widget-mask'), 'No widget mask node.');
        Assert.areNotSame('none', Y.one('.yui3-widget-mask').getStyle('display'), 'widget mask node was hidden.');

        // Using `hide()` since WidgetModaltiy doesn't even list to its own
        // `modalChange` event, which is crazy!
        this.widget.hide();

        Assert.isFalse(this.widget.get('visible'), 'widget is not hidden.');
        Assert.areSame('none', Y.one('.yui3-widget-mask').getStyle('display'), 'widget mask node was not hidden.');
    },

    'WidgetModality should correctly handle one mask node for multiple modal widgets': function () {
        var modal1, modal2;

        modal1 = new TestWidget({
            modal : true,
            render: '#test'
        });

        modal2 = new TestWidget({
            modal: true,
            render: '#test'
        });

        modal2.set('focusOn', [{eventName: 'clickoutside'}]);

        Assert.isNotNull(Y.one('.yui3-widget-mask'), 'No widget mask node.');
        Assert.areNotSame('none', Y.one('.yui3-widget-mask').getStyle('display'), 'widget mask node was hidden.');

        modal1.hide();
        Assert.areNotSame('none', Y.one('.yui3-widget-mask').getStyle('display'), 'widget mask node was hidden.');

        modal2.hide();
        Assert.areSame('none', Y.one('.yui3-widget-mask').getStyle('display'), 'widget mask node was not hidden.');

        modal1.destroy();
        modal2.destroy();
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['widget-modality', 'test']
});
