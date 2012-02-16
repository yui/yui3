YUI.add('widget-stack-test', function (Y) {

var Assert      = Y.Assert,
    ArrayAssert = Y.ArrayAssert,

    suite;

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

        Assert.areSame(1, this.widget.get('zIndex'), '`zIndex` is not 1.');
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['widget-stack', 'test']
});
